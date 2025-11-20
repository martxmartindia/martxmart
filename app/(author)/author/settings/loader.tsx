import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-10 flex justify-center items-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600 mr-2" />
      <span className="text-lg text-gray-700">Loading settings...</span>
    </div>
  )
}

