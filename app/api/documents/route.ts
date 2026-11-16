import { auth } from "@/lib/auth";
import { uploadToBlob } from "@/lib/blob";
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

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const content = formData.get("content") as string;
    const organizationId = formData.get("organizationId") as string;
    const file = formData.get("file") as File;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Missing required fileds" },
        { status: 400 },
      );
    }

    // check organization
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 404 },
      );
    }

    // get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        members: {
          where: { organizationId: organization.id },
          include: { organization: true },
        },
      },
    });
    if (!user || user.members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to access this organization",
        },
        { status: 403 },
      );
    }
    let fileUrl = null;
    let fileType = null;
    let fileSize = null;
    let extractedContent = content;

    // upload files
    if (file && file.size > 0) {
      const blob = await uploadToBlob(file, userId, organizationId);
      fileUrl = blob.url;
      fileSize = file.size;
      fileType = file.type;

      if (!extractedContent && file.type.includes("text")) {
        extractedContent = await file.text();
      }
    }
    const document = await prisma.document.create({
      data: {
        name,
        content: extractedContent || null,
        fileUrl,
        fileSize: fileSize || 0,
        fileType: fileType || "unknown",
        organizationId: organization.id,
        userId: userId,
        aiKeywords: [],
      },
      include: {
        users: { select: { name: true, email: true } },
        organization: { select: { name: true, id: true } },
      },
    });
    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document.id,
        name: document.name,
        fileUrl: document.fileUrl,
        organizationName: document.organization.name,
        organizationId: document.organization.id,
        uploadedBy: document.users.name,
      },
    });
  } catch (error) {
    console.error("Error uploading doc: ", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "failed to upload doc",
      },
      { status: 500 },
    );
  }
}

// get document
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unathorized" },
        { status: 401 },
      );
    }
    const userId = session.user.id;
    // use orgId i.e /api/documents?organizationId=${organization.id}
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: "Organization ID is a required field" },
        { status: 400 },
      );
    }
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      return NextResponse.json(
        { success: false, message: "organization not found" },
        { status: 401 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        members: {
          where: { organizationId: organization.id },
          include: { organization: true },
        },
      },
    });
    // get organization document
    const documents = await prisma.document.findMany({
      where: { organizationId: organization.id },
      include: {
        users: { select: { name: true, email: true } },
        organization: { select: { name: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      success: true,
      documents,
      metadata: {
        organizationName: organization.name,
        organizationId: organization.id,
        documentCount: documents.length,
      },
    });
  } catch (error: unknown) {
    console.error("Error getting doc: ", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "failed to get doc",
      },
      { status: 500 },
    );
  }
}
