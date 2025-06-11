import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, Settings, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Purchase {
  _id: string;
  gameId: {
    _id: string;
    title: string;
    images: { url: string; type: string }[];
  };
  purchaseDate: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'purchases') {
      fetchPurchases();
    }
  }, [activeTab]);

  const fetchPurchases = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/user/purchases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'purchases', label: 'My Games', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Bienvenido de vuelta, {user?.firstName}!
            </h1>
            <p className="text-gray-400">Controla tu experienca gamer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Informacion del Perfil</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={user?.firstName || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={user?.lastName || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={user?.username || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Mis juegos</h2>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : purchases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchases.map((purchase) => (
                        <div
                          key={purchase._id}
                          className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-purple-500/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={purchase.gameId.images?.[0]?.url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'}
                              alt={purchase.gameId.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="text-white font-semibold mb-1">
                                {purchase.gameId.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                Comprado: {new Date(purchase.purchaseDate).toLocaleDateString()}
                              </p>
                              <p className="text-purple-400 font-bold">
                                ${purchase.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No hay juegos comprados</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Wishlist</h2>
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Tu wishlist esta vacia</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Configuraciones</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Preferencias</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
                          <span className="text-gray-300">Notificaciones de Email </span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
                          <span className="text-gray-300">Marketing emails</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
                          <span className="text-gray-300">Notificaciones</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;