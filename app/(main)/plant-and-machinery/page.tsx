import Image from 'next/image';
import Link from 'next/link';

export default function PlantMachineryPage() {
  const projectTypes = [
    { 
      name: 'Food Processing Projects',  
      slug: 'food-processing', 
      image: '/images/food-processing.jpg',
      description: 'Explore food processing equipment and machinery for various industries'
    },
    { 
      name: 'Manufacturing Sector Projects', 
      slug: 'manufacturing', 
      image: '/images/manufacturing.jpg',
      description: 'Complete manufacturing unit setup solutions and machinery'
    },
    { 
      name: 'Service Sector Projects', 
      slug: 'service-sector', 
      image: '/images/service-sector.jpg',
      description: 'Service sector equipment and infrastructure solutions'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plant & Machinery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of industrial solutions for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectTypes.map((type, index) => (
            <div
              key={type.slug}
              className={`animate-slide-up opacity-0`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <Link
                href={`/plant-categories/${type.slug}`}
                className="group block h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative overflow-hidden pt-[56.25%]">
                  <Image
                    src={type.image} 
                    alt={type.name} 
                    height={400}
                    width={600}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {type.name}
                  </h2>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}