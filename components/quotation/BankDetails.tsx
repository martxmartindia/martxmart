import type React from "react"

const BankDetails: React.FC = () => {
  return (
    <div className="mb-4">
      <h3 className="font-bold">Bank Details:</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Left side: Bank Information */}
        <div>
          <p>
            <span className="font-semibold">Bank:</span> State Bank of India
          </p>
          <p>
            <span className="font-semibold">Account #:</span> 20522005790
          </p>
          <p>
            <span className="font-semibold">IFSC Code:</span> SBIN0001846
          </p>
          <p>
            <span className="font-semibold">Branch:</span> ADB PURNEA
          </p>
          <br />
          <p>TRADEMINDS MACHINERY PRIVATE LIMITED</p>
          <p>CORPORATE CURRENT ACCOUNT</p>
          <p>STATE BANK OF INDIA</p>
          <p>A/C No. - 20522005790</p>
          <p>IFSC CODE - SBIN0001846</p>
          <p>ADB PURNEA BEANCH, LINE BAZAR, PURNEA</p>
        </div>

        {/* Right side: Authorized Signatory */}
        <div className="text-right">
          <p>For TRADEMINDS MACHINERY PVT. LTD.</p>
          <p className="mt-8">Authorized Signatory</p>
        </div>
      </div>

      <p className="text-center mt-4 text-[8px]">Page 1 / 3 • This is a digitally signed document.</p>
    </div>
  )
}

export default BankDetails

