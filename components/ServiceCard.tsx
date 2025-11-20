import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  shortName: string;
  slug: string;
  description: string;
  priceAmount: number;
  category: string;
  imageUrl?: string;
  processingTime: string;
  governmentFee: string;
}

interface ServiceCardProps {
  service: Service;
  isFavorite: boolean;
  onToggleFavorite: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isFavorite, onToggleFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 rounded-xl">
        <div className="relative h-48 w-full">
          <Image
            src={service.imageUrl || "/placeholder.svg?height=200&width=400"}
            alt={service.title}
            fill
            className="object-cover rounded-t-xl"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(service.id)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="bg-white/90 hover:bg-white"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
                )}
              />
            </Button>
          </div>
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg sm:text-xl line-clamp-2">{service.title}</h3>
              <Badge variant="outline" className="w-fit text-orange-600 border-orange-600 mt-2">
                {service.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
            {service.description}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>
                Processing: {service?.processingTime
                  ? service.processingTime.match(/\d+-\d+\s+(working days|months|days for initial setup)/i)?.[0] || 
                    service.processingTime.match(/\d+-\d+\s+months/i)?.[0] || "N/A"
                  : "N/A (Data not available)"}
              </span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
              <span>Govt. Fee: {service.governmentFee}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="font-bold text-lg text-orange-600">
            ₹{service.priceAmount.toLocaleString()}
          </div>
          <Link href={`/services/${service.slug}`}>
            <Button className="bg-orange-600 hover:bg-orange-700 rounded-xl">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;