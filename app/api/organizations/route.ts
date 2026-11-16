import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // get user
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorised" },
        { status: 401 },
      );
    }
    const userId = session.user.id;
    // get org data
    const body = req.json();
    const { name, slug } = body as { name?: string; slug?: string };
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }
    const orgExists = await prisma.organization.findUnique({
      where: { slug: slug },
    });
    if (orgExists) {
      return NextResponse.json(
        { success: false, message: "Organization exist" },
        { status: 400 },
      );
    }
    const organization = await prisma.organization.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\S+/g, "-"),
      },
    });
    await prisma.member.create({
      data: { organizationId: organization.id, userId: userId, role: "owner" },
    });
    return NextResponse.json(
      {
        success: true,
        organization,
        message: "Organization created successfully",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Organisations Post: ", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Organization creation failed",
      },
      { status: 500 },
    );
  }
}
