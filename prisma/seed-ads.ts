import { prisma } from "@/lib/prisma";

async function seedAdvertisements() {
  try {
    // Create sample advertisements
    const advertisements = [
      {
        id: 'ad1',
        name: 'Sponza Influencer Marketing Platform',
        image: '/images/ads/sponza-ad.jpg',
        offer: '30% off your first campaign with code <span class="font-bold">SPONZA30</span>',
        offerExpiry: 'Valid until July 31, 2025',
        benefits: ['AI-driven influencer matching', 'Real-time campaign analytics', 'Seamless creator payments'],
        link: 'https://www.sponza.in',
        bgColor: 'bg-orange-500',
        hoverColor: 'hover:bg-orange-600',
        priority: 10,
      },
      {
        id: 'ad2',
        name: 'Prachar Prashar Digital Marketing Agency',
        image: '/images/ads/prachar-ad.jpg',
        offer: '15% off your first digital campaign with code <span class="font-bold">PRACHAR15</span>',
        offerExpiry: 'Valid until August 15, 2025',
        benefits: ['Tailored marketing plans', 'Data-driven results', '24/7 support'],
        link: 'https://www.pracharprashar.in',
        bgColor: 'bg-blue-500',
        hoverColor: 'hover:bg-blue-600',
        priority: 8,
      },
      {
        id: 'ad3',
        name: 'GrowEasy Marketing Solutions',
        image: '/images/ads/groweasy-ad.jpg',
        offer: 'Free consultation with code <span class="font-bold">GROWEASYFREE</span>',
        offerExpiry: 'Valid until July 25, 2025',
        benefits: ['Cost-effective campaigns', 'Expert guidance', 'Scalable solutions'],
        link: '/contact',
        bgColor: 'bg-green-500',
        hoverColor: 'hover:bg-green-600',
        priority: 6,
      },
      {
        id: 'ad4',
        name: 'TrendSet Media',
        image: '/images/ads/trendset-ad.jpg',
        offer: '20% off creative services with code <span class="font-bold">TREND20</span>',
        offerExpiry: 'Valid until August 1, 2025',
        benefits: ['Innovative designs', 'Targeted outreach', 'Proven ROI'],
        link: '/services',
        bgColor: 'bg-purple-500',
        hoverColor: 'hover:bg-purple-600',
        priority: 4,
      },
    ];

    for (const ad of advertisements) {
      await prisma.advertisement.upsert({
        where: { id: ad.id },
        update: ad,
        create: ad,
      });
    }

    console.log('✅ Advertisements seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding advertisements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdvertisements();