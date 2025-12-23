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
import { useRouter } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"

interface QuotationTemplateProps {
  quotation: any
}

const QuotationTemplate: React.FC<QuotationTemplateProps> = ({ quotation }) => {
  const router = useRouter()

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

      <div className="flex justify-between items-center mt-8 print:hidden border-t pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/cart')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
        >
          <Printer className="h-4 w-4" />
          Print Quotation
        </Button>
      </div>
    </div>
  )
}

export default QuotationTemplate

