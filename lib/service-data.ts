export const services = [
  // Business Registration
  {
    title: "GST Registration",
    slug: "gst-registration",
    shortName: "GST Reg",
    description:
      "Register your business for Goods and Services Tax (GST) with our hassle-free service.",
    content:
      "GST Registration is mandatory for businesses with an annual turnover exceeding ₹20 lakhs (₹10 lakhs for special category states). Our comprehensive GST registration service handles the entire process from application to final registration certificate, ensuring all requirements are met and compliance is maintained.",
    priceAmount: 999,
    governmentFee:
      "No government fee for registration on the official GST portal",
    processingTime: "7-15 working days",
    validity: "Lifetime (requires annual return filing)",
    category: "Business Registration",
    imageUrl: "/images/services/gst-registration.jpg",
    features: [
      "End-to-end application processing",
      "Document verification and preparation",
      "Assistance with GST portal registration",
      "GSTIN certificate delivery",
      "Post-registration compliance guidance",
      "Dedicated support throughout the process",
    ],
    requiredDocuments: [
      "PAN Card of Business/Proprietor",
      "Aadhaar Card",
      "Business Registration Document (if applicable)",
      "Bank Account Statement/Cancelled Cheque",
      "Address Proof of Business Premises",
      "Photographs of Proprietor/Directors",
      "Electricity Bill of Business Premises",
    ],
    processSteps: [
      {
        step: "Application Submission",
        description: "Submit your details and documents through our portal",
      },
      {
        step: "Document Verification",
        description:
          "Our experts verify your documents for accuracy and completeness",
      },
      {
        step: "GST Portal Registration",
        description:
          "We register your business on the GST portal and submit the application",
      },
      {
        step: "Application Tracking",
        description:
          "Track your application status in real-time through our dashboard",
      },
      {
        step: "GSTIN Issuance",
        description:
          "Receive your GSTIN certificate once approved by the authorities",
      },
      {
        step: "Post-Registration Support",
        description: "Get guidance on compliance requirements and next steps",
      },
    ],
    faqs: [
      {
        question: "Is GST registration mandatory for my business?",
        answer:
          "GST registration is mandatory if your annual turnover exceeds ₹20 lakhs (₹10 lakhs for special category states). However, certain businesses must register regardless of turnover, such as e-commerce operators and inter-state suppliers.",
      },
      {
        question: "How long does it take to get GST registration?",
        answer:
          "Typically, GST registration takes 7-15 working days from the date of application submission, provided all documents are in order.",
      },
      {
        question: "What types of GST registration are available?",
        answer:
          "There are two main types: Regular GST registration for businesses with turnover above the threshold, and Composition Scheme for small businesses with turnover up to ₹1.5 crore.",
      },
      {
        question: "What happens after I get GST registration?",
        answer:
          "After registration, you'll need to comply with GST regulations including filing returns, maintaining proper invoicing, and paying taxes on time. We provide guidance on these compliance requirements.",
      },
    ],
    relatedServices: [
      {
        id: "2",
        title: "GST Return Filing",
        slug: "gst-return-filing",
      },
      {
        id: "3",
        title: "MSME Registration",
        slug: "msme-registration",
      },
    ],
  },
  {
    title: "MSME Registration",
    slug: "msme-registration",
    shortName: "MSME Reg",
    description:
      "Register your business as a Micro, Small, or Medium Enterprise to access government benefits and schemes.",
    content:
      "MSME (Udyam) Registration is a government certification that recognizes your business as a Micro, Small, or Medium Enterprise. This registration provides numerous benefits including priority sector lending, lower interest rates, subsidies, and preference in government tenders. Our service ensures smooth registration with minimal effort from your side.",
    priceAmount: 499,
    governmentFee: "Free (Government registration on Udyam Portal)",
    processingTime: "1-3 working days",
    validity: "Lifetime",
    category: "Business Registration",
    imageUrl: "/images/services/msme-registration.jpg",
    features: [
      "Free government registration",
      "Quick processing time",
      "Access to government schemes and subsidies",
      "Priority sector lending from banks",
      "Concessions in electricity bills",
      "Protection against delayed payments",
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "PAN Card of Business/Proprietor",
      "Business Registration Document (if applicable)",
      "Bank Account Details",
    ],
    processSteps: [
      {
        step: "Application Submission",
        description: "Submit your details and documents through our portal",
      },
      {
        step: "Information Verification",
        description: "Our experts verify your information for accuracy",
      },
      {
        step: "Online Registration",
        description: "We complete the registration process on the Udyam portal",
      },
      {
        step: "Certificate Generation",
        description: "Receive your MSME (Udyam) Registration Certificate",
      },
      {
        step: "Guidance on Benefits",
        description:
          "Get detailed information on available benefits and schemes",
      },
    ],
    faqs: [
      {
        question: "What are the criteria for MSME classification?",
        answer:
          "MSMEs are classified based on investment in plant & machinery/equipment and annual turnover. Micro: Investment up to ₹1 crore and turnover up to ₹5 crore; Small: Investment up to ₹10 crore and turnover up to ₹50 crore; Medium: Investment up to ₹50 crore and turnover up to ₹250 crore.",
      },
      {
        question: "Is MSME registration mandatory?",
        answer:
          "MSME registration is not mandatory but highly recommended as it provides numerous benefits and access to government schemes and subsidies.",
      },
      {
        question: "Can I update my MSME registration details later?",
        answer:
          "Yes, you can update your MSME registration details on the Udyam portal if there are any changes in your business information.",
      },
      {
        question: "What benefits do I get with MSME registration?",
        answer:
          "Benefits include priority sector lending, lower interest rates, subsidies on patents, industrial promotion subsidies, protection against delayed payments, concessions in electricity bills, and preference in government tenders.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
    ],
  },
  {
    title: "Company Registration",
    slug: "company-registration",
    shortName: "Company Reg",
    description:
      "Register your company as a Private Limited, LLP, or OPC with our comprehensive company registration service.",
    content:
      "Company registration provides a legal identity to your business and offers benefits like limited liability protection, perpetual existence, and enhanced credibility. Our service covers the entire process from name approval to incorporation certificate, ensuring compliance with all legal requirements.",
    priceAmount: 7999,
    governmentFee: "₹1,000 - ₹20,000 (depending on company type and capital)",
    processingTime: "15-20 working days",
    validity: "Perpetual existence",
    category: "Business Registration",
    imageUrl: "/images/services/company-registration.jpg",
    features: [
      "Name availability check and reservation",
      "Digital Signature Certificate (DSC) for directors",
      "Director Identification Number (DIN) for directors",
      "Preparation of MOA and AOA",
      "Filing of incorporation documents",
      "Certificate of Incorporation",
      "PAN and TAN for the company",
      "Bank account opening assistance",
    ],
    requiredDocuments: [
      "Identity proof of directors/partners (Aadhaar, PAN)",
      "Address proof of directors/partners",
      "Residential proof for registered office",
      "Passport-sized photographs of directors/partners",
      "Digital Signature Certificate (if already available)",
      "NOC from property owner (for registered office)",
    ],
    processSteps: [
      {
        step: "Name Reservation",
        description: "Check and reserve a unique company name with MCA",
      },
      {
        step: "DSC and DIN",
        description:
          "Obtain Digital Signature Certificate and Director Identification Number",
      },
      {
        step: "Document Preparation",
        description:
          "Prepare Memorandum of Association (MOA) and Articles of Association (AOA)",
      },
      {
        step: "Filing with MCA",
        description: "Submit incorporation application with MCA",
      },
      {
        step: "Certificate Issuance",
        description: "Receive Certificate of Incorporation, PAN, and TAN",
      },
      {
        step: "Post-Incorporation Compliance",
        description:
          "Guidance on post-incorporation requirements and compliance",
      },
    ],
    faqs: [
      {
        question: "What types of company structures are available in India?",
        answer:
          "The main types are Private Limited Company, Limited Liability Partnership (LLP), One Person Company (OPC), Public Limited Company, and Partnership Firm.",
      },
      {
        question: "What is the minimum number of directors/partners required?",
        answer:
          "Private Limited Company: Minimum 2 directors; LLP: Minimum 2 partners; OPC: 1 director; Public Limited Company: Minimum 3 directors.",
      },
      {
        question: "What is the minimum capital requirement?",
        answer:
          "There is no minimum capital requirement for company registration in India. You can start with any amount of authorized capital based on your business needs.",
      },
      {
        question: "What are the post-incorporation compliances?",
        answer:
          "These include appointing auditors, opening a bank account, GST registration (if applicable), maintaining statutory registers, filing annual returns, and conducting board meetings.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
    ],
  },
  {
    title: "Sole Proprietorship Registration",
    slug: "sole-proprietorship-registration",
    shortName: "Sole Prop Reg",
    description:
      "Register your sole proprietorship business with minimal formalities.",
    content:
      "Sole Proprietorship Registration is ideal for small businesses run by a single individual. It requires minimal formalities and offers ease of setup. Our service ensures compliance with necessary registrations like GST, MSME, or Shop & Establishment License to establish your business legally.",
    priceAmount: 799,
    governmentFee:
      "Varies (₹100-₹5,000 based on required licenses like GST or Shop Act)",
    processingTime: "5-10 working days",
    validity: "Lifetime (subject to license renewals)",
    category: "Business Registration",
    imageUrl: "/images/services/sole-proprietorship-registration.jpg",
    features: [
      "Assistance with required registrations (GST, MSME, Shop Act)",
      "Document preparation and verification",
      "Bank account opening guidance",
      "Compliance advisory for sole proprietors",
      "Dedicated support throughout the process",
    ],
    requiredDocuments: [
      "Aadhaar Card of Proprietor",
      "PAN Card of Proprietor",
      "Address Proof of Business Premises",
      "Bank Account Details",
      "Rent Agreement/NOC (if rented premises)",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather required documents for registration",
      },
      {
        step: "License Selection",
        description: "Determine necessary licenses (GST, MSME, Shop Act)",
      },
      {
        step: "Application Submission",
        description: "Submit applications for selected licenses",
      },
      {
        step: "Verification",
        description: "Verify documents and track application status",
      },
      {
        step: "Certificate Issuance",
        description: "Receive registration certificates",
      },
    ],
    faqs: [
      {
        question: "Is Sole Proprietorship Registration mandatory?",
        answer:
          "There is no specific 'Sole Proprietorship Registration' in India, but businesses must obtain licenses like GST (if turnover exceeds ₹20 lakhs) or Shop & Establishment License to operate legally.",
      },
      {
        question: "What are the benefits of Sole Proprietorship?",
        answer:
          "Benefits include ease of setup, full control over the business, minimal compliance requirements, and low operational costs compared to other business structures.",
      },
      {
        question: "Can a sole proprietorship convert to another structure?",
        answer:
          "Yes, a sole proprietorship can be converted to a Partnership, LLP, or Private Limited Company by meeting the legal requirements for the new structure.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "8",
        title: "Shop & Establishment License",
        slug: "shop-establishment-license",
      },
    ],
  },
  {
    title: "Partnership Firm Registration",
    slug: "partnership-firm-registration",
    shortName: "Partnership Reg",
    description:
      "Register your partnership firm to formalize your business with partners.",
    content:
      "Partnership Firm Registration formalizes a business run by two or more individuals under a Partnership Deed. Our service ensures compliance with the Indian Partnership Act, 1932, and includes assistance with necessary registrations like GST and MSME.",
    priceAmount: 2499,
    governmentFee: "₹500-₹5,000 (varies by state)",
    processingTime: "10-15 working days",
    validity: "Perpetual (subject to partnership deed terms)",
    category: "Business Registration",
    imageUrl: "/images/services/partnership-firm-registration.jpg",
    features: [
      "Drafting of Partnership Deed",
      "Registration with Registrar of Firms",
      "Assistance with GST and MSME registration",
      "PAN and TAN for the firm",
      "Bank account opening guidance",
    ],
    requiredDocuments: [
      "Partnership Deed",
      "Identity Proof of Partners (Aadhaar/PAN)",
      "Address Proof of Partners",
      "Address Proof of Business Premises",
      "Rent Agreement/NOC (if rented)",
    ],
    processSteps: [
      {
        step: "Partnership Deed Drafting",
        description: "Prepare a legally compliant Partnership Deed",
      },
      {
        step: "Document Collection",
        description: "Gather required documents for registration",
      },
      {
        step: "Registrar Submission",
        description: "Submit application to Registrar of Firms",
      },
      {
        step: "Verification",
        description: "Verify documents and track application status",
      },
      {
        step: "Certificate Issuance",
        description: "Receive Partnership Firm registration certificate",
      },
    ],
    faqs: [
      {
        question: "Is Partnership Firm Registration mandatory?",
        answer:
          "Registration is optional under the Indian Partnership Act, but registered firms have legal advantages like the ability to file suits against third parties and better credibility.",
      },
      {
        question: "What is a Partnership Deed?",
        answer:
          "A Partnership Deed is a legal agreement between partners outlining the terms of the partnership, including profit-sharing, roles, and responsibilities.",
      },
      {
        question: "Can a partnership firm convert to an LLP?",
        answer:
          "Yes, a partnership firm can be converted to an LLP by following the process under the Limited Liability Partnership Act, 2008.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "17",
        title: "Legal Agreement Drafting",
        slug: "legal-agreement-drafting",
      },
    ],
  },
  {
    title: "LLP Registration",
    slug: "llp-registration",
    shortName: "LLP Reg",
    description:
      "Register your Limited Liability Partnership for flexibility and liability protection.",
    content:
      "Limited Liability Partnership (LLP) registration combines the flexibility of a partnership with limited liability protection. Our service covers the entire process from name reservation to LLP incorporation, ensuring compliance with the LLP Act, 2008.",
    priceAmount: 6999,
    governmentFee: "₹2,000-₹10,000 (based on contribution amount)",
    processingTime: "15-20 working days",
    validity: "Perpetual existence",
    category: "Business Registration",
    imageUrl: "/images/services/llp-registration.jpg",
    features: [
      "Name availability check and reservation",
      "Digital Signature Certificate (DSC) for partners",
      "Designated Partner Identification Number (DPIN)",
      "LLP Agreement drafting",
      "Filing with MCA",
      "PAN and TAN for the LLP",
    ],
    requiredDocuments: [
      "Identity Proof of Partners (Aadhaar/PAN)",
      "Address Proof of Partners",
      "Address Proof of Registered Office",
      "LLP Agreement",
      "NOC from Property Owner (if rented)",
      "Digital Signature Certificate (if available)",
    ],
    processSteps: [
      {
        step: "Name Reservation",
        description: "Check and reserve a unique LLP name with MCA",
      },
      {
        step: "DSC and DPIN",
        description: "Obtain DSC and DPIN for designated partners",
      },
      {
        step: "LLP Agreement Drafting",
        description: "Prepare a legally compliant LLP Agreement",
      },
      {
        step: "Filing with MCA",
        description: "Submit incorporation application with MCA",
      },
      {
        step: "Certificate Issuance",
        description: "Receive LLP Incorporation Certificate, PAN, and TAN",
      },
    ],
    faqs: [
      {
        question: "What is the minimum number of partners for an LLP?",
        answer:
          "An LLP requires a minimum of two partners, with at least two designated partners.",
      },
      {
        question: "What are the benefits of an LLP?",
        answer:
          "Benefits include limited liability protection, flexibility in management, perpetual succession, and fewer compliance requirements compared to a Private Limited Company.",
      },
      {
        question: "Can an LLP be converted to a Private Limited Company?",
        answer:
          "Yes, an LLP can be converted to a Private Limited Company under the Companies Act, 2013.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
    ],
  },
  {
    title: "Private Limited Company Registration",
    slug: "private-limited-registration",
    shortName: "Pvt Ltd Reg",
    description:
      "Register your Private Limited Company for enhanced credibility and growth.",
    content:
      "Private Limited Company registration offers limited liability, perpetual succession, and high credibility for businesses aiming atuarial growth. Our service ensures compliance with the Companies Act, 2013, from name approval to incorporation.",
    priceAmount: 7999,
    governmentFee: "₹1,000-₹15,000 (based on authorized capital)",
    processingTime: "15-20 working days",
    validity: "Perpetual existence",
    category: "Business Registration",
    imageUrl: "/images/services/private-limited-registration.jpg",
    features: [
      "Name availability check and reservation",
      "Digital Signature Certificate (DSC) for directors",
      "Director Identification Number (DIN)",
      "MOA and AOA preparation",
      "Filing with MCA",
      "PAN and TAN issuance",
      "Bank account opening assistance",
    ],
    requiredDocuments: [
      "Identity Proof of Directors (Aadhaar/PAN)",
      "Address Proof of Directors",
      "Address Proof of Registered Office",
      "NOC from Property Owner (if rented)",
      "Memorandum and Articles of Association",
    ],
    processSteps: [
      {
        step: "Name Reservation",
        description: "Check and reserve a unique company name",
      },
      {
        step: "DSC and DIN",
        description: "Obtain DSC and DIN for directors",
      },
      {
        step: "Document Preparation",
        description: "Prepare MOA, AOA, and other documents",
      },
      {
        step: "MCA Filing",
        description: "Submit incorporation application to MCA",
      },
      {
        step: "Certificate Issuance",
        description: "Receive Certificate of Incorporation",
      },
    ],
    faqs: [
      {
        question: "What is the minimum number of directors required?",
        answer:
          "A Private Limited Company requires a minimum of two directors.",
      },
      {
        question: "What is the minimum capital requirement?",
        answer:
          "There is no minimum capital requirement for Private Limited Companies in India.",
      },
      {
        question: "What are the compliance requirements?",
        answer:
          "Compliance includes annual filings, board meetings, statutory audits, and maintaining statutory registers.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
    ],
  },
  {
    title: "One Person Company (OPC) Registration",
    slug: "opc-registration",
    shortName: "OPC Reg",
    description:
      "Register your One Person Company for a single-owner business structure.",
    content:
      "One Person Company (OPC) registration is ideal for single entrepreneurs seeking limited liability and a formal business structure. Our service ensures compliance with the Companies Act, 2013, for seamless OPC incorporation.",
    priceAmount: 6999,
    governmentFee: "₹1,000-₹10,000 (based on authorized capital)",
    processingTime: "15-20 working days",
    validity: "Perpetual existence",
    category: "Business Registration",
    imageUrl: "/images/services/opc-registration.jpg",
    features: [
      "Name reservation",
      "Digital Signature Certificate (DSC)",
      "Director Identification Number (DIN)",
      "MOA and AOA preparation",
      "Filing with MCA",
      "PAN and TAN issuance",
    ],
    requiredDocuments: [
      "Identity Proof of Director (Aadhaar/PAN)",
      "Address Proof of Director",
      "Address Proof of Registered Office",
      "NOC from Property Owner (if rented)",
      "Nominee details",
    ],
    processSteps: [
      {
        step: "Name Reservation",
        description: "Check and reserve a unique OPC name",
      },
      {
        step: "DSC and DIN",
        description: "Obtain DSC and DIN for the director",
      },
      {
        step: "Document Preparation",
        description: "Prepare MOA, AOA, and nominee details",
      },
      {
        step: "MCA Filing",
        description: "Submit incorporation application",
      },
      {
        step: "Certificate Issuance",
        description: "Receive OPC Certificate of Incorporation",
      },
    ],
    faqs: [
      {
        question: "Who can start an OPC?",
        answer:
          "Any Indian citizen with a single-member business can start an OPC, provided they appoint a nominee.",
      },
      {
        question: "What is the role of a nominee in an OPC?",
        answer:
          "The nominee takes over the business in case of the director’s death or incapacity.",
      },
      {
        question: "Can an OPC convert to another structure?",
        answer:
          "Yes, an OPC can convert to a Private Limited Company if its turnover exceeds ₹2 crore or paid-up capital exceeds ₹50 lakh.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
    ],
  },
  {
    title: "Startup India (DPIIT) Registration",
    slug: "startup-india-registration",
    shortName: "Startup Reg",
    description:
      "Register with Startup India to access government benefits for startups.",
    content:
      "Startup India (DPIIT) Registration provides recognition to startups, enabling access to tax exemptions, funding, and government schemes. Our service ensures compliance with DPIIT requirements for seamless registration.",
    priceAmount: 1999,
    governmentFee: "Free (DPIIT registration)",
    processingTime: "5-10 working days",
    validity: "10 years or until eligibility criteria are met",
    category: "Business Registration",
    imageUrl: "/images/services/startup-india-registration.jpg",
    features: [
      "Eligibility assessment",
      "Application preparation and filing",
      "DPIIT portal registration",
      "Certificate of Recognition",
      "Guidance on benefits and schemes",
    ],
    requiredDocuments: [
      "Incorporation Certificate",
      "PAN Card of Business",
      "Business Plan/Description",
      "Website or Pitch Deck (if available)",
      "Aadhaar/PAN of Founders",
    ],
    processSteps: [
      {
        step: "Eligibility Check",
        description: "Verify if your business meets DPIIT startup criteria",
      },
      {
        step: "Document Preparation",
        description: "Prepare required documents and business details",
      },
      {
        step: "DPIIT Portal Submission",
        description: "Submit application on the Startup India portal",
      },
      {
        step: "Verification",
        description: "Track application status and respond to queries",
      },
      {
        step: "Certificate Issuance",
        description: "Receive DPIIT Certificate of Recognition",
      },
    ],
    faqs: [
      {
        question: "What qualifies as a startup under DPIIT?",
        answer:
          "A business incorporated as a company/LLP/partnership, less than 10 years old, with turnover below ₹100 crore, and working on innovation or scalable models qualifies as a startup.",
      },
      {
        question: "What benefits does DPIIT registration provide?",
        answer:
          "Benefits include tax exemptions for 3 years, access to funding schemes like Startup India Seed Fund, priority in government tenders, and simplified compliance.",
      },
      {
        question: "Is DPIIT registration mandatory?",
        answer:
          "No, but it is highly recommended for startups to avail government benefits and recognition.",
      },
    ],
    relatedServices: [
      {
        id: "3",
        title: "MSME Registration",
        slug: "msme-registration",
      },
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
    ],
  },
  {
    title: "Import Export Code (IEC)",
    slug: "import-export-code",
    shortName: "IEC",
    description:
      "Obtain Import-Export Code (IEC) for your international trade business.",
    content:
      "Import-Export Code (IEC) is a mandatory registration required for businesses engaged in import and export activities in India. Our service provides end-to-end assistance for obtaining IEC, ensuring compliance with DGFT regulations and smooth international trade operations.",
    priceAmount: 1499,
    governmentFee: "₹500 (fixed by DGFT)",
    processingTime: "3-7 working days",
    validity: "Lifetime (requires periodic updates)",
    category: "Business Registration",
    imageUrl: "/images/services/iec-registration.jpg",
    features: [
      "Complete application preparation",
      "Document verification and submission",
      "Digital signature assistance",
      "DGFT portal registration",
      "IEC certificate delivery",
      "Post-registration guidance",
    ],
    requiredDocuments: [
      "PAN Card of the business entity",
      "Business registration documents",
      "Bank certificate with current account details",
      "Passport-sized photographs of the applicant",
      "Address proof of the business premises",
      "Digital Signature Certificate (if available)",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather all required documents for IEC application",
      },
      {
        step: "Application Preparation",
        description: "Prepare the IEC application with accurate information",
      },
      {
        step: "DGFT Portal Submission",
        description: "Submit the application on the DGFT portal",
      },
      {
        step: "Application Tracking",
        description: "Track the status of your IEC application",
      },
      {
        step: "Certificate Issuance",
        description: "Receive your IEC certificate upon approval",
      },
      {
        step: "Post-Registration Support",
        description: "Get guidance on using IEC for import-export activities",
      },
    ],
    faqs: [
      {
        question: "Who needs an Import-Export Code (IEC)?",
        answer:
          "Any business entity or individual engaged in import or export activities in India must obtain an IEC. It is mandatory for customs clearance of imported goods and for claiming export benefits.",
      },
      {
        question: "How long is an IEC valid?",
        answer:
          "An IEC is valid for lifetime. However, businesses need to update their IEC details whenever there are changes in the business structure, address, or other key information.",
      },
      {
        question: "Can I apply for IEC myself?",
        answer:
          "Yes, you can apply for IEC yourself through the DGFT portal. However, professional assistance ensures accurate application preparation, proper document submission, and faster processing.",
      },
      {
        question: "What happens if I import or export without an IEC?",
        answer:
          "Importing or exporting without an IEC is illegal and can result in penalties, confiscation of goods, and legal action. Customs authorities will not clear goods without a valid IEC.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
    ],
  },
  {
    title: "APEDA Registration",
    slug: "apeda-registration",
    shortName: "APEDA Reg",
    description:
      "Register with APEDA for exporting agricultural and processed food products.",
    content:
      "APEDA (Agricultural and Processed Food Products Export Development Authority) registration is required for businesses exporting scheduled agricultural and processed food products. Our service ensures compliance with APEDA requirements for seamless export operations.",
    priceAmount: 2499,
    governmentFee: "₹5,000 (fixed by APEDA)",
    processingTime: "5-10 working days",
    validity: "5 years (renewable)",
    category: "Business Registration",
    imageUrl: "/images/services/apeda-registration.jpg",
    features: [
      "Application preparation and filing",
      "Document verification",
      "APEDA portal registration",
      "Registration-cum-Membership Certificate (RCMC) issuance",
      "Guidance on export benefits",
    ],
    requiredDocuments: [
      "IEC Certificate",
      "PAN Card of Business",
      "Business Registration Documents",
      "Bank Certificate",
      "Export Contract (if available)",
      "List of Products for Export",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather required documents for APEDA registration",
      },
      {
        step: "Application Preparation",
        description: "Prepare the RCMC application",
      },
      {
        step: "APEDA Portal Submission",
        description: "Submit application on the APEDA portal",
      },
      {
        step: "Verification",
        description: "Track application status and respond to queries",
      },
      {
        step: "Certificate Issuance",
        description: "Receive APEDA RCMC certificate",
      },
    ],
    faqs: [
      {
        question: "Who needs APEDA registration?",
        answer:
          "Businesses exporting scheduled agricultural and processed food products like fruits, vegetables, meat, dairy, and processed foods need APEDA registration.",
      },
      {
        question: "What is the validity of APEDA registration?",
        answer:
          "APEDA registration is valid for 5 years and can be renewed thereafter.",
      },
      {
        question: "Is IEC mandatory for APEDA registration?",
        answer:
          "Yes, an Import-Export Code (IEC) is mandatory for APEDA registration.",
      },
    ],
    relatedServices: [
      {
        id: "7",
        title: "Import Export Code",
        slug: "import-export-code",
      },
      {
        id: "9",
        title: "FSSAI Registration",
        slug: "fssai-registration",
      },
    ],
  },
  {
    title: "FSSAI Registration",
    slug: "fssai-registration",
    shortName: "FSSAI",
    description:
      "Obtain FSSAI license for your food business with our comprehensive service.",
    content:
      "FSSAI (Food Safety and Standards Authority of India) registration is mandatory for all food businesses in India. Our service provides end-to-end assistance for obtaining FSSAI registration or license, ensuring compliance with food safety regulations and standards.",
    priceAmount: 1499,
    governmentFee: "₹100-₹7,500 per year (based on turnover and license type)",
    processingTime: "7-30 days (depends on license type)",
    validity: "1-5 years",
    category: "Business Registration",
    imageUrl: "/images/services/fssai-registration.jpg",
    features: [
      "Complete application preparation",
      "Document verification and submission",
      "FSSAI portal registration",
      "Application tracking",
      "License certificate delivery",
      "Compliance guidance",
      "Renewal assistance",
    ],
    requiredDocuments: [
      "Business registration documents",
      "Address proof of business premises",
      "ID proof of business owner/directors",
      "Photographs of business premises",
      "NOC from local authority",
      "Water test report",
      "Medical fitness certificates of food handlers",
      "List of food products",
    ],
    processSteps: [
      {
        step: "License Type Determination",
        description:
          "Determine the appropriate FSSAI license type based on your business",
      },
      {
        step: "Document Collection",
        description: "Gather all required documents for FSSAI application",
      },
      {
        step: "Application Preparation",
        description: "Prepare the application with accurate information",
      },
      {
        step: "FSSAI Portal Submission",
        description: "Submit the application on the FSSAI portal",
      },
      {
        step: "Inspection (if required)",
        description: "Prepare for and facilitate FSSAI inspection of premises",
      },
      {
        step: "License Issuance",
        description: "Receive your FSSAI license upon approval",
      },
    ],
    faqs: [
      {
        question: "What are the different types of FSSAI licenses?",
        answer:
          "There are three types: Basic Registration (for businesses with turnover less than ₹12 lakhs), State License (for businesses with turnover between ₹12 lakhs and ₹20 crores), and Central License (for businesses with turnover above ₹20 crores or operating in multiple states).",
      },
      {
        question: "Is FSSAI registration mandatory for all food businesses?",
        answer:
          "Yes, all food businesses including manufacturers, processors, packers, transporters, distributors, retailers, and food service operators must obtain FSSAI registration or license based on their turnover.",
      },
      {
        question: "What is the validity period of FSSAI license?",
        answer:
          "Basic Registration is valid for 1-5 years, State License for 1-5 years, and Central License for 1-5 years. The validity period can be chosen at the time of application.",
      },
      {
        question: "What are the penalties for operating without FSSAI license?",
        answer:
          "Operating a food business without FSSAI license can result in penalties up to ₹5 lakhs, imprisonment up to 6 months, and closure of the business.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "8",
        title: "Shop & Establishment License",
        slug: "shop-establishment-license",
      },
    ],
  },
  {
    title: "Shops & Establishment License",
    slug: "shop-establishment-license",
    shortName: "S&E License",
    description:
      "Obtain mandatory Shop & Establishment License for your business premises.",
    content:
      "Shop & Establishment License is a mandatory registration required for all commercial establishments employing people. This license regulates working conditions, working hours, holidays, and other employment terms. Our service provides end-to-end assistance for obtaining this license, ensuring compliance with local municipal regulations.",
    priceAmount: 999,
    governmentFee: "₹100-₹5,000 (varies by state and size of establishment)",
    processingTime: "7-15 working days",
    validity: "1-5 years (varies by state)",
    category: "Business Registration",
    imageUrl: "/images/services/shop-establishment.jpg",
    features: [
      "Complete application preparation",
      "Document verification and submission",
      "Municipal portal registration",
      "Application tracking",
      "License certificate delivery",
      "Renewal reminders",
    ],
    requiredDocuments: [
      "Business registration documents",
      "Address proof of business premises",
      "Rent agreement/ownership deed",
      "NOC from property owner (if rented)",
      "ID proof of business owner",
      "Photographs of business premises",
      "List of employees (if applicable)",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather all required documents for license application",
      },
      {
        step: "Application Preparation",
        description: "Prepare the application with accurate information",
      },
      {
        step: "Municipal Portal Submission",
        description: "Submit the application on the municipal portal",
      },
      {
        step: "Application Tracking",
        description: "Track the status of your license application",
      },
      {
        step: "License Issuance",
        description: "Receive your Shop & Establishment License upon approval",
      },
      {
        step: "Compliance Guidance",
        description: "Get guidance on compliance requirements under the Act",
      },
    ],
    faqs: [
      {
        question: "Who needs a Shop & Establishment License?",
        answer:
          "All commercial establishments including shops, restaurants, offices, warehouses, and other businesses employing people need to obtain this license. Even home-based businesses with employees require this license.",
      },
      {
        question: "What is the validity period of the license?",
        answer:
          "The validity period varies by state, ranging from 1 to 5 years. In most states, it needs to be renewed periodically.",
      },
      {
        question: "What are the penalties for not having this license?",
        answer:
          "Operating without a Shop & Establishment License can result in penalties ranging from ₹1,000 to ₹25,000 depending on the state and size of the establishment. Continued non-compliance can lead to closure of the business.",
      },
      {
        question: "Do I need to display the license at my premises?",
        answer:
          "Yes, the Shop & Establishment License must be prominently displayed at the business premises. This is a legal requirement under the Shop & Establishment Act.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "3",
        title: "MSME Registration",
        slug: "msme-registration",
      },
    ],
  },
  {
    title: "NGO / Trust / Society Registration",
    slug: "ngo-trust-society-registration",
    shortName: "NGO Reg",
    description:
      "Register your NGO, Trust, or Society for charitable or non-profit activities.",
    content:
      "NGO registration as a Trust, Society, or Section 8 Company enables organizations to undertake charitable, educational, or social activities with legal recognition. Our service ensures compliance with relevant laws like the Indian Trusts Act, Societies Registration Act, or Companies Act.",
    priceAmount: 9999,
    governmentFee: "₹2,000-₹20,000 (based on structure and state)",
    processingTime: "15-30 working days",
    validity: "Perpetual (subject to compliance)",
    category: "Business Registration",
    imageUrl: "/images/services/ngo-registration.jpg",
    features: [
      "Structure selection guidance (Trust/Society/Section 8)",
      "Drafting of Trust Deed/MOA",
      "Registration with relevant authority",
      "PAN and TAN issuance",
      "80G and 12A registration assistance",
    ],
    requiredDocuments: [
      "Identity Proof of Founders/Trustees",
      "Address Proof of Founders/Trustees",
      "Address Proof of Registered Office",
      "Trust Deed/MOA and AOA",
      "NOC from Property Owner (if rented)",
    ],
    processSteps: [
      {
        step: "Structure Selection",
        description: "Choose between Trust, Society, or Section 8 Company",
      },
      {
        step: "Document Preparation",
        description: "Prepare Trust Deed or MOA/AOA",
      },
      {
        step: "Authority Submission",
        description: "Submit application to Registrar or MCA",
      },
      {
        step: "Verification",
        description: "Track application status and respond to queries",
      },
      {
        step: "Certificate Issuance",
        description: "Receive registration certificate",
      },
    ],
    faqs: [
      {
        question: "What are the types of NGO registrations?",
        answer:
          "NGOs can be registered as a Trust (under Indian Trusts Act), Society (under Societies Registration Act), or Section 8 Company (under Companies Act, 2013).",
      },
      {
        question: "What are 80G and 12A registrations?",
        answer:
          "80G provides tax exemptions to donors, and 12A exempts the NGO’s income from tax. Both require separate applications after NGO registration.",
      },
      {
        question: "What are the compliance requirements for NGOs?",
        answer:
          "NGOs must file annual returns, maintain accounts, and comply with FCRA regulations if receiving foreign funds.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "6",
        title: "Income Tax Return Filing",
        slug: "income-tax-return-filing",
      },
    ],
  },

  // Legal & IPR Services
  {
    title: "Trademark Registration",
    slug: "trademark-registration",
    shortName: "Trademark",
    description:
      "Protect your brand identity with our comprehensive trademark registration service.",
    content:
      "Trademark registration provides exclusive rights to use your brand name, logo, or slogan and prevents others from using similar marks. Our service covers the entire process from trademark search to registration certificate, ensuring your intellectual property is protected.",
    priceAmount: 5999,
    governmentFee: "₹4,500 - ₹9,000 per class",
    processingTime:
      "18-24 months (full registration), 3-6 months (examination)",
    validity: "10 years (renewable)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/trademark-registration.jpg",
    features: [
      "Comprehensive trademark search",
      "Application preparation and filing",
      "Response to examination reports",
      "Publication in Trademark Journal",
      "Opposition proceedings handling (if required)",
      "Registration certificate delivery",
      "Trademark monitoring services",
    ],
    requiredDocuments: [
      "Clear image of the trademark/logo (if applicable)",
      "Identity proof of applicant",
      "Address proof of applicant",
      "Business registration documents",
      "Power of Attorney (if applying through agent)",
      "User affidavit (if claiming prior use)",
    ],
    processSteps: [
      {
        step: "Trademark Search",
        description: "Conduct a comprehensive search to ensure availability",
      },
      {
        step: "Application Filing",
        description: "Prepare and file trademark application with the registry",
      },
      {
        step: "Examination",
        description: "Respond to examination report from the Trademark Office",
      },
      {
        step: "Publication",
        description:
          "Application published in the Trademark Journal for opposition",
      },
      {
        step: "Opposition Period",
        description: "4-month period for third parties to oppose the trademark",
      },
      {
        step: "Registration",
        description:
          "Receive registration certificate if no opposition is filed",
      },
    ],
    faqs: [
      {
        question: "What can be registered as a trademark?",
        answer:
          "Names, logos, slogans, letters, numbers, colors, sounds, and even smells can be registered as trademarks if they are distinctive and identify your goods or services.",
      },
      {
        question: "How long does trademark registration take?",
        answer:
          "The complete process typically takes 18-24 months, but you get TM protection from the date of application. The examination process usually takes 3-6 months.",
      },
      {
        question: "What is the validity of a trademark registration?",
        answer:
          "Trademark registration is valid for 10 years from the date of application and can be renewed indefinitely for successive periods of 10 years.",
      },
      {
        question: "What is the difference between TM and ®?",
        answer:
          "TM symbol can be used when you have applied for registration but it's not yet registered. The ® symbol can only be used after your trademark is officially registered.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "15",
        title: "Copyright Registration",
        slug: "copyright-registration",
      },
    ],
  },
  {
    title: "Trademark Objection Reply",
    slug: "trademark-objection-reply",
    shortName: "TM Objection",
    description: "Address trademark objections with expert legal assistance.",
    content:
      "If your trademark application faces objections from the Trademark Office, our service provides expert assistance in drafting and filing a reply to address the objections, ensuring your application moves forward smoothly.",
    priceAmount: 2999,
    governmentFee: "None",
    processingTime: "7-15 working days",
    validity: "N/A (specific to objection resolution)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/trademark-objection-reply.jpg",
    features: [
      "Review of objection notice",
      "Drafting of legal reply",
      "Document preparation for response",
      "Filing with Trademark Office",
      "Follow-up on application status",
    ],
    requiredDocuments: [
      "Trademark application details",
      "Objection notice from Trademark Office",
      "Evidence of trademark use (if applicable)",
      "Power of Attorney (if applicable)",
    ],
    processSteps: [
      {
        step: "Objection Review",
        description: "Analyze the objection notice from the Trademark Office",
      },
      {
        step: "Response Drafting",
        description: "Prepare a legally sound reply addressing objections",
      },
      {
        step: "Document Submission",
        description: "Submit the reply and supporting documents",
      },
      {
        step: "Follow-Up",
        description: "Track the status of the application post-reply",
      },
      {
        step: "Resolution",
        description: "Ensure objections are resolved for application progress",
      },
    ],
    faqs: [
      {
        question: "Why does a trademark application face objections?",
        answer:
          "Objections may arise due to similarity with existing trademarks, lack of distinctiveness, or incomplete documentation.",
      },
      {
        question: "How long do I have to reply to a trademark objection?",
        answer:
          "Typically, you have 30 days from the date of objection notice to file a reply.",
      },
      {
        question: "What happens if I don’t respond to the objection?",
        answer:
          "Failure to respond can lead to the rejection of your trademark application.",
      },
    ],
    relatedServices: [
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
      {
        id: "16",
        title: "Trademark Renewal",
        slug: "trademark-renewal",
      },
    ],
  },
  {
    title: "Trademark Renewal",
    slug: "trademark-renewal",
    shortName: "TM Renewal",
    description: "Renew your trademark to maintain exclusive rights.",
    content:
      "Trademark renewal is required every 10 years to maintain your exclusive rights to the mark. Our service ensures timely renewal of your trademark, preventing lapse and unauthorized use.",
    priceAmount: 3999,
    governmentFee: "₹9,000 per class",
    processingTime: "3-6 months",
    validity: "10 years (renewable)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/trademark-renewal.jpg",
    features: [
      "Application preparation for renewal",
      "Document verification",
      "Filing with Trademark Office",
      "Renewal certificate issuance",
      "Monitoring of renewal status",
    ],
    requiredDocuments: [
      "Trademark Registration Certificate",
      "Identity Proof of Applicant",
      "Power of Attorney (if applicable)",
      "Proof of trademark use (if required)",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather documents for renewal application",
      },
      {
        step: "Application Preparation",
        description: "Prepare the renewal application",
      },
      {
        step: "Filing with Trademark Office",
        description: "Submit the renewal application",
      },
      {
        step: "Status Tracking",
        description: "Track the renewal application status",
      },
      {
        step: "Certificate Issuance",
        description: "Receive renewed trademark certificate",
      },
    ],
    faqs: [
      {
        question: "When should I renew my trademark?",
        answer:
          "Trademark renewal should be done within 6 months before or after the expiry of the 10-year validity period.",
      },
      {
        question: "What happens if I miss the renewal deadline?",
        answer:
          "You can renew within 6 months after expiry with a late fee. Beyond that, the trademark may lapse, requiring a new application.",
      },
      {
        question: "Can I renew my trademark indefinitely?",
        answer: "Yes, trademarks can be renewed indefinitely every 10 years.",
      },
    ],
    relatedServices: [
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
      {
        id: "14",
        title: "Trademark Objection Reply",
        slug: "trademark-objection-reply",
      },
    ],
  },
  {
    title: "Copyright Registration",
    slug: "copyright-registration",
    shortName: "Copyright",
    description:
      "Protect your creative works with our copyright registration service.",
    content:
      "Copyright registration protects original literary, artistic, musical, or dramatic works. Our service ensures compliance with the Copyright Act, 1957, providing legal protection against unauthorized use.",
    priceAmount: 3999,
    governmentFee: "₹500-₹5,000 (based on work type)",
    processingTime: "6-12 months",
    validity: "Lifetime of author + 60 years",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/copyright-registration.jpg",
    features: [
      "Work eligibility assessment",
      "Application preparation and filing",
      "Response to objections (if any)",
      "Copyright certificate issuance",
      "Post-registration guidance",
    ],
    requiredDocuments: [
      "Copy of the work",
      "Identity Proof of Applicant",
      "Address Proof of Applicant",
      "Power of Attorney (if applicable)",
      "NOC from co-authors (if any)",
    ],
    processSteps: [
      {
        step: "Work Assessment",
        description: "Assess the eligibility of your work for copyright",
      },
      {
        step: "Application Preparation",
        description: "Prepare the copyright application",
      },
      {
        step: "Filing with Copyright Office",
        description: "Submit application to the Copyright Office",
      },
      {
        step: "Objection Handling",
        description: "Respond to any objections raised",
      },
      {
        step: "Certificate Issuance",
        description: "Receive copyright registration certificate",
      },
    ],
    faqs: [
      {
        question: "What can be copyrighted?",
        answer:
          "Original literary, artistic, musical, dramatic works, software, and films can be copyrighted.",
      },
      {
        question: "Is copyright registration mandatory?",
        answer:
          "Copyright exists automatically upon creation, but registration provides legal proof and stronger protection.",
      },
      {
        question: "How long does copyright protection last?",
        answer:
          "Copyright lasts for the lifetime of the author plus 60 years in India.",
      },
    ],
    relatedServices: [
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
      {
        id: "17",
        title: "Patent Filing & Advisory",
        slug: "patent-filing-advisory",
      },
    ],
  },
  {
    title: "Patent Filing & Advisory",
    slug: "patent-filing-advisory",
    shortName: "Patent Filing",
    description:
      "Protect your inventions with expert patent filing and advisory services.",
    content:
      "Patent registration protects novel inventions, processes, or products. Our service provides comprehensive assistance in patent searches, drafting, filing, and advisory to secure your intellectual property under the Patents Act, 1970.",
    priceAmount: 14999,
    governmentFee: "₹1,600-₹8,000 (based on applicant type)",
    processingTime: "2-5 years",
    validity: "20 years from filing date",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/patent-filing.jpg",
    features: [
      "Patentability search",
      "Drafting of patent specification",
      "Application filing with Patent Office",
      "Response to examination reports",
      "Patent grant assistance",
    ],
    requiredDocuments: [
      "Detailed description of the invention",
      "Drawings/illustrations (if applicable)",
      "Identity Proof of Inventor",
      "Address Proof of Inventor",
      "Power of Attorney (if applicable)",
    ],
    processSteps: [
      {
        step: "Patent Search",
        description: "Conduct a search to confirm novelty",
      },
      {
        step: "Specification Drafting",
        description: "Draft detailed patent specification",
      },
      {
        step: "Application Filing",
        description: "File the patent application with the Patent Office",
      },
      {
        step: "Examination Response",
        description: "Respond to examination reports",
      },
      {
        step: "Patent Grant",
        description: "Receive patent grant upon approval",
      },
    ],
    faqs: [
      {
        question: "What can be patented?",
        answer:
          "Novel, non-obvious, and industrially applicable inventions, processes, or products can be patented.",
      },
      {
        question: "How long does patent registration take?",
        answer:
          "Patent registration typically takes 2-5 years due to detailed examination processes.",
      },
      {
        question: "What is the validity of a patent?",
        answer:
          "A patent is valid for 20 years from the date of filing in India.",
      },
    ],
    relatedServices: [
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
      {
        id: "15",
        title: "Copyright Registration",
        slug: "copyright-registration",
      },
    ],
  },
  {
    title: "Logo / Brand / Tagline Protection",
    slug: "logo-brand-protection",
    shortName: "Brand Protection",
    description:
      "Protect your logo, brand, or tagline with trademark and copyright services.",
    content:
      "Protect your logo, brand, or tagline through trademark and copyright registration. Our service ensures comprehensive protection of your brand identity, preventing unauthorized use and enhancing brand value.",
    priceAmount: 5999,
    governmentFee: "₹4,500-₹9,000 (trademark) + ₹500-₹5,000 (copyright)",
    processingTime: "6-24 months (based on protection type)",
    validity: "10 years (trademark) / Lifetime + 60 years (copyright)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/brand-protection.jpg",
    features: [
      "Trademark and copyright eligibility assessment",
      "Application preparation and filing",
      "Objection handling",
      "Certificate issuance",
      "Brand monitoring guidance",
    ],
    requiredDocuments: [
      "Logo/brand/tagline design",
      "Identity Proof of Applicant",
      "Address Proof of Applicant",
      "Business Registration Documents",
      "Power of Attorney (if applicable)",
    ],
    processSteps: [
      {
        step: "Protection Type Assessment",
        description: "Determine if trademark, copyright, or both are needed",
      },
      {
        step: "Application Preparation",
        description: "Prepare applications for trademark/copyright",
      },
      {
        step: "Filing",
        description: "Submit applications to respective offices",
      },
      {
        step: "Objection Handling",
        description: "Respond to any objections raised",
      },
      {
        step: "Certificate Issuance",
        description: "Receive registration certificates",
      },
    ],
    faqs: [
      {
        question: "Should I register my logo as a trademark or copyright?",
        answer:
          "Logos are typically protected under trademark for brand identity and under copyright for artistic design. We assess the best approach for your case.",
      },
      {
        question: "How long does brand protection take?",
        answer:
          "Trademark registration takes 18-24 months, while copyright takes 6-12 months.",
      },
      {
        question: "Can I protect a tagline?",
        answer:
          "Yes, taglines can be protected under trademark if distinctive.",
      },
    ],
    relatedServices: [
      {
        id: "5",
        title: "Trademark Registration",
        slug: "trademark-registration",
      },
      {
        id: "15",
        title: "Copyright Registration",
        slug: "copyright-registration",
      },
    ],
  },
  {
    title: "Legal Agreement Drafting (MoU, NDA, Partnership Deed, etc.)",
    slug: "legal-agreement-drafting",
    shortName: "Agreement Drafting",
    description:
      "Draft legally binding agreements tailored to your business needs.",
    content:
      "Our legal agreement drafting service provides customized MoUs, NDAs, Partnership Deeds, and other contracts, ensuring legal compliance and protection of your interests.",
    priceAmount: 2499,
    governmentFee: "₹100-₹1,000 (for stamp duty, if applicable)",
    processingTime: "3-7 working days",
    validity: "As per agreement terms",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/legal-agreement-drafting.jpg",
    features: [
      "Customized agreement drafting",
      "Legal review and compliance check",
      "Stamp duty guidance",
      "Execution support",
      "Revisions based on client feedback",
    ],
    requiredDocuments: [
      "Details of parties involved",
      "Purpose and terms of the agreement",
      "Identity Proof of Signatories",
      "Business Registration Documents (if applicable)",
    ],
    processSteps: [
      {
        step: "Requirement Gathering",
        description: "Understand the purpose and terms of the agreement",
      },
      {
        step: "Drafting",
        description: "Prepare a legally compliant draft",
      },
      {
        step: "Client Review",
        description: "Share draft for client feedback and revisions",
      },
      {
        step: "Finalization",
        description: "Finalize the agreement with necessary clauses",
      },
      {
        step: "Execution",
        description: "Guide on signing and stamp duty requirements",
      },
    ],
    faqs: [
      {
        question: "What types of agreements can you draft?",
        answer:
          "We draft MoUs, NDAs, Partnership Deeds, Service Agreements, Franchise Agreements, and more, tailored to your needs.",
      },
      {
        question: "Is stamp duty mandatory for agreements?",
        answer:
          "Stamp duty depends on the agreement type and state laws. Some agreements like NDAs may not require it, while Partnership Deeds do.",
      },
      {
        question: "How long does it take to draft an agreement?",
        answer:
          "Drafting typically takes 3-7 days, depending on complexity and revisions.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "18",
        title: "Legal Notices & Replies",
        slug: "legal-notices-replies",
      },
    ],
  },
  {
    title: "Legal Notices & Replies",
    slug: "legal-notices-replies",
    shortName: "Legal Notices",
    description:
      "Draft and respond to legal notices with professional assistance.",
    content:
      "Our service provides expert drafting and response to legal notices, ensuring your interests are protected and responses comply with legal standards.",
    priceAmount: 1999,
    governmentFee: "None",
    processingTime: "3-7 working days",
    validity: "N/A (specific to notice resolution)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/legal-notices.jpg",
    features: [
      "Notice drafting or review",
      "Legal response preparation",
      "Compliance with legal standards",
      "Follow-up guidance",
      "Escalation advice (if needed)",
    ],
    requiredDocuments: [
      "Details of the issue",
      "Copy of received notice (if replying)",
      "Identity Proof of Client",
      "Relevant agreements/documents",
    ],
    processSteps: [
      {
        step: "Issue Assessment",
        description: "Understand the issue and notice details",
      },
      {
        step: "Drafting/Response Preparation",
        description: "Prepare a legally sound notice or response",
      },
      {
        step: "Client Review",
        description: "Share draft for feedback and revisions",
      },
      {
        step: "Submission",
        description: "Send the notice or response to the relevant party",
      },
      {
        step: "Follow-Up",
        description: "Guide on next steps or escalation",
      },
    ],
    faqs: [
      {
        question: "When should I send a legal notice?",
        answer:
          "A legal notice is sent to formally address issues like contract breaches, payment disputes, or trademark infringements before escalating to legal action.",
      },
      {
        question: "How long do I have to respond to a legal notice?",
        answer:
          "Typically, you have 15-30 days to respond, depending on the notice terms.",
      },
      {
        question: "What happens if I ignore a legal notice?",
        answer:
          "Ignoring a notice can lead to legal action, including court cases or penalties, depending on the issue.",
      },
    ],
    relatedServices: [
      {
        id: "17",
        title: "Legal Agreement Drafting",
        slug: "legal-agreement-drafting",
      },
      {
        id: "19",
        title: "Consumer Complaint Filing",
        slug: "consumer-complaint-filing",
      },
    ],
  },
  {
    title: "Consumer Complaint Filing",
    slug: "consumer-complaint-filing",
    shortName: "Consumer Complaint",
    description:
      "File consumer complaints against defective products or services.",
    content:
      "Our service assists in filing consumer complaints under the Consumer Protection Act, 2019, to address issues like defective products, deficient services, or unfair trade practices.",
    priceAmount: 2499,
    governmentFee: "₹0-₹5,000 (based on claim amount and forum)",
    processingTime: "15-30 days for filing",
    validity: "N/A (specific to case resolution)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/consumer-complaint.jpg",
    features: [
      "Complaint drafting",
      "Document preparation",
      "Filing with consumer forum",
      "Case tracking support",
      "Legal advisory",
    ],
    requiredDocuments: [
      "Details of the issue",
      "Purchase receipts/invoices",
      "Correspondence with seller/service provider",
      "Identity Proof of Complainant",
    ],
    processSteps: [
      {
        step: "Issue Assessment",
        description: "Understand the consumer issue and evidence",
      },
      {
        step: "Complaint Drafting",
        description: "Prepare a legally compliant complaint",
      },
      {
        step: "Document Preparation",
        description: "Gather supporting documents",
      },
      {
        step: "Filing",
        description: "File the complaint with the appropriate consumer forum",
      },
      {
        step: "Follow-Up",
        description: "Track case progress and provide updates",
      },
    ],
    faqs: [
      {
        question: "Who can file a consumer complaint?",
        answer:
          "Any consumer who purchased goods or services and faced issues like defects, deficiencies, or unfair practices can file a complaint.",
      },
      {
        question: "Where are consumer complaints filed?",
        answer:
          "Complaints are filed in District, State, or National Consumer Disputes Redressal Commissions, based on the claim amount.",
      },
      {
        question: "What is the time limit for filing a consumer complaint?",
        answer:
          "Complaints must be filed within 2 years from the date the issue arose.",
      },
    ],
    relatedServices: [
      {
        id: "18",
        title: "Legal Notices & Replies",
        slug: "legal-notices-replies",
      },
      {
        id: "20",
        title: "Legal Case Filing Support",
        slug: "legal-case-filing",
      },
    ],
  },
  {
    title: "Legal Case Filing Support",
    slug: "legal-case-filing",
    shortName: "Case Filing",
    description:
      "Get expert support for filing legal cases in courts or tribunals.",
    content:
      "Our legal case filing support service assists in preparing and filing cases in courts or tribunals, covering issues like contract disputes, property disputes, or business litigation, ensuring compliance with legal procedures.",
    priceAmount: 9999,
    governmentFee: "Varies (based on case type and court)",
    processingTime: "15-60 days for filing",
    validity: "N/A (specific to case resolution)",
    category: "Legal & IPR Services",
    imageUrl: "/images/services/legal-case-filing.jpg",
    features: [
      "Case assessment and strategy",
      "Document preparation",
      "Filing with appropriate court/tribunal",
      "Legal representation coordination",
      "Case tracking support",
    ],
    requiredDocuments: [
      "Details of the dispute",
      "Relevant agreements/documents",
      "Correspondence related to the issue",
      "Identity Proof of Client",
    ],
    processSteps: [
      {
        step: "Case Assessment",
        description: "Analyze the issue and legal merits",
      },
      {
        step: "Document Preparation",
        description: "Prepare legal documents and pleadings",
      },
      {
        step: "Filing",
        description: "File the case with the appropriate court/tribunal",
      },
      {
        step: "Representation Coordination",
        description: "Coordinate with lawyers for representation",
      },
      {
        step: "Case Tracking",
        description: "Track case progress and provide updates",
      },
    ],
    faqs: [
      {
        question: "What types of cases can be filed?",
        answer:
          "Cases include contract disputes, property disputes, business litigation, consumer disputes, and more, depending on the issue.",
      },
      {
        question: "How long does it take to file a case?",
        answer:
          "Filing typically takes 15-60 days, depending on case complexity and court requirements.",
      },
      {
        question: "Do I need a lawyer for case filing?",
        answer:
          "While you can file a case yourself, professional legal support ensures compliance and strengthens your case.",
      },
    ],
    relatedServices: [
      {
        id: "18",
        title: "Legal Notices & Replies",
        slug: "legal-notices-replies",
      },
      {
        id: "19",
        title: "Consumer Complaint Filing",
        slug: "consumer-complaint-filing",
      },
    ],
  },

  // Tax & Compliance
  {
    title: "GST Return Filing",
    slug: "gst-return-filing",
    shortName: "GST Filing",
    description:
      "Professional assistance for filing your GST returns accurately and on time.",
    content:
      "Our GST Return Filing service ensures accurate and timely filing of your GST returns, helping you maintain compliance and avoid penalties. We handle all types of GST returns including GSTR-1, GSTR-3B, and GSTR-9, ensuring proper reconciliation and maximum input tax credit.",
    priceAmount: 999,
    governmentFee: "None",
    processingTime: "3-5 working days",
    validity: "For the relevant tax period",
    category: "Tax & Compliance",
    imageUrl: "/images/services/gst-return-filing.jpg",
    features: [
      "All GST return types covered",
      "Data reconciliation",
      "Input tax credit optimization",
      "Error identification and correction",
      "Compliance monitoring",
      "Notice handling assistance",
      "Regular compliance updates",
    ],
    requiredDocuments: [
      "GST registration certificate",
      "Sales and purchase invoices",
      "E-way bills (if applicable)",
      "Bank statements",
      "Previous returns (if filed)",
      "Input tax credit details",
    ],
    processSteps: [
      {
        step: "Data Collection",
        description: "Provide your sales, purchase, and other financial data",
      },
      {
        step: "Data Processing",
        description: "Our experts process and reconcile your data",
      },
      {
        step: "Return Preparation",
        description: "Prepare your GST return with proper reconciliation",
      },
      {
        step: "Review and Approval",
        description: "Review the prepared return and approve for filing",
      },
      {
        step: "Filing",
        description: "File your GST return on the GST portal",
      },
      {
        step: "Confirmation",
        description: "Receive confirmation and filing acknowledgment",
      },
    ],
    faqs: [
      {
        question: "What are the different types of GST returns?",
        answer:
          "The main GST returns are GSTR-1 (outward supplies), GSTR-3B (monthly summary return), GSTR-9 (annual return), and GSTR-9C (reconciliation statement). The applicable returns depend on your business type and turnover.",
      },
      {
        question: "What are the due dates for GST returns?",
        answer:
          "GSTR-1: 11th of the next month; GSTR-3B: 20th of the next month; GSTR-9 and GSTR-9C: December 31st of the next financial year. These dates may vary for different categories of taxpayers.",
      },
      {
        question: "What happens if I miss the GST return filing deadline?",
        answer:
          "Late filing attracts penalties (₹50-₹200 per day) and interest (18% per annum) on the tax liability. It also restricts your buyers from claiming input tax credit, affecting your business relationships.",
      },
      {
        question: "How can I maximize my input tax credit?",
        answer:
          "To maximize input tax credit, ensure all your purchases are from registered dealers, maintain proper invoices, reconcile your purchase data with supplier filings, and claim ITC within the stipulated time frame.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "6",
        title: "Income Tax Return Filing",
        slug: "income-tax-return-filing",
      },
    ],
  },
  {
    title: "Income Tax Return (ITR) Filing",
    slug: "income-tax-return-filing",
    shortName: "ITR Filing",
    description:
      "Professional assistance for filing your income tax returns accurately and on time.",
    content:
      "Our Income Tax Return Filing service ensures accurate and timely filing of your tax returns, maximizing eligible deductions and exemptions. We handle all types of ITR forms for individuals, professionals, and businesses, ensuring compliance with tax laws and regulations.",
    priceAmount: 799,
    governmentFee: "None for most individual returns",
    processingTime: "3-5 working days",
    validity: "For the relevant assessment year",
    category: "Tax & Compliance",
    imageUrl: "/images/services/itr-filing.jpg",
    features: [
      "Comprehensive tax planning",
      "Maximum tax saving suggestions",
      "All ITR forms covered",
      "E-filing with digital signature",
      "Verification and confirmation",
      "Post-filing support",
      "Assistance with tax notices (if any)",
    ],
    requiredDocuments: [
      "PAN Card",
      "Aadhaar Card",
      "Form 16 (if salaried)",
      "Bank statements",
      "Investment proofs for deductions",
      "Property documents (if applicable)",
      "Previous year's ITR (if filed)",
    ],
    processSteps: [
      {
        step: "Information Collection",
        description: "Provide your financial information and documents",
      },
      {
        step: "Data Analysis",
        description: "Our experts analyze your data for maximum tax benefits",
      },
      {
        step: "Return Preparation",
        description: "Prepare your tax return with all eligible deductions",
      },
      {
        step: "Review and Approval",
        description: "Review the prepared return and approve for filing",
      },
      {
        step: "E-Filing",
        description: "E-file your return with the Income Tax Department",
      },
      {
        step: "Verification",
        description: "Complete the verification process (e-verify or physical)",
      },
    ],
    faqs: [
      {
        question: "Who needs to file an Income Tax Return?",
        answer:
          "Individuals with gross total income exceeding the basic exemption limit (₹2.5 lakhs for individuals under 60 years), professionals, businesses, and those with specific conditions like foreign income or assets must file ITR.",
      },
      {
        question: "What is the due date for filing ITR?",
        answer:
          "For individuals and entities not requiring audit, the due date is typically July 31st. For businesses requiring audit, it's October 31st. These datesmay vary as per government notifications.",
      },
      {
        question: "What happens if I miss the ITR filing deadline?",
        answer:
          "You can still file a belated return within the financial year with a late fee. However, you may lose certain benefits like the ability to carry forward losses (except house property losses).",
      },
      {
        question: "Which ITR form should I use?",
        answer:
          "The form depends on your income sources: ITR-1 for salary/pension, ITR-2 for capital gains, ITR-3 for business income, ITR-4 for presumptive income, and so on. We'll help determine the right form for you.",
      },
    ],
    relatedServices: [
      {
        id: "1",
        title: "GST Registration",
        slug: "gst-registration",
      },
      {
        id: "2",
        title: "GST Return Filing",
        slug: "gst-return-filing",
      },
    ],
  },
  {
    title: "TDS Return Filing",
    slug: "tds-return-filing",
    shortName: "TDS Filing",
    description:
      "Ensure timely and accurate TDS return filing for your business.",
    content:
      "Our TDS Return Filing service ensures compliance with Tax Deducted at Source (TDS) regulations under the Income Tax Act, 1961. We handle quarterly TDS return filings, including Form 24Q, 26Q, and 27Q, ensuring accurate deductions and timely submissions to avoid penalties.",
    priceAmount: 1499,
    governmentFee: "None",
    processingTime: "3-7 working days",
    validity: "For the relevant quarter",
    category: "Tax & Compliance",
    imageUrl: "/images/services/tds-return-filing.jpg",
    features: [
      "TDS data reconciliation",
      "Preparation of TDS returns (24Q, 26Q, 27Q)",
      "E-filing with digital signature",
      "TDS certificate issuance (Form 16/16A)",
      "Compliance monitoring",
      "Assistance with TDS notices",
    ],
    requiredDocuments: [
      "TAN (Tax Deduction Account Number)",
      "Details of TDS deductions",
      "Challan details of TDS payments",
      "PAN of deductees",
      "Financial statements",
      "Previous TDS returns (if applicable)",
    ],
    processSteps: [
      {
        step: "Data Collection",
        description: "Collect TDS deduction and payment details",
      },
      {
        step: "Data Reconciliation",
        description: "Reconcile TDS data with financial records",
      },
      {
        step: "Return Preparation",
        description: "Prepare quarterly TDS returns",
      },
      {
        step: "Review and Approval",
        description: "Review returns for accuracy and approval",
      },
      {
        step: "E-Filing",
        description: "File TDS returns on the Income Tax portal",
      },
      {
        step: "Certificate Issuance",
        description: "Issue Form 16/16A to deductees",
      },
    ],
    faqs: [
      {
        question: "Who needs to file TDS returns?",
        answer:
          "Any person or entity deducting TDS on payments like salaries, professional fees, rent, or interest must file TDS returns.",
      },
      {
        question: "What are the due dates for TDS returns?",
        answer:
          "Quarterly TDS returns are due on July 31st (Q1), October 31st (Q2), January 31st (Q3), and May 31st (Q4).",
      },
      {
        question: "What are the penalties for late TDS filing?",
        answer:
          "Late filing attracts a penalty of ₹200 per day, up to the TDS amount, and interest at 1-1.5% per month for delayed payments.",
      },
      {
        question: "What is the difference between Form 16 and Form 16A?",
        answer:
          "Form 16 is for TDS on salaries, while Form 16A is for TDS on other payments like rent or professional fees.",
      },
    ],
    relatedServices: [
      {
        id: "6",
        title: "Income Tax Return Filing",
        slug: "income-tax-return-filing",
      },
      {
        id: "13",
        title: "PAN / TAN Application",
        slug: "pan-tan-application",
      },
    ],
  },
  {
    title: "Advance Tax Filing",
    slug: "advance-tax-filing",
    shortName: "Advance Tax",
    description: "Manage your advance tax payments with expert guidance.",
    content:
      "Advance Tax Filing is mandatory for individuals, HUFs, and businesses with tax liability exceeding ₹10,000 in a financial year. Our service ensures timely calculation and payment of advance tax installments to avoid interest penalties under the Income Tax Act.",
    priceAmount: 999,
    governmentFee: "None",
    processingTime: "2-5 working days per installment",
    validity: "For the relevant financial year",
    category: "Tax & Compliance",
    imageUrl: "/images/services/advance-tax-filing.jpg",
    features: [
      "Tax liability estimation",
      "Advance tax calculation",
      "Challan preparation and payment support",
      "E-filing assistance",
      "Compliance reminders",
      "Interest penalty avoidance guidance",
    ],
    requiredDocuments: [
      "PAN Card",
      "Estimated income details",
      "Previous year’s ITR",
      "Financial statements",
      "Investment proofs (if applicable)",
    ],
    processSteps: [
      {
        step: "Income Estimation",
        description: "Estimate your annual income and tax liability",
      },
      {
        step: "Tax Calculation",
        description: "Calculate advance tax for each installment",
      },
      {
        step: "Challan Preparation",
        description: "Prepare advance tax payment challan",
      },
      {
        step: "Payment Submission",
        description: "Assist in making advance tax payments",
      },
      {
        step: "Filing Confirmation",
        description: "Confirm payment and update records",
      },
    ],
    faqs: [
      {
        question: "Who needs to pay advance tax?",
        answer:
          "Individuals, HUFs, and businesses with tax liability exceeding ₹10,000 in a financial year must pay advance tax.",
      },
      {
        question: "What are the due dates for advance tax?",
        answer:
          "Advance tax is paid in installments: 15% by June 15th, 45% by September 15th, 75% by December 15th, and 100% by March 15th.",
      },
      {
        question: "What happens if I miss an advance tax payment?",
        answer:
          "Missing payments incurs interest under Sections 234B and 234C, typically at 1% per month.",
      },
    ],
    relatedServices: [
      {
        id: "6",
        title: "Income Tax Return Filing",
        slug: "income-tax-return-filing",
      },
      {
        id: "21",
        title: "TDS Return Filing",
        slug: "tds-return-filing",
      },
    ],
  },
  {
    title: "ROC Filing (MCA Annual Return)",
    slug: "roc-filing",
    shortName: "ROC Filing",
    description:
      "Ensure timely ROC filing for your company’s compliance with MCA.",
    content:
      "ROC (Registrar of Companies) Filing is mandatory for companies and LLPs under the Companies Act, 2013, and LLP Act, 2008. Our service ensures timely filing of annual returns and financial statements with the Ministry of Corporate Affairs (MCA).",
    priceAmount: 4999,
    governmentFee: "₹600-₹6,000 (based on authorized capital)",
    processingTime: "7-15 working days",
    validity: "For the relevant financial year",
    category: "Tax & Compliance",
    imageUrl: "/images/services/roc-filing.jpg",
    features: [
      "Preparation of Form AOC-4 and MGT-7",
      "Financial statement compilation",
      "Digital signature application",
      "Filing with MCA portal",
      "Compliance monitoring",
      "Penalty avoidance guidance",
    ],
    requiredDocuments: [
      "Financial statements (Balance Sheet, P&L)",
      "Auditor’s report",
      "Board resolution details",
      "Digital Signature Certificate of Director",
      "Details of shareholders/directors",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather financial statements and other documents",
      },
      {
        step: "Form Preparation",
        description: "Prepare AOC-4 and MGT-7 forms",
      },
      {
        step: "Audit Coordination",
        description: "Coordinate with auditors for compliance",
      },
      {
        step: "Filing with MCA",
        description: "Submit forms on the MCA portal",
      },
      {
        step: "Confirmation",
        description: "Receive filing acknowledgment",
      },
    ],
    faqs: [
      {
        question: "Who needs to file ROC returns?",
        answer:
          "All registered companies (Private Limited, Public Limited, OPC) and LLPs must file annual returns with the MCA.",
      },
      {
        question: "What are the due dates for ROC filing?",
        answer:
          "Form AOC-4 (financial statements) is due within 30 days of AGM, and Form MGT-7 (annual return) within 60 days of AGM, typically by October 30th and November 29th.",
      },
      {
        question: "What are the penalties for late ROC filing?",
        answer:
          "Late filing incurs a penalty of ₹100 per day per form, with additional fines for continued non-compliance.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "24",
        title: "Audit Services",
        slug: "audit-services",
      },
    ],
  },
  {
    title: "Audit Services (Statutory / Internal)",
    slug: "audit-services",
    shortName: "Audit Services",
    description:
      "Conduct statutory and internal audits for compliance and transparency.",
    content:
      "Our audit services include statutory audits required under the Companies Act and internal audits for operational efficiency. We ensure compliance with regulatory standards and provide detailed reports for transparency.",
    priceAmount: 9999,
    governmentFee: "None (audit fees vary by company size)",
    processingTime: "15-30 days",
    validity: "For the relevant financial year",
    category: "Tax & Compliance",
    imageUrl: "/images/services/audit-services.jpg",
    features: [
      "Statutory audit for compliance",
      "Internal audit for process efficiency",
      "Audit report preparation",
      "Compliance with accounting standards",
      "Coordination with statutory auditors",
      "Recommendations for improvements",
    ],
    requiredDocuments: [
      "Financial statements",
      "Accounting records",
      "Previous audit reports",
      "Board resolutions",
      "Details of transactions",
    ],
    processSteps: [
      {
        step: "Audit Planning",
        description: "Plan the audit scope and timeline",
      },
      {
        step: "Data Collection",
        description: "Gather financial and operational data",
      },
      {
        step: "Audit Execution",
        description: "Conduct statutory or internal audit",
      },
      {
        step: "Report Preparation",
        description: "Prepare detailed audit reports",
      },
      {
        step: "Review and Submission",
        description: "Review findings and submit reports",
      },
    ],
    faqs: [
      {
        question:
          "What is the difference between statutory and internal audits?",
        answer:
          "Statutory audits are mandatory under law to ensure compliance, while internal audits are voluntary to improve internal processes and controls.",
      },
      {
        question: "Who needs a statutory audit?",
        answer:
          "Companies with turnover above ₹40 crore, paid-up capital above ₹2 crore, or borrowings above ₹1 crore require statutory audits.",
      },
      {
        question: "What are the benefits of internal audits?",
        answer:
          "Internal audits improve operational efficiency, detect fraud, and enhance risk management.",
      },
    ],
    relatedServices: [
      {
        id: "23",
        title: "ROC Filing",
        slug: "roc-filing",
      },
      {
        id: "6",
        title: "Income Tax Return Filing",
        slug: "income-tax-return-filing",
      },
    ],
  },
  {
    title: "Annual Compliance Management",
    slug: "annual-compliance-management",
    shortName: "Compliance Mgmt",
    description: "Manage all annual compliance requirements for your business.",
    content:
      "Our Annual Compliance Management service ensures your business meets all statutory requirements, including ROC filings, tax returns, and labor law compliances, avoiding penalties and ensuring smooth operations.",
    priceAmount: 14999,
    governmentFee: "Varies based on compliance requirements",
    processingTime: "Ongoing (annual cycle)",
    validity: "For the relevant financial year",
    category: "Tax & Compliance",
    imageUrl: "/images/services/annual-compliance.jpg",
    features: [
      "ROC filings (AOC-4, MGT-7)",
      "GST and income tax return filings",
      "Labor law compliance (ESI, PF, PT)",
      "Compliance calendar setup",
      "Penalty avoidance guidance",
      "Dedicated compliance manager",
    ],
    requiredDocuments: [
      "Financial statements",
      "Tax registration certificates",
      "Employee details",
      "Previous compliance records",
      "Board resolutions",
    ],
    processSteps: [
      {
        step: "Compliance Assessment",
        description: "Identify all applicable compliances",
      },
      {
        step: "Document Collection",
        description: "Gather necessary documents",
      },
      {
        step: "Filing Preparation",
        description: "Prepare filings for ROC, tax, and labor laws",
      },
      {
        step: "Submission",
        description: "Submit all required filings",
      },
      {
        step: "Monitoring",
        description: "Monitor compliance deadlines and updates",
      },
    ],
    faqs: [
      {
        question: "What does annual compliance include?",
        answer:
          "It includes ROC filings, tax return filings, labor law compliances, and maintaining statutory records as per applicable laws.",
      },
      {
        question: "Why is annual compliance important?",
        answer:
          "Compliance ensures legal operations, avoids penalties, and maintains your business’s reputation.",
      },
      {
        question: "Can I manage compliance myself?",
        answer:
          "Yes, but professional assistance ensures accuracy and timely filings, reducing the risk of errors.",
      },
    ],
    relatedServices: [
      {
        id: "23",
        title: "ROC Filing",
        slug: "roc-filing",
      },
      {
        id: "10",
        title: "ESI & PF Registration",
        slug: "esi-pf-registration",
      },
    ],
  },
  {
    title: "DIR-3 KYC & DIN Filing",
    slug: "dir3-kyc-din-filing",
    shortName: "DIR-3 KYC",
    description: "Complete DIR-3 KYC and DIN filing for company directors.",
    content:
      "DIR-3 KYC and DIN (Director Identification Number) filing are mandatory for directors of companies to ensure compliance with MCA regulations. Our service ensures accurate and timely filing to avoid deactivation of DIN.",
    priceAmount: 1499,
    governmentFee: "₹500 per DIN (for KYC)",
    processingTime: "3-7 working days",
    validity: "Annual (KYC) / Lifetime (DIN)",
    category: "Tax & Compliance",
    imageUrl: "/images/services/dir3-kyc.jpg",
    features: [
      "DIN application (if required)",
      "DIR-3 KYC filing",
      "Digital signature assistance",
      "MCA portal submission",
      "Compliance monitoring",
    ],
    requiredDocuments: [
      "Aadhaar Card of Director",
      "PAN Card of Director",
      "Passport-sized photograph",
      "Address Proof of Director",
      "Digital Signature Certificate",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather director details and documents",
      },
      {
        step: "DIN Application",
        description: "Apply for DIN if not already issued",
      },
      {
        step: "KYC Preparation",
        description: "Prepare DIR-3 KYC form",
      },
      {
        step: "MCA Submission",
        description: "Submit KYC form on MCA portal",
      },
      {
        step: "Confirmation",
        description: "Receive KYC confirmation",
      },
    ],
    faqs: [
      {
        question: "What is DIR-3 KYC?",
        answer:
          "DIR-3 KYC is an annual filing to update and verify director details with the MCA to keep the DIN active.",
      },
      {
        question: "Who needs to file DIR-3 KYC?",
        answer:
          "All directors with a DIN must file DIR-3 KYC annually, even if they are not associated with any company.",
      },
      {
        question: "What happens if DIR-3 KYC is not filed?",
        answer:
          "Non-filing leads to DIN deactivation, preventing the director from participating in company filings.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "23",
        title: "ROC Filing",
        slug: "roc-filing",
      },
    ],
  },
  {
    title: "CMA Data & DPR Preparation",
    slug: "cma-dpr-preparation",
    shortName: "CMA/DPR",
    description: "Prepare CMA data and DPR for loan applications.",
    content:
      "Our CMA (Credit Monitoring Arrangement) Data and DPR (Detailed Project Report) Preparation service helps businesses secure bank loans by providing detailed financial projections and project plans as per bank requirements.",
    priceAmount: 7999,
    governmentFee: "None",
    processingTime: "7-15 working days",
    validity: "For the loan application process",
    category: "Tax & Compliance",
    imageUrl: "/images/services/cma-dpr-preparation.jpg",
    features: [
      "Financial projections preparation",
      "Detailed project report drafting",
      "Compliance with bank formats",
      "Ratio analysis",
      "Loan application support",
    ],
    requiredDocuments: [
      "Financial statements (last 2-3 years)",
      "Business plan details",
      "Project cost estimates",
      "Market analysis data",
      "Existing loan details (if any)",
    ],
    processSteps: [
      {
        step: "Data Collection",
        description: "Gather financial and project details",
      },
      {
        step: "Financial Projections",
        description: "Prepare CMA data with projections",
      },
      {
        step: "DPR Drafting",
        description: "Draft detailed project report",
      },
      {
        step: "Review and Finalization",
        description: "Review with client and finalize documents",
      },
      {
        step: "Submission Support",
        description: "Assist in submitting to banks",
      },
    ],
    faqs: [
      {
        question: "What is CMA data?",
        answer:
          "CMA data is a financial report with projections, ratios, and creditworthiness details required by banks for loan approvals.",
      },
      {
        question: "What is a DPR?",
        answer:
          "A Detailed Project Report outlines the project’s objectives, costs, timelines, and feasibility for loan or investment purposes.",
      },
      {
        question: "Which banks require CMA/DPR?",
        answer:
          "Most banks in India, including public and private sector banks, require CMA data and DPR for business loans.",
      },
    ],
    relatedServices: [
      {
        id: "34",
        title: "Loan Documentation Support",
        slug: "loan-documentation-support",
      },
      {
        id: "6",
        title: "Income Tax Return Filing",
        slug: "income-tax-return-filing",
      },
    ],
  },
  {
    title: "Compliance Calendar Setup",
    slug: "compliance-calendar-setup",
    shortName: "Compliance Calendar",
    description: "Set up a compliance calendar for timely regulatory filings.",
    content:
      "Our Compliance Calendar Setup service creates a customized calendar to track and manage all statutory filing deadlines, including GST, TDS, ROC, and labor law compliances, ensuring your business stays penalty-free.",
    priceAmount: 2499,
    governmentFee: "None",
    processingTime: "3-5 working days",
    validity: "Annual (requires updates)",
    category: "Tax & Compliance",
    imageUrl: "/images/services/compliance-calendar.jpg",
    features: [
      "Identification of applicable compliances",
      "Customized calendar creation",
      "Deadline reminders",
      "Compliance tracking support",
      "Updates for regulatory changes",
    ],
    requiredDocuments: [
      "Business registration details",
      "List of applicable licenses",
      "Previous compliance records",
      "Tax registration certificates",
    ],
    processSteps: [
      {
        step: "Compliance Assessment",
        description: "Identify all applicable compliance requirements",
      },
      {
        step: "Calendar Creation",
        description: "Create a customized compliance calendar",
      },
      {
        step: "Client Review",
        description: "Share calendar for client approval",
      },
      {
        step: "Implementation",
        description: "Set up reminders and tracking system",
      },
      {
        step: "Ongoing Support",
        description: "Provide updates for regulatory changes",
      },
    ],
    faqs: [
      {
        question: "What is a compliance calendar?",
        answer:
          "A compliance calendar tracks deadlines for statutory filings like GST, TDS, ROC, and labor law returns.",
      },
      {
        question: "Why do I need a compliance calendar?",
        answer:
          "It ensures timely filings, avoids penalties, and keeps your business compliant with all regulations.",
      },
      {
        question: "How often should the calendar be updated?",
        answer:
          "The calendar should be updated annually or whenever new compliances or regulatory changes apply.",
      },
    ],
    relatedServices: [
      {
        id: "25",
        title: "Annual Compliance Management",
        slug: "annual-compliance-management",
      },
      {
        id: "2",
        title: "GST Return Filing",
        slug: "gst-return-filing",
      },
    ],
  },
  {
    title: "Digital Signature Certificate (DSC)",
    slug: "digital-signature-certificate",
    shortName: "DSC",
    description:
      "Obtain a Digital Signature Certificate for secure online transactions.",
    content:
      "A Digital Signature Certificate (DSC) is required for secure e-filing and online transactions under MCA, GST, and other portals. Our service ensures quick issuance of Class 3 DSC for individuals and organizations.",
    priceAmount: 999,
    governmentFee: "₹400-₹1,500 (based on validity and type)",
    processingTime: "1-3 working days",
    validity: "1-2 years",
    category: "Tax & Compliance",
    imageUrl: "/images/services/digital-signature.jpg",
    features: [
      "Class 3 DSC issuance",
      "Application preparation",
      "Verification support",
      "USB token delivery",
      "Post-issuance guidance",
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "PAN Card",
      "Address Proof",
      "Passport-sized photograph",
      "Business registration (if organizational DSC)",
    ],
    processSteps: [
      {
        step: "Document Collection",
        description: "Gather required identity and address proofs",
      },
      {
        step: "Application Preparation",
        description: "Prepare DSC application",
      },
      {
        step: "Verification",
        description: "Complete verification process",
      },
      {
        step: "DSC Issuance",
        description: "Issue DSC with USB token",
      },
      {
        step: "Usage Guidance",
        description: "Guide on using DSC for e-filings",
      },
    ],
    faqs: [
      {
        question: "What is a DSC used for?",
        answer:
          "DSC is used for secure e-filing on MCA, GST, and other government portals, and for signing digital documents.",
      },
      {
        question: "What is the validity of a DSC?",
        answer: "DSC is valid for 1-2 years, after which it needs renewal.",
      },
      {
        question: "Who can apply for a DSC?",
        answer:
          "Individuals, directors, or authorized signatories of organizations can apply for a DSC.",
      },
    ],
    relatedServices: [
      {
        id: "4",
        title: "Company Registration",
        slug: "company-registration",
      },
      {
        id: "26",
        title: "DIR-3 KYC & DIN Filing",
        slug: "dir3-kyc-din-filing",
      },
    ],
  },
  {
    "title": "Professional Tax Registration",
    "slug": "professional-tax-registration",
    "shortName": "Prof Tax",
    "description": "Register for Professional Tax and ensure compliance with state tax regulations.",
    "content": "Professional Tax is a state-specific tax levied on professions, trades, and employments. Our service provides end-to-end assistance for obtaining Professional Tax registration, ensuring compliance with state tax regulations and timely filing of returns.",
    "priceAmount": 999,
    "governmentFee": "₹100-₹2,500 annually (varies by state)",
    "processingTime": "7-15 days",
    "validity": "Lifetime (requires periodic filing)",
    "category": "Tax & Compliance",
    "imageUrl": "/images/services/professional-tax.png",
    "features": [
      "Complete application preparation",
      "Document verification and submission",
      "Portal registration assistance",
      "Application tracking",
      "Registration certificate delivery",
      "Compliance guidance",
      "Initial return filing assistance"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "PAN card of the business",
      "Address proof of business premises",
      "Bank account details",
      "List of employees with salary details",
      "ID proof of business owner/directors"
    ],
    "processSteps": [
      {
        "step": "State-specific Requirements Check",
        "description": "Determine the specific requirements for your state"
      },
      {
        "step": "Document Collection",
        "description": "Gather all required documents for registration"
      },
      {
        "step": "Application Preparation",
        "description": "Prepare the application with accurate information"
      },
      {
        "step": "Portal/Office Submission",
        "description": "Submit the application on the state portal or at the tax office"
      },
      {
        "step": "Registration Issuance",
        "description": "Receive your Professional Tax registration certificate"
      },
      {
        "step": "Compliance Guidance",
        "description": "Get guidance on periodic filing requirements"
      }
    ],
    "faqs": [
      {
        "question": "Which states in India levy Professional Tax?",
        "answer": "Professional Tax is levied in states like Maharashtra, Karnataka, Tamil Nadu, Gujarat, West Bengal, Andhra Pradesh, Telangana, Madhya Pradesh, and a few others. Each state has its own rates and regulations."
      },
      {
        "question": "Who needs to register for Professional Tax?",
        "answer": "All businesses with employees, self-employed professionals, and individuals earning above a certain threshold (varies by state) need to register for Professional Tax in states where it is applicable."
      },
      {
        "question": "What are the filing requirements for Professional Tax?",
        "answer": "Filing requirements vary by state. Generally, businesses need to file monthly or quarterly returns and deposit the tax collected from employees. Self-employed professionals may need to file annual returns."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Penalties for non-compliance include late fees, interest on delayed payments, and in some cases, legal action. The penalties vary by state but can range from 10% to 100% of the tax amount, along with interest."
      }
    ],
    "relatedServices": [
      {
        "id": "1",
        "title": "GST Registration",
        "slug": "gst-registration"
      },
      {
        "id": "6",
        "title": "Income Tax Return Filing",
        "slug": "income-tax-return-filing"
      }
    ]
  },
  {
    "title": "Factory License",
    "slug": "factory-license",
    "shortName": "Factory License",
    "description": "Obtain a Factory License for manufacturing units.",
    "content": "A Factory License is mandatory for manufacturing units under the Factories Act, 1948. Our service ensures compliance with state-specific regulations for obtaining and renewing factory licenses.",
    "priceAmount": 4999,
    "governmentFee": "₹1,000-₹25,000 (based on manpower and horsepower)",
    "processingTime": "15-30 days",
    "validity": "1-3 years (varies by state)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/factory-license.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Submission to Factory Inspectorate",
      "Inspection coordination",
      "License issuance",
      "Renewal reminders"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Layout plan of factory",
      "List of machinery and workers",
      "Power connection details",
      "NOC from local authority",
      "Safety compliance documents"
    ],
    "processSteps": [
      {
        "step": "Document Collection",
        "description": "Gather required documents and factory details"
      },
      {
        "step": "Application Preparation",
        "description": "Prepare factory license application"
      },
      {
        "step": "Submission",
        "description": "Submit to state Factory Inspectorate"
      },
      {
        "step": "Inspection",
        "description": "Coordinate factory inspection"
      },
      {
        "step": "License Issuance",
        "description": "Receive factory license"
      }
    ],
    "faqs": [
      {
        "question": "Who needs a Factory License?",
        "answer": "Any manufacturing unit with 10 or more workers (with power) or 20 or more workers (without power) requires a Factory License."
      },
      {
        "question": "What is the validity of a Factory License?",
        "answer": "Validity varies by state, typically 1-3 years, with renewal required thereafter."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Non-compliance can lead to fines up to ₹1 lakh, imprisonment, or factory closure."
      }
    ],
    "relatedServices": [
      {
        "id": "13",
        "title": "Environmental Compliance",
        "slug": "environmental-compliance"
      },
      {
        "id": "10",
        "title": "ESI & PF Registration",
        "slug": "esi-pf-registration"
      }
    ]
  },
  {
    "title": "Pollution Control NOC (CTE/CTO)",
    "slug": "pollution-control-noc",
    "shortName": "Pollution NOC",
    "description": "Obtain Pollution Control NOC for environmental compliance.",
    "content": "Pollution Control NOC (Consent to Establish and Consent to Operate) is mandatory for industries impacting the environment. Our service ensures compliance with Pollution Control Board regulations for CTE and CTO.",
    "priceAmount": 2999,
    "governmentFee": "₹1,000-₹50,000 (based on pollution category: Green, Orange, Red)",
    "processingTime": "1-6 months",
    "validity": "1-5 years (based on category)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/pollution-control-noc.jpg",
    "features": [
      "Pollution category assessment",
      "CTE/CTO application preparation",
      "Environmental impact assessment",
      "Compliance system setup",
      "Inspection coordination",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Land documents and layout plan",
      "Project report",
      "Effluent treatment plans",
      'Air emission control measures',
      "Solid waste management plans"
    ],
    "processSteps": [
      {
        "step": "Category Assessment",
        "description": "Determine pollution category (Green, Orange, Red)"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare technical reports and documents"
      },
      {
        "step": "CTE Application",
        "description": "Apply for Consent to Establish"
      },
      {
        "step": "Implementation",
        "description": "Implement pollution control measures"
      },
      {
        "step": "CTO Application",
        "description": "Apply for Consent to Operate"
      }
    ],
    "faqs": [
      {
        "question": "What is the difference between CTE and CTO?",
        "answer": "CTE is required before setting up a unit, approving pollution control plans. CTO is needed before operations, confirming compliance with standards."
      },
      {
        "question": "Which industries need Pollution Control NOC?",
        "answer": "Industries in manufacturing, mining, or processing with environmental impact need CTE/CTO, categorized as Green, Orange, or Red."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Penalties include fines up to ₹1 crore, imprisonment up to 7 years, and closure orders."
      }
    ],
    "relatedServices": [
      {
        "id": "12",
        "title": "ISO Certification",
        "slug": "iso-certification"
      },
      {
        "id": "30",
        "title": "Factory License",
        "slug": "factory-license"
      }
    ]
  },
  {
    "title": "Fire Safety NOC",
    "slug": "fire-safety-noc",
    "shortName": "Fire NOC",
    "description": "Obtain Fire Safety NOC for your business premises.",
    "content": "A Fire Safety NOC is mandatory for certain businesses, including factories, warehouses, and commercial establishments, to ensure compliance with fire safety regulations. Our service assists in obtaining the NOC from the state fire department.",
    "priceAmount": 3999,
    "governmentFee": "₹500-₹10,000 (varies by state and premises)",
    "processingTime": "15-30 days",
    "validity": "1-3 years (varies by state)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/fire-safety-noc.jpg",
    "features": [
      "Fire safety compliance assessment",
      "Application preparation",
      "Coordination with fire department",
      "Inspection support",
      "NOC issuance",
      "Renewal reminders"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Building layout plan",
      "Fire safety equipment details",
      "NOC from landlord (if rented)",
      "Address proof of premises"
    ],
    "processSteps": [
      {
        "step": "Compliance Assessment",
        "description": "Assess fire safety requirements for your premises"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and supporting documents"
      },
      {
        "step": "Submission",
        "description": "Submit application to fire department"
      },
      {
        "step": "Inspection",
        "description": "Coordinate fire safety inspection"
      },
      {
        "step": "NOC Issuance",
        "description": "Receive Fire Safety NOC"
      }
    ],
    "faqs": [
      {
        "question": "Which businesses need a Fire Safety NOC?",
        "answer": "Factories, warehouses, high-rise buildings, and commercial establishments with specific risks require a Fire Safety NOC."
      },
      {
        "question": "What is the validity of a Fire Safety NOC?",
        "answer": "Validity varies by state, typically 1-3 years, with renewal required thereafter."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Non-compliance can lead to fines, closure orders, or legal action by the fire department."
      }
    ],
    "relatedServices": [
      {
        "id": "30",
        "title": "Factory License",
        "slug": "factory-license"
      },
      {
        "id": "31",
        "title": "Pollution Control NOC",
        "slug": "pollution-control-noc"
      }
    ]
  },
  {
    "title": "Drug License (Wholesale / Retail)",
    "slug": "drug-license",
    "shortName": "Drug License",
    "description": "Obtain a Drug License for pharmaceutical wholesale or retail.",
    "content": "A Drug License is mandatory for businesses involved in the sale, distribution, or storage of drugs and pharmaceuticals. Our service ensures compliance with the Drugs and Cosmetics Act, 1940, for wholesale or retail licenses.",
    "priceAmount": 4999,
    "governmentFee": "₹3,000-₹10,000 (varies by license type)",
    "processingTime": "15-45 days",
    "validity": "5 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/drug-license.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Coordination with drug control authority",
      "Inspection support",
      "License issuance",
      "Renewal guidance"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Pharmacist qualification certificate",
      "Premises layout plan",
      "Refrigeration/storage details",
      "NOC from landlord (if rented)",
      "Address proof of premises"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Verify eligibility for wholesale/retail license"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and documents"
      },
      {
        "step": "Submission",
        "description": "Submit to state drug control authority"
      },
      {
        "step": "Inspection",
        "description": "Coordinate premises inspection"
      },
      {
        "step": "License Issuance",
        "description": "Receive Drug License"
      }
    ],
    "faqs": [
      {
        "question": "Who needs a Drug License?",
        "answer": "Businesses involved in selling, distributing, or storing drugs, including pharmacies and wholesalers, need a Drug License."
      },
      {
        "question": "What are the requirements for a Drug License?",
        "answer": "Requirements include a qualified pharmacist, adequate storage facilities, and compliance with drug control regulations."
      },
      {
        "question": "What is the validity of a Drug License?",
        "answer": "The license is valid for 5 years and requires renewal thereafter."
      }
    ],
    "relatedServices": [
      {
        "id": "1",
        "title": "GST Registration",
        "slug": "gst-registration"
      },
      {
        "id": "8",
        "title": "Shop & Establishment License",
        "slug": "shop-establishment-license"
      }
    ]
  },
  {
    "title": "Trade License",
    "slug": "trade-license",
    "shortName": "Trade License",
    "description": "Obtain a Trade License for operating your business legally.",
    "content": "A Trade License is required for businesses operating within municipal limits to ensure compliance with local regulations. Our service assists in obtaining the license from municipal authorities.",
    "priceAmount": 1999,
    "governmentFee": "₹500-₹10,000 (varies by municipality and business type)",
    "processingTime": "7-15 days",
    "validity": "1 year (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/trade-license.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Municipal authority submission",
      "Inspection coordination",
      "License issuance",
      "Renewal reminders"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Address proof of premises",
      "NOC from landlord (if rented)",
      "Identity proof of owner",
      "Business activity details"
    ],
    "processSteps": [
      {
        "step": "Document Collection",
        "description": "Gather required documents"
      },
      {
        "step": "Application Preparation",
        "description": "Prepare trade license application"
      },
      {
        "step": "Submission",
        "description": "Submit to municipal authority"
      },
      {
        "step": "Inspection",
        "description": "Coordinate inspection if required"
      },
      {
        "step": "License Issuance",
        "description": "Receive Trade License"
      }
    ],
    "faqs": [
      {
        "question": "Who needs a Trade License?",
        "answer": "Businesses operating within municipal limits, such as shops, factories, or service providers, need a Trade License."
      },
      {
        "question": "What is the validity of a Trade License?",
        "answer": "Trade Licenses are typically valid for 1 year and require annual renewal."
      },
      {
        "question": "What are the penalties for not having a Trade License?",
        "answer": "Penalties include fines up to ₹50,000 and potential business closure by municipal authorities."
      }
    ],
    "relatedServices": [
      {
        "id": "8",
        "title": "Shop & Establishment License",
        "slug": "shop-establishment-license"
      },
      {
        "id": "1",
        "title": "GST Registration",
        "slug": "gst-registration"
      }
    ]
  },
  {
    "title": "Labour License (CLRA, Shops, etc.)",
    "slug": "labour-license",
    "shortName": "Labour License",
    "description": "Obtain Labour License for compliance with labor regulations.",
    "content": "A Labour License under the Contract Labour (Regulation and Abolition) Act, 1970, or other labor laws is required for businesses employing contract workers or operating commercial establishments. Our service ensures compliance with state-specific labor regulations.",
    "priceAmount": 3999,
    "governmentFee": "₹1,000-₹15,000 (based on number of workers)",
    "processingTime": "15-30 days",
    "validity": "1 year (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/labour-license.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Submission to labor department",
      "Compliance advisory",
      "License issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "List of contract workers",
      "Agreement with contractors",
      "Address proof of premises",
      "Identity proof of employer"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Determine applicability of CLRA or other labor laws"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and supporting documents"
      },
      {
        "step": "Submission",
        "description": "Submit to state labor department"
      },
      {
        "step": "Verification",
        "description": "Coordinate with authorities for verification"
      },
      {
        "step": "License Issuance",
        "description": "Receive Labour License"
      }
    ],
    "faqs": [
      {
        "question": "Who needs a Labour License?",
        "answer": "Businesses employing 20 or more contract workers (under CLRA) or operating commercial establishments require a Labour License."
      },
      {
        "question": "What is the validity of a Labour License?",
        "answer": "The license is typically valid for 1 year and requires annual renewal."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Penalties include fines up to ₹50,000 and imprisonment for non-compliance with labor laws."
      }
    ],
    "relatedServices": [
      {
        "id": "10",
        "title": "ESI & PF Registration",
        "slug": "esi-pf-registration"
      },
      {
        "id": "11",
        "title": "Labor Law Compliance",
        "slug": "labor-law-compliance"
      }
    ]
  },
  {
    "title": "BIS Certification",
    "slug": "bis-certification",
    "shortName": "BIS Cert",
    "description": "Obtain BIS Certification for product quality compliance.",
    "content": "Bureau of Indian Standards (BIS) Certification is mandatory for certain products to ensure quality and safety. Our service assists in obtaining BIS certification, including product testing and compliance with ISI standards.",
    "priceAmount": 9999,
    "governmentFee": "₹1,000-₹50,000 (based on product and testing)",
    "processingTime": "2-6 months",
    "validity": "1-2 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/bis-certification.jpg",
    "features": [
      "Product eligibility assessment",
      "Application preparation",
      "Product testing coordination",
      "Compliance with BIS standards",
      "Certification issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Product specifications",
      "Test reports (if available)",
      "Manufacturing process details",
      "Address proof of factory"
    ],
    "processSteps": [
      {
        "step": "Product Assessment",
        "description": "Assess product eligibility for BIS certification"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and technical documents"
      },
      {
        "step": "Testing Coordination",
        "description": "Coordinate product testing with BIS labs"
      },
      {
        "step": "Application Submission",
        "description": "Submit to BIS authorities"
      },
      {
        "step": "Certification Issuance",
        "description": "Receive BIS certification"
      }
    ],
    "faqs": [
      {
        "question": "Which products require BIS Certification?",
        "answer": "Products like electronics, cement, steel, and certain consumer goods listed under BIS mandatory schemes require certification."
      },
      {
        "question": "What is the validity of BIS Certification?",
        "answer": "BIS Certification is valid for 1-2 years, with renewal required thereafter."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Non-compliance can lead to fines, product recalls, or legal action by BIS authorities."
      }
    ],
    "relatedServices": [
      {
        "id": "12",
        "title": "ISO Certification",
        "slug": "iso-certification"
      },
      {
        "id": "9",
        "title": "FSSAI Registration",
        "slug": "fssai-registration"
      }
    ]
  },
  {
    "title": "ISO Certification",
    "slug": "iso-certification",
    "shortName": "ISO Cert",
    "description": "Obtain ISO certification for your business to enhance credibility and processes.",
    "content": "ISO (International Organization for Standardization) certification demonstrates your business's commitment to quality, efficiency, and customer satisfaction. Our service provides end-to-end assistance for obtaining various ISO certifications including ISO 9001, ISO 14001, ISO 45001, and more, enhancing your business's credibility and operational excellence.",
    "priceAmount": 4999,
    "governmentFee": "None (certification is through private accredited bodies)",
    "processingTime": "2-6 months (depends on organization size and readiness)",
    "validity": "3 years (requires annual surveillance audits)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/iso-certification.jpg",
    "features": [
      "Gap analysis and readiness assessment",
      "Documentation preparation",
      "Implementation assistance",
      "Internal audit training",
      "Pre-certification audit",
      "Certification audit coordination",
      "Post-certification support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Organization chart",
      "Process maps and workflows",
      "Existing policies and procedures",
      "Product/service specifications",
      "Customer feedback records"
    ],
    "processSteps": [
      {
        "step": "Initial Assessment",
        "description": "Assess your organization's current processes and readiness"
      },
      {
        "step": "Standard Selection",
        "description": "Select the appropriate ISO standard(s) for your business"
      },
      {
        "step": "Documentation Development",
        "description": "Develop required documentation including quality manual and procedures"
      },
      {
        "step": "Implementation",
        "description": "Implement the management system as per ISO requirements"
      },
      {
        "step": "Internal Audit",
        "description": "Conduct internal audit to verify implementation"
      },
      {
        "step": "Certification Audit",
        "description": "Coordinate with certification body for final audit and certification"
      }
    ],
    "faqs": [
      {
        "question": "Which ISO certification is right for my business?",
        "answer": "The most common is ISO 9001 (Quality Management System) suitable for all businesses. Other standards include ISO 14001 (Environmental Management), ISO 45001 (Occupational Health and Safety), ISO 27001 (Information Security), and industry-specific standards like ISO 22000 (Food Safety) or ISO 13485 (Medical Devices)."
      },
      {
        "question": "What are the benefits of ISO certification?",
        "answer": "Benefits include improved processes and efficiency, enhanced customer satisfaction, access to new markets and customers, competitive advantage, reduced waste and costs, better risk management, and compliance with regulatory requirements."
      },
      {
        "question": "How long does ISO certification take?",
        "answer": "The timeline varies based on organization size, complexity, and readiness. Typically, it takes 2-6 months from initiation to certification. Larger organizations or those starting from scratch may take longer."
      },
      {
        "question": "Are there any subsidies available for ISO certification?",
        "answer": "Yes, MSMEs can avail subsidies for ISO certification under various government schemes. The subsidy amount varies but can cover up to 75% of the certification cost. We assist in applying for these subsidies."
      }
    ],
    "relatedServices": [
      {
        "id": "3",
        "title": "MSME Registration",
        "slug": "msme-registration"
      },
      {
        "id": "13",
        "title": "Environmental Compliance",
        "slug": "environmental-compliance"
      }
    ]
  },
  {
    "title": "AGMARK / FPO Certification",
    "slug": "agmark-fpo-certification",
    "shortName": "AGMARK/FPO",
    "description": "Obtain AGMARK or FPO certification for agricultural and food products.",
    "content": "AGMARK and FPO (Fruit Products Order) certifications ensure quality standards for agricultural and processed food products. Our service assists in obtaining these certifications for market credibility and compliance.",
    "priceAmount": 5999,
    "governmentFee": "₹2,000-₹20,000 (based on product and testing)",
    "processingTime": "1-3 months",
    "validity": "1-5 years (based on product)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/agmark-fpo-certification.jpg",
    "features": [
      "Product eligibility assessment",
      "Application preparation",
      "Testing coordination",
      "Compliance with standards",
      "Certification issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Product specifications",
      "Test reports (if available)",
      "Packaging details",
      "Address proof of premises"
    ],
    "processSteps": [
      {
        "step": "Product Assessment",
        "description": "Assess eligibility for AGMARK/FPO"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and technical documents"
      },
      {
        "step": "Testing Coordination",
        "description": "Coordinate product testing"
      },
      {
        "step": "Submission",
        "description": "Submit to relevant authority"
      },
      {
        "step": "Certification Issuance",
        "description": "Receive AGMARK/FPO certification"
      }
    ],
    "faqs": [
      {
        "question": "What is AGMARK/FPO certification?",
        "answer": "AGMARK certifies agricultural products for quality, while FPO certifies processed fruit and vegetable products under the FPO Act, 1955."
      },
      {
        "question": "Who needs AGMARK/FPO certification?",
        "answer": "Producers, processors, and traders of agricultural or fruit-based products need these certifications for market compliance."
      },
      {
        "question": "What is the validity of AGMARK/FPO certification?",
        "answer": "Validity ranges from 1-5 years, depending on the product and certification type."
      }
    ],
    "relatedServices": [
      {
        "id": "9",
        "title": "FSSAI Registration",
        "slug": "fssai-registration"
      },
      {
        "id": "11",
        "title": "APEDA Registration",
        "slug": "apeda-registration"
      }
    ]
  },
  {
    "title": "BEE Certification",
    "slug": "bee-certification",
    "shortName": "BEE Cert",
    "description": "Obtain BEE Certification for energy-efficient products.",
    "content": "Bureau of Energy Efficiency (BEE) Certification is required for energy-efficient appliances like ACs, refrigerators, and fans. Our service ensures compliance with BEE standards for star ratings and labeling.",
    "priceAmount": 7999,
    "governmentFee": "₹2,000-₹25,000 (based on product and testing)",
    "processingTime": "2-4 months",
    "validity": "Varies by product (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/bee-certification.jpg",
    "features": [
      "Product eligibility assessment",
      "Application preparation",
      "Testing coordination with BEE labs",
      "Star rating compliance",
      "Certification issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Product specifications",
      "Test reports (if available)",
      "Manufacturing process details",
      "Address proof of factory"
    ],
    "processSteps": [
      {
        "step": "Product Assessment",
        "description": "Assess eligibility for BEE certification"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and technical documents"
      },
      {
        "step": "Testing Coordination",
        "description": "Coordinate testing with BEE-approved labs"
      },
      {
        "step": "Submission",
        "description": "Submit to BEE authorities"
      },
      {
        "step": "Certification Issuance",
        "description": "Receive BEE star rating certification"
      }
    ],
    "faqs": [
      {
        "question": "Which products require BEE Certification?",
        "answer": "Appliances like ACs, refrigerators, ceiling fans, and water heaters listed under BEE’s mandatory labeling scheme require certification."
      },
      {
        "question": "What is the benefit of BEE Certification?",
        "answer": "BEE Certification ensures energy efficiency, enhances market credibility, and meets regulatory requirements."
      },
      {
        "question": "What is the validity of BEE Certification?",
        "answer": "Validity varies by product, typically requiring renewal every 2-3 years."
      }
    ],
    "relatedServices": [
      {
        "id": "35",
        "title": "BIS Certification",
        "slug": "bis-certification"
      },
      {
        "id": "12",
        "title": "ISO Certification",
        "slug": "iso-certification"
      }
    ]
  },
  {
    "title": "Food Fortification Certification",
    "slug": "food-fortification-certification",
    "shortName": "Food Fort Cert",
    "description": "Obtain Food Fortification Certification for fortified food products.",
    "content": "Food Fortification Certification ensures compliance with FSSAI standards for fortified foods like milk, oil, and staples. Our service assists in obtaining certification to meet regulatory and market requirements.",
    "priceAmount": 5999,
    "governmentFee": "₹2,000-₹15,000 (based on product and testing)",
    "processingTime": "1-3 months",
    "validity": "1-5 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/food-fortification.jpg",
    "features": [
      "Product eligibility assessment",
      "Application preparation",
      "Testing coordination",
      "FSSAI compliance",
      "Certification issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "FSSAI registration/license",
      "Product specifications",
      "Fortification process details",
      "Test reports",
      "Packaging details"
    ],
    "processSteps": [
      {
        "step": "Eligibility Assessment",
        "description": "Assess product eligibility for fortification"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and technical documents"
      },
      {
        "step": "Testing Coordination",
        "description": "Coordinate testing with FSSAI-approved labs"
      },
      {
        "step": "Submission",
        "description": "Submit to FSSAI authorities"
      },
      {
        "step": "Certification Issuance",
        "description": "Receive Food Fortification Certification"
      }
    ],
    "faqs": [
      {
        "question": "What is Food Fortification Certification?",
        "answer": "It certifies that food products like milk, oil, or staples meet FSSAI standards for added nutrients like vitamins or minerals."
      },
      {
        "question": "Is Food Fortification Certification mandatory?",
        "answer": "It is mandatory for fortified food products as per FSSAI regulations."
      },
      {
        "question": "What is the validity of the certification?",
        "answer": "Validity ranges from 1-5 years, depending on the product and FSSAI guidelines."
      }
    ],
    "relatedServices": [
      {
        "id": "9",
        "title": "FSSAI Registration",
        "slug": "fssai-registration"
      },
      {
        "id": "36",
        "title": "AGMARK / FPO Certification",
        "slug": "agmark-fpo-certification"
      }
    ]
  },
  {
    "title": "PSARA License",
    "slug": "psara-license",
    "shortName": "PSARA License",
    "description": "Obtain PSARA License for private security agencies.",
    "content": "The Private Security Agencies Regulation Act (PSARA) License is mandatory for operating a private security agency in India. Our service ensures compliance with state-specific PSARA regulations for license issuance.",
    "priceAmount": 7999,
    "governmentFee": "₹5,000-₹25,000 (based on operational scope)",
    "processingTime": "30-60 days",
    "validity": "5 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/psara-license.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Compliance with PSARA requirements",
      "Coordination with authorities",
      "License issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "MoU with training institute",
      "Details of security guards",
      "Address proof of agency",
      "Identity proof of owner",
      "Police verification certificates"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Verify eligibility under PSARA"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and documents"
      },
      {
        "step": "Submission",
        "description": "Submit to state controlling authority"
      },
      {
        "step": "Verification",
        "description": "Coordinate police and document verification"
      },
      {
        "step": "License Issuance",
        "description": "Receive PSARA License"
      }
    ],
    "faqs": [
      {
        "question": "Who needs a PSARA License?",
        "answer": "Any agency providing private security services, including guards or personnel, needs a PSARA License."
      },
      {
        "question": "What is the validity of a PSARA License?",
        "answer": "The license is valid for 5 years and requires renewal thereafter."
      },
      {
        "question": "Is training mandatory for PSARA License?",
        "answer": "Yes, agencies must tie up with a recognized training institute to train security personnel."
      }
    ],
    "relatedServices": [
      {
        "id": "8",
        "title": "Shop & Establishment License",
        "slug": "shop-establishment-license"
      },
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      }
    ]
  },
  {
    "title": "Spice Board Registration",
    "slug": "spice-board-registration",
    "shortName": "Spice Board Reg",
    "description": "Register with the Spice Board for spice exports.",
    "content": "Spice Board Registration is mandatory for exporters of spices and spice products. Our service ensures compliance with Spice Board regulations for obtaining the Registration-cum-Membership Certificate (RCMC).",
    "priceAmount": 2999,
    "governmentFee": "₹5,000-₹15,000 (based on export volume)",
    "processingTime": "10-20 days",
    "validity": "5 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/spice-board-registration.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Spice Board portal submission",
      "RCMC issuance",
      "Export benefits guidance"
    ],
    "requiredDocuments": [
      "IEC Certificate",
      "Business registration documents",
      "PAN Card",
      "Export contract (if available)",
      "List of spices for export"
    ],
    "processSteps": [
      {
        "step": "Document Collection",
        "description": "Gather required documents"
      },
      {
        "step": "Application Preparation",
        "description": "Prepare RCMC application"
      },
      {
        "step": "Submission",
        "description": "Submit to Spice Board"
      },
      {
        "step": "Verification",
        "description": "Track application status"
      },
      {
        "step": "RCMC Issuance",
        "description": "Receive Spice Board RCMC"
      }
    ],
    "faqs": [
      {
        "question": "Who needs Spice Board Registration?",
        "answer": "Exporters of spices and spice products listed under the Spice Board require registration."
      },
      {
        "question": "Is IEC mandatory for Spice Board Registration?",
        "answer": "Yes, an Import-Export Code (IEC) is mandatory."
      },
      {
        "question": "What is the validity of Spice Board RCMC?",
        "answer": "The RCMC is valid for 5 years and requires renewal thereafter."
      }
    ],
    "relatedServices": [
      {
        "id": "7",
        "title": "Import Export Code",
        "slug": "import-export-code"
      },
      {
        "id": "11",
        "title": "APEDA Registration",
        "slug": "apeda-registration"
      }
    ]
  },
  {
    "title": "RCMC (Export Council Membership)",
    "slug": "rcmc-export-council",
    "shortName": "RCMC",
    "description": "Obtain RCMC for export promotion council membership.",
    "content": "Registration-cum-Membership Certificate (RCMC) is required for exporters to avail benefits from export promotion councils like FIEO, APEDA, or Spice Board. Our service ensures compliance with council requirements.",
    "priceAmount": 2999,
    "governmentFee": "₹2,000-₹15,000 (varies by council)",
    "processingTime": "10-20 days",
    "validity": "5 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/rcmc-export-council.jpg",
    "features": [
      "Council selection guidance",
      "Application preparation",
      "Document verification",
      "RCMC issuance",
      "Export benefits advisory"
    ],
    "requiredDocuments": [
      "IEC Certificate",
      "Business registration documents",
      "PAN Card",
      "Export performance details",
      "Bank certificate"
    ],
    "processSteps": [
      {
        "step": "Council Selection",
        "description": "Identify relevant export promotion council"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare RCMC application"
      },
      {
        "step": "Submission",
        "description": "Submit to export council"
      },
      {
        "step": "Verification",
        "description": "Track application status"
      },
      {
        "step": "RCMC Issuance",
        "description": "Receive RCMC certificate"
      }
    ],
    "faqs": [
      {
        "question": "What is an RCMC?",
        "answer": "RCMC is a membership certificate issued by export promotion councils to avail export benefits and schemes."
      },
      {
        "question": "Which councils issue RCMC?",
        "answer": "Councils like FIEO, APEDA, Spice Board, and others issue RCMC based on product categories."
      },
      {
        "question": "What is the validity of RCMC?",
        "answer": "RCMC is valid for 5 years and requires renewal thereafter."
      }
    ],
    "relatedServices": [
      {
        "id": "7",
        "title": "Import Export Code",
        "slug": "import-export-code"
      },
      {
        "id": "39",
        "title": "Spice Board Registration",
        "slug": "spice-board-registration"
      }
    ]
  },
  {
    "title": "Organic Certification (NPOP / NOP)",
    "slug": "organic-certification",
    "shortName": "Organic Cert",
    "description": "Obtain Organic Certification for organic products.",
    "content": "Organic Certification under NPOP (India) or NOP (USA) ensures compliance with organic standards for agricultural and food products. Our service assists in obtaining certification for domestic and export markets.",
    "priceAmount": 9999,
    "governmentFee": "₹5,000-₹50,000 (based on scope and certification body)",
    "processingTime": "3-6 months",
    "validity": "1-3 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/organic-certification.jpg",
    "features": [
      "Organic standards assessment",
      "Application preparation",
      "Inspection coordination",
      "Certification issuance",
      "Compliance monitoring",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Organic farming/process details",
      "Soil and water test reports",
      "Production records",
      "Address proof of farm/factory"
    ],
    "processSteps": [
      {
        "step": "Standards Assessment",
        "description": "Assess compliance with NPOP/NOP standards"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and organic records"
      },
      {
        "step": "Inspection",
        "description": "Coordinate organic certification inspection"
      },
      {
        "step": "Submission",
        "description": "Submit to certification body"
      },
      {
        "step": "Certification Issuance",
        "description": "Receive Organic Certification"
      }
    ],
    "faqs": [
      {
        "question": "What is NPOP/NOP certification?",
        "answer": "NPOP (National Programme for Organic Production) is for India, and NOP (National Organic Program) is for the USA, certifying organic products."
      },
      {
        "question": "Who needs Organic Certification?",
        "answer": "Producers, processors, or exporters of organic agricultural or food products need certification."
      },
      {
        "question": "What is the validity of Organic Certification?",
        "answer": "Validity ranges from 1-3 years, with annual inspections for renewal."
      }
    ],
    "relatedServices": [
      {
        "id": "11",
        "title": "APEDA Registration",
        "slug": "apeda-registration"
      },
      {
        "id": "9",
        "title": "FSSAI Registration",
        "slug": "fssai-registration"
      }
    ]
  },
  {
    "title": "Cold Storage / Warehousing License",
    "slug": "cold-storage-warehousing-license",
    "shortName": "Cold Storage License",
    "description": "Obtain a license for operating cold storage or warehousing facilities.",
    "content": "A Cold Storage/Warehousing License is required for businesses operating storage facilities for perishable goods. Our service ensures compliance with state regulations and WDRA (Warehousing Development and Regulatory Authority) requirements.",
    "priceAmount": 5999,
    "governmentFee": "₹5,000-₹25,000 (based on capacity and state)",
    "processingTime": "15-45 days",
    "validity": "1-5 years (renewable)",
    "category": "Licensing & Certification",
    "imageUrl": "/images/services/cold-storage-license.jpg",
    "features": [
      "Application preparation",
      "Document verification",
      "Compliance with WDRA/state regulations",
      "Inspection coordination",
      "License issuance",
      "Renewal support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Layout plan of facility",
      "Storage capacity details",
      "NOC from local authority",
      "Fire safety compliance",
      "Address proof of premises"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Verify eligibility for cold storage/warehousing license"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and documents"
      },
      {
        "step": "Submission",
        "description": "Submit to WDRA or state authority"
      },
      {
        "step": "Inspection",
        "description": "Coordinate facility inspection"
      },
      {
        "step": "License Issuance",
        "description": "Receive Cold Storage/Warehousing License"
      }
    ],
    "faqs": [
      {
        "question": "Who needs a Cold Storage/Warehousing License?",
        "answer": "Businesses operating facilities for storing perishable goods like food, pharmaceuticals, or agricultural products need this license."
      },
      {
        "question": "What is the validity of the license?",
        "answer": "Validity ranges from 1-5 years, depending on state or WDRA regulations."
      },
      {
        "question": "Is WDRA registration mandatory?",
        "answer": "WDRA registration is mandatory for warehouses issuing negotiable warehouse receipts, but state licenses may also apply."
      }
    ],
    "relatedServices": [
      {
        "id": "9",
        "title": "FSSAI Registration",
        "slug": "fssai-registration"
      },
      {
        "id": "31",
        "title": "Pollution Control NOC",
        "slug": "pollution-control-noc"
      }
    ]
  },
  {
    "title": "Bookkeeping & Accounting",
    "slug": "bookkeeping-accounting",
    "shortName": "Bookkeeping",
    "description": "Manage your business’s financial records with professional bookkeeping.",
    "content": "Our Bookkeeping & Accounting service ensures accurate recording of financial transactions, compliance with accounting standards, and preparation of financial reports for businesses of all sizes.",
    "priceAmount": 4999,
    "governmentFee": "None",
    "processingTime": "Ongoing (monthly/quarterly)",
    "validity": "Ongoing",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/bookkeeping-accounting.jpg",
    "features": [
      "Daily transaction recording",
      "Ledger maintenance",
      "Bank reconciliation",
      "Financial report preparation",
      "GST and tax compliance support",
      "Cloud-based accounting software"
    ],
    "requiredDocuments": [
      "Bank statements",
      "Sales and purchase invoices",
      "Expense receipts",
      "Previous accounting records (if any)",
      "GST registration details"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Collect financial transaction data"
      },
      {
        "step": "Transaction Recording",
        "description": "Record transactions in accounting software"
      },
      {
        "step": "Reconciliation",
        "description": "Reconcile bank and financial records"
      },
      {
        "step": "Report Preparation",
        "description": "Prepare financial statements"
      },
      {
        "step": "Client Review",
        "description": "Share reports for client review"
      }
    ],
    "faqs": [
      {
        "question": "Why is bookkeeping important?",
        "answer": "Bookkeeping ensures accurate financial records, aids in tax compliance, and supports business decision-making."
      },
      {
        "question": "Can I use accounting software with your service?",
        "answer": "Yes, we use cloud-based software like Tally or QuickBooks, customizable to your needs."
      },
      {
        "question": "What reports are included in bookkeeping?",
        "answer": "Reports include balance sheets, profit & loss statements, cash flow statements, and trial balances."
      }
    ],
    "relatedServices": [
      {
        "id": "6",
        "title": "Income Tax Return Filing",
        "slug": "income-tax-return-filing"
      },
      {
        "id": "2",
        "title": "GST Return Filing",
        "slug": "gst-return-filing"
      }
    ]
  },
  {
    "title": "Financial Statement Preparation (Balance Sheet, P&L)",
    "slug": "financial-statement-preparation",
    "shortName": "Financial Statements",
    "description": "Prepare accurate balance sheets and P&L statements for your business.",
    "content": "Our Financial Statement Preparation service ensures accurate balance sheets and profit & loss statements compliant with Indian Accounting Standards, supporting tax filings, audits, and business decisions.",
    "priceAmount": 3999,
    "governmentFee": "None",
    "processingTime": "7-15 days",
    "validity": "For the relevant financial year",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/financial-statements.jpg",
    "features": [
      "Balance sheet preparation",
      "Profit & loss statement preparation",
      "Compliance with accounting standards",
      "Audit-ready financials",
      "Client review and revisions"
    ],
    "requiredDocuments": [
      "Accounting records",
      "Bank statements",
      "Sales and purchase ledgers",
      "Expense details",
      "Previous financial statements (if any)"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Gather accounting and financial data"
      },
      {
        "step": "Data Analysis",
        "description": "Analyze transactions and ledgers"
      },
      {
        "step": "Statement Preparation",
        "description": "Prepare balance sheet and P&L"
      },
      {
        "step": "Review",
        "description": "Share statements for client review"
      },
      {
        "step": "Finalization",
        "description": "Finalize audit-ready statements"
      }
    ],
    "faqs": [
      {
        "question": "Why are financial statements important?",
        "answer": "They provide insights into financial health, support tax filings, audits, and loan applications."
      },
      {
        "question": "What standards do you follow?",
        "answer": "We follow Indian Accounting Standards (Ind AS) or GAAP as applicable."
      },
      {
        "question": "Can financial statements be revised?",
        "answer": "Yes, revisions can be made based on client feedback or new data before finalization."
      }
    ],
    "relatedServices": [
      {
        "id": "6",
        "title": "Income Tax Return Filing",
        "slug": "income-tax-return-filing"
      },
      {
        "id": "24",
        "title": "Audit Services",
        "slug": "audit-services"
      }
    ]
  },
  {
    "title": "Project Report & Business Plan",
    "slug": "project-report-business-plan",
    "shortName": "Project Report",
    "description": "Develop detailed project reports and business plans for funding and growth.",
    "content": "Our Project Report & Business Plan service creates comprehensive reports for loan applications, investor pitches, or business expansion, tailored to bank and investor requirements.",
    "priceAmount": 7999,
    "governmentFee": "None",
    "processingTime": "7-15 days",
    "validity": "For the relevant project/funding cycle",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/project-report-business-plan.jpg",
    "features": [
      "Market analysis",
      "Financial projections",
      "Operational strategy",
      "Risk assessment",
      "Funding requirement analysis",
      "Customized report formatting"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Financial statements",
      "Market data (if available)",
      "Project details",
      "Funding requirements"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Gather business and project details"
      },
      {
        "step": "Market Research",
        "description": "Conduct market and industry analysis"
      },
      {
        "step": "Financial Projections",
        "description": "Prepare financial forecasts"
      },
      {
        "step": "Report Drafting",
        "description": "Draft project report and business plan"
      },
      {
        "step": "Review and Finalization",
        "description": "Review with client and finalize"
      }
    ],
    "faqs": [
      {
        "question": "What is a project report/business plan?",
        "answer": "A project report or business plan outlines the business model, market analysis, financial projections, and strategies for funding or growth."
      },
      {
        "question": "Who needs a project report?",
        "answer": "Businesses seeking loans, investments, or planning expansion require project reports."
      },
      {
        "question": "Can the report be customized for specific banks?",
        "answer": "Yes, we tailor reports to meet specific bank or investor requirements."
      }
    ],
    "relatedServices": [
      {
        "id": "27",
        "title": "CMA Data & DPR Preparation",
        "slug": "cma-dpr-preparation"
      },
      {
        "id": "34",
        "title": "Loan Documentation Support",
        "slug": "loan-documentation-support"
      }
    ]
  },
  {
    "title": "Virtual CFO Services",
    "slug": "virtual-cfo-services",
    "shortName": "Virtual CFO",
    "description": "Access expert financial guidance with Virtual CFO services.",
    "content": "Our Virtual CFO Services provide strategic financial management, budgeting, forecasting, and compliance support for startups and SMEs, without the cost of a full-time CFO.",
    "priceAmount": 14999,
    "governmentFee": "None",
    "processingTime": "Ongoing (monthly/quarterly)",
    "validity": "Ongoing",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/virtual-cfo.jpg",
    "features": [
      "Financial strategy development",
      "Budgeting and forecasting",
      "Cash flow management",
      "Compliance oversight",
      "Financial reporting",
      "Fundraising support"
    ],
    "requiredDocuments": [
      "Financial statements",
      "Accounting records",
      "Business plan",
      "Tax registration details",
      "Funding details (if applicable)"
    ],
    "processSteps": [
      {
        "step": "Business Assessment",
        "description": "Assess financial and business needs"
      },
      {
        "step": "Strategy Development",
        "description": "Develop financial and operational strategies"
      },
      {
        "step": "Implementation",
        "description": "Implement budgeting and forecasting systems"
      },
      {
        "step": "Monitoring",
        "description": "Monitor financial performance"
      },
      {
        "step": "Reporting",
        "description": "Provide regular financial reports"
      }
    ],
    "faqs": [
      {
        "question": "What is a Virtual CFO?",
        "answer": "A Virtual CFO provides part-time or outsourced financial management services, including strategy, budgeting, and compliance."
      },
      {
        "question": "Who can benefit from Virtual CFO services?",
        "answer": "Startups, SMEs, and businesses without a full-time CFO can benefit."
      },
      {
        "question": "How is a Virtual CFO different from a regular accountant?",
        "answer": "A Virtual CFO focuses on strategic financial planning and decision-making, beyond routine accounting."
      }
    ],
    "relatedServices": [
      {
        "id": "43",
        "title": "Bookkeeping & Accounting",
        "slug": "bookkeeping-accounting"
      },
      {
        "id": "44",
        "title": "Financial Statement Preparation",
        "slug": "financial-statement-preparation"
      }
    ]
  },
  {
    "title": "Inventory & Billing System Setup",
    "slug": "inventory-billing-system-setup",
    "shortName": "Inventory System",
    "description": "Set up efficient inventory and billing systems for your business.",
    "content": "Our Inventory & Billing System Setup service streamlines stock management and invoicing processes using software like Tally, Zoho, or QuickBooks, ensuring accuracy and compliance with GST regulations.",
    "priceAmount": 5999,
    "governmentFee": "None",
    "processingTime": "7-15 days",
    "validity": "Ongoing",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/inventory-billing-system.jpg",
    "features": [
      "Software selection and setup",
      "Inventory tracking system",
      "GST-compliant invoicing",
      "Training on system usage",
      "Integration with accounting",
      "Ongoing support"
    ],
    "requiredDocuments": [
      "Business registration details",
      "GST registration",
      "Current inventory records",
      "Sales and purchase details",
      "Bank account details"
    ],
    "processSteps": [
      {
        "step": "Requirement Analysis",
        "description": "Assess business inventory and billing needs"
      },
      {
        "step": "Software Selection",
        "description": "Choose suitable software for your business"
      },
      {
        "step": "System Setup",
        "description": "Configure inventory and billing modules"
      },
      {
        "step": "Training",
        "description": "Train staff on system usage"
      },
      {
        "step": "Integration",
        "description": "Integrate with accounting systems"
      }
    ],
    "faqs": [
      {
        "question": "Why do I need an inventory and billing system?",
        "answer": "It ensures accurate stock management, GST-compliant invoicing, and streamlined operations."
      },
      {
        "question": "Which software do you use?",
        "answer": "We use popular software like Tally, Zoho, QuickBooks, or custom solutions based on your needs."
      },
      {
        "question": "Can the system be customized?",
        "answer": "Yes, we tailor the system to your specific business requirements."
      }
    ],
    "relatedServices": [
      {
        "id": "43",
        "title": "Bookkeeping & Accounting",
        "slug": "bookkeeping-accounting"
      },
      {
        "id": "2",
        "title": "GST Return Filing",
        "slug": "gst-return-filing"
      }
    ]
  },
  {
    "title": "GST Reconciliation Support",
    "slug": "gst-reconciliation-support",
    "shortName": "GST Reconciliation",
    "description": "Ensure accurate GST reconciliation for compliance and ITC claims.",
    "content": "Our GST Reconciliation Support service ensures your GST returns match with books of accounts and GSTR-2A/2B, maximizing Input Tax Credit (ITC) claims and avoiding penalties.",
    "priceAmount": 2999,
    "governmentFee": "None",
    "processingTime": "5-10 days per return",
    "validity": "For the relevant GST period",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/gst-reconciliation.jpg",
    "features": [
      "GSTR-2A/2B reconciliation",
      "ITC claim optimization",
      "Mismatch identification and correction",
      "GST portal updates",
      "Compliance reporting",
      "Support for notices"
    ],
    "requiredDocuments": [
      "GST registration details",
      "GSTR-1, 3B, 2A/2B data",
      "Purchase and sales invoices",
      "Accounting records",
      "Bank statements"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Collect GST returns and accounting data"
      },
      {
        "step": "Reconciliation",
        "description": "Match GSTR-2A/2B with books"
      },
      {
        "step": "Mismatch Resolution",
        "description": "Identify and correct discrepancies"
      },
      {
        "step": "ITC Claim",
        "description": "Optimize Input Tax Credit claims"
      },
      {
        "step": "Reporting",
        "description": "Provide reconciliation reports"
      }
    ],
    "faqs": [
      {
        "question": "What is GST reconciliation?",
        "answer": "GST reconciliation matches your GST returns with supplier data (GSTR-2A/2B) to ensure ITC claims and compliance."
      },
      {
        "question": "Why is GST reconciliation important?",
        "answer": "It prevents ITC loss, ensures compliance, and avoids penalties for mismatches."
      },
      {
        "question": "How often should GST reconciliation be done?",
        "answer": "It should be done monthly or quarterly, aligned with GST return filings."
      }
    ],
    "relatedServices": [
      {
        "id": "2",
        "title": "GST Return Filing",
        "slug": "gst-return-filing"
      },
      {
        "id": "43",
        "title": "Bookkeeping & Accounting",
        "slug": "bookkeeping-accounting"
      }
    ]
  },
  {
    "title": "Business Valuation Reports",
    "slug": "business-valuation-reports",
    "shortName": "Valuation Reports",
    "description": "Obtain professional business valuation reports for funding or sale.",
    "content": "Our Business Valuation Reports service provides detailed valuation reports for fundraising, mergers, acquisitions, or business sales, using methods like DCF, market comparison, and asset-based valuation.",
    "priceAmount": 9999,
    "governmentFee": "None",
    "processingTime": "10-20 days",
    "validity": "For the relevant valuation purpose",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/business-valuation.jpg",
    "features": [
      "Valuation using multiple methods",
      "Detailed financial analysis",
      "Market comparison",
      "Report customization",
      "Support for investor presentations"
    ],
    "requiredDocuments": [
      "Financial statements (last 3 years)",
      "Business plan",
      "Market data (if available)",
      "Asset details",
      "Revenue projections"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Gather financial and business data"
      },
      {
        "step": "Valuation Method Selection",
        "description": "Choose appropriate valuation methods"
      },
      {
        "step": "Analysis",
        "description": "Perform financial and market analysis"
      },
      {
        "step": "Report Drafting",
        "description": "Draft detailed valuation report"
      },
      {
        "step": "Review and Finalization",
        "description": "Review with client and finalize"
      }
    ],
    "faqs": [
      {
        "question": "Why do I need a business valuation?",
        "answer": "Valuation is needed for fundraising, mergers, acquisitions, or selling your business."
      },
      {
        "question": "What methods are used for valuation?",
        "answer": "Common methods include Discounted Cash Flow (DCF), market comparison, and asset-based valuation."
      },
      {
        "question": "How long is a valuation report valid?",
        "answer": "Validity depends on the purpose but is typically relevant for 6-12 months."
      }
    ],
    "relatedServices": [
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      },
      {
        "id": "34",
        "title": "Loan Documentation Support",
        "slug": "loan-documentation-support"
      }
    ]
  },
  {
    "title": "Loan Documentation Support",
    "slug": "loan-documentation-support",
    "shortName": "Loan Documentation",
    "description": "Prepare comprehensive loan documentation for bank approvals.",
    "content": "Our Loan Documentation Support service assists in preparing all necessary documents for business loan applications, ensuring compliance with bank requirements and increasing approval chances.",
    "priceAmount": 4999,
    "governmentFee": "None",
    "processingTime": "7-15 days",
    "validity": "For the loan application process",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/loan-documentation.jpg",
    "features": [
      "Document preparation",
      "Financial projections",
      "Bank-specific formatting",
      "Application submission support",
      "Follow-up with banks"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Financial statements",
      "Project report",
      "KYC documents",
      "Loan application form"
    ],
    "processSteps": [
      {
        "step": "Requirement Analysis",
        "description": "Understand loan requirements and bank preferences"
      },
      {
        "step": "Document Collection",
        "description": "Gather necessary financial and KYC documents"
      },
      {
        "step": "Documentation Preparation",
        "description": "Prepare loan application and supporting documents"
      },
      {
        "step": "Submission",
        "description": "Submit documents to the bank"
      },
      {
        "step": "Follow-up",
        "description": "Coordinate with bank for approval"
      }
    ],
    "faqs": [
      {
        "question": "What documents are needed for a loan application?",
        "answer": "Common documents include financial statements, business plans, KYC documents, and project reports."
      },
      {
        "question": "Can you assist with specific bank requirements?",
        "answer": "Yes, we tailor documentation to meet specific bank guidelines."
      },
      {
        "question": "How long does loan approval take?",
        "answer": "Approval timelines vary by bank, typically 15-60 days after submission."
      }
    ],
    "relatedServices": [
      {
        "id": "27",
        "title": "CMA Data & DPR Preparation",
        "slug": "cma-dpr-preparation"
      },
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      }
    ]
  },
  {
    "title": "Udyami Mitra Portal Support",
    "slug": "udyami-mitra-portal-support",
    "shortName": "Udyami Mitra",
    "description": "Access support for registration and benefits on the Udyami Mitra Portal.",
    "content": "Our Udyami Mitra Portal Support service assists businesses in registering on the Udyami Mitra Portal to access government schemes, subsidies, and financial assistance for MSMEs.",
    "priceAmount": 1999,
    "governmentFee": "None",
    "processingTime": "5-10 days",
    "validity": "Ongoing",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/udyami-mitra.jpg",
    "features": [
      "Portal registration assistance",
      "Scheme eligibility assessment",
      "Application preparation",
      "Document submission",
      "Follow-up for approvals"
    ],
    "requiredDocuments": [
      "MSME registration certificate",
      "Business registration documents",
      "PAN Card",
      "Aadhaar Card",
      "Bank account details"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Assess eligibility for Udyami Mitra schemes"
      },
      {
        "step": "Document Collection",
        "description": "Gather required documents"
      },
      {
        "step": "Portal Registration",
        "description": "Register on Udyami Mitra Portal"
      },
      {
        "step": "Application Submission",
        "description": "Submit scheme applications"
      },
      {
        "step": "Follow-up",
        "description": "Track application status"
      }
    ],
    "faqs": [
      {
        "question": "What is the Udyami Mitra Portal?",
        "answer": "It’s a government platform to connect MSMEs with financial institutions and schemes."
      },
      {
        "question": "Who can register on the Udyami Mitra Portal?",
        "answer": "MSMEs with valid registration can register to access subsidies and loans."
      },
      {
        "question": "What schemes are available on the portal?",
        "answer": "Schemes like PMEGP, MSME loans, and subsidies are accessible."
      }
    ],
    "relatedServices": [
      {
        "id": "3",
        "title": "MSME Registration",
        "slug": "msme-registration"
      },
      {
        "id": "50",
        "title": "Subsidy Application Assistance",
        "slug": "subsidy-application-assistance"
      }
    ]
  },
  {
    "title": "Subsidy Application Assistance (PMEGP / PMFME)",
    "slug": "subsidy-application-assistance",
    "shortName": "Subsidy Assistance",
    "description": "Apply for government subsidies under PMEGP, PMFME, and other schemes.",
    "content": "Our Subsidy Application Assistance service helps businesses apply for government subsidies under schemes like PMEGP (Prime Minister’s Employment Generation Programme) and PMFME (Pradhan Mantri Formalisation of Micro Food Enterprises), ensuring proper documentation and submission.",
    "priceAmount": 4999,
    "governmentFee": "None",
    "processingTime": "15-30 days",
    "validity": "For the subsidy application cycle",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/subsidy-application.jpg",
    "features": [
      "Scheme eligibility assessment",
      "Application preparation",
      "Document verification",
      "Submission to authorities",
      "Follow-up for approvals"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Project report",
      "Financial statements",
      "KYC documents",
      "Bank account details"
    ],
    "processSteps": [
      {
        "step": "Eligibility Assessment",
        "description": "Determine eligibility for PMEGP/PMFME"
      },
      {
        "step": "Document Collection",
        "description": "Gather required documents"
      },
      {
        "step": "Application Preparation",
        "description": "Prepare subsidy application"
      },
      {
        "step": "Submission",
        "description": "Submit to relevant authorities"
      },
      {
        "step": "Follow-up",
        "description": "Track application status"
      }
    ],
    "faqs": [
      {
        "question": "What are PMEGP and PMFME subsidies?",
        "answer": "PMEGP supports new enterprises with subsidies, while PMFME aids micro food processing units."
      },
      {
        "question": "Who is eligible for these subsidies?",
        "answer": "MSMEs, startups, and individuals meeting scheme criteria can apply."
      },
      {
        "question": "What is the subsidy amount?",
        "answer": "Subsidies vary, typically 15-35% of project cost, depending on the scheme."
      }
    ],
    "relatedServices": [
      {
        "id": "3",
        "title": "MSME Registration",
        "slug": "msme-registration"
      },
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      }
    ]
  },
  {
    "title": "Investment Pitch Deck Preparation",
    "slug": "investment-pitch-deck-preparation",
    "shortName": "Pitch Deck",
    "description": "Create professional pitch decks for investor presentations.",
    "content": "Our Investment Pitch Deck Preparation service designs compelling pitch decks to attract investors, highlighting your business model, financials, and growth potential.",
    "priceAmount": 6999,
    "governmentFee": "None",
    "processingTime": "7-15 days",
    "validity": "For the fundraising cycle",
    "category": "Accounting & Financial Services",
    "imageUrl": "/images/services/pitch-deck.jpg",
    "features": [
      "Business model presentation",
      "Financial projections",
      "Market analysis",
      "Investor-friendly design",
      "Customized content",
      "Presentation coaching"
    ],
    "requiredDocuments": [
      "Business plan",
      "Financial statements",
      "Market research data",
      "Team details",
      "Funding requirements"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Gather business and financial data"
      },
      {
        "step": "Content Development",
        "description": "Develop pitch deck content"
      },
      {
        "step": "Design",
        "description": "Create visually appealing slides"
      },
      {
        "step": "Review",
        "description": "Share draft for client feedback"
      },
      {
        "step": "Finalization",
        "description": "Finalize investor-ready pitch deck"
      }
    ],
    "faqs": [
      {
        "question": "What is an investment pitch deck?",
        "answer": "A pitch deck is a presentation summarizing your business for potential investors."
      },
      {
        "question": "What should a pitch deck include?",
        "answer": "It includes business overview, market opportunity, financials, team, and funding needs."
      },
      {
        "question": "Can you help present the pitch deck?",
        "answer": "Yes, we provide coaching for effective investor presentations."
      }
    ],
    "relatedServices": [
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      },
      {
        "id": "48",
        "title": "Business Valuation Reports",
        "slug": "business-valuation-reports"
      }
    ]
  },
  {
    "title": "Company Closure (Strike-Off)",
    "slug": "company-closure-strike-off",
    "shortName": "Company Closure",
    "description": "Close your company legally with MCA strike-off process.",
    "content": "Our Company Closure service assists in the voluntary strike-off of a company under the Companies Act, 2013, ensuring compliance with MCA regulations and proper closure formalities.",
    "priceAmount": 9999,
    "governmentFee": "₹5,000-₹10,000 (based on MCA fees)",
    "processingTime": "3-6 months",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/company-closure.jpg",
    "features": [
      "Filing of STK-2 form",
      "Clearance of liabilities",
      "Document preparation",
      "MCA portal submission",
      "Coordination with ROC",
      "Closure certificate issuance"
    ],
    "requiredDocuments": [
      "Board resolution for closure",
      "Financial statements",
      "Affidavit of no liabilities",
      "Indemnity bond",
      "PAN card of company",
      "Latest ITR filings"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Verify company eligibility for strike-off"
      },
      {
        "step": "Liability Clearance",
        "description": "Ensure all debts and liabilities are cleared"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare STK-2 and supporting documents"
      },
      {
        "step": "Submission",
        "description": "Submit application to MCA"
      },
      {
        "step": "ROC Approval",
        "description": "Obtain approval from Registrar of Companies"
      },
      {
        "step": "Closure",
        "description": "Receive strike-off confirmation"
      }
    ],
    "faqs": [
      {
        "question": "Who can apply for company strike-off?",
        "answer": "Companies with no liabilities, no operations for 2 years, and no pending litigations can apply."
      },
      {
        "question": "What happens after strike-off?",
        "answer": "The company is removed from the MCA register and ceases to exist legally."
      },
      {
        "question": "Are there penalties for non-compliance during closure?",
        "answer": "Non-compliance can lead to fines up to ₹1 lakh or rejection of the strike-off application."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "6",
        "title": "Income Tax Return Filing",
        "slug": "income-tax-return-filing"
      }
    ]
  },
  {
    "title": "LLP Closure",
    "slug": "llp-closure",
    "shortName": "LLP Closure",
    "description": "Close your Limited Liability Partnership legally with MCA.",
    "content": "Our LLP Closure service assists in the voluntary winding up of a Limited Liability Partnership under the LLP Act, 2008, ensuring compliance with MCA regulations and proper closure formalities.",
    "priceAmount": 7999,
    "governmentFee": "₹5,000-₹10,000 (based on MCA fees)",
    "processingTime": "3-6 months",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/llp-closure.jpg",
    "features": [
      "Filing of LLP Form 24",
      "Clearance of liabilities",
      "Document preparation",
      "MCA portal submission",
      "Coordination with ROC",
      "Closure certificate issuance"
    ],
    "requiredDocuments": [
      "LLP agreement",
      "Partner resolution for closure",
      "Financial statements",
      "Affidavit of no liabilities",
      "Indemnity bond",
      "Latest ITR filings"
    ],
    "processSteps": [
      {
        "step": "Eligibility Check",
        "description": "Verify LLP eligibility for closure"
      },
      {
        "step": "Liability Clearance",
        "description": "Ensure all debts and liabilities are cleared"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare Form 24 and supporting documents"
      },
      {
        "step": "Submission",
        "description": "Submit application to MCA"
      },
      {
        "step": "ROC Approval",
        "description": "Obtain approval from Registrar of Companies"
      },
      {
        "step": "Closure",
        "description": "Receive LLP closure confirmation"
      }
    ],
    "faqs": [
      {
        "question": "Who can apply for LLP closure?",
        "answer": "LLPs with no liabilities, no operations for 2 years, and no pending litigations can apply."
      },
      {
        "question": "What is the process for LLP closure?",
        "answer": "It involves clearing liabilities, filing Form 24, and obtaining ROC approval."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Non-compliance can lead to fines up to ₹1 lakh or rejection of the closure application."
      }
    ],
    "relatedServices": [
      {
        "id": "5",
        "title": "LLP Registration",
        "slug": "llp-registration"
      },
      {
        "id": "6",
        "title": "Income Tax Return Filing",
        "slug": "income-tax-return-filing"
      }
    ]
  },
  {
    "title": "Partnership Dissolution",
    "slug": "partnership-dissolution",
    "shortName": "Partnership Dissolution",
    "description": "Dissolve your partnership firm legally with proper documentation.",
    "content": "Our Partnership Dissolution service ensures the legal dissolution of a partnership firm under the Indian Partnership Act, 1932, with proper documentation and compliance.",
    "priceAmount": 4999,
    "governmentFee": "₹1,000-₹5,000 (varies by state)",
    "processingTime": "15-30 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/partnership-dissolution.jpg",
    "features": [
      "Dissolution deed preparation",
      "Liability clearance",
      "Document filing with authorities",
      "GST/PAN surrender assistance",
      "Partner consent documentation"
    ],
    "requiredDocuments": [
      "Partnership deed",
      "Partner consent letter",
      "Financial statements",
      "PAN card of firm",
      "GST registration surrender documents"
    ],
    "processSteps": [
      {
        "step": "Partner Agreement",
        "description": "Obtain consent for dissolution"
      },
      {
        "step": "Liability Clearance",
        "description": "Clear all firm liabilities"
      },
      {
        "step": "Dissolution Deed",
        "description": "Prepare and execute dissolution deed"
      },
      {
        "step": "Filing",
        "description": "File documents with relevant authorities"
      },
      {
        "step": "Closure",
        "description": "Complete dissolution process"
      }
    ],
    "faqs": [
      {
        "question": "What is partnership dissolution?",
        "answer": "It is the legal process of closing a partnership firm, distributing assets, and settling liabilities."
      },
      {
        "question": "Do all partners need to agree to dissolution?",
        "answer": "Yes, unanimous consent is typically required unless specified otherwise in the partnership deed."
      },
      {
        "question": "What happens to GST/PAN after dissolution?",
        "answer": "GST and PAN registrations need to be surrendered post-dissolution."
      }
    ],
    "relatedServices": [
      {
        "id": "15",
        "title": "Partnership Firm Registration",
        "slug": "partnership-firm-registration"
      },
      {
        "id": "2",
        "title": "GST Return Filing",
        "slug": "gst-return-filing"
      }
    ]
  },
  {
    "title": "Conversion: Proprietorship to LLP / Pvt Ltd",
    "slug": "proprietorship-to-llp-pvt-ltd",
    "shortName": "Business Conversion",
    "description": "Convert your proprietorship to LLP or Private Limited company.",
    "content": "Our Business Conversion service assists in converting a proprietorship into an LLP or Private Limited company for better liability protection and scalability, ensuring compliance with MCA regulations.",
    "priceAmount": 14999,
    "governmentFee": "₹2,000-₹10,000 (based on entity type)",
    "processingTime": "15-30 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/business-conversion.jpg",
    "features": [
      "New entity registration",
      "Asset transfer documentation",
      "PAN/GST transfer",
      "MCA filing support",
      "Compliance guidance"
    ],
    "requiredDocuments": [
      "Proprietorship PAN",
      "Business registration documents",
      "Financial statements",
      "KYC of owners/partners",
      "Proposed company/LLP details"
    ],
    "processSteps": [
      {
        "step": "Entity Selection",
        "description": "Choose LLP or Pvt Ltd based on needs"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare conversion documents"
      },
      {
        "step": "New Entity Registration",
        "description":"Register LLP or Pvt Ltd with MCA"
      },
      {
        "step": "Asset Transfer",
        "description": "Transfer proprietorship assets"
      },
      {
        "step": "Compliance",
        "description": "Complete PAN/GST transfer and compliance"
      }
    ],
    "faqs": [
      {
        "question": "Why convert a proprietorship to LLP/Pvt Ltd?",
        "answer": "Conversion offers limited liability, better funding options, and scalability."
      },
      {
        "question": "What happens to proprietorship assets?",
        "answer": "Assets are transferred to the new entity via a transfer agreement."
      },
      {
        "question": "How long does conversion take?",
        "answer": "The process typically takes 15-30 days, depending on MCA approvals."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "5",
        "title": "LLP Registration",
        "slug": "llp-registration"
      }
    ]
  },
  {
    "title": "Director / Partner Addition or Removal",
    "slug": "director-partner-addition-removal",
    "shortName": "Director/Partner Change",
    "description": "Add or remove directors/partners in your company or LLP.",
    "content": "Our service facilitates the addition or removal of directors/partners in a company or LLP, ensuring compliance with MCA regulations and proper documentation.",
    "priceAmount": 4999,
    "governmentFee": "₹500-₹5,000 (based on MCA fees)",
    "processingTime": "7-15 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/director-partner-change.jpg",
    "features": [
      "Filing of DIR-12 or LLP Form 4",
      "Resolution preparation",
      "Document verification",
      "MCA portal submission",
      "Compliance guidance"
    ],
    "requiredDocuments": [
      "KYC of new/existing directors/partners",
      "Board/partner resolution",
      "Consent letter (for addition)",
      "Resignation letter (for removal)",
      "Company/LLP PAN"
    ],
    "processSteps": [
      {
        "step": "Resolution",
        "description": "Pass board/partner resolution"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare DIR-12 or LLP Form 4"
      },
      {
        "step": "Submission",
        "description": "Submit to MCA"
      },
      {
        "step": "Verification",
        "description": "Coordinate with ROC for approval"
      },
      {
        "step": "Completion",
        "description": "Update company/LLP records"
      }
    ],
    "faqs": [
      {
        "question": "What is required to add a director/partner?",
        "answer": "A board/partner resolution, KYC documents, and consent letter are needed."
      },
      {
        "question": "How long does it take to remove a director/partner?",
        "answer": "The process takes 7-15 days, depending on MCA processing."
      },
      {
        "question": "Are there penalties for non-compliance?",
        "answer": "Yes, non-compliance can lead to fines up to ₹50,000."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "5",
        "title": "LLP Registration",
        "slug": "llp-registration"
      }
    ]
  },
  {
    "title": "Business Name Change",
    "slug": "business-name-change",
    "shortName": "Name Change",
    "description": "Change your company or LLP name legally with MCA approval.",
    "content": "Our Business Name Change service assists in legally changing the name of your company or LLP, ensuring compliance with MCA regulations and proper documentation.",
    "priceAmount": 5999,
    "governmentFee": "₹1,000-₹5,000 (based on MCA fees)",
    "processingTime": "15-30 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/business-name-change.jpg",
    "features": [
      "Name availability check",
      "Filing of INC-24 or LLP Form 5",
      "Resolution preparation",
      "MCA portal submission",
      "New certificate issuance"
    ],
    "requiredDocuments": [
      "Board/partner resolution",
      "Existing certificate of incorporation",
      "Proposed name details",
      "KYC of directors/partners",
      "MOA/AOA or LLP agreement"
    ],
    "processSteps": [
      {
        "step": "Name Approval",
        "description": "Check and reserve new name with MCA"
      },
      {
        "step": "Resolution",
        "description": "Pass board/partner resolution"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare INC-24 or LLP Form 5"
      },
      {
        "step": "Submission",
        "description": "Submit to MCA"
      },
      {
        "step": "Certificate Issuance",
        "description": "Receive new incorporation certificate"
      }
    ],
    "faqs": [
      {
        "question": "How do I choose a new business name?",
        "answer": "The new name must comply with MCA naming guidelines and be unique."
      },
      {
        "question": "How long does a name change take?",
        "answer": "The process takes 15-30 days, depending on MCA approvals."
      },
      {
        "question": "Do I need to update other registrations?",
        "answer": "Yes, GST, PAN, and other registrations need to be updated post-name change."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "5",
        "title": "LLP Registration",
        "slug": "llp-registration"
      }
    ]
  },
  {
    "title": "Business Address Change",
    "slug": "business-address-change",
    "shortName": "Address Change",
    "description": "Update your company or LLP address with MCA.",
    "content": "Our Business Address Change service assists in updating the registered address of your company or LLP, ensuring compliance with MCA regulations and proper documentation.",
    "priceAmount": 4999,
    "governmentFee": "₹500-₹5,000 (based on MCA fees)",
    "processingTime": "7-15 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/business-address-change.jpg",
    "features": [
      "Filing of INC-22 or LLP Form 15",
      "Resolution preparation",
      "Document verification",
      "MCA portal submission",
      "Updated certificate issuance"
    ],
    "requiredDocuments": [
      "Board/partner resolution",
      "New address proof",
      "NOC from landlord (if rented)",
      "Existing certificate of incorporation",
      "KYC of directors/partners"
    ],
    "processSteps": [
      {
        "step": "Resolution",
        "description": "Pass board/partner resolution"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare INC-22 or LLP Form 15"
      },
      {
        "step": "Submission",
        "description": "Submit to MCA"
      },
      {
        "step": "Verification",
        "description": "Coordinate with ROC for approval"
      },
      {
        "step": "Completion",
        "description": "Receive updated address certificate"
      }
    ],
    "faqs": [
      {
        "question": "What documents are needed for address change?",
        "answer": "New address proof, NOC from landlord, and board resolution are required."
      },
      {
        "question": "How long does an address change take?",
        "answer": "The process takes 7-15 days, depending on MCA processing."
      },
      {
        "question": "Do I need to update other registrations?",
        "answer": "Yes, GST, PAN, and other registrations need to be updated."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "5",
        "title": "LLP Registration",
        "slug": "llp-registration"
      }
    ]
  },
  {
    "title": "Increase in Authorized Capital",
    "slug": "increase-authorized-capital",
    "shortName": "Capital Increase",
    "description": "Increase the authorized capital of your company.",
    "content": "Our service assists in increasing the authorized capital of a company to support growth or new share issuance, ensuring compliance with MCA regulations.",
    "priceAmount": 5999,
    "governmentFee": "₹1,000-₹10,000 (based on capital increase)",
    "processingTime": "15-30 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/authorized-capital-increase.jpg",
    "features": [
      "Filing of SH-7",
      "MOA amendment",
      "Resolution preparation",
      "MCA portal submission",
      "Updated certificate issuance"
    ],
    "requiredDocuments": [
      "Board resolution",
      "Shareholder resolution",
      "Existing MOA/AOA",
      "Financial statements",
      "Company PAN"
    ],
    "processSteps": [
      {
        "step": "Resolution",
        "description": "Pass board and shareholder resolutions"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare SH-7 and amended MOA"
      },
      {
        "step": "Submission",
        "description": "Submit to MCA"
      },
      {
        "step": "Verification",
        "description": "Coordinate with ROC for approval"
      },
      {
        "step": "Completion",
        "description": "Receive updated MOA"
      }
    ],
    "faqs": [
      {
        "question": "Why increase authorized capital?",
        "answer": "To issue new shares, raise funds, or support business expansion."
      },
      {
        "question": "What is the difference between authorized and paid-up capital?",
        "answer": "Authorized capital is the maximum capital a company can issue, while paid-up capital is the amount actually paid by shareholders."
      },
      {
        "question": "How long does the process take?",
        "answer": "The process takes 15-30 days, depending on MCA approvals."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "60",
        "title": "Share Transfer & Restructuring",
        "slug": "share-transfer-restructuring"
      }
    ]
  },
  {
    "title": "Share Transfer & Restructuring",
    "slug": "share-transfer-restructuring",
    "shortName": "Share Transfer",
    "description": "Facilitate share transfer and corporate restructuring.",
    "content": "Our Share Transfer & Restructuring service assists in transferring shares or restructuring company ownership, ensuring compliance with the Companies Act, 2013.",
    "priceAmount": 7999,
    "governmentFee": "₹1,000-₹10,000 (based on MCA fees)",
    "processingTime": "15-30 days",
    "validity": "Permanent",
    "category": "Closure & Conversion",
    "imageUrl": "/images/services/share-transfer.jpg",
    "features": [
      "Share transfer agreement",
      "Filing of SH-4",
      "Resolution preparation",
      "MCA portal submission",
      "Updated shareholding records"
    ],
    "requiredDocuments": [
      "Share transfer agreement",
      "Board resolution",
      "Shareholder details",
      "Share certificates",
      "Company PAN"
    ],
    "processSteps": [
      {
        "step": "Agreement",
        "description": "Execute share transfer agreement"
      },
      {
        "step": "Resolution",
        "description": "Pass board resolution"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare SH-4 and supporting documents"
      },
      {
        "step": "Submission",
        "description": "Submit to MCA"
      },
      {
        "step": "Completion",
        "description": "Update shareholding records"
      }
    ],
    "faqs": [
      {
        "question": "What is share transfer?",
        "answer": "It involves transferring shares from one shareholder to another, updating ownership."
      },
      {
        "question": "What is corporate restructuring?",
        "answer": "Restructuring involves changing ownership, capital structure, or operations for strategic goals."
      },
      {
        "question": "How long does share transfer take?",
        "answer": "The process takes 15-30 days, depending on MCA approvals."
      }
    ],
    "relatedServices": [
      {
        "id": "4",
        "title": "Company Registration",
        "slug": "company-registration"
      },
      {
        "id": "59",
        "title": "Increase in Authorized Capital",
        "slug": "increase-authorized-capital"
      }
    ]
  },
  {
    "title": "Business Idea Validation",
    "slug": "business-idea-validation",
    "shortName": "Idea Validation",
    "description": "Validate your business idea with market and feasibility analysis.",
    "content": "Our Business Idea Validation service assesses the viability of your business idea through market research, feasibility studies, and competitive analysis, helping you make informed decisions.",
    "priceAmount": 6999,
    "governmentFee": "None",
    "processingTime": "10-20 days",
    "validity": "For the project initiation phase",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/business-idea-validation.jpg",
    "features": [
      "Market research",
      "Feasibility analysis",
      "Competitor analysis",
      "Financial viability assessment",
      "Validation report",
      "Strategy recommendations"
    ],
    "requiredDocuments": [
      "Business idea summary",
      "Target market details",
      "Financial projections (if any)",
      "Competitor information (if available)"
    ],
    "processSteps": [
      {
        "step": "Idea Submission",
        "description": "Submit your business idea details"
      },
      {
        "step": "Market Research",
        "description": "Conduct market and competitor analysis"
      },
      {
        "step": "Feasibility Study",
        "description": "Assess technical and financial viability"
      },
      {
        "step": "Report Preparation",
        "description": "Prepare validation report"
      },
      {
        "step": "Review",
        "description": "Discuss findings and recommendations"
      }
    ],
    "faqs": [
      {
        "question": "Why validate a business idea?",
        "answer": "Validation reduces risks by assessing market demand, competition, and feasibility."
      },
      {
        "question": "What does the validation report include?",
        "answer": "It includes market analysis, competitor insights, financial viability, and strategic recommendations."
      },
      {
        "question": "How long does validation take?",
        "answer": "The process takes 10-20 days, depending on complexity."
      }
    ],
    "relatedServices": [
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      },
      {
        "id": "62",
        "title": "Market Research & Demand Analysis",
        "slug": "market-research-demand-analysis"
      }
    ]
  },
  {
    "title": "Business Planning & Strategy",
    "slug": "business-planning-strategy",
    "shortName": "Business Planning",
    "description": "Develop a comprehensive business plan and growth strategy.",
    "content": "Our Business Planning & Strategy service creates detailed plans to guide your business growth, covering market entry, operations, and financial strategies.",
    "priceAmount": 9999,
    "governmentFee": "None",
    "processingTime": "15-30 days",
    "validity": "Ongoing",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/business-planning.jpg",
    "features": [
      "Market entry strategy",
      "Operational planning",
      "Financial projections",
      "Risk mitigation strategies",
      "Growth roadmap",
      "Implementation support"
    ],
    "requiredDocuments": [
      "Business overview",
      "Financial statements",
      "Market data (if available)",
      "Team details",
      "Growth objectives"
    ],
    "processSteps": [
      {
        "step": "Business Assessment",
        "description": "Assess current business status"
      },
      {
        "step": "Market Analysis",
        "description": "Analyze market and competition"
      },
      {
        "step": "Strategy Development",
        "description": "Develop business and financial strategies"
      },
      {
        "step": "Plan Drafting",
        "description": "Draft comprehensive business plan"
      },
      {
        "step": "Review",
        "description": "Finalize plan with client feedback"
      }
    ],
    "faqs": [
      {
        "question": "What is a business plan?",
        "answer": "A business plan outlines your business goals, strategies, and financial projections."
      },
      {
        "question": "Who needs a business plan?",
        "answer": "Startups, growing businesses, and those seeking funding need a business plan."
      },
      {
        "question": "Can the plan be updated?",
        "answer": "Yes, plans can be revised based on changing business needs."
      }
    ],
    "relatedServices": [
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      },
      {
        "id": "61",
        "title": "Business Idea Validation",
        "slug": "business-idea-validation"
      }
    ]
  },
  {
    "title": "Subsidy / Scheme Consulting (PM Mudra, PMEGP, PMFME, Stand-Up India)",
    "slug": "subsidy-scheme-consulting",
    "shortName": "Subsidy Consulting",
    "description": "Access government subsidies and schemes for your business.",
    "content": "Our Subsidy/Scheme Consulting service helps businesses identify and apply for government schemes like PM Mudra, PMEGP, PMFME, and Stand-Up India, maximizing financial benefits.",
    "priceAmount": 5999,
    "governmentFee": "None",
    "processingTime": "15-30 days",
    "validity": "For the scheme application cycle",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/subsidy-consulting.jpg",
    "features": [
      "Scheme eligibility assessment",
      "Application preparation",
      "Document verification",
      "Submission support",
      "Follow-up with authorities"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Project report",
      "Financial statements",
      "KYC documents",
      "Bank account details"
    ],
    "processSteps": [
      {
        "step": "Scheme Identification",
        "description": "Identify suitable government schemes"
      },
      {
        "step": "Eligibility Check",
        "description": "Assess eligibility for schemes"
      },
      {
        "step": "Document Preparation",
        "description": "Prepare application and documents"
      },
      {
        "step": "Submission",
        "description": "Submit to relevant authorities"
      },
      {
        "step": "Follow-up",
        "description": "Track application status"
      }
    ],
    "faqs": [
      {
        "question": "What schemes are available for businesses?",
        "answer": "Schemes like PM Mudra, PMEGP, PMFME, and Stand-Up India offer loans and subsidies."
      },
      {
        "question": "Who is eligible for these schemes?",
        "answer": "MSMEs, startups, and specific categories like women or SC/ST entrepreneurs are eligible."
      },
      {
        "question": "What is the subsidy amount?",
        "answer": "Subsidies vary, typically 15-35% of project cost, depending on the scheme."
      }
    ],
    "relatedServices": [
      {
        "id": "50",
        "title": "Subsidy Application Assistance",
        "slug": "subsidy-application-assistance"
      },
      {
        "id": "49",
        "title": "Udyami Mitra Portal Support",
        "slug": "udyami-mitra-portal-support"
      }
    ]
  },
  {
    "title": "CMA Data / DPR Preparation",
    "slug": "cma-dpr-preparation",
    "shortName": "CMA/DPR",
    "description": "Prepare CMA data and DPR for loan approvals.",
    "content": "Our CMA Data/DPR Preparation service creates Credit Monitoring Arrangement (CMA) data and Detailed Project Reports (DPR) for bank loan applications, ensuring compliance with bank requirements.",
    "priceAmount": 7999,
    "governmentFee": "None",
    "processingTime": "7-15 days",
    "validity": "For the loan application cycle",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/cma-dpr.jpg",
    "features": [
      "Financial projections",
      "CMA data preparation",
      "DPR drafting",
      "Bank-specific formatting",
      "Loan application support"
    ],
    "requiredDocuments": [
      "Financial statements",
      "Business plan",
      "Project details",
      "Market data",
      "Funding requirements"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Gather financial and project data"
      },
      {
        "step": "Financial Analysis",
        "description": "Prepare financial projections"
      },
      {
        "step": "CMA/DPR Drafting",
        "description": "Draft CMA data and DPR"
      },
      {
        "step": "Review",
        "description": "Share draft for client feedback"
      },
      {
        "step": "Finalization",
        "description": "Finalize bank-ready documents"
      }
    ],
    "faqs": [
      {
        "question": "What is CMA data?",
        "answer": "CMA data includes financial projections and ratios required by banks for loan evaluation."
      },
      {
        "question": "What is a DPR?",
        "answer": "A Detailed Project Report outlines project details, financials, and feasibility for loan approvals."
      },
      {
        "question": "Which banks require CMA/DPR?",
        "answer": "Most banks, including SBI, HDFC, and ICICI, require CMA/DPR for business loans."
      }
    ],
    "relatedServices": [
      {
        "id": "45",
        "title": "Project Report & Business Plan",
        "slug": "project-report-business-plan"
      },
      {
        "id": "34",
        "title": "Loan Documentation Support",
        "slug": "loan-documentation-support"
      }
    ]
  },
  {
    "title": "Machinery & Plant Setup Consulting",
    "slug": "machinery-plant-setup-consulting",
    "shortName": "Plant Setup",
    "description": "Plan and set up your manufacturing plant efficiently.",
    "content": "Our Machinery & Plant Setup Consulting service provides end-to-end guidance for establishing manufacturing units, including machinery selection, layout planning, and compliance.",
    "priceAmount": 14999,
    "governmentFee": "None",
    "processingTime": "30-60 days",
    "validity": "For the setup phase",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/plant-setup.jpg",
    "features": [
      "Machinery selection guidance",
      "Plant layout planning",
      "Compliance advisory",
      "Vendor coordination",
      "Setup timeline management",
      "Operational readiness support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Project details",
      "Financial projections",
      "Land documents",
      "Industry-specific requirements"
    ],
    "processSteps": [
      {
        "step": "Requirement Analysis",
        "description": "Assess plant and machinery needs"
      },
      {
        "step": "Vendor Selection",
        "description": "Identify and coordinate with vendors"
      },
      {
        "step": "Layout Planning",
        "description": "Design plant layout"
      },
      {
        "step": "Compliance Check",
        "description": "Ensure regulatory compliance"
      },
      {
        "step": "Setup Execution",
        "description": "Oversee plant setup"
      }
    ],
    "faqs": [
      {
        "question": "What industries do you support for plant setup?",
        "answer": "We support manufacturing, food processing, agro-based, and other industries."
      },
      {
        "question": "Do you assist with machinery procurement?",
        "answer": "Yes, we guide vendor selection and machinery procurement."
      },
      {
        "question": "What compliances are needed for plant setup?",
        "answer": "Compliances include factory license, pollution NOC, and fire safety NOC."
      }
    ],
    "relatedServices": [
      {
        "id": "30",
        "title": "Factory License",
        "slug": "factory-license"
      },
      {
        "id": "31",
        "title": "Pollution Control NOC",
        "slug": "pollution-control-noc"
      }
    ]
  },
  {
    "title": "Loan & Finance Advisory",
    "slug": "loan-finance-advisory",
    "shortName": "Loan Advisory",
    "description": "Get expert advice for securing business loans and financing.",
    "content": "Our Loan & Finance Advisory service provides guidance on securing business loans, identifying suitable financial institutions, and preparing for loan approvals.",
    "priceAmount": 5999,
    "governmentFee": "None",
    "processingTime": "Ongoing",
    "validity": "For the financing cycle",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/loan-advisory.jpg",
    "features": [
      "Loan option analysis",
      "Bank selection guidance",
      "Documentation advisory",
      "Financial strategy planning",
      "Negotiation support"
    ],
    "requiredDocuments": [
      "Financial statements",
      "Business plan",
      "KYC documents",
      "Loan requirements",
      "Collateral details (if any)"
    ],
    "processSteps": [
      {
        "step": "Requirement Analysis",
        "description": "Understand financing needs"
      },
      {
        "step": "Loan Option Evaluation",
        "description": "Identify suitable loan options"
      },
      {
        "step": "Documentation Guidance",
        "description": "Advise on required documents"
      },
      {
        "step": "Bank Coordination",
        "description": "Assist in bank negotiations"
      },
      {
        "step": "Approval Support",
        "description": "Support loan approval process"
      }
    ],
    "faqs": [
      {
        "question": "What types of loans can you advise on?",
        "answer": "We advise on term loans, working capital loans, MSME loans, and government-backed loans."
      },
      {
        "question": "Do you guarantee loan approval?",
        "answer": "No, approval depends on bank policies, but we maximize your chances."
      },
      {
        "question": "What is the role of collateral in loans?",
        "answer": "Collateral may be required for secured loans to reduce lender risk."
      }
    ],
    "relatedServices": [
      {
        "id": "34",
        "title": "Loan Documentation Support",
        "slug": "loan-documentation-support"
      },
      {
        "id": "27",
        "title": "CMA Data & DPR Preparation",
        "slug": "cma-dpr-preparation"
      }
    ]
  },
  {
    "title": "Licensing & Compliance Guidance",
    "slug": "licensing-compliance-guidance",
    "shortName": "Compliance Guidance",
    "description": "Ensure compliance with all required licenses and regulations.",
    "content": "Our Licensing & Compliance Guidance service provides expert advice on obtaining necessary licenses and maintaining compliance with industry and government regulations.",
    "priceAmount": 4999,
    "governmentFee": "Varies by license",
    "processingTime": "Ongoing",
    "validity": "Ongoing",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/compliance-guidance.jpg",
    "features": [
      "License requirement analysis",
      "Compliance checklist",
      "Application guidance",
      "Renewal reminders",
      "Regulatory updates"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Industry details",
      "Existing licenses (if any)",
      "KYC documents"
    ],
    "processSteps": [
      {
        "step": "Requirement Analysis",
        "description": "Identify required licenses and compliances"
      },
      {
        "step": "Checklist Creation",
        "description": "Prepare compliance checklist"
      },
      {
        "step": "Application Support",
        "description": "Guide license applications"
      },
      {
        "step": "Monitoring",
        "description": "Track compliance status"
      },
      {
        "step": "Updates",
        "description": "Provide regulatory updates"
      }
    ],
    "faqs": [
      {
        "question": "What licenses does my business need?",
        "answer": "Licenses depend on industry and location, e.g., GST, FSSAI, or factory license."
      },
      {
        "question": "How do I stay compliant?",
        "answer": "Regular audits, timely renewals, and adherence to regulations ensure compliance."
      },
      {
        "question": "What are the penalties for non-compliance?",
        "answer": "Penalties vary but can include fines, business closure, or legal action."
      }
    ],
    "relatedServices": [
      {
        "id": "1",
        "title": "GST Registration",
        "slug": "gst-registration"
      },
      {
        "id": "30",
        "title": "Factory License",
        "slug": "factory-license"
      }
    ]
  },
  {
    "title": "Market Research & Demand Analysis",
    "slug": "market-research-demand-analysis",
    "shortName": "Market Research",
    "description": "Conduct market research and demand analysis for your business.",
    "content": "Our Market Research & Demand Analysis service provides detailed insights into market trends, customer demand, and competition to support business planning and growth.",
    "priceAmount": 7999,
    "governmentFee": "None",
    "processingTime": "15-30 days",
    "validity": "For the project phase",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/market-research.jpg",
    "features": [
      "Market trend analysis",
      "Customer demand assessment",
      "Competitor analysis",
      "SWOT analysis",
      "Detailed research report",
      "Strategic recommendations"
    ],
    "requiredDocuments": [
      "Business overview",
      "Target market details",
      "Product/service details",
      "Existing market data (if any)"
    ],
    "processSteps": [
      {
        "step": "Requirement Analysis",
        "description": "Understand business and research needs"
      },
      {
        "step": "Data Collection",
        "description": "Collect market and customer data"
      },
      {
        "step": "Analysis",
        "description": "Analyze trends, demand, and competition"
      },
      {
        "step": "Report Preparation",
        "description": "Prepare detailed research report"
      },
      {
        "step": "Review",
        "description": "Share findings and recommendations"
      }
    ],
    "faqs": [
      {
        "question": "Why is market research important?",
        "answer": "It helps understand customer needs, market opportunities, and competitive landscape."
      },
      {
        "question": "What is included in the research report?",
        "answer": "The report includes market trends, demand analysis, competitor insights, and strategies."
      },
      {
        "question": "How long does market research take?",
        "answer": "The process takes 15-30 days, depending on complexity."
      }
    ],
    "relatedServices": [
      {
        "id": "61",
        "title": "Business Idea Validation",
        "slug": "business-idea-validation"
      },
      {
        "id": "62",
        "title": "Business Planning & Strategy",
        "slug": "business-planning-strategy"
      }
    ]
  },
  {
    "title": "Startup Mentorship",
    "slug": "startup-mentorship",
    "shortName": "Mentorship",
    "description": "Receive expert mentorship for your startup journey.",
    "content": "Our Startup Mentorship service provides personalized guidance from industry experts to help startups navigate challenges, develop strategies, and achieve growth.",
    "priceAmount": 9999,
    "governmentFee": "None",
    "processingTime": "Ongoing",
    "validity": "Ongoing",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/startup-mentorship.jpg",
    "features": [
      "One-on-one mentorship",
      "Business strategy guidance",
      "Funding advice",
      "Operational planning",
      "Networking opportunities",
      "Performance tracking"
    ],
    "requiredDocuments": [
      "Business plan",
      "Financial statements",
      "Growth objectives",
      "Team details"
    ],
    "processSteps": [
      {
        "step": "Business Assessment",
        "description": "Assess startup goals and challenges"
      },
      {
        "step": "Mentor Matching",
        "description": "Assign industry-specific mentor"
      },
      {
        "step": "Strategy Sessions",
        "description": "Conduct regular mentorship sessions"
      },
      {
        "step": "Action Plan",
        "description": "Develop and implement action plan"
      },
      {
        "step": "Progress Tracking",
        "description": "Monitor startup progress"
      }
    ],
    "faqs": [
      {
        "question": "Who can benefit from startup mentorship?",
        "answer": "Early-stage startups, entrepreneurs, and businesses seeking growth can benefit."
      },
      {
        "question": "What does mentorship cover?",
        "answer": "It covers strategy, funding, operations, and networking."
      },
      {
        "question": "How is mentorship delivered?",
        "answer": "Mentorship is delivered through one-on-one sessions, calls, or virtual meetings."
      }
    ],
    "relatedServices": [
      {
        "id": "62",
        "title": "Business Planning & Strategy",
        "slug": "business-planning-strategy"
      },
      {
        "id": "51",
        "title": "Investment Pitch Deck Preparation",
        "slug": "investment-pitch-deck-preparation"
      }
    ]
  },
  {
    "title": "Industry Setup Support (Agro / Food / Manufacturing)",
    "slug": "industry-setup-support",
    "shortName": "Industry Setup",
    "description": "Set up your agro, food, or manufacturing business efficiently.",
    "content": "Our Industry Setup Support service provides end-to-end guidance for establishing businesses in agro, food, or manufacturing sectors, including licensing, machinery, and compliance.",
    "priceAmount": 14999,
    "governmentFee": "Varies by licenses required",
    "processingTime": "30-60 days",
    "validity": "For the setup phase",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/industry-setup.jpg",
    "features": [
      "Industry-specific planning",
      "Licensing assistance",
      "Machinery and plant setup",
      "Compliance advisory",
      "Vendor coordination",
      "Operational readiness"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Project details",
      "Land documents",
      "Financial projections",
      "Industry-specific requirements"
    ],
    "processSteps": [
      {
        "step": "Industry Analysis",
        "description": "Assess industry-specific requirements"
      },
      {
        "step": "Licensing Support",
        "description": "Assist with required licenses"
      },
      {
        "step": "Machinery Planning",
        "description": "Plan machinery and plant setup"
      },
      {
        "step": "Compliance",
        "description": "Ensure regulatory compliance"
      },
      {
        "step": "Setup Execution",
        "description": "Oversee industry setup"
      }
    ],
    "faqs": [
      {
        "question": "Which industries do you support?",
        "answer": "We support agro-based, food processing, and manufacturing industries."
      },
      {
        "question": "What licenses are needed for industry setup?",
        "answer": "Licenses like FSSAI, factory license, and pollution NOC may be required."
      },
      {
        "question": "Can you assist with funding for setup?",
        "answer": "Yes, we provide loan and subsidy application support."
      }
    ],
    "relatedServices": [
      {
        "id": "30",
        "title": "Factory License",
        "slug": "factory-license"
      },
      {
        "id": "9",
        "title": "FSSAI Registration",
        "slug": "fssai-registration"
      }
    ]
  },
  {
    "title": "Franchise & Private Label Consulting",
    "slug": "franchise-private-label-consulting",
    "shortName": "Franchise Consulting",
    "description": "Develop your franchise or private label business model.",
    "content": "Our Franchise & Private Label Consulting service helps businesses create and expand franchise models or launch private label products, including strategy, branding, and compliance.",
    "priceAmount": 9999,
    "governmentFee": "None",
    "processingTime": "15-30 days",
    "validity": "Ongoing",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/franchise-consulting.jpg",
    "features": [
      "Franchise model development",
      "Private label strategy",
      "Branding and marketing plans",
      "Legal agreement drafting",
      "Compliance guidance",
      "Expansion support"
    ],
    "requiredDocuments": [
      "Business overview",
      "Brand details",
      "Financial projections",
      "Target market data",
      "Existing contracts (if any)"
    ],
    "processSteps": [
      {
        "step": "Business Assessment",
        "description": "Assess franchise/private label potential"
      },
      {
        "step": "Strategy Development",
        "description": "Develop franchise or private label strategy"
      },
      {
        "step": "Branding",
        "description": "Create branding and marketing plans"
      },
      {
        "step": "Legal Support",
        "description": "Draft franchise/private label agreements"
      },
      {
        "step": "Implementation",
        "description": "Support rollout and expansion"
      }
    ],
    "faqs": [
      {
        "question": "What is a franchise model?",
        "answer": "A franchise model allows others to operate your business under your brand."
      },
      {
        "question": "What is private label?",
        "answer": "Private label involves selling products under your brand, manufactured by others."
      },
      {
        "question": "What support do you provide for franchising?",
        "answer": "We provide strategy, branding, legal, and expansion support."
      }
    ],
    "relatedServices": [
      {
        "id": "62",
        "title": "Business Planning & Strategy",
        "slug": "business-planning-strategy"
      },
      {
        "id": "62",
        "title": "Market Research & Demand Analysis",
        "slug": "market-research-demand-analysis"
      }
    ]
  },
  {
    "title": "Compliance Health Check Reporting",
    "slug": "compliance-health-check-reporting",
    "shortName": "Compliance Health Check",
    "description": "Assess and report on your business’s compliance status.",
    "content": "Our Compliance Health Check Reporting service audits your business’s compliance with tax, labor, and industry regulations, providing a detailed report with recommendations.",
    "priceAmount": 5999,
    "governmentFee": "None",
    "processingTime": "10-20 days",
    "validity": "For the audit period",
    "category": "Consulting & Support",
    "imageUrl": "/images/services/compliance-health-check.jpg",
    "features": [
      "Compliance audit",
      "Regulatory gap analysis",
      "Detailed compliance report",
      "Actionable recommendations",
      "Follow-up support"
    ],
    "requiredDocuments": [
      "Business registration documents",
      "Tax filings",
      "Licenses and permits",
      "Financial statements",
      "Employee records"
    ],
    "processSteps": [
      {
        "step": "Data Collection",
        "description": "Gather compliance-related documents"
      },
      {
        "step": "Audit",
        "description": "Conduct compliance audit"
      },
      {
        "step": "Gap Analysis",
        "description": "Identify non-compliance issues"
      },
      {
        "step": "Report Preparation",
        "description": "Prepare detailed compliance report"
      },
      {
        "step": "Recommendations",
        "description": "Provide actionable compliance solutions"
      }
    ],
    "faqs": [
      {
        "question": "Why do I need a compliance health check?",
        "answer": "It identifies regulatory gaps, prevents penalties, and ensures business continuity."
      },
      {
        "question": "What regulations are covered?",
        "answer": "Tax, labor, environmental, and industry-specific regulations are covered."
      },
      {
        "question": "How often should I do a compliance check?",
        "answer": "Annually or when there are significant regulatory changes."
      }
    ],
    "relatedServices": [
      {
        "id": "66",
        "title": "Licensing & Compliance Guidance",
        "slug": "licensing-compliance-guidance"
      },
      {
        "id": "6",
        "title": "Income Tax Return Filing",
        "slug": "income-tax-return-filing"
      }
    ]
  }
];
