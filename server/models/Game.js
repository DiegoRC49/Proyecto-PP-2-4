import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Simulation', 'Puzzle', 'Horror', 'Indie']
  },
  platform: [{
    type: String,
    enum: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Mobile']
  }],
  genre: [{
    type: String
  }],
  developer: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  images: [{
    url: String,
    type: {
      type: String,
      enum: ['cover', 'screenshot', 'banner']
    }
  }],
  trailer: {
    type: String
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }],
  systemRequirements: {
    minimum: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    },
    recommended: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 1000
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Game', gameSchema);