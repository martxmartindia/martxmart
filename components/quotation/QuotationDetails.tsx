import type React from "react"

interface QuotationDetailsProps {
  user: {
    name?: string
    email?: string
    phone?: string
    address?:string
  }
}

const QuotationDetails: React.FC<QuotationDetailsProps> = ({ user }) => {
  return (
    <div className="mb-4">
      <hr className="border-t border-gray-300 mb-2" />
      <div className="grid grid-cols-2 gap-8">
        {/* Bill To */}
        <div>
          <p className="font-bold">Bill To:</p>
          <p>{user?.name || "Customer"}</p>
          <p>Ph: {user?.phone || "N/A"}</p>
          <p>{user?.email || "N/A"}</p>
          <p>{user.address|| "N/A"}</p>
          <p>Place of Supply: BIHAR</p>
        </div>

        {/* Dispatch From */}
        <div className="text-left">
          <p className="font-bold">Dispatch From:</p>
          <p>SHASHI BHAWAN, COLLEGE CHOWK, J.P NAGAR</p>
          <p>COURT STATION ROAD, NEAR PAPPU YADAV HOUSE</p>
          <p>PURNEA, BIHAR, 854301</p>
        </div>
      </div>
      <hr className="border-t border-gray-300 mt-2" />
    </div>
  )
}

export default QuotationDetails

