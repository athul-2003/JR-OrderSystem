import React from 'react';
import { Product } from '../lib/types';
import { products } from '../lib/products';

interface ProductSelectProps {
  onSelect: (product: Product, quantity: number) => void;
}

export default function ProductSelect({ onSelect }: ProductSelectProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddProduct = () => {
    if (selectedProduct) {
      onSelect(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col space-y-2 SelectRow">
      <select
        className="border p-2 rounded ProductSelect"
        value={selectedProduct?.id || ''}
        onChange={(e) => setSelectedProduct(products.find(p => p.id === Number(e.target.value)) || null)}
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
  {product.name} - ${product.price.toFixed(2)}
</option>
))}
</select>
<input
  type="number"
  min="1"
  step="1"
  value={quantity}
  onChange={(e) => setQuantity(Number(e.target.value))}
  className="border p-2 rounded DropDownMenu"
/>
<button
  onClick={handleAddProduct}
  disabled={!selectedProduct || quantity < 1}
  className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300 add-button"
>
  Add to Order
</button>
    </div>
  );
}

