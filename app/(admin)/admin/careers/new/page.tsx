"use client"

import { CareerForm } from "../components/career-form"

export default function NewCareerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Job Posting</h1>
      <CareerForm />
    </div>
  )
}