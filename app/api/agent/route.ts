import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_BASE_URL 
  : 'http://localhost:3000';

async function fetchAPI(endpoint: string, params?: URLSearchParams) {
  try {
    const url = `${BASE_URL}/api/${endpoint}${params ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
  }
  return null;
}

async function fetchAllAPIs() {
  const [products, shoppingProducts, services, categories, schemes, blog, media, careers] = await Promise.all([
    fetchAPI('products'),
    fetchAPI('shopping/products'),
    fetchAPI('services'),
    fetchAPI('categories'),
    fetchAPI('government-schemes'),
    fetchAPI('blog'),
    fetchAPI('media'),
    fetchAPI('careers')
  ]);
  
  return {
    products: products?.products || [],
    shoppingProducts: shoppingProducts?.products || [],
    services: services?.services || [],
    categories: categories?.categories || [],
    franchises: [],
    schemes: schemes?.schemes || [],
    orders: [],
    vendors: [],
    quotations: [],
    inventory: [],
    coupons: [],
    reviews: [],
    analytics: {},
    blog: blog?.posts || [],
    media: media?.media || [],
    careers: careers?.jobs || [],
    affiliates: [],
    notifications: [],
    tickets: [],
    users: [],
    addresses: [],
    wishlist: [],
    cart: [],
    payment: [],
    plants: [],
    creditScore: [],
    quoteRequests: [],
    slides: [],
    advertisements: [],
    projectReports: [],
    admin: {},
    permissions: [],
    tax: []
  };
}

async function fetchProducts(category?: string, search?: string, limit = '5') {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  params.append('limit', limit);
  
  const data = await fetchAPI('products', params);
  return data?.products || [];
}

async function fetchShoppingProducts(category?: string, search?: string, limit = '5') {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  params.append('limit', limit);
  
  const data = await fetchAPI('shopping/products', params);
  return data?.products || [];
}

async function fetchServices(category?: string, limit = '4') {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  params.append('limit', limit);
  
  const data = await fetchAPI('services', params);
  return data?.services || [];
}

async function fetchCategories() {
  const data = await fetchAPI('categories');
  return data?.categories || [];
}

async function fetchOffers() {
  const data = await fetchAPI('products/deals');
  return data?.deals || [];
}

async function fetchFranchises() {
  const data = await fetchAPI('franchises');
  return data?.franchises || [];
}

async function fetchGovernmentSchemes() {
  const data = await fetchAPI('government-schemes');
  return data?.schemes || [];
}

async function getAIResponse(input: string): Promise<any> {
  const lowerInput = input.toLowerCase();
  const allData = await fetchAllAPIs();
  
  // Mobile/Phone search - Show only products
  if (lowerInput.includes('फोन') || lowerInput.includes('mobile') || lowerInput.includes('मोबाइल')) {
    const mobileProducts = [...allData.products, ...allData.shoppingProducts]
      .filter(p => p.name?.toLowerCase().includes('mobile') || p.name?.toLowerCase().includes('phone'));
    
    return {
      message: 'यहाँ हमारे बेस्ट मोबाइल फोन हैं:',
      suggestedProducts: mobileProducts.slice(0, 5).map((p: any) => ({
        name: p.name,
        price: `₹${p.price.toLocaleString()}`,
        description: p.description,
        category: p.category?.name || 'Mobile',
        id: p.id,
        images: p.images || [],
        brand: p.brand,
        stock: p.stock,
        rating: p.averageRating || 0,
        reviews: p.reviewCount || 0
      })),
      quickReplies: ['iPhone दिखाएं', 'Samsung फोन', 'कीमत कम करें', 'EMI की जानकारी'],
      actionButtons: [
        { text: 'सभी मोबाइल देखें', action: 'VIEW_PRODUCTS', data: 'mobile' },
        { text: 'विवरण देखें', action: 'VIEW_PRODUCT_DETAIL', data: mobileProducts[0]?.id || '' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' }
      ]
    };
  }
  
  // Laptop search - Show only products
  if (lowerInput.includes('लैपटॉप') || lowerInput.includes('laptop')) {
    const laptopProducts = [...allData.products, ...allData.shoppingProducts]
      .filter(p => p.name?.toLowerCase().includes('laptop'));
    
    return {
      message: 'हमारे पास ये बेहतरीन लैपटॉप हैं:',
      suggestedProducts: laptopProducts.slice(0, 5).map((p: any) => ({
        name: p.name,
        price: `₹${p.price.toLocaleString()}`,
        description: p.description,
        category: p.category?.name || 'Laptop',
        id: p.id,
        images: p.images || [],
        brand: p.brand,
        stock: p.stock,
        rating: p.averageRating || 0,
        reviews: p.reviewCount || 0
      })),
      quickReplies: ['MacBook दिखाएं', 'Gaming laptop', 'बजट लैपटॉप', 'EMI विकल्प'],
      actionButtons: [
        { text: 'सभी लैपटॉप देखें', action: 'VIEW_PRODUCTS', data: 'laptop' },
        { text: 'विवरण देखें', action: 'VIEW_PRODUCT_DETAIL', data: laptopProducts[0]?.id || '' },
        { text: 'स्टोर विजिट करें', action: 'VIEW_MORE', data: 'store_location' }
      ]
    };
  }
  
  // Services - Show only services
  if (lowerInput.includes('रिपेयर') || lowerInput.includes('सर्विस') || lowerInput.includes('repair') || lowerInput.includes('service')) {
    return {
      message: 'हमारी सर्विसेज:',
      services: allData.services.map((s: any) => ({
        name: s.name,
        description: s.description,
        price: s.price ? `₹${s.price}` : 'कॉल करके पूछें',
        id: s.id,
        category: s.category,
        duration: s.duration,
        features: s.features || []
      })),
      quickReplies: ['मोबाइल रिपेयर', 'लैपटॉप सर्विस', 'होम सर्विस', 'वारंटी क्लेम'],
      actionButtons: [
        { text: 'सर्विस बुक करें', action: 'CALLBACK_REQUEST', data: 'service_booking' },
        { text: 'सर्विस विवरण', action: 'VIEW_SERVICE_DETAIL', data: allData.services[0]?.id || '' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' }
      ]
    };
  }
  
  // Store info and contact
  if (lowerInput.includes('समय') || lowerInput.includes('time') || lowerInput.includes('खुला') || lowerInput.includes('बंद') || lowerInput.includes('संपर्क') || lowerInput.includes('contact')) {
    return {
      message: '🕒 स्टोर का समय:\n\n📅 सोमवार से शनिवार: सुबह 10:00 - रात 9:00\n📅 रविवार: सुबह 11:00 - रात 8:00\n\n📍 पता: Shop No. 123, MG Road, Mumbai\n📞 फोन: +91 02269718200\n📧 ईमेल: support@martxmart.com\n📱 व्हाट्सऐप: +91 9876543210',
      quickReplies: ['पता भेजें', 'फोन करें', 'व्हाट्सऐप करें', 'ईमेल करें'],
      actionButtons: [
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' },
        { text: 'व्हाट्सऐप करें', action: 'CONTACT_SUPPORT', data: 'whatsapp' },
        { text: 'ईमेल करें', action: 'EMAIL_SUPPORT', data: 'support@martxmart.com' },
        { text: 'लोकेशन देखें', action: 'VIEW_MORE', data: 'location' }
      ]
    };
  }
  
  // Delivery info
  if (lowerInput.includes('डिलीवरी') || lowerInput.includes('delivery') || lowerInput.includes('शिपिंग')) {
    return {
      message: '🚚 डिलीवरी की जानकारी:\n\n✅ मुंबई में: 2-4 घंटे\n✅ महाराष्ट्र में: 1-2 दिन\n✅ पूरे भारत में: 3-7 दिन\n\n💰 ₹999+ ऑर्डर पर फ्री डिलीवरी\n📦 सुरक्षित पैकेजिंग गारंटी',
      quickReplies: ['ट्रैक ऑर्डर', 'डिलीवरी चार्ज', 'एक्सप्रेस डिलीवरी', 'रिटर्न पॉलिसी'],
      actionButtons: [
        { text: 'ऑर्डर ट्रैक करें', action: 'TRACK_ORDER', data: 'track' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' }
      ]
    };
  }
  
  // Offers and deals
  if (lowerInput.includes('ऑफर') || lowerInput.includes('offer') || lowerInput.includes('छूट') || lowerInput.includes('discount') || lowerInput.includes('deal')) {
    const offers = await fetchOffers();
    const discountedProducts = [...allData.products, ...allData.shoppingProducts]
      .filter((p: any) => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 3);
    
    return {
      message: 'आज के स्पेशल ऑफर्स:',
      offers: (offers || []).map((o: any) => ({
        title: o.title,
        description: o.description,
        discount: o.discount,
        validUntil: o.validUntil
      })),
      suggestedProducts: discountedProducts.map((p: any) => ({
        name: p.name,
        price: `₹${p.price.toLocaleString()}`,
        originalPrice: `₹${p.originalPrice.toLocaleString()}`,
        description: p.description,
        category: p.category?.name || 'Product',
        id: p.id,
        images: p.images || [],
        discount: p.discount,
        rating: p.averageRating || 0
      })),
      quickReplies: ['दिवाली ऑफर', 'मोबाइल ऑफर', 'लैपटॉप ऑफर', 'एक्सचेंज ऑफर'],
      actionButtons: [
        { text: 'सभी ऑफर देखें', action: 'VIEW_OFFERS', data: 'all' },
        { text: 'ऑफर विवरण', action: 'VIEW_PRODUCT_DETAIL', data: discountedProducts[0]?.id || '' },
        { text: 'व्हाट्सऐप पर ऑफर', action: 'GET_OFFERS', data: 'whatsapp' }
      ]
    };
  }
  
  // Categories
  if (lowerInput.includes('कैटेगरी') || lowerInput.includes('category') || lowerInput.includes('प्रकार')) {
    return {
      message: 'हमारे पास ये कैटेगरी हैं:',
      categories: allData.categories.map((c: any) => ({
        name: c.name,
        description: c.description,
        productCount: c.productCount || 0
      })),
      quickReplies: allData.categories.slice(0, 4).map((c: any) => c.name),
      actionButtons: [
        { text: 'सभी कैटेगरी देखें', action: 'VIEW_CATEGORIES', data: 'all' }
      ]
    };
  }
  
  // Franchise inquiry
  if (lowerInput.includes('फ्रैंचाइजी') || lowerInput.includes('franchise') || lowerInput.includes('बिजनेस')) {
    return {
      message: 'मार्टएक्समार्ट फ्रैंचाइजी के अवसर:',
      franchises: allData.franchises.map((f: any) => ({
        name: f.name,
        location: f.location,
        investment: f.investment ? `₹${f.investment.toLocaleString()}` : 'कॉल करके पूछें',
        description: f.description
      })),
      quickReplies: ['फ्रैंचाइजी आवेदन', 'निवेश की जानकारी', 'सपोर्ट की जानकारी'],
      actionButtons: [
        { text: 'फ्रैंचाइजी आवेदन करें', action: 'CALLBACK_REQUEST', data: 'franchise_application' },
        { text: 'सभी फ्रैंचाइजी देखें', action: 'VIEW_FRANCHISES', data: 'all' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' }
      ]
    };
  }
  
  // Government schemes
  if (lowerInput.includes('सरकारी') || lowerInput.includes('government') || lowerInput.includes('योजना') || lowerInput.includes('scheme') || lowerInput.includes('subsidy')) {
    return {
      message: 'सरकारी योजनाएं और सब्सिडी:',
      schemes: allData.schemes.map((s: any) => ({
        name: s.name,
        description: s.description,
        eligibility: s.eligibility,
        benefit: s.benefit
      })),
      quickReplies: ['MSME योजना', 'GST पंजीकरण', 'कंपनी पंजीकरण', 'लोन योजना'],
      actionButtons: [
        { text: 'योजना के लिए आवेदन करें', action: 'CALLBACK_REQUEST', data: 'government_scheme' },
        { text: 'सभी योजना देखें', action: 'VIEW_GOVERNMENT_SCHEMES', data: 'all' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' }
      ]
    };
  }
  
  // Orders inquiry - Show only orders
  if (lowerInput.includes('ऑर्डर') || lowerInput.includes('order')) {
    return {
      message: 'आपके ऑर्डर की जानकारी:',
      orders: allData.orders.slice(0, 5).map((o: any) => ({
        id: o.id,
        status: o.status,
        total: o.total ? `₹${o.total.toLocaleString()}` : 'N/A',
        date: o.createdAt,
        items: o.items || []
      })),
      quickReplies: ['ऑर्डर ट्रैक करें', 'रिटर्न/एक्सचेंज', 'पेमेंट स्टेटस', 'कैंसल ऑर्डर'],
      actionButtons: [
        { text: 'सभी ऑर्डर देखें', action: 'TRACK_ORDER', data: 'all' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' }
      ]
    };
  }
  
  // Vendors inquiry - Show only vendors
  if (lowerInput.includes('विक्रेता') || lowerInput.includes('vendor') || lowerInput.includes('सेलर')) {
    return {
      message: 'हमारे विक्रेता:',
      vendors: allData.vendors.slice(0, 5).map((v: any) => ({
        name: v.name,
        businessName: v.businessName,
        rating: v.rating || 0,
        products: v.productCount || 0,
        location: v.location,
        verified: v.verified || false
      })),
      quickReplies: ['विक्रेता बनें', 'टॉप विक्रेता', 'विक्रेता सपोर्ट', 'कमीशन रेट'],
      actionButtons: [
        { text: 'विक्रेता रजिस्ट्रेशन', action: 'CALLBACK_REQUEST', data: 'vendor_registration' },
        { text: 'सभी विक्रेता देखें', action: 'VIEW_VENDORS', data: 'all' }
      ]
    };
  }
  
  // Reviews inquiry - Show only reviews
  if (lowerInput.includes('रिव्यू') || lowerInput.includes('review') || lowerInput.includes('रेटिंग')) {
    return {
      message: 'ग्राहक रिव्यू:',
      reviews: allData.reviews.slice(0, 5).map((r: any) => ({
        productName: r.productName,
        rating: r.rating,
        comment: r.comment,
        userName: r.userName,
        date: r.createdAt
      })),
      quickReplies: ['रिव्यू लिखें', 'टॉप रेटेड प्रोडक्ट', '5 स्टार रिव्यू', 'रिव्यू पॉलिसी'],
      actionButtons: [
        { text: 'सभी रिव्यू देखें', action: 'VIEW_REVIEWS', data: 'all' }
      ]
    };
  }
  
  // Blog/News inquiry - Show only blog
  if (lowerInput.includes('ब्लॉग') || lowerInput.includes('blog') || lowerInput.includes('न्यूज') || lowerInput.includes('news')) {
    return {
      message: 'लेटेस्ट ब्लॉग और न्यूज:',
      blog: allData.blog.slice(0, 5).map((b: any) => ({
        title: b.title,
        excerpt: b.excerpt,
        publishedAt: b.publishedAt,
        category: b.category,
        author: b.author
      })),
      quickReplies: ['टेक न्यूज', 'बिजनेस टिप्स', 'प्रोडक्ट गाइड', 'इंडस्ट्री न्यूज'],
      actionButtons: [
        { text: 'सभी ब्लॉग देखें', action: 'VIEW_BLOG', data: 'all' }
      ]
    };
  }
  
  // Careers inquiry - Show only careers
  if (lowerInput.includes('करियर') || lowerInput.includes('career') || lowerInput.includes('जॉब') || lowerInput.includes('job')) {
    return {
      message: 'करियर के अवसर:',
      careers: allData.careers.slice(0, 5).map((c: any) => ({
        title: c.title,
        department: c.department,
        location: c.location,
        type: c.type,
        experience: c.experience,
        salary: c.salary
      })),
      quickReplies: ['जॉब अप्लाई करें', 'इंटर्नशिप', 'रिमोट जॉब', 'सैलरी रेंज'],
      actionButtons: [
        { text: 'सभी जॉब देखें', action: 'VIEW_CAREERS', data: 'all' },
        { text: 'CV भेजें', action: 'CALLBACK_REQUEST', data: 'job_application' }
      ]
    };
  }
  
  // Quotations inquiry - Show only quotations
  if (lowerInput.includes('कोटेशन') || lowerInput.includes('quotation') || lowerInput.includes('भाव') || lowerInput.includes('quote')) {
    return {
      message: 'आपके कोटेशन:',
      quotations: allData.quotations.slice(0, 5).map((q: any) => ({
        id: q.id,
        productName: q.productName,
        quantity: q.quantity,
        status: q.status,
        amount: q.amount ? `₹${q.amount.toLocaleString()}` : 'Pending'
      })),
      quickReplies: ['नया कोटेशन', 'कोटेशन स्टेटस', 'बल्क ऑर्डर', 'कस्टम कोटेशन'],
      actionButtons: [
        { text: 'नया कोटेशन मांगें', action: 'CALLBACK_REQUEST', data: 'quotation_request' },
        { text: 'सभी कोटेशन देखें', action: 'VIEW_QUOTATIONS', data: 'all' }
      ]
    };
  }
  
  // Coupons inquiry - Show only coupons
  if (lowerInput.includes('कूपन') || lowerInput.includes('coupon') || lowerInput.includes('प्रोमो कोड')) {
    return {
      message: 'उपलब्ध कूपन और प्रोमो कोड:',
      coupons: allData.coupons.slice(0, 5).map((c: any) => ({
        code: c.code,
        discount: c.discount,
        description: c.description,
        validUntil: c.validUntil,
        minAmount: c.minAmount
      })),
      quickReplies: ['नए कूपन', 'मेरे कूपन', 'फ्री शिपिंग', 'बल्क डिस्काउंट'],
      actionButtons: [
        { text: 'सभी कूपन देखें', action: 'VIEW_COUPONS', data: 'all' }
      ]
    };
  }
  
  // Wishlist inquiry - Show only wishlist
  if (lowerInput.includes('विशलिस्ट') || lowerInput.includes('wishlist') || lowerInput.includes('पसंदीदा')) {
    return {
      message: 'आपकी विशलिस्ट:',
      wishlist: allData.wishlist.slice(0, 5).map((w: any) => ({
        productName: w.productName,
        price: w.price ? `₹${w.price.toLocaleString()}` : 'N/A',
        availability: w.availability,
        addedDate: w.addedDate
      })),
      quickReplies: ['कार्ट में डालें', 'प्राइस अलर्ट', 'शेयर करें', 'विशलिस्ट क्लीयर करें'],
      actionButtons: [
        { text: 'विशलिस्ट देखें', action: 'VIEW_WISHLIST', data: 'all' }
      ]
    };
  }
  
  // Cart inquiry - Show only cart
  if (lowerInput.includes('कार्ट') || lowerInput.includes('cart') || lowerInput.includes('टोकरी')) {
    return {
      message: 'आपका कार्ट:',
      cart: allData.cart.slice(0, 5).map((c: any) => ({
        productName: c.productName,
        quantity: c.quantity,
        price: c.price ? `₹${c.price.toLocaleString()}` : 'N/A',
        total: c.total ? `₹${c.total.toLocaleString()}` : 'N/A'
      })),
      quickReplies: ['चेकआउट करें', 'कार्ट अपडेट करें', 'कार्ट खाली करें', 'कूपन लगाएं'],
      actionButtons: [
        { text: 'कार्ट देखें', action: 'VIEW_CART', data: 'all' },
        { text: 'चेकआउट', action: 'CHECKOUT', data: 'proceed' }
      ]
    };
  }
  
  // Default response with comprehensive backend data
  const allProducts = [...allData.products, ...allData.shoppingProducts].slice(0, 3);
  
  return {
    message: 'मैं आपकी मदद करने के लिए यहाँ हूँ! आप निम्नलिखित के बारे में पूछ सकते हैं:\n\n📱 मोबाइल फोन\n💻 लैपटॉप\n🎧 एक्सेसरीज\n🔧 रिपेयर सर्विस\n🎁 आज के ऑफर्स\n🚚 डिलीवरी की जानकारी\n🏢 फ्रैंचाइजी\n🏦 सरकारी योजनाएं',
    suggestedProducts: allProducts.map((p: any) => ({
      name: p.name,
      price: `₹${p.price.toLocaleString()}`,
      description: p.description,
      category: p.category?.name || 'Product',
      id: p.id,
      images: p.images || [],
      brand: p.brand,
      rating: p.averageRating || 0
    })),
    categories: allData.categories.slice(0, 4).map((c: any) => ({ name: c.name, productCount: c.productCount || 0 })),
    services: allData.services.slice(0, 2).map((s: any) => ({ name: s.name, description: s.description })),
    quickReplies: ['मोबाइल दिखाएं', 'लैपटॉप चाहिए', 'आज के ऑफर', 'स्टोर का समय', 'फ्रैंचाइजी', 'सरकारी योजना'],
    actionButtons: [
      { text: 'सभी प्रोडक्ट देखें', action: 'VIEW_PRODUCTS', data: 'all' },
      { text: 'प्रोडक्ट विवरण', action: 'VIEW_PRODUCT_DETAIL', data: allProducts[0]?.id || '' },
      { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' },
      { text: 'व्हाट्सऐप करें', action: 'CONTACT_SUPPORT', data: 'whatsapp' }
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: "Input is required and must be a string" },
        { status: 400 }
      );
    }

    const response = await getAIResponse(input);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Agent API error:", error);
    
    const fallbackResponse = {
      message: 'क्षमा करें, कुछ तकनीकी समस्या है। कृपया थोड़ी देर बाद पुनः प्रयास करें या हमारी सहायता टीम से संपर्क करें 🔧\n\n📞 फोन: +91 02269718200\n📧 ईमेल: support@martxmart.com\n📱 व्हाट्सऐप: +91 9876543210',
      quickReplies: ['कॉल करें', 'व्हाट्सऐप करें', 'ईमेल करें', 'बाद में कोशिश करें'],
      actionButtons: [
        { text: 'तुरंत कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' },
        { text: 'व्हाट्सऐप सपोर्ट', action: 'CONTACT_SUPPORT', data: 'whatsapp' },
        { text: 'ईमेल सपोर्ट', action: 'EMAIL_SUPPORT', data: 'support@martxmart.com' }
      ]
    };
    
    return NextResponse.json(fallbackResponse, { status: 200 });
  }
} 