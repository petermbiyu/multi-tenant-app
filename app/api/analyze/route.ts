import { auth } from "@/lib/auth";
import { analyzeWithGemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const userId = session.user.id;
    // get resquest data
    const { documentId, organizationId, analysisType } = await req.json();
    if (!documentId || !organizationId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        organization: {
          id: organizationId,
          members: { some: { user: { id: userId } } },
        },
      },
    });
    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 },
      );
    }
    // get content
    const content = document.content || document.name;
    if (!content) {
      return NextResponse.json(
        { success: false, message: "Document has no content for analysis" },
        { status: 400 },
      );
    }
    // analyse using gemini
    const summary = await analyzeWithGemini(content, analysisType);
    // save results to db
    const updateDoc = await prisma.document.update({
      where: { id: documentId },
      data: {
        aiSummary: summary,
        sentiment: analysisType,
        aiKeywords: ["analyzed"],
      },
    });
    return NextResponse.json({
      success: true,
      summary,
      document: {
        id: updateDoc.id,
        name: updateDoc.name,
        aiSummary: updateDoc.aiSummary,
      },
    });
  } catch (error: unknown) {
    console.error("Error analyzing doc: ", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "failed to analyze doc",
    });
  }
}
