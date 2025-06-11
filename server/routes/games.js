import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import passport from 'passport';

const router = express.Router();

// Get all games with filters and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      platform,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (platform) query.platform = { $in: [platform] };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { developer: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const games = await Game.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Game.countDocuments(query);

    res.json({
      success: true,
      games,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalGames: total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get featured games
router.get('/featured', async (req, res) => {
  try {
    const games = await Game.find({ featured: true }).limit(6);
    res.json({
      success: true,
      games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('reviews.userId', 'username avatar');
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Add game to cart
router.post('/:id/cart', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const gameId = req.params.id;
    const userId = req.user._id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const user = await User.findById(userId);
    const existingItem = user.cart.find(item => item.gameId.toString() === gameId);

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Game already in cart'
      });
    }

    user.cart.push({ gameId });
    await user.save();

    res.json({
      success: true,
      message: 'Game added to cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Add review to game
router.post('/:id/review', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const gameId = req.params.id;
    const userId = req.user._id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Check if user already reviewed this game
    const existingReview = game.reviews.find(review => review.userId.toString() === userId.toString());
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this game'
      });
    }

    game.reviews.push({
      userId,
      rating,
      comment
    });

    // Update rating average
    const totalRating = game.reviews.reduce((sum, review) => sum + review.rating, 0);
    game.rating.average = totalRating / game.reviews.length;
    game.rating.count = game.reviews.length;

    await game.save();

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;