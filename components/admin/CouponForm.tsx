"use client";

import { useState } from "react";

interface CouponFormProps {
  coupon?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CouponForm({ coupon, onSubmit, onCancel, loading }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discount: coupon?.discount || "",
    expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : "",
    isActive: coupon?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Coupon Code</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          className="w-full p-2 border rounded-md"
          required
          placeholder="SAVE20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Discount (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={formData.discount}
          onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expires At</label>
        <input
          type="date"
          value={formData.expiresAt}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          className="w-full p-2 border rounded-md"
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="isActive" className="text-sm font-medium">Active</label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : coupon ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}