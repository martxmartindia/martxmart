export type OrderItem = {
  id: string;
  quantity: number;
};

export type PaymentMethod = 'RAZORPAY' | 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'EMI' | 'COD';

export type Order = {
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
};

export type OrderStore = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'status' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: number, status: Order['status']) => void;
};