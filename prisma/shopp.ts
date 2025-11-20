import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/auth';
import { CategoryType, DiscountType } from '@prisma/client';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.category.deleteMany({ where: { type: CategoryType.SHOP } });
  await prisma.shopping.deleteMany({}); // Removed invalid 'type' filter
  await prisma.user.deleteMany({});
  await prisma.slide.deleteMany({ where: { type: CategoryType.SHOP } });
  console.log('✅ Existing data cleared');

  // Create admin user
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@martxmart.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@martxmart.com',
      phone: '9876543210',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Define main categories and subcategories with unique names
  const categories = [
    {
      name: 'Electronics & Mobile Accessories',
      slug: 'electronics-mobile-accessories',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Smartphones & Devices', slug: 'smartphones-devices' },
        { name: 'Mobile Accessories', slug: 'mobile-accessories' },
        { name: 'Audio Devices', slug: 'audio-devices' },
        { name: 'Charging & Power Solutions', slug: 'charging-power-solutions' },
        { name: 'Wearables & Smart Tech', slug: 'wearables-smart-tech' },
        { name: 'Smart Home Devices', slug: 'smart-home-devices' },
        { name: 'Mobile Parts & Repairs', slug: 'mobile-parts-repairs' },
      ],
    },
    {
      name: 'Fashion & Ethnic Wear Store',
      slug: 'fashion-ethnic-wear',
      type: CategoryType.SHOP,
      isFestival: true,
      festivalType: 'Multiple Festivals',
      subcategories: [
        { name: "Women's Clothing", slug: 'womens-clothing' }, // Renamed for clarity
        { name: "Men's Clothing", slug: 'mens-clothing' }, // Renamed for clarity
        { name: 'Kids Fashion Wear', slug: 'kids-fashion-wear' },
        { name: 'Fashion Accessories', slug: 'fashion-accessories' },
        { name: 'Footwear', slug: 'footwear' },
      ],
    },
    {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Skincare Products', slug: 'skincare-products' }, // Renamed for uniqueness
        { name: 'Hair Care Products', slug: 'hair-care-products' }, // Renamed for uniqueness
        { name: 'Makeup & Cosmetics', slug: 'makeup-cosmetics' },
        { name: 'Personal Hygiene Products', slug: 'personal-hygiene-products' }, // Renamed for uniqueness
        { name: 'Fragrances & Deodorants', slug: 'fragrances-deodorants' },
        { name: "Men's Grooming Products", slug: 'mens-grooming-products' }, // Renamed for uniqueness
      ],
    },
    {
      name: 'Home, Kitchen & Décor Store',
      slug: 'home-kitchen-decor',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Cookware & Serveware', slug: 'cookware-serveware' },
        { name: 'Kitchen Tools & Appliances', slug: 'kitchen-tools-appliances' },
        { name: 'Storage & Containers', slug: 'storage-containers' },
        { name: 'Cleaning Essentials', slug: 'cleaning-essentials' },
        { name: 'Home Furnishings', slug: 'home-furnishings' }, // Renamed for clarity
        { name: 'Home Decor Items', slug: 'home-decor-items' }, // Renamed for uniqueness
        { name: 'Household Accessories', slug: 'household-accessories' }, // Renamed for uniqueness
      ],
    },
    {
      name: 'Grocery & Daily Essentials',
      slug: 'grocery-daily-essentials',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Flours, Grains & Pulses', slug: 'flours-grains-pulses' },
        { name: 'Oils & Cooking Essentials', slug: 'oils-cooking-essentials' }, // Renamed for clarity
        { name: 'Spices & Masalas', slug: 'spices-masalas' },
        { name: 'Packaged Foods & Snacks', slug: 'packaged-foods-snacks' }, // Renamed for clarity
        { name: 'Beverages', slug: 'beverages' },
        { name: 'Dairy & Bakery Products', slug: 'dairy-bakery-products' }, // Renamed for clarity
        { name: 'Household Cleaning Needs', slug: 'household-cleaning-needs' }, // Renamed for uniqueness
        { name: 'Personal Daily Products', slug: 'personal-daily-products' }, // Renamed for uniqueness
      ],
    },
    {
      name: 'Baby & Kids Store',
      slug: 'baby-kids-store', // Fixed typo from 'baby-kung'
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Baby Diapers & Hygiene', slug: 'baby-diapers-hygiene' },
        { name: 'Baby Food & Nutrition', slug: 'baby-food-nutrition' },
        { name: 'Baby Skincare & Bath', slug: 'baby-skincare-bath' }, // Renamed for clarity
        { name: 'Baby Clothing', slug: 'baby-clothing' }, // Renamed for clarity
        { name: 'Kids Clothing', slug: 'kids-clothing' },
        { name: 'Baby Gear & Travel', slug: 'baby-gear-travel' },
        { name: 'Infant & Toddler Toys', slug: 'infant-toddler-toys' }, // Renamed for clarity
      ],
    },
    {
      name: 'Books, Stationery & Learning Store',
      slug: 'books-stationery-learning',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'School Books & Guides', slug: 'school-books-guides' },
        { name: 'Competitive Exam Books', slug: 'competitive-exam-books' },
        { name: 'Higher Education Books', slug: 'higher-education-books' }, // Renamed for clarity
        { name: "Children's Books", slug: 'childrens-books' },
        { name: 'Stationery Essentials', slug: 'stationery-essentials' },
        { name: 'Art & Craft Supplies', slug: 'art-craft-supplies' },
        { name: 'Learning Tools', slug: 'learning-tools' }, // Renamed for clarity
      ],
    },
    {
      name: 'Sports & Fitness Store',
      slug: 'sports-fitness',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Cricket Gear', slug: 'cricket-gear' },
        { name: 'Badminton & Indoor Sports', slug: 'badminton-indoor-sports' },
        { name: 'Football & Outdoor Games', slug: 'football-outdoor-games' },
        { name: 'Gym & Fitness Equipment', slug: 'gym-fitness-equipment' }, // Renamed for clarity
        { name: 'Yoga & Wellness Products', slug: 'yoga-wellness-products' }, // Renamed for clarity
        { name: 'Sportswear & Accessories', slug: 'sportswear-accessories' },
        { name: 'Fitness Monitoring Devices', slug: 'fitness-monitoring-devices' },
      ],
    },
    {
      name: 'Festive & Celebration Store',
      slug: 'festive-celebration',
      type: CategoryType.SHOP,
      isFestival: true,
      festivalType: 'Multiple Festivals',
      subcategories: [
        { name: 'Puja Samagri', slug: 'puja-samagri' },
        { name: 'Diyas & Candles', slug: 'diyas-candles' }, // Renamed for clarity
        { name: 'Festive Decor', slug: 'festive-decor' }, // Renamed for uniqueness
        { name: 'Ethnic Gifts & Hampers', slug: 'ethnic-gifts-hampers' },
        { name: 'Festival Essentials', slug: 'festival-essentials' }, // Renamed for clarity
        { name: 'Seasonal Gift Items', slug: 'seasonal-gift-items' }, // Renamed for clarity
      ],
    },
    {
      name: 'Toys & Games Store',
      slug: 'toys-games',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Educational Toys', slug: 'educational-toys' }, // Renamed for clarity
        { name: 'Soft Toys', slug: 'soft-toys' },
        { name: 'Remote-Control Toys', slug: 'remote-control-toys' }, // Renamed for clarity
        { name: 'Board Games', slug: 'board-games' }, // Renamed for clarity
        { name: 'Outdoor Play Equipment', slug: 'outdoor-play-equipment' }, // Renamed for clarity
        { name: 'Pretend Play Toys', slug: 'pretend-play-toys' }, // Renamed for clarity
        { name: 'Construction Toys', slug: 'construction-toys' }, // Renamed for clarity
      ],
    },
    {
      name: 'Pet Care & Accessories Store',
      slug: 'pet-care-accessories',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Pet Food & Nutrition', slug: 'pet-food-nutrition' },
        { name: 'Pet Grooming Products', slug: 'pet-grooming-products' }, // Renamed for clarity
        { name: 'Pet Beds & Furniture', slug: 'pet-beds-furniture' }, // Renamed for clarity
        { name: 'Pet Toys', slug: 'pet-toys' }, // Renamed for clarity
        { name: 'Pet Feeding Supplies', slug: 'pet-feeding-supplies' }, // Renamed for clarity
        { name: 'Pet Travel & Safety', slug: 'pet-travel-safety' },
        { name: 'Pet Hygiene Products', slug: 'pet-hygiene-products' }, // Renamed for clarity
      ],
    },
    {
      name: 'Made in India Store',
      slug: 'made-in-india',
      type: CategoryType.SHOP,
      isFestival: true,
      festivalType: 'Multiple Festivals',
      subcategories: [
        { name: 'ODOP Specials', slug: 'odop-specials' },
        { name: 'Indian Handicrafts', slug: 'indian-handicrafts' }, // Renamed for clarity
        { name: 'Regional Foods', slug: 'regional-foods' }, // Renamed for clarity
        { name: 'Indian Startup Products', slug: 'indian-startup-products' }, // Renamed for clarity
        { name: 'Women-led SHG Products', slug: 'women-led-shg-products' }, // Renamed for clarity
        { name: 'Spiritual & Ethnic Items', slug: 'spiritual-ethnic-items' }, // Renamed for clarity
        { name: 'Eco-Friendly India', slug: 'eco-friendly-india' }, // Renamed for clarity
      ],
    },
    {
      name: 'Automobile & Accessories Store',
      slug: 'automobile-accessories',
      type: CategoryType.SHOP,
      isFestival: false,
      subcategories: [
        { name: 'Two-Wheeler Accessories', slug: 'two-wheeler-accessories' },
        { name: 'Car Interior Accessories', slug: 'car-interior-accessories' }, // Renamed for clarity
        { name: 'Exterior Styling Kits', slug: 'exterior-styling-kits' }, // Renamed for clarity
        { name: 'Performance Upgrades', slug: 'performance-upgrades' }, // Renamed for clarity
        { name: 'Car Cleaning Products', slug: 'car-cleaning-products' }, // Renamed for clarity
        { name: 'Engine Oils & Lubricants', slug: 'engine-oils-lubricants' }, // Renamed for clarity
        { name: 'Vehicle Security Devices', slug: 'vehicle-security-devices' }, // Renamed for clarity
        { name: 'EV Accessories', slug: 'ev-accessories' }, // Renamed for clarity
      ],
    },
  ];

  // Verify unique names and slugs
  const allNames = categories.flatMap(c => [c.name, ...c.subcategories.map(s => s.name)]);
  const allSlugs = categories.flatMap(c => [c.slug, ...c.subcategories.map(s => s.slug)]);
  const duplicateNames = allNames.filter((name, index) => allNames.indexOf(name) !== index);
  const duplicateSlugs = allSlugs.filter((slug, index) => allSlugs.indexOf(slug) !== index);
  if (duplicateNames.length > 0 || duplicateSlugs.length > 0) {
    console.error('❌ Duplicate names:', duplicateNames);
    console.error('❌ Duplicate slugs:', duplicateSlugs);
    throw new Error('Duplicate category names or slugs detected');
  }

  // Create main categories and subcategories
  const createdCategories = [];
  for (const categoryData of categories) {
    try {
    console.log(`Creating main category: ${categoryData.name} (${categoryData.slug})`);
    const mainCategory = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {
        slug: categoryData.slug,
        type: categoryData.type,
        isFestival: categoryData.isFestival,
        ...(categoryData.festivalType && { festivalType: categoryData.festivalType }),
      },
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        type: categoryData.type,
        isFestival: categoryData.isFestival,
        ...(categoryData.festivalType && { festivalType: categoryData.festivalType }),
      },
    });
    createdCategories.push(mainCategory);
    console.log('✅ Main Category created:', mainCategory.name);

    for (const subcategoryData of categoryData.subcategories) {
      console.log(`Creating subcategory: ${subcategoryData.name} (${subcategoryData.slug})`);
      const subcategory = await prisma.category.upsert({
        where: { name: subcategoryData.name },
        update: {
          slug: subcategoryData.slug,
          type: categoryData.type,
          isFestival: categoryData.isFestival,
          ...(categoryData.festivalType && { festivalType: categoryData.festivalType }),
          parentId: mainCategory.id,
        },
        create: {
          name: subcategoryData.name,
          slug: subcategoryData.slug,
          type: categoryData.type,
          isFestival: categoryData.isFestival,
          ...(categoryData.festivalType && { festivalType: categoryData.festivalType }),
          parentId: mainCategory.id,
        },
      });
      createdCategories.push(subcategory);
      console.log('✅ Subcategory created:', subcategory.name);
    }
    } catch (error) {
      console.error(`❌ Error creating category/subcategory:`, error);
    }
  }

  // Create sample products
  const products = [
    {
      name: 'Premium Cotton Kurti Set',
      slug: 'premium-cotton-kurti-set',
      description: 'Beautiful premium cotton kurti set perfect for festivals and special occasions. Made with high-quality cotton fabric that ensures comfort and style.',
      price: 1299,
      originalPrice: 2499,
      stock: 50,
      images: [
        'https://images.pexels.com/photos/8832584/pexels-photo-8832584.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'Ethnic Wear Co.',
      hsnCode: '62046200',
      isFeatured: true,
      isFestival: true,
      festivalType: 'Diwali',
      weight: 0.5,
      dimensions: '30x25x5 cm',
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')?.id, // Updated to match new slug
      discount: 48,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        size: ['S', 'M', 'L', 'XL'],
        color: ['Red', 'Blue', 'Green'],
        material: 'Cotton',
        pattern: 'Printed',
        subcategory: 'Kurtis & Kurtas',
      },
    },
    {
      name: 'Designer Silk Saree',
      slug: 'designer-silk-saree',
      description: 'Elegant designer silk saree with intricate embroidery work. Perfect for weddings and special occasions.',
      price: 3299,
      originalPrice: 5999,
      stock: 25,
      images: [
        'https://images.pexels.com/photos/12211/pexels-photo-12211.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'Royal Silk',
      hsnCode: '50071000',
      isFeatured: true,
      isFestival: true,
      festivalType: 'Wedding',
      weight: 0.8,
      dimensions: '550x110 cm',
      categoryId: createdCategories.find(c => c.slug === 'womens-clothing')?.id, // Updated to match new slug
      discount: 45,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        size: ['Free Size'],
        color: ['Golden', 'Red', 'Maroon'],
        material: 'Silk',
        pattern: 'Embroidered',
        subcategory: 'Sarees',
      },
    },
    {
      name: 'Wireless Bluetooth Earbuds',
      slug: 'wireless-bluetooth-earbuds',
      description: 'High-quality wireless Bluetooth earbuds with noise cancellation and long battery life.',
      price: 2999,
      originalPrice: 4999,
      stock: 100,
      images: [
        'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'TechPro',
      hsnCode: '85183000',
      isFeatured: true,
      isFestival: false,
      weight: 0.1,
      dimensions: '10x8x3 cm',
      categoryId: createdCategories.find(c => c.slug === 'audio-devices')?.id,
      discount: 40,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        color: ['Black', 'White', 'Blue'],
        connectivity: 'Bluetooth 5.0',
        batteryLife: '24 hours',
        waterResistance: 'IPX4',
        subcategory: 'Bluetooth Earphones',
      },
    },
    {
      name: 'Organic Spice Collection',
      slug: 'organic-spice-collection',
      description: 'Premium organic spice collection with authentic Indian spices. Perfect for traditional cooking.',
      price: 649,
      originalPrice: 899,
      stock: 200,
      images: [
        'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'Organic India',
      hsnCode: '09109900',
      isFeatured: false,
      isFestival: false,
      weight: 1.0,
      dimensions: '25x20x15 cm',
      categoryId: createdCategories.find(c => c.slug === 'spices-masalas')?.id,
      discount: 28,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        type: 'Organic',
        packaging: 'Glass Jars',
        shelfLife: '24 months',
        origin: 'India',
        subcategory: 'Whole Spices',
      },
    },
    {
      name: 'Festive Gift Hamper',
      slug: 'festive-gift-hamper',
      description: 'Beautiful festive gift hamper with sweets, dry fruits, and decorative items. Perfect for Diwali gifting.',
      price: 899,
      originalPrice: 1499,
      stock: 75,
      images: [
        'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'Festival Delights',
      hsnCode: '21069099',
      isFeatured: true,
      isFestival: true,
      festivalType: 'Diwali',
      weight: 2.0,
      dimensions: '30x25x20 cm',
      categoryId: createdCategories.find(c => c.slug === 'ethnic-gifts-hampers')?.id,
      discount: 40,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        contents: ['Sweets', 'Dry Fruits', 'Decorative Items'],
        packaging: 'Premium Gift Box',
        occasion: 'Diwali',
        serves: '4-6 people',
        subcategory: 'Ethnic Gifts & Hampers',
      },
    },
    {
      name: 'Baby Diaper Pack (Newborn)',
      slug: 'baby-diaper-pack-newborn',
      description: 'Soft and absorbent newborn diapers with hypoallergenic material for sensitive skin.',
      price: 799,
      originalPrice: 999,
      stock: 150,
      images: [
        'https://images.pexels.com/photos/1619779/pexels-photo-1619779.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'LittleCare',
      hsnCode: '96190010',
      isFeatured: true,
      isFestival: false,
      weight: 1.5,
      dimensions: '40x30x10 cm',
      categoryId: createdCategories.find(c => c.slug === 'baby-diapers-hygiene')?.id,
      discount: 20,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        size: 'Newborn',
        material: 'Hypoallergenic',
        count: '40 pieces',
        subcategory: 'Disposable Diapers',
      },
    },
    {
      name: 'NCERT Class 10 Maths Textbook',
      slug: 'ncert-class-10-maths-textbook',
      description: 'Official NCERT Mathematics textbook for Class 10, CBSE curriculum.',
      price: 299,
      originalPrice: 350,
      stock: 200,
      images: [
        'https://images.pexels.com/photos/159711/books-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'NCERT',
      hsnCode: '49011010',
      isFeatured: true,
      isFestival: false,
      weight: 0.6,
      dimensions: '25x18x2 cm',
      categoryId: createdCategories.find(c => c.slug === 'school-books-guides')?.id,
      discount: 14,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        class: '10',
        board: 'CBSE',
        subject: 'Mathematics',
        language: 'English',
        subcategory: 'CBSE Textbooks',
      },
    },
    {
      name: 'Cricket Bat (Tennis Ball)',
      slug: 'cricket-bat-tennis-ball',
      description: 'Lightweight cricket bat designed for tennis ball cricket, ideal for casual play.',
      price: 799,
      originalPrice: 999,
      stock: 80,
      images: [
        'https://images.pexels.com/photos/1124466/pexels-photo-1124466.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'SportsStar',
      hsnCode: '95069920',
      isFeatured: true,
      isFestival: false,
      weight: 1.2,
      dimensions: '85x10x5 cm',
      categoryId: createdCategories.find(c => c.slug === 'cricket-gear')?.id,
      discount: 20,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        material: 'Poplar Wood',
        size: 'Full Size',
        grip: 'Rubber',
        subcategory: 'Cricket Bats',
      },
    },
    {
      name: 'Remote Control Car',
      slug: 'remote-control-car',
      description: 'High-speed remote control car with rechargeable battery, perfect for kids.',
      price: 1499,
      originalPrice: 1999,
      stock: 60,
      images: [
        'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'FunPlay',
      hsnCode: '95030090',
      isFeatured: true,
      isFestival: false,
      weight: 0.8,
      dimensions: '30x15x10 cm',
      categoryId: createdCategories.find(c => c.slug === 'remote-control-toys')?.id, // Updated to match new slug
      discount: 25,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        age: '6+ years',
        battery: 'Rechargeable',
        range: '50 meters',
        subcategory: 'Remote Control Cars',
      },
    },
    {
      name: 'Dog Food (Adult, Chicken Flavor)',
      slug: 'dog-food-adult-chicken',
      description: 'Nutritious dry dog food for adult dogs, chicken flavor with essential vitamins.',
      price: 999,
      originalPrice: 1299,
      stock: 100,
      images: [
        'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'PetJoy',
      hsnCode: '23091000',
      isFeatured: true,
      isFestival: false,
      weight: 3.0,
      dimensions: '40x25x15 cm',
      categoryId: createdCategories.find(c => c.slug === 'pet-food-nutrition')?.id,
      discount: 23,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        type: 'Dry Food',
        flavor: 'Chicken',
        weight: '3 kg',
        subcategory: 'Dry Dog Food',
      },
    },
    {
      name: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      description: 'Exquisite Banarasi silk saree with intricate zari work, ideal for festivals.',
      price: 4999,
      originalPrice: 7999,
      stock: 30,
      images: [
        'https://images.pexels.com/photos/2781812/pexels-photo-2781812.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'Handloom Heritage',
      hsnCode: '50072090',
      isFeatured: true,
      isFestival: true,
      festivalType: 'Diwali',
      weight: 0.9,
      dimensions: '550x110 cm',
      categoryId: createdCategories.find(c => c.slug === 'odop-specials')?.id,
      discount: 37,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        size: 'Free Size',
        color: ['Red', 'Gold', 'Green'],
        material: 'Silk',
        pattern: 'Zari Work',
        subcategory: 'Banarasi Saree',
      },
    },
    {
      name: 'Full-Face Helmet',
      slug: 'full-face-helmet',
      description: 'ISI-marked full-face helmet for two-wheeler safety with aerodynamic design.',
      price: 1999,
      originalPrice: 2499,
      stock: 70,
      images: [
        'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      brand: 'SafeRide',
      hsnCode: '65061010',
      isFeatured: true,
      isFestival: false,
      weight: 1.4,
      dimensions: '35x25x25 cm',
      categoryId: createdCategories.find(c => c.slug === 'two-wheeler-accessories')?.id,
      discount: 20,
      discountType: DiscountType.PERCENTAGE,
      attributes: {
        size: ['M', 'L', 'XL'],
        color: ['Black', 'Red', 'Blue'],
        certification: 'ISI Marked',
        subcategory: 'Helmets',
      },
    },
  ];

  // Verify unique product slugs
  const productSlugs = products.map(p => p.slug);
  const duplicateProductSlugs = productSlugs.filter((slug, index) => productSlugs.indexOf(slug) !== index);
  if (duplicateProductSlugs.length > 0) {
    console.error('❌ Duplicate product slugs:', duplicateProductSlugs);
    throw new Error('Duplicate product slugs detected');
  }

  for (const productData of products) {
    if (productData.categoryId) {
      const { categoryId, ...productDataWithoutCategoryId } = productData;
      console.log(`Creating product: ${productData.name} (${productData.slug})`);
      const product = await prisma.shopping.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          ...productDataWithoutCategoryId,
          categoryId: categoryId,
          averageRating: Math.random() * 2 + 3, // Random rating between 3-5
          reviewCount: Math.floor(Math.random() * 200) + 10, // Random review count
        },
      });
      console.log('✅ Product created:', product.name);
    } else {
      console.warn(`⚠️ Skipping product ${productData.name}: No valid categoryId`);
    }
  }

  // Create sample slides for homepage
  const slides = [
    {
      type: CategoryType.SHOP,
      imageorVideo: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=1200',
      mobileImageorVideo: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800',
      isActive: true,
    },
    {
      type: CategoryType.SHOP,
      imageorVideo: 'https://images.pexels.com/photos/8832584/pexels-photo-8832584.jpeg?auto=compress&cs=tinysrgb&w=1200',
      mobileImageorVideo: 'https://images.pexels.com/photos/8832584/pexels-photo-8832584.jpeg?auto=compress&cs=tinysrgb&w=800',
      isActive: true,
    },
  ];

  for (const slideData of slides) {
    console.log(`Creating slide: ${slideData.imageorVideo}`);
    await prisma.slide.create({
      data: {
        type: slideData.type,
        imageorVideo: slideData.imageorVideo,
        mobileImageorVideo: slideData.mobileImageorVideo,
        isActive: slideData.isActive,
      },
    });
    console.log('✅ Slide created');
  }
  console.log('✅ Homepage slides created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });