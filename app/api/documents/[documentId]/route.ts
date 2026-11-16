import { auth } from "@/lib/auth";
import { deleteFromBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RoutePrams {
  params: Promise<{ documentId: string }>;
}

export async function DELETE(req: NextRequest, { params }: RoutePrams) {
  try {
    const { documentId } = await params;
    const session = await auth.api.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const userId = session.user.id;
    // get document with organization information
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        organization: {
          include: { members: { where: { user: { id: userId } } } },
        },
      },
    });
    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found!" },
        { status: 404 },
      );
    }
    if (document.organization.members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to delete this document",
        },
        { status: 403 },
      );
    }
    if (document.fileUrl) {
      try {
        await deleteFromBlob(document.fileUrl);
      } catch (error) {
        console.log("failed to delete file from blob", error);
      }
    }
    // delete from db
    await prisma.document.delete({ where: { id: documentId } });

    return NextResponse.json(
      { success: true, message: "document deletd successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error deleting doc: ", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "failed to delete doc",
      },
      { status: 500 },
    );
  }
}
