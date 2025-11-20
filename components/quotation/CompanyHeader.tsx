import type React from "react"
import Image from "next/image"

interface CompanyHeaderProps {
  quotationId: string
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ quotationId }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      {/* Logo */}
      <div className="w-1/4">
        <Image src="/logo1.png" alt="Company Logo" width={80} height={80} />
      </div>

      {/* Company Details */}
      <div className="w-1/2 text-center mr-">
        <h1 className="text-lg font-bold">TRADEMINDS MACHINERY PVT. LTD.</h1>
        <p>GSTIN 10AAKCT9241P1ZW PAN AAKCT9241P</p>
        <p>MSME NO UDYAM-BR-27-0038535</p>
        <p>SHASHI BHAWAN, COLLEGE CHOWK, J.P NAGAR COURT STATION RO-</p>
        <p>AD, NEAR PAPPU YADAV HOUSE</p>
        <p>PURNEA, BIHAR, 854301</p>
        <p>Mobile +91 9060181018, 9262265226 Email support@trademindsma-</p>
        <p>chinery.co.in</p>
        <p>Website www.trademindsmachinery.co.in</p>
      </div>

      {/* Quotation Title */}
      <div className="w-1/4 text-right">
        <h2 className="text-base font-bold">Q U O T A T I O N</h2>
        <p>ORIGINAL FOR RECIPIENT</p>
        <div>
          <p>
            <span className="font-semibold">Quotation #:</span> {quotationId}
          </p>
          <p>
            <span className="font-semibold">Quotation Date:</span>{" "}
            {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p>
            <span className="font-semibold">Validity:</span>{" "}
            {new Date(new Date().setDate(new Date().getDate() + 90)).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CompanyHeader

