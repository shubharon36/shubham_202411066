export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface CartItem extends Product {
  quantity: number;
}
