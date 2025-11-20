interface CouponListProps {
  coupons: {
    id: string;
    code: string;
    discount: number;
    isActive: boolean;
    expiresAt: string;
  }[];
  error?: string;
}

export default function CouponList({ coupons, error }: CouponListProps) {
  if (error) {
    return (
      <div className="text-red-500 bg-red-50 border border-red-200 rounded p-4">
        Error: {error}
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <div className="text-gray-500 bg-gray-50 border border-gray-200 rounded p-4">
        You don't have any coupons at the moment.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Coupons</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`p-4 rounded shadow-sm border ${
              coupon.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <h3 className="font-semibold text-lg">{coupon.code}</h3>
            <p className="text-sm">Discount: {coupon.discount}%</p>
            <p className="text-sm">
              Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
            </p>
            <p className={`text-sm font-medium ${coupon.isActive ? 'text-green-600' : 'text-gray-500'}`}>
              Status: {coupon.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
