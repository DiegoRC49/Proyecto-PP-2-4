import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Game {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount: number;
  images: { url: string; type: string }[];
  rating: { average: number; count: number };
  category: string;
  platform: string[];
}

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { addToCart } = useCart();
  const coverImage = game.images.find(img => img.type === 'cover') || game.images[0];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(game._id);
    if (success) {
      // You could add a toast notification here
      console.log('Added to cart successfully');
    }
  };

  return (
    <Link to={`/game/${game._id}`} className="group">
      <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm">
        {/* Game Image */}
        <div className="relative overflow-hidden">
          <img
            src={coverImage?.url || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={game.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {game.discount > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
              -{game.discount}%
            </div>
          )}

          {/* Platform Tags */}
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {game.platform.slice(0, 2).map((platform, index) => (
              <span
                key={index}
                className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
              >
                {platform}
              </span>
            ))}
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-purple-400 transition-colors">
              {game.title}
            </h3>
          </div>

          {/* Category */}
          <span className="inline-block bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full mb-3">
            {game.category}
          </span>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-gray-300 text-sm">
                {game.rating.average.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              ({game.rating.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {game.originalPrice && game.originalPrice > game.price ? (
                <>
                  <span className="text-gray-400 text-sm line-through">
                    ${game.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-green-400 font-bold text-lg">
                    ${game.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-white font-bold text-lg">
                  ${game.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;