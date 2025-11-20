import Image from "next/image"
import type React from "react"

const AuthorizedSignatory: React.FC = () => {
  return (
    <div className="text-right mb-8">
      <p>For TRADEMINDS MACHINERY PVT. LTD.</p>
      <Image src='/logo.png' alt="Company Logo" width={80} height={80} />
      <p className="mt-8">Authorized Signatory</p>
    </div>
  )
}

export default AuthorizedSignatory

