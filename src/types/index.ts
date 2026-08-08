export interface ProductSpecification {
  Fabric?: string;
  Dupatta?: string;
  Trouser?: string;
  Care?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isOffer?: boolean;
  clicks: number;
  colorImageMap?: Record<string, string>;
  stitchingFee?: number;
  specifications?: ProductSpecification;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  title: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export type PaymentOption = 
  | 'Cash on Delivery'
  | '25% Advance Downpayment'
  | '100% Full Payment'
  | 'Bank Transfer'
  | 'Safepay Credit/Debit Card & Mobile Wallet'
  | 'Boutique Pickup';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  city?: string;
  province?: string;
  address?: string;
  role: 'admin' | 'customer';
  createdAt?: string;
}

export type AuthModalMode = 'login' | 'signup' | 'forgot';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  country: string;
  specialNotes?: string;
  paymentMethod: PaymentOption;
  paymentStatus?: 'Paid (Safepay)' | 'Paid (Advance 25%)' | 'Paid (Full 100%)' | 'Pending COD' | 'Unpaid';
  paymentReference?: string;
  safepayTracker?: string;
  paidAt?: string;
  downpaymentAmount?: number;
  remainingCodAmount?: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  formattedWhatsAppMsg: string;
}

export interface SafepayTransaction {
  id: string;
  orderNumber: string;
  tracker: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount: number;
  isComingSoon?: boolean;
  isAvailable?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  image?: string;
}
