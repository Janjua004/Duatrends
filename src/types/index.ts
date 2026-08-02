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
  | 'Boutique Pickup';

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

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount: number;
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
