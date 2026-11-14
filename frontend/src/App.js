import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const handleBuy = (product) => {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_email: 'customer@microshop.internal',
        items: [{ product_id: product.id, quantity: 1 }]
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setOrderStatus(`Success! Ordered ${product.name}`);
      })
      .catch((err) => {
        setOrderStatus('Failed to place order.');
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '40px', maxWidth: '800px', margin: 'auto' }}>
      <h1>🛒 MicroShop Platform</h1>
      <p>Welcome to our cloud-native microservices storefront.</p>

      {orderStatus && (
        <div style={{ background: '#eef9ed', border: '1px solid #d1e7dd', padding: '10px', marginBottom: '20px', borderRadius: '4px' }}>
          {orderStatus}
        </div>
      )}

      <h2>Product Catalog</h2>
      {loading ? (
        <p>Loading catalog items...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
              <div>
                <strong>{p.name}</strong> - ${p.price} (Stock: {p.stock})
              </div>
              <button onClick={() => handleBuy(p)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                Buy Now
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;