import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // CSV template with all available fields
    const csvTemplate = `name,description,price,categoryId,stock,brand,modelNumber,dimensions,weight,warranty,featured,images,videoUrl,productType,hsnCode,gstPercentage,capacity,powerConsumption,material,automation,certifications,discount,discountType,shippingCharges,minimumOrderQuantity,deliveryTime,warrantyDetails,returnPolicy,afterSalesService,industryType,applications,accessories,installationRequired,documentationLinks,manufacturer,madeIn,specifications
"Sample CNC Machine","High precision CNC lathe machine for industrial use",150000,"category-id-here",5,"HAAS","VF-2","200x100x150 cm",2500,"2 Years",true,"https://example.com/image1.jpg|https://example.com/image2.jpg","https://youtube.com/watch?v=example","Mechanical Machinery","8459","18","1000 kg/h","5 kW","Stainless Steel","Fully Automatic","ISO 9001|CE","10","PERCENTAGE",5000,1,"7-10 business days","2 years manufacturer warranty with on-site support","30 days return policy","24/7 technical support","Manufacturing|Automotive","Industrial Production|Precision Machining","Tool Kit|Manual|Safety Equipment",true,"https://example.com/manual.pdf|https://example.com/specs.pdf","HAAS Automation","USA","High-speed spindle with automatic tool changer"`;

    return new NextResponse(csvTemplate, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="product-import-template.csv"',
      },
    });

  } catch (error) {
    console.error('Template error:', error);
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
  }
}