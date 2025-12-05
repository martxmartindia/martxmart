import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

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

    if (contactId) {
      // Fetch messages with specific contact
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: contactId },
            { senderId: contactId, receiverId: session.user.id },
          ],
          franchiseId: franchise.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json({
        messages,
      });
    } else {
      // Fetch contacts (unique users who have messaged with this franchise)
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id },
          ],
          franchiseId: franchise.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get unique contacts
      const contactMap = new Map();

      messages.forEach(message => {
        const otherUser = message.senderId === session.user.id ? message.receiver : message.sender;
        if (!contactMap.has(otherUser.id)) {
          contactMap.set(otherUser.id, {
            id: otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
            role: otherUser.role,
            image: otherUser.image,
            lastMessage: message.content,
            lastMessageTime: message.createdAt.toISOString(),
            unreadCount: message.receiverId === session.user.id && !message.isRead ? 1 : 0,
            isOnline: false, // Could be implemented with real-time status
          });
        } else {
          // Update unread count
          const contact = contactMap.get(otherUser.id);
          if (message.receiverId === session.user.id && !message.isRead) {
            contact.unreadCount += 1;
          }
          // Update last message if newer
          if (new Date(message.createdAt) > new Date(contact.lastMessageTime)) {
            contact.lastMessage = message.content;
            contact.lastMessageTime = message.createdAt.toISOString();
          }
        }
      });

      const contacts = Array.from(contactMap.values());

      return NextResponse.json({
        contacts,
      });
    }
  } catch (error) {
    console.error("Franchise messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "FRANCHISE") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, receiverId } = body;

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

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
        franchiseId: franchise.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      message,
    });
  } catch (error) {
    console.error("Create message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}