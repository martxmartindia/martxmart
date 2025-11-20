"use client"

import type React from "react"

import CompanyHeader from "./CompanyHeader"
import QuotationDetails from "./QuotationDetails"
import ItemsTable from "./ItemsTable"
import TotalCalculation from "./TotalCalculation"
import BankDetails from "./BankDetails"
import Notes from "./Notes"
import TermsAndConditions from "./TermsAndConditions"
import { Button } from "@/components/ui/button"

interface QuotationTemplateProps {
  quotation: any
}

const QuotationTemplate: React.FC<QuotationTemplateProps> = ({ quotation }) => {
  const handlePrint = () => {
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        @page { margin: 0; size: A4; }
        body * { visibility: hidden; }
        .print-container, .print-container * { visibility: visible; }
        .print-container { position: absolute; left: 0; top: 0; width: 100%; }
      }
    `
    document.head.appendChild(style)
    window.print()
    document.head.removeChild(style)
  }

  return (
    <div className="max-w-[21cm] mx-auto p-8 bg-white shadow-lg text-[10px] leading-tight border-2 border-gray-300 print-container">
      <CompanyHeader quotationId={`EST-${quotation.id.substring(0, 6)}`} />
      <QuotationDetails user={quotation.user} />
      <ItemsTable items={quotation.items} />
      <TotalCalculation
        subtotal={quotation.subtotal}
        tax={quotation.tax}
        total={quotation.total}
        items={quotation.items}
      />
      <BankDetails />
      <Notes />
      <TermsAndConditions />

      <div className="flex justify-end mt-4 print:hidden">
        <Button onClick={handlePrint} className="ml-4">
          Print Quotation
        </Button>
      </div>
    </div>
  )
}

export default QuotationTemplate

