import type React from "react"

interface Item {
  id: string
  name: string
  price: number
  quantity: number
  hsnCode:string
}

interface ItemsTableProps {
  items: Item[]
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items }) => {
  return (
    <div className="mb-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-1 text-left font-semibold">#</th>
            <th className="border border-gray-300 p-1 text-left font-semibold">Item</th>
            <th className="border border-gray-300 p-1 text-left font-semibold">HSN/ SAC</th>
            <th className="border border-gray-300 p-1 text-right font-semibold">Rate / Item</th>
            <th className="border border-gray-300 p-1 text-right font-semibold">Qty</th>
            <th className="border border-gray-300 p-1 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="border border-gray-300 p-1">{index + 1}</td>
              <td className="border border-gray-300 p-1">{item.name}</td>
              <td className="border border-gray-300 p-1">{item?.hsnCode || "-" }</td>
              <td className="border border-gray-300 p-1 text-right">  {Number(item.price).toFixed(2)}              </td>
              <td className="border border-gray-300 p-1 text-right">{item.quantity} PCS</td>
              <td className="border border-gray-300 p-1 text-right">{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ItemsTable

