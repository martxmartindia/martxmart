import { NextRequest, NextResponse } from 'next/server';

const services = [
  {
    id: 1,
    name: 'मोबाइल रिपेयर',
    description: 'सभी ब्रांड की मोबाइल रिपेयर सर्विस',
    price: 'Starting from ₹500',
    category: 'repair',
    duration: '2-4 hours',
    warranty: '3 months',
    features: ['Screen Replacement', 'Battery Change', 'Software Issues', 'Water Damage'],
    image: '/services/mobile-repair.jpg',
    rating: 4.8,
    reviews: 450,
    available: true
  },
  {
    id: 2,
    name: 'लैपटॉप सर्विस',
    description: 'हार्डवेयर और सॉफ्टवेयर सपोर्ट',
    price: 'Starting from ₹800',
    category: 'repair',
    duration: '1-2 days',
    warranty: '6 months',
    features: ['Hardware Repair', 'OS Installation', 'Data Recovery', 'Virus Removal'],
    image: '/services/laptop-service.jpg',
    rating: 4.7,
    reviews: 320,
    available: true
  },
  {
    id: 3,
    name: 'होम डिलीवरी',
    description: 'फ्री होम डिलीवरी ₹999+ ऑर्डर पर',
    price: 'Free on ₹999+',
    category: 'delivery',
    duration: '2-4 hours',
    warranty: 'Safe delivery guarantee',
    features: ['Same Day Delivery', 'Express Delivery', 'Installation Service', 'Unboxing Service'],
    image: '/services/home-delivery.jpg',
    rating: 4.9,
    reviews: 1200,
    available: true
  },
  {
    id: 4,
    name: 'इंस्टॉलेशन सर्विस',
    description: 'प्रोडक्ट इंस्टॉलेशन और सेटअप',
    price: 'Starting from ₹200',
    category: 'installation',
    duration: '1-2 hours',
    warranty: '1 month',
    features: ['TV Wall Mount', 'AC Installation', 'Router Setup', 'Smart Home Setup'],
    image: '/services/installation.jpg',
    rating: 4.6,
    reviews: 280,
    available: true
  },
  {
    id: 5,
    name: 'एक्सटेंडेड वारंटी',
    description: 'अपने प्रोडक्ट की वारंटी बढ़ाएं',
    price: 'Starting from ₹999',
    category: 'warranty',
    duration: '1-3 years',
    warranty: 'Extended coverage',
    features: ['Accidental Damage', 'Liquid Damage', 'Free Pickup & Drop', '24/7 Support'],
    image: '/services/warranty.jpg',
    rating: 4.5,
    reviews: 180,
    available: true
  },
  {
    id: 6,
    name: 'डेटा रिकवरी',
    description: 'खोए हुए डेटा को वापस पाएं',
    price: 'Starting from ₹1500',
    category: 'data',
    duration: '2-5 days',
    warranty: 'Success guarantee',
    features: ['Hard Drive Recovery', 'Phone Data Recovery', 'Photo Recovery', 'Document Recovery'],
    image: '/services/data-recovery.jpg',
    rating: 4.4,
    reviews: 95,
    available: true
  },
  {
    id: 7,
    name: 'टेक सपोर्ट',
    description: '24/7 तकनीकी सहायता',
    price: 'Starting from ₹300',
    category: 'support',
    duration: 'Immediate',
    warranty: 'Satisfaction guarantee',
    features: ['Remote Support', 'Phone Support', 'Chat Support', 'Video Call Support'],
    image: '/services/tech-support.jpg',
    rating: 4.7,
    reviews: 650,
    available: true
  },
  {
    id: 8,
    name: 'बल्क ऑर्डर',
    description: 'कॉर्पोरेट और बल्क ऑर्डर सर्विस',
    price: 'Custom pricing',
    category: 'bulk',
    duration: '3-7 days',
    warranty: 'Business warranty',
    features: ['Volume Discounts', 'Custom Configuration', 'Dedicated Support', 'Flexible Payment'],
    image: '/services/bulk-order.jpg',
    rating: 4.8,
    reviews: 120,
    available: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const available = searchParams.get('available');
    const sortBy = searchParams.get('sortBy') || 'name';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredServices = [...services];

    // Filter by category
    if (category && category !== 'all') {
      filteredServices = filteredServices.filter(s => s.category === category);
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredServices = filteredServices.filter(s => 
        s.name.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm) ||
        s.features.some(f => f.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by availability
    if (available === 'true') {
      filteredServices = filteredServices.filter(s => s.available);
    }

    // Sort services
    filteredServices.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'newest':
          return b.id - a.id;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    return NextResponse.json({
      services: paginatedServices,
      total: filteredServices.length,
      page,
      limit,
      totalPages: Math.ceil(filteredServices.length / limit),
      categories: [...new Set(services.map(s => s.category))],
    });

  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, customerName, phone, email, address, preferredTime, notes } = body;

    if (!serviceId || !customerName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const service = services.find(s => s.id === parseInt(serviceId));
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const booking = {
      id: Date.now(),
      serviceId: parseInt(serviceId),
      serviceName: service.name,
      customerName,
      phone,
      email: email || '',
      address: address || '',
      preferredTime: preferredTime || '',
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedPrice: service.price
    };

    // In a real app, save to database
    console.log('Service booking created:', booking);

    return NextResponse.json({
      message: 'Service booked successfully',
      booking,
      confirmationId: `SRV${booking.id}`
    });

  } catch (error) {
    console.error('Service booking error:', error);
    return NextResponse.json(
      { error: 'Failed to book service' },
      { status: 500 }
    );
  }
}