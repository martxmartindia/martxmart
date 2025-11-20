'use client';

export function CartItem({ item, cartId }: { item: any; cartId: string }) {
  const handleRemove = async () => {
    const response = await fetch(`/api/cart?cartId=${cartId}&shoppingId=${item.shoppingId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      window.location.reload(); // Refresh to update cart
    }
  };

  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h3 className="text-lg">{item.shopping.name}</h3>
        <p>Quantity: {item.quantity}</p>
        <p>Price: ${item.price}</p>
      </div>
      <button onClick={handleRemove} className="bg-red-500 text-white px-4 py-2 rounded">
        Remove
      </button>
    </div>
  );
}