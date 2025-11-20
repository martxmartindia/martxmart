
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
interface CategorySeed {
  name: string;
  type: 'MACHINE' | 'SHOP';
  subcategories?: string[];
}

const categoryData: CategorySeed[] = [
  {
    name: 'Commercial Machinery & Equipment',
    type:"MACHINE",   
    subcategories: [
      'Hotel Equipment',
      'Restaurant Equipment',
      'Laundry Machines',
      'Kitchen Appliances',
      'Cleaning Equipment',
      'Refrigeration Units',
      'Bakery Machinery',
      'Beverage Machines',
      'Ice Makers',
      'Food Warmers',
      'Coffee Machines',
      'Disinfection Equipment',
      'Vending Machines',
      'Catering Equipment',
      'Cold Storage Units',
    ],
  },
  {
    name: 'Industrial Machinery & Tools',
    type:"MACHINE",
    subcategories: [
      'CNC Machines',
      'Welding Equipment',
      'Cutting Machines',
      'Drilling Machines',
      'Grinding Machines',
      'Hydraulic Presses',
      'Pneumatic Tools',
      'Air Compressors',
      'Industrial Ovens',
      'Lathes & Milling Machines',
      'Press Machines',
      'Assembly Line Equipment',
      'Material Handling Equipment',
      'Industrial Robots',
      'Tooling & Accessories',
    ],
  },
  {
    name: 'Medical & Surgical Equipment',
        type:"MACHINE",

    subcategories: [
      'Diagnostic Devices',
      'Surgical Instruments',
      'Hospital Furniture',
      'ICU Equipment',
      'Patient Monitoring Systems',
      'Sterilizers & Autoclaves',
      'Imaging Equipment',
      'Mobility Aids',
      'Respiratory Devices',
      'Laboratory Equipment',
      'Dental Equipment',
      'Orthopedic Devices',
      'Physiotherapy Machines',
      'Emergency Medical Equipment',
      'Medical Consumables',
    ],
  },
  {
    name: 'Agricultural Machinery & Tools',
        type:"MACHINE",

    subcategories: [
      'Tractors',
      'Harvesters',
      'Seeders & Planters',
      'Sprayers',
      'Irrigation Systems',
      'Cultivators',
      'Threshers',
      'Milking Machines',
      'Soil Preparation Tools',
      'Post-Harvest Equipment',
      'Crop Protection Equipment',
      'Fertilizer Spreaders',
      'Agro Processing Machinery',
      'Agricultural Pumps',
      'Greenhouse Equipment',
    ],
  },
  {
    name: 'Construction & Civil Machinery',
        type:"MACHINE",

    subcategories: [
      'Concrete Mixers',
      'Road Rollers',
      'Earthmoving Equipment',
      'Cranes & Hoists',
      'Scaffolding',
      'Rebar Cutters & Benders',
      'Drilling Machines',
      'Compactors',
      'Asphalt Pavers',
      'Jackhammers',
      'Surveying Instruments',
      'Concrete Pumps',
      'Tile & Brick Cutting Machines',
      'Construction Safety Equipment',
      'Welding & Cutting Tools',
    ],
  },
  {
    name: 'Food Processing Machinery',
        type:"MACHINE",

    subcategories: [
      'Grain Milling Machines',
      'Oil Expellers',
      'Pulverizers',
      'Dehydrators',
      'Packaging Machines',
      'Bakery Machines',
      'Dairy Processing Machines',
      'Meat Processing Machines',
      'Juicers & Extractors',
      'Spice Processing Equipment',
      'Chocolate & Confectionery Machines',
      'Freezing & Cooling Equipment',
      'Fruit & Vegetable Processing Machines',
      'Snack Food Machinery',
      'Bottling & Filling Machines',
    ],
  },
  {
    name: 'Textile & Garment Machinery',
        type:"MACHINE",

    subcategories: [
      'Sewing Machines',
      'Embroidery Machines',
      'Knitting Machines',
      'Dyeing Machines',
      'Printing Machines',
      'Cutting Machines',
      'Steam Boilers',
      'Ironing & Pressing Machines',
      'Weaving Machines',
      'Textile Testing Equipment',
      'Fabric Inspection Machines',
      'Yarn Processing Machines',
      'Fabric Spreading Machines',
      'Sewing Accessories',
      'Pattern Making Machines',
    ],
  },
  {
    name: 'Packaging & Printing Machinery',  
      type:"MACHINE",

    subcategories: [
      'Blister Packaging Machines',
      'Label Printing Machines',
      'Flexographic Printers',
      'Carton Sealing Machines',
      'Shrink Wrapping Machines',
      'Bag Making Machines',
      'Pouch Making Machines',
      'Inkjet Printers',
      'Lamination Machines',
      'Heat Sealers',
      'Paper Cutting Machines',
      'Folding Machines',
      'Pallet Wrappers',
      'Tape Dispensers',
      'Coding & Marking Machines',
    ],
  },
  {
    name: 'Laboratory & Scientific Equipment',
        type:"MACHINE",

    subcategories: [
      'Microscopes',
      'Centrifuges',
      'Incubators',
      'PH Meters',
      'Spectrophotometers',
      'Autoclaves',
      'Water Baths',
      'Analytical Balances',
      'Test Chambers',
      'Laboratory Glassware',
      'Fume Hoods',
      'Chromatography Equipment',
      'Thermal Cyclers',
      'Particle Counters',
      'Safety Cabinets',
    ],
  },
  {
    name: 'Automotive Workshop & Garage Equipment',
        type:"MACHINE",

    subcategories: [
      'Hydraulic Lifts',
      'Wheel Alignment Machines',
      'Tyre Changers',
      'Engine Diagnostic Tools',
      'Battery Chargers',
      'Air Compressors',
      'Spray Painting Equipment',
      'Car Wash Machines',
      'Diagnostic Scanners',
      'Dent Repair Kits',
      'Engine Hoists',
      'Fuel Injection Testers',
      'Brake Testing Equipment',
      'Exhaust Gas Analyzers',
      'Workshop Tools',
    ],
  },
  {
    name: 'Renewable Energy Equipment',
        type:"MACHINE",

    subcategories: [
      'Solar Panels',
      'Solar Water Pumps',
      'Wind Turbines',
      'Biogas Plants',
      'Solar Batteries',
      'Solar Inverters',
      'Solar Street Lights',
      'Hybrid Energy Systems',
      'Energy Storage Systems',
      'Solar Chargers',
      'LED Solar Lights',
      'Solar Water Heaters',
      'Off-Grid Systems',
      'Solar Power Controllers',
      'Wind Generators',
    ],
  },
  {
    name: 'Waste Management & Recycling Machinery',
        type:"MACHINE",

    subcategories: [
      'Composting Machines',
      'Plastic Shredders',
      'E-Waste Recycling Machines',
      'Incinerators',
      'Waste Segregation Equipment',
      'Paper Recycling Machines',
      'Metal Recycling Machines',
      'Glass Recycling Machines',
      'Bio-Medical Waste Disposal',
      'Waste Balers',
      'Waste Compacting Machines',
      'Waste Sorting Systems',
      'Oil Recycling Machines',
      'Hazardous Waste Equipment',
      'Recyclable Material Conveyors',
    ],
  },
  {
    name: 'Water & Wastewater Treatment Equipment',
        type:"MACHINE",

    subcategories: [
      'Reverse Osmosis Plants',
      'UV Purifiers',
      'Effluent Treatment Plants',
      'Sewage Treatment Plants',
      'Water Softeners',
      'Industrial Filters',
      'Chemical Dosing Systems',
      'Aeration Systems',
      'Desalination Units',
      'Filtration Media',
      'Sludge Treatment Equipment',
      'Water Quality Testing Instruments',
      'Pumping Systems',
      'Filtration Units',
      'Chlorination Systems',
    ],
  },
  {
    name: 'Mining & Drilling Machinery',
        type:"MACHINE",

    subcategories: [
      'Drilling Rigs',
      'Stone Crushers',
      'Jack Hammers',
      'Screening Equipment',
      'Mining Conveyors',
      'Explosive Equipment',
      'Earthmoving Machines',
      'Rock Breakers',
      'Loaders & Dumpers',
      'Excavators',
      'Mineral Processing Equipment',
      'Blasting Equipment',
      'Underground Mining Equipment',
      'Core Drilling Machines',
      'Tunnel Boring Machines',
    ],
  },
  {
    name: 'Office & Institutional Equipment',
        type:"MACHINE",

    subcategories: [
      'Currency Counting Machines',
      'Biometric Attendance Systems',
      'Binding Machines',
      'Laminators',
      'Projectors',
      'Interactive Boards',
      'Digital Signage',
      'Token Display Systems',
      'Audio Systems',
      'Time Clocks',
      'Shredders',
      'Fax Machines',
      'Telephone Systems',
      'Photocopiers',
      'Conference Room Equipment',
    ],
  },
  {
    name: 'Cold Chain Equipment',
        type:"MACHINE",

    subcategories: [
      'Deep Freezers',
      'Cold Rooms',
      'Vaccine Carriers',
      'Ice Lined Refrigerators',
      'Refrigerated Trucks',
      'Cooling Cabinets',
      'Blast Freezers',
      'Temperature Monitoring Devices',
      'Refrigeration Compressors',
      'Cold Storage Doors',
      'Walk-In Freezers',
      'Portable Cold Storage',
      'Cold Storage Insulation Materials',
      'Ice Machines',
      'Cryogenic Storage',
    ],
  },
  {
    name: 'Fire Safety & Disaster Management Equipment',
        type:"MACHINE",

    subcategories: [
      'Fire Extinguishers',
      'Fire Hydrants',
      'Smoke Detectors',
      'Fire Alarms',
      'Fire Blankets',
      'Emergency Lighting',
      'Rescue Tools',
      'Fire Hose Reels',
      'Sprinkler Systems',
      'First Aid Kits',
      'Fire Safety Signage',
      'Fire Doors',
      'Fire Pumps',
      'Gas Detection Systems',
      'Emergency Evacuation Equipment',
    ],
  },
  {
    name: 'Educational & Training Equipment',
        type:"MACHINE",

    subcategories: [
      'Science Lab Kits',
      'Robotic Kits',
      'Teaching Simulators',
      'Smart Boards',
      'Projectors',
      'Educational Software',
      'Language Labs',
      'VR Training Equipment',
      'Measuring Instruments',
      'Demonstration Models',
      'Whiteboards',
      'Training Furniture',
      'Art & Craft Supplies',
      'Audio Visual Equipment',
      'Interactive Learning Devices',
    ],
  },
  {
    name: 'Beauty & Salon Machinery',
        type:"MACHINE",

    subcategories: [
      'Facial Machines',
      'Hair Steamers',
      'Laser Hair Removal Machines',
      'Salon Chairs',
      'Manicure & Pedicure Equipment',
      'Wax Heaters',
      'Makeup Stations',
      'Massage Beds',
      'Hair Dryers',
      'Skin Care Devices',
      'Hair Clippers',
      'Hair Curlers',
      'Nail Drills',
      'UV Sterilizers',
      'Steamers',
    ],
  },
  {
    name: 'Home & Small Business Machines',
        type:"MACHINE",

    subcategories: [
      'Small CNC Machines',
      '3D Printers',
      'Desktop Milling Machines',
      'Small Injection Molding Machines',
      'Laser Engraving Machines',
      'Packaging Machines (Small Scale)',
      'Label Printers',
      'Barcode Scanners',
      'Heat Press Machines',
      'Sewing Machines (Home Use)',
      'Desktop Lathes',
      'Mini Drilling Machines',
      'Small Grinding Machines',
      'Desktop Cutters',
      'Home Workshop Tools',
    ],
  },
  {
    name: 'Pharmaceutical Manufacturing Machinery',
        type:"MACHINE",

    subcategories: [
      'Tablet Press Machines',
      'Capsule Filling Machines',
      'Granulators',
      'Coating Machines',
      'Blenders & Mixers',
      'Packing Machines',
      'Liquid Filling Machines',
      'Sterilizers',
      'Dryers',
      'Labeling Machines',
      'Ointment Filling Machines',
      'Powder Filling Machines',
      'Blister Packing Machines',
      'Pharmaceutical Testing Equipment',
      'Capsule Polishing Machines',
    ],
  },
  {
    name: 'Plastic & Rubber Processing Machinery',
        type:"MACHINE",

    subcategories: [
      'Injection Molding Machines',
      'Extruders',
      'Blow Molding Machines',
      'Rubber Molding Machines',
      'Plastic Recycling Machines',
      'Calenders',
      'Thermoforming Machines',
      'Granulators',
      'Welding Machines',
      'Cutting Machines',
      'Plastic Testing Equipment',
      'Plastic Welding Machines',
      'Pelletizers',
      'Plastic Molding Dies',
      'Rubber Mixing Mills',
    ],
  },
  {
    name: 'Woodworking & Carpentry Machinery',
        type:"MACHINE",

    subcategories: [
      'Table Saws',
      'Planers',
      'Jointers',
      'Wood Routers',
      'Edgebanders',
      'Sanding Machines',
      'CNC Woodworking Machines',
      'Thicknessers',
      'Mortisers',
      'Wood Dryers',
      'Woodworking Lathes',
      'Shapers',
      'Wood Carving Machines',
      'Wood Polishing Machines',
      'Dust Collectors',
    ],
  },
  {
    name: 'Metalworking Machinery',
        type:"MACHINE",

    subcategories: [
      'CNC Milling Machines',
      'Metal Lathes',
      'Grinding Machines',
      'Drilling Machines',
      'Press Brakes',
      'Metal Shears',
      'Plasma Cutters',
      'Welding Machines',
      'Surface Grinders',
      'Bending Machines',
      'Laser Cutting Machines',
      'Punching Machines',
      'Metal Forming Machines',
      'Metal Testing Equipment',
      'Metal Rolling Machines',
    ],
  },
  {
    name: 'HVAC & Refrigeration Equipment',
        type:"MACHINE",

    subcategories: [
      'Air Conditioning Units',
      'Industrial Chillers',
      'Cooling Towers',
      'Ventilation Fans',
      'Heat Exchangers',
      'Air Handling Units',
      'Dehumidifiers',
      'Ducting Systems',
      'Refrigeration Compressors',
      'Thermostats',
      'Ventilation Ducts',
      'Split AC Units',
      'HVAC Controls',
      'HVAC Filters',
      'Evaporative Coolers',
    ],
  },
];

async function seedCategories() {
  try {

    // Seed parent categories first
    for (const parent of categoryData) {
      const parentSlug = slugify(parent.name, { lower: true, strict: true });
      
      // Check if parent category already exists
      const existingParent = await prisma.category.findUnique({
        where: { slug: parentSlug },
      });

      let parentCategory;
      if (!existingParent) {
        parentCategory = await prisma.category.create({
          data: {
            name: parent.name,
            slug: parentSlug,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } else {
        parentCategory = existingParent;
      }

      // delete previous category
      

      // Seed subcategories
      if (parent.subcategories) {
        for (const subName of parent.subcategories) {
          const subSlug = slugify(subName, { lower: true, strict: true });
          
          // Check if subcategory already exists
          const existingSub = await prisma.category.findUnique({
            where: { slug: subSlug },
          });

          if (!existingSub) {
            await prisma.category.create({
              data: {
                name: subName,
                slug: subSlug,
                parentId: parentCategory.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          } else {
            // Update existing subcategory with parentId
            await prisma.category.update({
              where: { id: existingSub.id },
              data: { parentId: parentCategory.id },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await seedCategories();
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });