import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers";
export async function GET( request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
      try {
      const id = (await params).id;
    const career = await prisma.career.findUnique({
      where: { id: id },
    });

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { error: "Failed to fetch career details" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
      try {
      const id = (await params).id;
      const result = await requireAuth();
    if (result instanceof NextResponse) return result;
    const decoded = await getAuthenticatedUser();
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
      
    const body = await request.json();

    // Check if the career exists
    const career = await prisma.career.findUnique({
      where: { id: id },
    });

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        careerId: id,
        userId: decoded.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        resumeUrl: body.resumeUrl,
        coverLetter: body.coverLetter,
        portfolioUrl: body.portfolioUrl,
        experience: body.experience,
        currentCompany: body.currentCompany,
        noticePeriod: body.noticePeriod,
        expectedSalary: body.expectedSalary,
        documents: body.documents || [],
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();

    const career = await prisma.career.update({
      where: { id },
      data: {
        title: body.title,
        department: body.department,
        location: body.location,
        type: body.type,
        experience: body.experience,
        description: body.description,
        responsibilities: body.responsibilities,
        requirements: body.requirements,
        benefits: body.benefits,
        salary: body.salary,
      }
    });
    return NextResponse.json(career);
    }
    catch (error) {
      console.error("Error updating career:", error);
      return NextResponse.json(
        { error: "Failed to update career listing" },
        { status: 500 }
      );
    }
  }

export async function DELETE(req: Request) {
    try {
      const body = await req.json();

      const career = await prisma.career.delete({
        where: { id: body.id },
      })
      return NextResponse.json(career);
    }
    catch (error) {
      console.error("Error deleting career:", error);
      return NextResponse.json(
        { error: "Failed to delete career listing" },
        { status: 500 }
      );
    }
}