import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, totalAmount, fetchCart } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRemoveFromCart = async (gameId: string) => {
    await removeFromCart(gameId);
  };

  const handleCheckout = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/user/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Purchase successful:', data);
        await fetchCart(); // Refresh cart
        alert('Purchase completed successfully!');
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tu carrito esta vacio</h2>
          <p className="text-gray-400 mb-6">Agrega alguos juegos para empezar!</p>
          <a
            href="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Buscar juegos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Carrito de compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.gameId.images?.[0]?.url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={item.gameId.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.gameId.title}
                    </h3>
                    <p className="text-2xl font-bold text-purple-400">
                      ${item.gameId.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">Qty: {item.quantity}</span>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFromCart(item.gameId._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Orden</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({cart.length} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Secure checkout powered by GameVault
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;