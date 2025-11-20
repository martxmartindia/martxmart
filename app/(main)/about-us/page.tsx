"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle,
  Clock,
  Globe,
  Users,
  Lightbulb,
  BarChart,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AboutUsPage() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const milestones = [
    {
      year: "2024",
      title: "Founded in Purnia, Bihar",
      description:
        "A bold vision took shape — to digitize and simplify industrial trade across India.",
    },
    {
      year: "2024",
      title: "Launched Beta Version",
      description:
        "Seamlessly connected local suppliers with verified buyers nationwide.",
    },
    {
      year: "2024",
      title: "100+ Successful Transactions",
      description: "Early validation of trust, utility, and market potential.",
    },
    {
      year: "2025",
      title: "1,000+ Verified Suppliers",
      description: "Rapid growth with a strong network of reliable partners.",
    },
    {
      year: "2025",
      title: "AI-Powered Recommendations",
      description:
        "Smarter discovery. Faster decisions. Personalized machinery solutions.",
    },
  ];

  const stats = [
    {
      value: "1K+",
      label: "Verified Suppliers",
      icon: <Building className="h-8 w-8 text-orange-600" />,
    },
    {
      value: "2K+",
      label: "Industrial Products",
      icon: <Globe className="h-8 w-8 text-orange-600" />,
    },
    {
      value: "3K+",
      label: "Monthly Transactions",
      icon: <Clock className="h-8 w-8 text-orange-600" />,
    },
    {
      value: "98%",
      label: "Customer Satisfaction",
      icon: <Award className="h-8 w-8 text-orange-600" />,
    },
  ];

  const team = [
    {
      name: "Vinod Kumar",
      position: "Founder & Director",
      image: "/team/founder.png",
      bio: "Leads the company's vision and strategy with a strong focus on building a trusted digital ecosystem.",
    },
    {
      name: "Rahul Kumar",
      position: "Co-Founder & Director",
      image: "/team/rahul.jpg",
      bio: "Drives operations and growth initiatives, ensuring efficiency and a seamless customer experience.",
    },
    {
      name: "Aadesh Kumar",
      position: "Chief Technology Officer (CTO)",
      image: "/team/ctofounder.jpg",
      bio: "Heads product and technology, delivering a secure, scalable, and user-centric platform.",
    },
    {
      name: "Sawan Kumar",
      position: "Chief Operating Officer (COO)",
      image: "/team/cto.jpg",
      bio: "Manages end-to-end operations to ensure reliability, speed, and service excellence.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-12 sm:py-16 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/about.jpg"
              alt="Industrial machinery"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                  About martXmart
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-10 leading-relaxed max-w-4xl mx-auto"
              >
                Empowering the Future of Industrial Growth Through Seamless Digital Innovation.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full sm:w-auto text-white border-2 border-white/30 hover:bg-white/10 hover:border-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    Start Selling Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-12 sm:py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
                    Our Mission
                  </h2>
                  <div className="w-12 sm:w-16 h-1 bg-orange-600 rounded-full mb-4 sm:mb-6"></div>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                    We aim to revolutionize industrial trade by offering a secure, transparent, and tech-enabled ecosystem — where every transaction builds trust, growth, and long-term value.
                  </p>
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">
                  What Drives Us
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      icon: Shield,
                      title: "Trust-Centric Platform",
                      desc: "Every listing is verified. Every deal is transparent. Reliability is at the core of our marketplace."
                    },
                    {
                      icon: CheckCircle,
                      title: "Secure, Seamless Transactions",
                      desc: "We ensure risk-free buying with pre-approved sellers and intelligent safety protocols."
                    },
                    {
                      icon: Users,
                      title: "Meaningful Partnerships",
                      desc: "We believe in business relationships built on mutual respect, accountability, and consistency."
                    },
                    {
                      icon: Lightbulb,
                      title: "Smart Technology, Smarter Buying",
                      desc: "AI-driven search, data insights, and digital tools simplify your procurement journey."
                    },
                    {
                      icon: TrendingUp,
                      title: "Confidence Through Empowerment",
                      desc: "We empower every business—big or small—to grow independently, with full confidence and clarity."
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start group hover:bg-gray-50 p-2 sm:p-3 rounded-lg transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 mr-3 sm:mr-4">
                        <div className="bg-orange-100 group-hover:bg-orange-200 rounded-full p-2 transition-colors duration-300">
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                          {item.title}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2 relative"
              >
                <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <Image
                    src="/mission.png"
                    alt="Industrial machinery marketplace"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-orange-600 text-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg">
                  <Star className="h-5 w-5 sm:h-8 sm:w-8" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 lg:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Trusted by thousands of businesses across India
              </p>
            </motion.div>
            
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-white group">
                    <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 text-center">
                      <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                        {stat.value}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base font-medium">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 lg:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <div className="w-16 h-1 bg-orange-600 rounded-full mx-auto mb-6"></div>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From a startup to India's leading industrial machinery marketplace, driven by innovation and excellence.
              </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600 rounded-full"></div>
              <div className="sm:hidden absolute left-8 h-full w-1 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600 rounded-full"></div>

              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center mb-8 sm:mb-12 ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-8 sm:left-1/2 transform sm:-translate-x-1/2 z-10">
                    <motion.div
                      className="bg-orange-600 rounded-full h-4 w-4 sm:h-6 sm:w-6 border-4 border-white shadow-lg"
                      whileHover={{ scale: 1.3 }}
                      transition={{ duration: 0.2 }}
                    ></motion.div>
                  </div>

                  <div className={`w-full sm:w-5/12 ml-16 sm:ml-0 ${
                    index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"
                  }`}>
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300"
                    >
                      <div className="flex items-center mb-3">
                        <span className="bg-orange-100 text-orange-600 font-bold text-sm sm:text-base px-3 py-1 rounded-full">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-orange-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.1),transparent_50%)] pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12 lg:mb-20"
            >
              <div className="inline-flex items-center justify-center p-2 bg-orange-100 rounded-full mb-6">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Meet Our <span className="text-orange-600">Leadership</span>
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-8"></div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                The visionary minds behind <span className="font-semibold text-orange-600">martXmart</span>, driving innovation and excellence in industrial commerce.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
                {team.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.7, 
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="group relative"
                  >
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                      {/* Image Container */}
                      <div className="relative h-80 sm:h-96 overflow-hidden">
                        <Image
                          src={member.image || "/logo.png"}
                          alt={`${member.name}, ${member.position}`}
                          fill
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                        
                        {/* Floating Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <Star className="h-4 w-4 text-orange-500" />
                        </div>
                        
                        {/* Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl sm:text-2xl font-bold mb-1">
                            {member.name}
                          </h3>
                          <p className="text-orange-200 font-medium text-sm sm:text-base">
                            {member.position}
                          </p>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 sm:p-8">
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-4">
                          {member.bio}
                        </p>
                        
                        {/* Action Button */}
                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center text-orange-600 font-semibold text-sm cursor-pointer hover:text-orange-700 transition-colors">
                            <span>Learn More</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-orange-300 to-orange-500 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-lg"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 sm:py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
                    Our Core Values
                  </h2>
                  <div className="w-12 sm:w-16 h-1 bg-orange-600 rounded-full mb-4 sm:mb-6"></div>
                </div>
                
                <div className="grid gap-3 sm:gap-4">
                  {[
                    {
                      title: "Integrity & Transparency",
                      icon: Shield,
                      desc: "We build trust through honest practices, verified sellers, and clear, reliable listings.",
                    },
                    {
                      title: "Customer First",
                      icon: Users,
                      desc: "Our platform is designed around the evolving needs of buyers and sellers — with fast support and smooth experiences.",
                    },
                    {
                      title: "Innovation-Led Growth",
                      icon: Lightbulb,
                      desc: "We invest in smart technology to simplify trade, boost performance, and unlock new opportunities.",
                    },
                    {
                      title: "Global Reach",
                      icon: Globe,
                      desc: "We connect businesses across regions, enabling seamless trade at both national and international levels.",
                    },
                    {
                      title: "Operational Excellence",
                      icon: Award,
                      desc: "From listing to delivery, we focus on speed, quality, and accuracy in every process.",
                    },
                    {
                      title: "Empowering Businesses",
                      icon: BarChart,
                      desc: "We support MSMEs and industrial sellers with tools and visibility to grow and scale with confidence.",
                    },
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start group hover:bg-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300"
                    >
                      <div className="flex-shrink-0 mr-3 sm:mr-4">
                        <div className="bg-orange-100 group-hover:bg-orange-200 rounded-lg sm:rounded-xl p-2 sm:p-3 transition-colors duration-300">
                          <value.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                          {value.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2 relative"
              >
                <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <Image
                    src="/value.jpg"
                    alt="Our company values"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-gray-100">
                  <Award className="h-5 w-5 sm:h-8 sm:w-8 text-orange-600" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-orange-600 via-orange-700 to-red-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Join the martXmart Community
              </h2>
              <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-8"></div>
              <p className="text-lg sm:text-xl mb-10 leading-relaxed text-orange-100 max-w-3xl mx-auto">
                Empowering Industrial Commerce with Trust and Simplicity. Discover a seamless way to buy or sell industrial machinery on a secure, efficient, and trusted platform designed for real businesses.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-orange-600 hover:bg-orange-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Start Buying
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full sm:w-auto text-white border-2 border-white/30 hover:bg-white/10 hover:border-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-sm transition-all duration-300"
                  >
                    Start Selling <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}