import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import GameCard from '../components/Games/GameCard';

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

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt'
  });

  const categories = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation', 'Puzzle', 'Horror', 'Indie'];
  const platforms = ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Mobile'];

  useEffect(() => {
    fetchFeaturedGames();
    fetchGames();
  }, [searchParams, filters]);

  const fetchFeaturedGames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/games/featured');
      const data = await response.json();
      if (data.success) {
        setFeaturedGames(data.games);
      }
    } catch (error) {
      console.error('Error fetching featured games:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const search = searchParams.get('search') || '';
      const queryParams = new URLSearchParams({
        ...filters,
        search,
        page: '1',
        limit: '12'
      });

      const response = await fetch(`http://localhost:3001/api/games?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setGames(data.games);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900/80 to-blue-900/80 py-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Descubre tu proxima
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Aventura Gamer
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explora miles de juegos, desde joyas indie hasta superproducciones AAA. Encuentra tu juego perfecto a precios inmejorables.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Games */}
        {featuredGames.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Juegos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map(game => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-purple-400" />
              <h3 className="text-white font-semibold">Filtros</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas las Categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas las plataformas</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="createdAt">Mas Nuevos</option>
                <option value="price">Precio: de Menor a Mayor</option>
                <option value="-price">Precio: DE Mayor a Menor</option>
                <option value="-rating.average">Mejor Valorados</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'All Games'}
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Grid className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map(game => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No se encontraron juegos que coincidan con tus criterios.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;