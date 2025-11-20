'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Briefcase, Building, Clock, Globe, MapPin, Search, Users, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Career = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salary?: string;
  postedDate: string;
};

const CareersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [careers, setCareers] = useState<Career[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Fetch careers data
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedDepartment !== 'all') params.append('department', selectedDepartment);
        if (selectedLocation !== 'all') params.append('location', selectedLocation);

        // Placeholder API call (replace with actual endpoint)
        const response = await fetch(`/api/careers?${params.toString()}`);
        const data = await response.json();

        setCareers(data);
        const uniqueDepartments = ['all', ...new Set(data.map((career: Career) => career.department))] as string[];
        const uniqueLocations = ['all', ...new Set(data.map((career: Career) => career.location))] as string[];
        setDepartments(uniqueDepartments);
        setLocations(uniqueLocations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching careers:', error);
        setIsLoading(false);
      }
    };

    fetchCareers();
  }, [searchTerm, selectedDepartment, selectedLocation]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return careers.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
      const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [careers, searchTerm, selectedDepartment, selectedLocation]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-900 to-brand-800 text-primary-foreground py-20 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/logo.png?height=800&width=1600"
            alt="Careers at martXmart"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
              Join the martXmart Team
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Be part of our mission to revolutionize the industrial machinery marketplace.
            </p>
            <div className="bg-card/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card/20 text-foreground placeholder:text-muted-foreground transition-all duration-200"
                  aria-label="Search job openings"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Why Work at martXmart?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join a dynamic team shaping the future of industrial commerce with opportunities for growth and impact.
            </p>
          </div>
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                icon: Globe,
                title: 'Global Impact',
                description: 'Connect buyers and sellers worldwide, driving industrial growth.',
              },
              {
                icon: Users,
                title: 'Collaborative Culture',
                description: 'Work in a supportive environment where your ideas matter.',
              },
              {
                icon: Building,
                title: 'Rapid Growth',
                description: 'Grow your career in a fast-paced, innovative company.',
              },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="h-full bg-card rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 p-6 text-center group">
                  <div className="flex items-center justify-center bg-brand-50 rounded-full w-16 h-16 mb-4 mx-auto">
                    <item.icon className="h-8 w-8 text-brand-500 group-hover:text-brand-600 transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-6 text-foreground">
                Our Culture
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At martXmart, we foster innovation, collaboration, and continuous learning in a passionate and inclusive environment.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Innovation', description: 'Encouraging creative solutions and new ideas.' },
                  { title: 'Collaboration', description: 'Working together to achieve shared goals.' },
                  { title: 'Growth', description: 'Investing in your professional development.' },
                  { title: 'Balance', description: 'Valuing work-life balance and flexibility.' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="bg-brand-50 p-2 rounded-full mr-4">
                      <Check className="h-5 w-5 text-brand-500" aria-hidden="true" />
                    </div>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{item.title}:</span> {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { alt: 'Team collaboration', src: '/logo.png?height=300&width=300' },
                { alt: 'Office environment', src: '/logo.png?height=300&width=300', offset: true },
                { alt: 'Team event', src: '/logo.png?height=300&width=300' },
                { alt: 'Work environment', src: '/logo.png?height=300&width=300', offset: true },
              ].map((img, index) => (
                <div key={index} className={`relative h-48 rounded-lg overflow-hidden ${img.offset ? 'mt-8' : ''}`}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-brand-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Benefits & Perks
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We offer competitive benefits to support your wellbeing and career growth.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Health & Wellness',
                items: [
                  'Comprehensive health insurance',
                  'Dental and vision coverage',
                  'Mental health support',
                  'Wellness programs',
                ],
              },
              {
                title: 'Work-Life Balance',
                items: ['Flexible work hours', 'Remote work options', 'Generous paid time off', 'Parental leave'],
              },
              {
                title: 'Growth & Development',
                items: [
                  'Learning & development budget',
                  'Conference attendance',
                  'Mentorship programs',
                  'Career advancement opportunities',
                ],
              },
              {
                title: 'Financial Benefits',
                items: ['Competitive salary', 'Equity/stock options', 'Retirement plans', 'Performance bonuses'],
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card rounded-lg p-6 shadow-soft hover:shadow-medium transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-foreground mb-4">{category.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="bg-brand-50 p-1 rounded-full mr-2">
                        <Check className="h-3 w-3 text-brand-500" aria-hidden="true" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover opportunities to shape the future of industrial commerce with martXmart.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-lg shadow-soft p-6 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground transition-all duration-200"
                    aria-label="Search job openings"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground"
                  aria-label="Filter by department"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full sm:w-48 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-400 focus:border-brand-500 bg-card text-foreground"
                  aria-label="Filter by location"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'all' ? 'All Locations' : loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                  </div>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-medium transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.experience}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/careers/${job.id}`} className="inline-block">
                          <button
                            className="bg-brand-500 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
                            aria-label={`Apply for ${job.title}`}
                          >
                            Apply Now
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </Link>
                      </div>
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.salary && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-brand-50 text-brand-500">
                            {job.salary}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border border-brand-500 text-brand-500">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Posted on {formatDate(job.postedDate)}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No positions found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedDepartment('all');
                        setSelectedLocation('all');
                      }}
                      className="mt-4 text-brand-500 hover:text-brand-600 font-medium"
                      aria-label="Clear filters"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Our Application Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A streamlined process to help you find the perfect role at martXmart.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 sm:left-12 md:left-1/2 top-0 bottom-0 w-1 bg-brand-200 transform md:-translate-x-1/2"></div>
              {[
                {
                  step: 'Application',
                  description: 'Submit your resume and cover letter through our careers page.',
                },
                {
                  step: 'Initial Screening',
                  description: 'Our team will review your application and schedule a call to discuss your experience.',
                },
                {
                  step: 'Technical Assessment',
                  description: 'Complete a role-specific assessment or case study to showcase your skills.',
                },
                {
                  step: 'Team Interviews',
                  description: 'Meet with team members to discuss your fit and skills in detail.',
                },
                {
                  step: 'Offer',
                  description: 'Receive an offer and join the martXmart team!',
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="absolute left-8 sm:left-12 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                    <div className="bg-brand-500 text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div
                    className={`ml-16 sm:ml-24 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.step}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-brand-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about joining martXmart.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  question: 'What is the interview process like?',
                  answer:
                    'Our process includes an initial screening, a technical assessment or case study, and team interviews, typically spanning 2-3 weeks with feedback at each stage.',
                },
                {
                  question: 'Do you offer remote work options?',
                  answer:
                    'Yes, most roles offer flexible remote or hybrid options, with some requiring occasional in-office presence.',
                },
                {
                  question: 'What is the company culture like?',
                  answer:
                    'We foster a collaborative, innovative, and inclusive culture, prioritizing work-life balance and celebrating team successes.',
                },
                {
                  question: 'What opportunities are there for growth?',
                  answer:
                    'We offer learning resources, mentorship, and clear career paths with frequent advancement opportunities.',
                },
                {
                  question: 'Can I apply if no roles match my skills?',
                  answer:
                    'Yes, submit a general application, and we’ll contact you if a suitable position opens.',
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="bg-card p-4 rounded-lg shadow-soft"
                  open={index === 0}
                >
                  <summary className="font-medium text-foreground cursor-pointer">{faq.question}</summary>
                  <p className="text-muted-foreground mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 bg-card text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore open positions or connect with our team to learn more about opportunities at martXmart.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/careers/open-positions" className="inline-block">
              <button
                className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-brand-500 text-primary-foreground rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-brand-600 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
                aria-label="View All Open Positions"
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </button>
            </Link>
            <Link href="/contact" className="inline-block">
              <button
                className="w-full sm:w-auto px-8 py-3 text-sm sm:text-base border border-brand-500 text-brand-500 rounded-lg font-medium hover:bg-brand-50 focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:outline-none transition-colors duration-200"
                aria-label="Contact Careers Team"
              >
                Contact Careers Team
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CareersPage;