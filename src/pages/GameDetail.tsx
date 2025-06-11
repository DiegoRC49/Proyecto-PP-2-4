import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, MessageCircle, Calendar, Monitor, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

interface Game {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount: number;
  category: string;
  platform: string[];
  genre: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  images: { url: string; type: string }[];
  trailer?: string;
  rating: { average: number; count: number };
  reviews: Array<{
    userId: { username: string; avatar: string };
    rating: number;
    comment: string;
    date: string;
  }>;
  tags: string[];
  systemRequirements: {
    minimum: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    recommended: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
  };
  salesCount: number;
}

const GameDetail: React.FC = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  const { addToCart } = useCart();
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  useEffect(() => {
    if (socket && game) {
      socket.emit('join_chat', game._id);
      
      socket.on('receive_message', (message) => {
        setChatMessages(prev => [...prev, message]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, game]);

  const fetchGameDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/games/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setGame(data.game);
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (game) {
      const success = await addToCart(game._id);
      if (success) {
        console.log('Added to cart successfully');
      }
    }
  };

  const sendMessage = () => {
    if (socket && game && newMessage.trim() && user) {
      const messageData = {
        gameId: game._id,
        message: newMessage,
        username: user.username,
        avatar: user.avatar
      };
      
      socket.emit('send_message', messageData);
      setNewMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
          <p className="text-gray-400">The game you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const coverImage = game.images.find(img => img.type === 'cover') || game.images[0];
  const screenshots = game.images.filter(img => img.type === 'screenshot');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
        <img
          src={coverImage?.url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={game.title}
          className="w-full h-96 object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="flex-shrink-0">
                <img
                  src={coverImage?.url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={game.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-2xl"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{game.title}</h1>
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{game.rating.average.toFixed(1)}</span>
                    <span className="text-gray-300">({game.rating.count} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">{game.salesCount} purchases</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {game.category}
                  </span>
                  {game.platform.map((platform, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                  <div className="text-center mb-4">
                    {game.originalPrice && game.originalPrice > game.price ? (
                      <div>
                        <span className="text-gray-400 text-lg line-through block">
                          ${game.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-green-400 font-bold text-3xl">
                          ${game.price.toFixed(2)}
                        </span>
                        <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold mt-1">
                          -{game.discount}% OFF
                        </div>
                      </div>
                    ) : (
                      <span className="text-white font-bold text-3xl">
                        ${game.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>
                    
                    <button className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Add to Wishlist</span>
                    </button>
                    
                    {user && (
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>Chat</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      {showChat && user && (
        <div className="fixed bottom-4 right-4 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Game Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-2">
            {chatMessages.map((message, index) => (
              <div key={index} className="flex items-start space-x-2">
                <img
                  src={message.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={message.username}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{message.username}</div>
                  <div className="text-white text-sm">{message.message}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'screenshots', 'requirements', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{game.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Developer</h3>
                  <p className="text-gray-300">{game.developer}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Publisher</h3>
                  <p className="text-gray-300">{game.publisher}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Release Date</h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(game.releaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Platforms</h3>
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{game.platform.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Genres</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {game.genre.map((g, index) => (
                  <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {g}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag, index) => (
                  <span key={index} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'screenshots' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={screenshot.url}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Minimum</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">OS: </span>
                    <span className="text-white">{game.systemRequirements.minimum.os}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Processor: </span>
                    <span className="text-white">{game.systemRequirements.minimum.processor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Memory: </span>
                    <span className="text-white">{game.systemRequirements.minimum.memory}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Graphics: </span>
                    <span className="text-white">{game.systemRequirements.minimum.graphics}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Storage: </span>
                    <span className="text-white">{game.systemRequirements.minimum.storage}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Recommended</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">OS: </span>
                    <span className="text-white">{game.systemRequirements.recommended.os}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Processor: </span>
                    <span className="text-white">{game.systemRequirements.recommended.processor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Memory: </span>
                    <span className="text-white">{game.systemRequirements.recommended.memory}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Graphics: </span>
                    <span className="text-white">{game.systemRequirements.recommended.graphics}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Storage: </span>
                    <span className="text-white">{game.systemRequirements.recommended.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">User Reviews</h2>
            <div className="space-y-6">
              {game.reviews.map((review, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start space-x-4">
                    <img
                      src={review.userId.avatar}
                      alt={review.userId.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-semibold">{review.userId.username}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;