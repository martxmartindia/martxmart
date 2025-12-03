import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const csvText = await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must have header and at least one data row' }, { status: 400 });
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const record: any = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      return record;
    });

    const results = {
      total: records.length,
      imported: 0,
      failed: 0,
      errors: [] as any[],
      success: false,
    };

    // Get all categories for validation
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    const categoryIds = new Set(categories.map(c => c.id));

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 2; // +2 because CSV is 1-indexed and has header

      try {
        // Validate required fields
        if (!record.name || !record.description || !record.price || !record.categoryId) {
          results.errors.push({
            row: rowNumber,
            message: 'Missing required fields: name, description, price, categoryId'
          });
          results.failed++;
          continue;
        }

        // Validate category exists
        if (!categoryIds.has(record.categoryId)) {
          results.errors.push({
            row: rowNumber,
            message: `Invalid categoryId: ${record.categoryId}`
          });
          results.failed++;
          continue;
        }

        // Validate price is numeric
        const price = parseFloat(record.price);
        if (isNaN(price) || price <= 0) {
          results.errors.push({
            row: rowNumber,
            message: 'Price must be a positive number'
          });
          results.failed++;
          continue;
        }

        // Generate slug
        const slug = record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
          where: { slug }
        });
        
        let finalSlug = slug;
        if (existingProduct) {
          finalSlug = `${slug}-${Date.now()}`;
        }

        // Create product
        await prisma.product.create({
          data: {
            name: record.name,
            slug: finalSlug,
            description: record.description,
            price: price,
            originalPrice: price * 1.1, // 10% markup
            stock: record.stock ? parseInt(record.stock) : 0,
            categoryId: record.categoryId,
            brand: record.brand || null,
            modelNumber: record.modelNumber || null,
            dimensions: record.dimensions || null,
            weight: record.weight ? parseFloat(record.weight) : null,
            warranty: record.warranty || null,
            featured: record.featured === 'true' || record.featured === '1',
            images: record.images ? record.images.split('|').map((img: string) => img.trim()) : [],
            videoUrl: record.videoUrl || null,
            productType: record.productType || null,
            hsnCode: record.hsnCode || '8471',
            gstPercentage: record.gstPercentage ? parseFloat(record.gstPercentage) : null,
            capacity: record.capacity || null,
            powerConsumption: record.powerConsumption || null,
            material: record.material || null,
            automation: record.automation || null,
            certifications: record.certifications ? record.certifications.split('|').map((cert: string) => cert.trim()) : [],
            discount: record.discount ? parseFloat(record.discount) : null,
            discountType: record.discountType || null,
            shippingCharges: record.shippingCharges ? parseFloat(record.shippingCharges) : null,
            minimumOrderQuantity: record.minimumOrderQuantity ? parseInt(record.minimumOrderQuantity) : null,
            deliveryTime: record.deliveryTime || null,
            warrantyDetails: record.warrantyDetails || null,
            returnPolicy: record.returnPolicy || null,
            afterSalesService: record.afterSalesService || null,
            industryType: record.industryType ? record.industryType.split('|').map((type: string) => type.trim()) : [],
            applications: record.applications ? record.applications.split('|').map((app: string) => app.trim()) : [],
            accessories: record.accessories ? record.accessories.split('|').map((acc: string) => acc.trim()) : [],
            installationRequired: record.installationRequired === 'true' || record.installationRequired === '1',
            documentationLinks: record.documentationLinks ? record.documentationLinks.split('|').map((link: string) => link.trim()) : [],
            manufacturer: record.manufacturer || null,
            madeIn: record.madeIn || null,
            specifications: record.specifications || null,
          }
        });

        results.imported++;
      } catch (error: any) {
        results.errors.push({
          row: rowNumber,
          message: error.message || 'Unknown error occurred'
        });
        results.failed++;
      }
    }

    results.success = results.imported > 0;

    return NextResponse.json(results);

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import products' }, { status: 500 });
  }
}