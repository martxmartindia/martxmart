import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request){
 try {
   const {sacCode,sacName} = await request.json()
   const hsn = await prisma.sacDetail.create({
     data:{
       sacCode,
       sacName     }
   })
 
   return NextResponse.json({
     message: "SAC Code Created",
     hsn
   })
 } catch (error) {
  console.error(error)
  return NextResponse.json({
     message: "Something went wrong",
     error
   })
 }
}

export async function GET(){
 try {
   const sac = await prisma.sacDetail.findMany()
   return NextResponse.json({
     message: "SAC Code Fetched",
     sac
   })
 }
 catch (error) {
   console.error(error)
   return NextResponse.json({
     message: "Something went wrong",
     error
   })
 }
}

export async function DELETE(request: Request){
 try {
   const {id} = await request.json()
   const sac = await prisma.sacDetail.delete({
     where:{
       id
     }
   })
   return NextResponse.json({
     message: "SAC Code Deleted",
     sac
   })
 }
 catch (error) {
   console.error(error)
   return NextResponse.json({
     message: "Something went wrong",
     error
   })
 }
}



export async function PUT(request: Request){
 try {
   const {id,sacCode,sacName} = await request.json()
   const sac = await prisma.sacDetail.update({
     where:{
       id
     },
     data:{
       sacCode,
       sacName
     }
   })
   return NextResponse.json({
     message: "SAC Code Updated",
     sac
   })
 }
 catch (error) {
   console.error(error)
   return NextResponse.json({
     message: "Something went wrong",
     error
   })
 }
}