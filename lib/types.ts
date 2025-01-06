export interface Product {
    id: number;
    name: string;
    price: number;
  }
  
  export interface OrderItem {
    product: Product;
    quantity: number;
  }
  
  export interface Order {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: OrderItem[];
    // Removed the total field
  }
  
  