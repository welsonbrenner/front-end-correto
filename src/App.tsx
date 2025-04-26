import { useState } from 'react';
import { Size, Ingredient, OrderDetails, MarmitaItem } from './types';
import { initialIngredients, extraItems, marmitaPrices, deliveryZones, deliveryTimes } from './data/ingredients';
import { MarmitaBuilder } from './components/MarmitaBuilder';
import { AdminPanel } from './components/AdminPanel';
import {CategoryPanel} from './components/Category';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import AdminLogin from './components/LoginAdmin';
import { ShoppingBag } from 'lucide-react';
import './App.css';

type AppStep = 'builder' | 'checkout' | 'confirmation';
type AdminView = 'ingredients' | 'categories';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminView, setAdminView] = useState<AdminView>('ingredients');
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [selectedSize, setSelectedSize] = useState<Size>('medium');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<AppStep>('builder');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [marmitas, setMarmitas] = useState<MarmitaItem[]>([]);
  const [observation, setObservation] = useState('');

  const handleToggleIngredient = (id: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, active: !ing.active } : ing));
  };

  const handleUpdateIngredient = (ingredient: Ingredient) => {
    setIngredients(ingredients.map(ing => ing.id === ingredient.id ? ingredient : ing));
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleIngredientToggle = (id: string) => {
    setSelectedIngredients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleExtra = (id: string) => {
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const calculateMarmitaPrice = (marmita: MarmitaItem) => {
    const basePrice = marmitaPrices[marmita.size];
    const extrasPrice = (marmita.extras || []).reduce((total, extraId) => {
      const extra = extraItems.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
    return basePrice + extrasPrice;
  };

  const calculateTotalPrice = (includingDeliveryFee = false, neighborhood?: string) => {
    const subtotal = marmitas.reduce((total, marmita) => total + calculateMarmitaPrice(marmita), 0);
    if (!includingDeliveryFee || !neighborhood) return subtotal;
    const deliveryZone = deliveryZones.find(zone => zone.neighborhoods.includes(neighborhood));
    return subtotal + (deliveryZone?.fee || 0);
  };

  const handleAddMarmita = () => {
    const newMarmita: MarmitaItem = {
      id: Date.now().toString(),
      size: selectedSize,
      ingredients: selectedIngredients,
      extras: selectedExtras,
    };
    setMarmitas(prev => [...prev, newMarmita]);
    setSelectedSize('medium');
    setSelectedIngredients([]);
    setSelectedExtras([]);
  };

  const handleRemoveMarmita = (id: string) => {
    setMarmitas(prev => prev.filter(m => m.id !== id));
  };

  const handleConfirmOrder = (details: Omit<OrderDetails, 'marmitas' | 'totalPrice' | 'deliveryFee' | 'estimatedTime' | 'observation'>) => {
    const neighborhood = details.address?.neighborhood || '';
    const deliveryFee = details.deliveryMethod === 'delivery' && neighborhood
      ? (deliveryZones.find(zone => zone.neighborhoods.includes(neighborhood))?.fee || 0)
      : 0;
    const estimatedTime = details.deliveryMethod === 'delivery' ? deliveryTimes.delivery : deliveryTimes.pickup;

    setOrderDetails({
      ...details,
      marmitas,
      totalPrice: calculateTotalPrice(true, neighborhood),
      deliveryFee,
      estimatedTime,
      observation,
    });
    setCurrentStep('confirmation');
  };

  const handleNewOrder = () => {
    setSelectedSize('medium');
    setSelectedIngredients([]);
    setSelectedExtras([]);
    setMarmitas([]);
    setOrderDetails(null);
    setObservation('');
    setCurrentStep('builder');
  };

  const renderAdminPanel = () => {
    if (adminView === 'ingredients') {
      return (
        <AdminPanel
          ingredients={ingredients}
          onToggleIngredient={handleToggleIngredient}
          onUpdateIngredient={handleUpdateIngredient}
          onDeleteIngredient={handleDeleteIngredient}
          onAddCategory={() => setAdminView('categories')}
        />
      );
    }
    return <CategoryPanel onBack={() => setAdminView('ingredients')} />;
  };

  const renderContent = () => {
    if (isAdmin) {
      if (!isLoggedIn) return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
      return renderAdminPanel();
    }

    switch (currentStep) {
      case 'builder':
        return (
          <MarmitaBuilder
            ingredients={ingredients}
            selectedSize={selectedSize}
            selectedIngredients={selectedIngredients}
            selectedExtras={selectedExtras}
            observation={observation}
            onObservationChange={setObservation}
            onSizeChange={setSelectedSize}
            onIngredientToggle={handleIngredientToggle}
            onExtraToggle={handleToggleExtra}
            onAddMarmita={handleAddMarmita}
            onRemoveMarmita={handleRemoveMarmita}
            onProceedToCheckout={() => setCurrentStep('checkout')}
            marmitas={marmitas}
          />
        );
      case 'checkout':
        return (
          <Checkout
            marmitas={marmitas}
            totalPrice={calculateTotalPrice()}
            onBack={() => setCurrentStep('builder')}
            onComplete={handleConfirmOrder}
          />
        );
      case 'confirmation':
        return orderDetails ? (
          <OrderConfirmation
            orderDetails={orderDetails}
            onNewOrder={handleNewOrder}
          />
        ) : null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-container">
              <img src="/LogoGs.png" alt="GS SABORES" className="logo" />
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-4">
              {!isAdmin && marmitas.length > 0 && (
                <div className="cart-badge">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="mobile-text">
                    {marmitas.length} {marmitas.length === 1 ? 'marmita' : 'marmitas'}
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="elegant-button-outline border-amber-500 text-amber-700"
              >
                {isAdmin ? 'Modo Cliente' : 'Modo Admin'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        {renderContent()}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">© 2024 GS SABORES. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
