"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Trash2, Star, StarOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedProducts: string[];
  onSelectionChange: (productIds: string[]) => void;
  onBulkAction: () => void;
  products: any[];
}

export default function BulkActions({
  selectedProducts,
  onSelectionChange,
  onBulkAction,
  products,
}: BulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked && products) {
      onSelectionChange(products.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      const promises = selectedProducts.map(id =>
        fetch(`/api/products/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(promises);
      toast.success(`${selectedProducts.length} products deleted successfully`);
      onSelectionChange([]);
      onBulkAction();
    } catch (error) {
      toast.error('Failed to delete products');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkFeature = async (featured: boolean) => {
    setIsLoading(true);
    try {
      const promises = selectedProducts.map(id =>
        fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featured })
        })
      );
      
      await Promise.all(promises);
      toast.success(`${selectedProducts.length} products ${featured ? 'featured' : 'unfeatured'} successfully`);
      onSelectionChange([]);
      onBulkAction();
    } catch (error) {
      toast.error('Failed to update products');
    } finally {
      setIsLoading(false);
    }
  };

  const isAllSelected = products?.length > 0 && selectedProducts.length === products.length;
  const isPartiallySelected = selectedProducts.length > 0 && selectedProducts.length < (products?.length || 0);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) {
                const input = el.querySelector('input[type="checkbox"]') as HTMLInputElement;
                if (input) input.indeterminate = isPartiallySelected;
              }
            }}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-gray-600">
            {selectedProducts.length > 0 
              ? `${selectedProducts.length} selected`
              : 'Select all'
            }
          </span>
        </div>

        {selectedProducts.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Bulk Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkFeature(true)}>
                <Star className="h-4 w-4 mr-2" />
                Mark as Featured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkFeature(false)}>
                <StarOff className="h-4 w-4 mr-2" />
                Remove from Featured
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Products</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProducts.length} selected products? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}