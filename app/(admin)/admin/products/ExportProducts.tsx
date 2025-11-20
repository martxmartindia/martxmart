"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportProductsProps {
  selectedProducts?: string[];
  filters?: any;
}

export default function ExportProducts({ selectedProducts, filters }: ExportProductsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (exportType: 'all' | 'selected' | 'filtered') => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      
      if (exportType === 'selected' && selectedProducts?.length) {
        params.append('ids', selectedProducts.join(','));
      } else if (exportType === 'filtered' && filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value as string);
        });
      }
      
      params.append('format', 'csv');
      
      const response = await fetch(`/api/admin/products/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-${exportType}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Products exported successfully');
    } catch (error) {
      toast.error('Failed to export products');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async (exportType: 'all' | 'selected' | 'filtered') => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      
      if (exportType === 'selected' && selectedProducts?.length) {
        params.append('ids', selectedProducts.join(','));
      } else if (exportType === 'filtered' && filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value as string);
        });
      }
      
      params.append('format', 'json');
      
      const response = await fetch(`/api/admin/products/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-${exportType}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Products exported successfully');
    } catch (error) {
      toast.error('Failed to export products');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-semibold">Export as CSV</div>
        <DropdownMenuItem onClick={() => exportToCSV('all')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          All Products
        </DropdownMenuItem>
        {selectedProducts && selectedProducts.length > 0 && (
          <DropdownMenuItem onClick={() => exportToCSV('selected')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Selected Products ({selectedProducts.length})
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => exportToCSV('filtered')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Filtered Products
        </DropdownMenuItem>
        
        <div className="px-2 py-1.5 text-sm font-semibold border-t mt-1">Export as JSON</div>
        <DropdownMenuItem onClick={() => exportToJSON('all')}>
          <FileText className="h-4 w-4 mr-2" />
          All Products
        </DropdownMenuItem>
        {selectedProducts && selectedProducts.length > 0 && (
          <DropdownMenuItem onClick={() => exportToJSON('selected')}>
            <FileText className="h-4 w-4 mr-2" />
            Selected Products ({selectedProducts.length})
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => exportToJSON('filtered')}>
          <FileText className="h-4 w-4 mr-2" />
          Filtered Products
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}