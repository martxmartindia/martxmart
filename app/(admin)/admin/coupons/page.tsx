"use client";

import { useState, useEffect } from "react";
import CouponForm from "@/components/admin/CouponForm";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  expiresAt: string;
  admin?: { name: string; email: string };
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`/api/admin/coupons?page=${page}&limit=10&search=${search}&isActive=${isActive}`);
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, search, isActive]);

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon?.id}`
        : "/api/admin/coupons";
      
      const response = await fetch(url, {
        method: editingCoupon ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingCoupon(null);
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">
            {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <CouponForm
            coupon={editingCoupon}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingCoupon(null);
            }}
          />
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Code</th>
              <th className="border p-2 text-left">Discount</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Expires At</th>
              <th className="border p-2 text-left">Created By</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon: Coupon) => (
              <tr key={coupon.id}>
                <td className="border p-2 font-mono">{coupon.code}</td>
                <td className="border p-2">{coupon.discount}%</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="border p-2">
                  {new Date(coupon.expiresAt).toLocaleDateString()}
                </td>
                <td className="border p-2">{coupon.admin?.name}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 rounded ${
                page === pageNum ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}