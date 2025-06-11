import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import Game from '../models/Game.js';

const router = express.Router();

// Get user cart
router.get('/cart', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.gameId');
    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/cart/:gameId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.gameId.toString() !== req.params.gameId);
    await user.save();

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Purchase games (checkout)
router.post('/purchase', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.gameId');
    
    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    let totalAmount = 0;
    const purchasedGames = [];

    for (const item of user.cart) {
      const game = item.gameId;
      totalAmount += game.price;
      
      // Add to purchase history
      user.purchaseHistory.push({
        gameId: game._id,
        price: game.price
      });

      // Update game sales count
      await Game.findByIdAndUpdate(game._id, {
        $inc: { salesCount: 1 }
      });

      purchasedGames.push(game);
    }

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Purchase completed successfully',
      totalAmount,
      purchasedGames
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user purchase history
router.get('/purchases', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('purchaseHistory.gameId');
    res.json({
      success: true,
      purchases: user.purchaseHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Add to wishlist
router.post('/wishlist/:gameId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const gameId = req.params.gameId;

    if (user.wishlist.includes(gameId)) {
      return res.status(400).json({
        success: false,
        message: 'Game already in wishlist'
      });
    }

    user.wishlist.push(gameId);
    await user.save();

    res.json({
      success: true,
      message: 'Game added to wishlist'
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