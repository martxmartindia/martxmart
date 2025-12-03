'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdvertisementForm from './AdvertisementForm';
import AdvertisementDetail from './AdvertisementDetail';

interface Advertisement {
  id: string;
  name: string;
  image?: string;
  offer: string;
  offerExpiry: string;
  benefits: string[];
  link: string;
  bgColor: string;
  hoverColor: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const fetchAdvertisements = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        ...(statusFilter !== 'all' && { isActive: statusFilter })
      });

      const response = await fetch(`/api/admin/advertisements?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setAdvertisements(data.advertisements);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [page, search, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      const response = await fetch(`/api/admin/advertisements/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Advertisement deleted successfully');
        fetchAdvertisements();
      } else {
        toast.error(data.message || 'Failed to delete advertisement');
      }
    } catch (error) {
      toast.error('Failed to delete advertisement');
    }
  };

  const handleEdit = (advertisement: Advertisement) => {
    setSelectedAd(advertisement);
    setShowForm(true);
  };

  const handleView = (advertisement: Advertisement) => {
    setSelectedAd(advertisement);
    setShowDetail(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedAd(null);
    fetchAdvertisements();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Advertisements</h1>
        <Button onClick={() => { setSelectedAd(null); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Advertisement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or offer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Offer</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advertisements.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell>{ad.offer}</TableCell>
                  <TableCell>{ad.offerExpiry}</TableCell>
                  <TableCell>{ad.priority}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={ad.isActive ? 'default' : 'secondary'}
                      className={ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {ad.isActive ? (
                        <><CheckCircle className="w-3 h-3 mr-1" />Active</>
                      ) : (
                        <><AlertCircle className="w-3 h-3 mr-1" />Inactive</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(ad)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ad.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          Showing page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAd ? 'Edit Advertisement' : 'Add Advertisement'}
            </DialogTitle>
          </DialogHeader>
          <AdvertisementForm
            advertisement={selectedAd}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advertisement Details</DialogTitle>
          </DialogHeader>
          {selectedAd && (
            <AdvertisementDetail
              advertisement={selectedAd}
              onClose={() => setShowDetail(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}