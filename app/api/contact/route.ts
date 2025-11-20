import { prisma } from "@/lib/prisma";
export async function POST(request: Request) {
 try {
     const { name, email, phone, subject, message, inquiryType } = await request.json();
     const contact=await prisma.contact.create({
         data: {
             name,
             email,
             phone,
             subject,
             message,
             inquiryType,
         },
     });
     return Response.json({ message: "Contact created successfully" }, { status: 201 });
 } catch (error) {
     console.error(error);
     return Response.json({ message: "Something went wrong" }, { status: 500 });
 }
}