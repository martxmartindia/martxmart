export const getCoupons = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  if (!response.ok) throw new Error('Failed to fetch coupons');
  return response.json();
};

export const getApplications = async (userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applications?userId=${userId}`, {
    next: { revalidate: 60 },
    cache: 'force-cache',
  });
  if (!response.ok) throw new Error('Failed to fetch applications');
  return response.json();
};

export const getAffiliateData = async (userId: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/affiliate?userId=${userId}`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to fetch affiliate data');
  return response.json();
};
