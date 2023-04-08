const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  collection_id: {
    type: String,
    required: true,
  },
  chainName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image_url: {
    type: String,
    default: '',
  },
  banner_image_url: {
    type: String,
    default: '',
  },
  external_url: {
    type: String,
    default: '',
  },
  twitter_username: {
    type: String,
    default: '',
  },
  discord_url: {
    type: String,
    default: '',
  },
  marketplace_pages: [{
    type: Object,
    default: {},
  }],
  metaplex_mint: {
    type: String,
    default: '',
  },
  metaplex_first_verified_creator: {
    type: String,
    default: '',
  },
  floor_prices: [{
    type: Object,
    default: {},
  }],
  distinct_owner_count: {
    type: Number,
    default: 0,
  },
  distinct_nft_count: {
    type: Number,
    default: 0,
  },
  total_quantity: {
    type: Number,
    default: 0,
  },
  top_contracts: [{
    type: String,
    default: '',
  }],
  floor_price: {
    type: Number,
    default: 0,
  },
  volume_today: {
    type: Number,
    default: 0,
  },
  volume_ystd: {
    type: Number,
    default: 0,
  },
  one_day_change: {
    type: Number,
    default: 0,
  },
  volume_week: {
    type: Number,
    default: 0,
  },
  volume_last_week: {
    type: Number,
    default: 0,
  },
  seven_days_change: {
    type: Number,
    default: 0,
  },
  policies: [{
    type: String,
    default: '',
  }],
  total_owners: [{
    type: String,
    default: '',
  }],
  link: {
    type: String,
    default: '',
  },
  total_minted: [{
    type: Number,
    default: 0,
  }],
  time_ranges: {
    today: {
      volume: {
        type: Number,
        default: 0,
      },
      total_tx: {
        type: String,
        default: '',
      },
      total_assets: {
        type: String,
        default: '',
      },
    },
    week: {
      volume: {
        type: Number,
        default: 0,
      },
      total_tx: {
        type: String,
        default: '',
      },
      total_assets: {
        type: String,
        default: '',
      },
    },
    month: {
      volume: {
        type: Number,
        default: 0,
      },
      total_tx: {
        type: String,
        default: '',
      },
      total_assets: {
        type: String,
        default: '',
      },
    },
    all: {
      volume: {
        type: Number,
        default: 0,
      },
      total_tx: {
        type: String,
        default: '',
      },
      total_assets: {
        type: String,
        default: '',
      },
    },
  },
});

module.exports = mongoose.model("nfts", schema);