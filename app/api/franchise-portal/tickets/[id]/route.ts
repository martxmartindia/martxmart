import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: ticketId } = await params;

    // Get franchise
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Get ticket details
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        franchiseId: franchise.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Format for frontend
    const formattedTicket = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdBy: ticket.createdBy,
      assignedTo: ticket.assignedTo,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      comments: ticket.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({
      ticket: formattedTicket,
    });
  } catch (error) {
    console.error("Franchise ticket details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: ticketId } = await params;
    const body = await request.json();
    const { status } = body;

    // Get franchise
    const franchise = await prisma.franchise.findFirst({
      where: { ownerId: session.user.id },
    });

    if (!franchise) {
      return NextResponse.json(
        { error: "Franchise not found" },
        { status: 404 }
      );
    }

    // Update ticket
    const ticket = await prisma.ticket.updateMany({
      where: {
        id: ticketId,
        franchiseId: franchise.id,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    if (ticket.count === 0) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Get updated ticket
    const updatedTicket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        franchiseId: franchise.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json({
      ticket: {
        id: updatedTicket!.id,
        title: updatedTicket!.title,
        description: updatedTicket!.description,
        category: updatedTicket!.category,
        priority: updatedTicket!.priority,
        status: updatedTicket!.status,
        createdBy: updatedTicket!.createdBy,
        assignedTo: updatedTicket!.assignedTo,
        createdAt: updatedTicket!.createdAt.toISOString(),
        updatedAt: updatedTicket!.updatedAt.toISOString(),
        comments: updatedTicket!.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          user: comment.user,
          createdAt: comment.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}