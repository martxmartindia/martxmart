import type React from "react"

const TermsAndConditions: React.FC = () => {
  const terms = [
    "Warranty : All spare parts of the machine will have one year warranty from the date of machine supply. The Company will be liable only in case of any manufacturing defect. The company will not be responsible in any way for any damage caused by burning or short circuit.",
    "Payment Terms : The machines will be provided to the client only after 70% of the total payment amount for all the machines specified in the quotation has been paid in advance. In case of finance, machines will be made available only after 100% payment.",
    "Quotation Time Period : The price of quotation will be valid for 90 days from the date of issue of quotation. All written quotations automatically expire after 90 days unless accepted within 90 days from the date quoted. In case of finance, the quotation can be modified based on the instructions given by the bank.",
    "Delivery : After the payment of amount, the machines will be delivered within 30 to 45 days. In case of finance, it will be done within 30 days to 60 days.",
    "Support and Services : For any technical problems in the machines during working hours, call our company toll free number (+91-9262265226) or can also inform us on mail id (support@trademindsmachinery.co.in). The technical team of the company will be made available to solve your problems within 48 to 72 hours.",
    "Cancellation Policy : If the customer wishes to cancel the order, it will be mandatory to inform the company within 12 hours. If more than 12 hours elapse or the order is placed, the customer will have to pay service charge and the payment will be refunded within 48 to 72 hours but the order will not be canceled once the order is placed. In case of finance, the amount paid will not be refunded. The company will hand over all the machines mentioned in the quotation to the customer in time. The machine will not be returned under any circumstances after installation.",
    "Inconvenience Policy : If there is any defect in the machine, its information will have to be given at the time of machine installation itself. After the machine is installed, the company will not take any responsibility for it.",
    "Limit of Responsibilities : The company provides best quality products to the customers and they have to follow all the guidelines related to maintenance of machines 100%.",
    "Confidentiality : The company will keep the customer's data and details completely confidential so that the customer will not face any inconvenience.",
    "Legal Rights : In case of any kind of dispute, the final jurisdiction for the related legal rights and judicial process will be the Court of Purnia.",
    "Installation and Training : The installation of the machine will be done by the machine manufacturing company and the training program prescribed by the company for the use and maintenance of the machine will be provided to the customer's employees at reasonable service charges and if the installation of the machines is done by any unauthorized person, If installed by employees then our company will not be responsible for any compensation and all warranties and guarantees will be void.",
    "Packing and Transportation : Packing and transportation charges for the machines as determined by the company will be payable extra by the customer. This fee depends on the traffic. Besides, loading and unloading charges will also be payable to the customer.",
    "Insurance Requirements : Customer may be required to maintain insurance coverage for the machines. The customer will have to arrange for insurance at his own cost. The Company is not liable for any advice or assistance relating to insurance.",
    "Road Permit : If required please send Road Permit (i.e. e-way bill) for the out station.",
    "Buyer & Seller Consent : The Company prepares any quotation with the full consent of the Customer. The company is not responsible in any way in this.",
    "Amendments and Modifications : Our Company reserves the right to add or change the above terms and conditions and prices as and when required without giving any prior notice or assigning any reason.",
    "Tax Policy : All types of taxes decided by the State and Central Government on machines and services will be payable by the customer.",
    "We strongly suggest not to do business/services/buy/sell machines with any unauthorized person even if he says he is from TRADEMINDS MACHINERY PVT. LTD. , You are requested to please contact only the authorized personnel of the company so that you will get full support.",
  ]

  return (
    <div>
      <h3 className="font-bold mb-2">Terms and Conditions:</h3>
      <ol className="list-decimal list-inside">
        {terms.map((term, index) => (
          <li key={index} className="mb-1">
            {term}
          </li>
        ))}
      </ol>
      <p className="mt-2">
        Note - The Company will not be responsible for credit/payment into any account other than the bank account
        mentioned in the quotation.
      </p>
      <hr className="border-t border-gray-300 my-2" />
      <div className="mt-4 text-right">
        <p>Receiver&apos;s Signature</p>
      </div>
      <p className="text-center mt-4 font-bold">Thank You</p>
      <p className="text-center mt-4 text-[8px]">Page 3 / 3 • This is a digitally signed document.</p>
    </div>
  )
}

export default TermsAndConditions

