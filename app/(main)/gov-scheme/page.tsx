'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

interface GovernmentScheme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ministry: string | null;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string[];
  documents: string[];
  sectors: string[];
  status: string;
  website: string | null;
}

export default function GovernmentSchemesPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/government-schemes');
        if (!response.ok) {
          throw new Error('Failed to fetch government schemes');
        }
        const data = await response.json();
        setSchemes(data);
      } catch (error) {
        console.error('Error fetching government schemes:', error);
        setError('Failed to load schemes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const filteredSchemes = useMemo(() => {
    const result = schemes.filter(
      (scheme) =>
        (activeTab === 'all' || scheme.slug === activeTab) &&
        (scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (scheme.description &&
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          scheme.sectors.some((sector) =>
            sector.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'status') {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [schemes, activeTab, searchTerm, sortBy]);

  const paginatedSchemes = filteredSchemes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Government Schemes</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore government initiatives to support your business with financial aid, subsidies, and more.
        </p>
      </motion.div>

      <div className="sticky top-0 bg-white z-10 py-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search schemes..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10 py-2 rounded-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              aria-label="Search government schemes"
            />
          </div>
          <div className="flex gap-4 items-center">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'status')}>
              <SelectTrigger className="w-40 rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveTab('all')}
                className="rounded-full"
              >
                All
              </Button>
              {schemes.slice(0, 5).map((scheme) => (
                <Button
                  key={scheme.slug}
                  variant={activeTab === scheme.slug ? 'default' : 'outline'}
                  onClick={() => setActiveTab(scheme.slug)}
                  className="rounded-full"
                >
                  {scheme.slug.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton key={item} className="h-96 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-red-600 text-lg">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </motion.div>
      ) : (
        <>
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {paginatedSchemes.map((scheme) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.jpg"
                        alt=""
                        height={250}
                        width={200}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                        {scheme.status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
                        {scheme.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{scheme.ministry}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {scheme.description || 'No description available.'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {scheme.sectors.slice(0, 3).map((sector, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-100">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/gov-scheme/${scheme.slug}`}>
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700 rounded-full"
                          aria-label={`Read more about ${scheme.name}`}
                        >
                          Read More <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredSchemes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">No schemes found.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveTab('all');
                  setPage(1);
                }}
                className="mt-4 rounded-full"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-full"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'default' : 'outline'}
                  onClick={() => setPage(p)}
                  className="rounded-full"
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-full"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}