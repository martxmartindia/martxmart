import type React from "react"

interface TotalCalculationProps {
  subtotal: number
  tax: number
  total: number
  items: any[]
}

const TotalCalculation: React.FC<TotalCalculationProps> = ({ subtotal, tax, total, items }) => {
  const totalItems = items.length
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  // Convert number to words
  const convertToWords = (num: number) => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    const convertLessThanOneThousand = (num: number) => {
      if (num === 0) return ""

      if (num < 10) return units[num]

      if (num < 20) return teens[num - 10]

      const ten = Math.floor(num / 10)
      const unit = num % 10

      return tens[ten] + (unit !== 0 ? " " + units[unit] : "")
    }

    if (num === 0) return "Zero"

    const roundedNum = Math.round(num)
    const lakhs = Math.floor(roundedNum / 100000)
    const thousands = Math.floor((roundedNum % 100000) / 1000)
    const hundreds = Math.floor((roundedNum % 1000) / 100)
    const remainder = roundedNum % 100

    let result = ""

    if (lakhs > 0) {
      result += convertLessThanOneThousand(lakhs) + " Lakh"
      if (lakhs > 1) result += "s"
    }

    if (thousands > 0) {
      if (result !== "") result += ", "
      result += convertLessThanOneThousand(thousands) + " Thousand"
    }

    if (hundreds > 0) {
      if (result !== "") result += ", "
      result += convertLessThanOneThousand(hundreds) + " Hundred"
    }

    if (remainder > 0) {
      if (result !== "") result += " And "
      result += convertLessThanOneThousand(remainder)
    }

    return result
  }

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-1">
        {/* Left side */}
        <div>Delivery/ Shipping Charges</div>
        <div className="text-right">₹0.00</div>
        <div className="text-[8px]">SAC: 9968</div>
        <div></div>

        <div>Packaging Charges</div>
        <div className="text-right">₹0.00</div>
        <div className="text-[8px]">SAC: 9967</div>
        <div></div>

        <div className="font-semibold">Taxable Amount</div>
        <div className="text-right font-semibold">₹{subtotal.toFixed(2)}</div>
        <div>CGST 9.0%</div>
        <div className="text-right">₹{(tax / 2).toFixed(2)}</div>
        <div>SGST 9.0%</div>
        <div className="text-right">₹{(tax / 2).toFixed(2)}</div>
        <div>Round Off</div>
        <div className="text-right">{(Math.round(total) - total).toFixed(2)}</div>
        <div className="font-bold text-sm">Total</div>
        <div className="text-right font-bold text-sm">₹{Math.round(total).toFixed(2)}</div>
      </div>

      {/* Total Items / Qty and Total Amount in Words */}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <p>
          Total Items / Qty : {totalItems} / {totalQuantity}
        </p>
        <p className="font-semibold text-right">
          Total amount (in words): INR {convertToWords(Math.round(total))} Rupees Only.
        </p>
      </div>

      <hr className="border-t border-gray-300 my-2" />
    </div>
  )
}

export default TotalCalculation

