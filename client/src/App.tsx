
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { UpsellModal } from './components/UpsellModal';
import { SmartSearch } from './components/SmartSearch';
import { DynamicBundle } from './components/DynamicBundle';
import { CompleteTheLook } from './components/CompleteTheLook';
import { PostPurchase } from './pages/PostPurchase';
import { Dashboard } from './pages/Dashboard';
import { RulesBuilder } from './pages/RulesBuilder';
import { IntegrationsHub } from './pages/IntegrationsHub';
import './App.css';

const Storefront = () => {
  const { addToCart } = useCart();

  const mockProduct = {
    id: '1', title: 'Premium Hydration Serum', price: 45.00, image: 'https://placehold.co/400x400/18181b/ffffff?text=Serum', rating: 4.8, reviews: 124
  };

  return (
    <div className="container">
      <h1>Welcome to Nova Store</h1>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Experience the Intelligent Cart</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '0.5rem', width: '300px' }}>
          <img src={mockProduct.image} alt={mockProduct.title} style={{ width: '100%', borderRadius: '0.5rem' }} />
          <h3 style={{ marginTop: '1rem' }}>{mockProduct.title}</h3>
          <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>${mockProduct.price.toFixed(2)}</p>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => addToCart(mockProduct)}>
            Add to Cart
          </button>
        </div>
      </div>

      <CompleteTheLook baseProductId="1" />

      <div style={{ marginTop: '4rem' }}>
        <h2>Special Offers</h2>
        <DynamicBundle />
      </div>
    </div>
  );
};

const Checkout = () => (
  <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
    <h2>Checkout Process</h2>
    <p>Simulating Checkout...</p>
    <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.href = '/offers/post-purchase'}>
      Complete Order
    </button>
  </div>
);

const Header = () => {
  const { cartItems, openCart } = useCart();
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="brand" onClick={() => window.location.href = '/'} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <img src="/logo.png" alt="NovaCart AI" style={{ height: '28px', width: '28px', borderRadius: '4px' }} />
        <span>NovaCart AI</span>
      </div>

      <nav style={{ display: 'flex', gap: '1rem', marginLeft: '2rem' }}>
        <a href="/admin" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Dashboard</a>
        <a href="/admin/rules" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Logic Engine</a>
        <a href="/admin/integrations" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Integrations</a>
      </nav>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <SmartSearch />
      </div>

      <div className="nav-actions">
        <div className="cart-icon-wrapper" onClick={openCart}>
          <ShoppingBag size={24} />
          {count > 0 && <span className="cart-count">{count}</span>}
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Storefront />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/offers/post-purchase" element={<PostPurchase />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/rules" element={<RulesBuilder />} />
            <Route path="/admin/integrations" element={<IntegrationsHub />} />
          </Routes>
        </main>
        <CartDrawer />
        <UpsellModal />
      </Router>
    </CartProvider>
  );
}

export default App;
