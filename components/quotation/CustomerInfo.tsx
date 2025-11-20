import type React from "react"

const CustomerInfo: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div>
        <h3 className="font-bold">Quotation #: EST-335</h3>
        <p>Quotation Date: 06 Jan 2025</p>
        <p>Validity: 06 Apr 2025</p>
      </div>
      <div>
        <h3 className="font-bold">Bill To:</h3>
        <p>CHANDESHWAR MANDAL</p>
        <p>Ph: 9155613409</p>
        <p>sawanroy119@gmail.com</p>
        <p>WARD NO 04, NARRI GOBINDPUR</p>
        <p>PRATAPGANJ, SUPAUL</p>
        <p>SUPAUL, BIHAR, 852125</p>
        <p>Place of Supply: 10-BIHAR</p>
      </div>
    </div>
  )
}

export default CustomerInfo

