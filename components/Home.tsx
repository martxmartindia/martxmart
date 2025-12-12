import { Tractor, Factory, Store, Truck, Building2, Wrench, CheckCircle, Headphones, ShieldCheck, Users, ShoppingCart, Award, Zap, ChevronRight, Loader2, ArrowRight, Star, TrendingUp, Shield, Clock } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image";
import Link from "next/link";

type Slide = {
  id: number;
  imageorVideo: string;
  mobileImageorVideo: string;
  link?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Advertisement = {
  id: string;
  name: string;
  image?: string;
  offer: string;
  offerExpiry: string;
  benefits: string[];
  link: string;
  bgColor: string;
  hoverColor: string;
};

const IndustrySolutions = () => {
  const sectors = [
    {
      name: "Agriculture",
      icon: <Tractor className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      desc: "Farm tools, irrigation kits, solar pumps, and agri-processing units.",
      color: "from-green-50 to-green-100",
      products: "500+",
      growth: "+15%"
    },
    {
      name: "Manufacturing",
      icon: <Factory className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      desc: "SME-friendly machinery setups and automation solutions.",
      color: "from-blue-50 to-blue-100",
      products: "800+",
      growth: "+22%"
    },
    {
      name: "Retail & Commerce",
      icon: <Store className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      desc: "POS machines, weighing scales, and billing software.",
      color: "from-purple-50 to-purple-100",
      products: "300+",
      growth: "+18%"
    },
    {
      name: "Logistics",
      icon: <Truck className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      desc: "Loading equipment, GPS trackers, and delivery systems.",
      color: "from-yellow-50 to-yellow-100",
      products: "400+",
      growth: "+25%"
    },
    {
      name: "Construction",
      icon: <Building2 className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      desc: "Concrete mixers, safety gear, and site planning solutions.",
      color: "from-red-50 to-red-100",
      products: "600+",
      growth: "+12%"
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Industry Leading Solutions
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tailored Solutions for Every Industry
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            Discover specialized equipment and solutions designed to accelerate growth across key industries
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sectors.map((sector, index) => (
            <Card
              key={sector.name}
              className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br ${sector.color} cursor-pointer overflow-hidden`}
            >
              <CardContent className="p-4 sm:p-6 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                <div className="flex items-start space-x-3 sm:space-x-4 relative z-10">
                  <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    {sector.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{sector.name}</h3>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {sector.growth}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">{sector.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{sector.products} Products</span>
                      <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Explore All Industries
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Services Section
const ServicesSection = () => {
  const services = [
    {
      icon: <Wrench className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Installation & Setup",
      desc: "Professional on-site installation and equipment setup services.",
      features: ["Expert technicians", "Same-day service", "Training included"]
    },
    {
      icon: <CheckCircle className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Quality Assurance",
      desc: "Rigorous quality checks and product verification processes.",
      features: ["ISO certified", "100% tested", "Quality guarantee"]
    },
    {
      icon: <Headphones className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      title: "24/7 Support",
      desc: "Round-the-clock customer support for all your queries.",
      features: ["Live chat", "Phone support", "Remote assistance"]
    },
    {
      icon: <ShieldCheck className="text-orange-600 w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Warranty Protection",
      desc: "Comprehensive warranty coverage and service support.",
      features: ["Extended warranty", "Free repairs", "Replacement guarantee"]
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Premium Services
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            End-to-End Business Support
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
            From installation to ongoing support, we're with you every step of your business journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white overflow-hidden"
            >
              <CardContent className="p-4 sm:p-6 relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -translate-y-8 translate-x-8 opacity-50" />
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {service.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="space-y-1">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="w-1 h-1 bg-orange-400 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Need Custom Solutions?</h3>
            <p className="text-gray-600 mb-6">Our experts are ready to design tailored solutions for your specific business needs</p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Custom Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Stats Section
const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  
  const stats = [
    { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, value: 1000, suffix: "+", label: "Happy Customers", color: "from-blue-400 to-blue-600" },
    { icon: <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />, value: 2000, suffix: "+", label: "Products Listed", color: "from-green-400 to-green-600" },
    { icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, value: 300, suffix: "+", label: "Verified Sellers", color: "from-purple-400 to-purple-600" },
    { icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />, value: 99.9, suffix: "%", label: "Uptime", color: "from-yellow-400 to-yellow-600" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = start;
            return newValues;
          });
        }, 16);
      });
    }
  }, [isVisible]);

  return (
    <section id="stats-section" className="py-12 sm:py-16 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
            Join our growing community of successful businesses
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white group">
              <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {stat.suffix === "%" 
                  ? animatedValues[index].toFixed(1) 
                  : Math.floor(animatedValues[index])
                }{stat.suffix}
              </div>
              <div className="text-white/90 font-medium text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            4.9/5 Average Rating
          </div>
        </div>
      </div>
    </section>
  )
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesResponse, adsResponse] = await Promise.all([
          fetch("/api/hero-slides"),
          fetch("/api/advertisements")
        ]);
        
        if (!slidesResponse.ok) {
          throw new Error("Failed to fetch slides");
        }
        
        const slidesData = await slidesResponse.json();
        setSlides(slidesData.slides);
        
        if (adsResponse.ok) {
          const adsData = await adsResponse.json();
          setAds(adsData.advertisements || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const changeSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  useEffect(() => {
    if (!isHovering) {
      const timer = setInterval(() => {
        changeSlide((currentSlide + 1) % slides.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [currentSlide, slides.length, changeSlide, isHovering]);

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  

  return (
    <div className="flex flex-col xl:flex-row">
      {/* Hero Section - Mobile: Full Width, Desktop: 75% Width */}
      <section
        className="relative w-full xl:w-[75%] h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] overflow-hidden bg-gradient-to-br from-gray-100 to-white flex items-center justify-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="region"
        aria-label="Hero Slider"
      >
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
            <div className="relative">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-orange-500" />
              <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 border-2 border-orange-200 rounded-full animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-orange-600 font-medium text-sm sm:text-base mb-1">Loading amazing deals...</p>
              <p className="text-gray-500 text-xs sm:text-sm">Discovering the best offers for you</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 sm:p-8 rounded-2xl text-center max-w-md border border-red-200">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">!</span>
              </div>
              <p className="text-red-600 font-medium text-base sm:text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : slides.length === 0 ? (
          <div className="h-full flex items-center justify-center px-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 sm:p-8 rounded-2xl text-center max-w-md border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-orange-600 font-medium text-base sm:text-lg mb-2">Coming Soon!</p>
              <p className="text-orange-500 text-sm">Exciting offers are on the way</p>
            </div>
          </div>
        ) : (
          <>
            <div
              className="absolute inset-0 flex transition-transform duration-700 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => {
                const SlideContent = () => (
                  <div className="relative w-full h-full overflow-hidden">
                    {isVideo(slide.imageorVideo) ? (
                      <video
                        src={slide.imageorVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="hidden md:block w-full h-full object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
                        aria-label={`Slide ${index + 1} video`}
                      />
                    ) : (
                      <Image
                        src={slide.imageorVideo || "/logo.png"}
                        alt={`Promotional slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="hidden md:block object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
                        quality={90}
                      />
                    )}
                    {isVideo(slide.mobileImageorVideo) ? (
                      <video
                        src={slide.mobileImageorVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="block md:hidden w-full h-full object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
                        aria-label={`Slide ${index + 1} mobile video`}
                      />
                    ) : (
                      <Image
                        src={slide.mobileImageorVideo || "/logo.png"}
                        alt={`Promotional slide ${index + 1} - mobile version`}
                        fill
                        priority={index === 0}
                        className="block md:hidden object-cover transition-transform duration-700 hover:scale-105 will-change-transform"
                        quality={85}
                      />
                    )}
                  </div>
                );

                return (
                  <div 
                    key={index} 
                    className="relative w-full h-full flex-shrink-0"
                    aria-hidden={currentSlide !== index}
                  >
                    {slide.link ? (
                      <Link href={slide.link} className="block w-full h-full cursor-pointer">
                        <SlideContent />
                      </Link>
                    ) : (
                      <SlideContent />
                    )}
                  </div>
                );
              })}
            </div>
            <div 
              className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20"
              role="tablist"
              aria-label="Slide dots"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 sm:w-12 h-1.5 sm:h-2 bg-orange-500"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/75"
                  } rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black`}
                  role="tab"
                  aria-selected={currentSlide === index}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-black/20">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </section>

      {/* Ads Section - Mobile: Hidden, Desktop: 25% Width */}
      <aside className="hidden xl:flex w-full xl:w-[25%] h-auto xl:h-[65vh] bg-gradient-to-b from-gray-50 to-gray-100 flex-col p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Special Offers</h3>
          <p className="text-xs text-gray-600">Limited time deals</p>
        </div>
        
        <div className="space-y-4">
          {ads.map((ad, index) => (
            <div key={ad.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <div className="mb-3">
                {ad.image && (
                  <div className="mb-2">
                    <Image
                      src={ad.image}
                      alt={ad.name}
                      width={200}
                      height={100}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h4 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{ad.name}</h4>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg mb-3">
                  <p className="text-xs text-gray-700 font-medium" dangerouslySetInnerHTML={{ __html: ad.offer }} />
                  <p className="text-xs text-orange-600 mt-1 font-medium">{ad.offerExpiry}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <ul className="text-xs text-gray-600 space-y-1">
                  {ad.benefits.slice(0, 2).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-orange-400 rounded-full flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link 
                href={ad.link} 
                className={`${ad.bgColor} ${ad.hoverColor} text-white font-medium py-2 px-4 rounded-lg block text-center text-xs transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
          <p className="text-xs text-gray-600 mb-2">Need help choosing?</p>
          <Link href="/contact" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
            Contact Our Experts
          </Link>
        </div>
      </aside>

      {/* Mobile Ads Section - Show below slider on mobile */}
      <div className="block xl:hidden bg-gradient-to-br from-gray-50 to-white px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Featured Offers</h2>
          <p className="text-gray-600 text-sm">Don't miss these limited-time deals</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {ads.slice(0, 4).map((ad) => (
            <div key={ad.id} className="bg-white p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group">
              <div className="mb-4">
                {ad.image && (
                  <div className="mb-3">
                    <Image
                      src={ad.image}
                      alt={ad.name}
                      width={300}
                      height={150}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2">{ad.name}</h4>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-gray-700 font-medium" dangerouslySetInnerHTML={{ __html: ad.offer }} />
                  <p className="text-xs text-orange-600 mt-1 font-medium">{ad.offerExpiry}</p>
                </div>
              </div>
              
              <Link 
                href={ad.link} 
                className={`${ad.bgColor} ${ad.hoverColor} text-white font-medium py-2.5 px-4 rounded-lg block text-center text-sm transition-all duration-300 shadow-sm hover:shadow-md group-hover:-translate-y-0.5`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryShowcase = () => {
  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      image: string;
      productCount: number;
      shoppingCount: number;
      featured: boolean;
      description: string;
      subcategories?: Array<{
        id: string;
        name: string;
        productCount: number;
        shoppingCount: number;
        image: string;
      }>;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch main categories with subcategories and product counts
        const response = await fetch("/api/categories?type=MACHINE&includeSubcategories=true&includeProducts=false");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div className="space-y-2">
              <div className="h-6 sm:h-8 w-40 sm:w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-3 sm:h-4 w-32 sm:w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-20 sm:w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="flex-shrink-0 w-36 sm:w-40 h-44 sm:h-48 bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="h-full flex flex-col">
                  <div className="relative flex-1 mb-3 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="text-center space-y-2">
                    <div className="h-3 sm:h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  // Filter to show only main categories (those with subcategories or high product counts)
  const mainCategories = categories.filter(category =>
    (category.subcategories && category.subcategories.length > 0) ||
    category.productCount > 10
  );

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600 text-sm sm:text-base">Discover products tailored to your industry needs</p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors duration-300 self-start sm:self-auto"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {(mainCategories || []).map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex-shrink-0 w-36 sm:w-40 h-44 sm:h-48 relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300 snap-start hover:-translate-y-1"
            >
              <div className="p-3 sm:p-4 h-full flex flex-col">
                <div className="relative flex-1 mb-3 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={category.image || "/logo1.png"}
                    alt={category.name}
                    fill
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  />
                  {category.featured && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {category.subcategories.length} subcategories
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors text-sm mb-1 line-clamp-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                    <ShoppingCart className="w-3 h-3" />
                    {category.productCount + category.shoppingCount} Products
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {mainCategories.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No categories available</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new categories</p>
          </div>
        )}
      </div>
    </section>
  );
};


export { IndustrySolutions, ServicesSection, StatsSection, CategoryShowcase ,HeroSlider}