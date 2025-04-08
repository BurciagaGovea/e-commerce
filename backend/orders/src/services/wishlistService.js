import sequelize from "../config/database.js";
import { models } from "../models/index.js";
const {Orders, orderDetail, Wishlist} = models;

export const wishlistService = {
  getWishlist: async (user_id) => {
    try {
      const wishlist = await Wishlist.findAll({
        where: {
          user_id,
          is_active: true
        }
      });
      return wishlist;
    } catch (error) {
      console.error("Error getting wishlist: ", error);
      throw error;
    }
  },

  addToWishlist: async (user_id, product_id) => {
    try {
      const [item, created] = await Wishlist.findOrCreate({
        where: { user_id, product_id },
        defaults: {
          user_id,
          product_id,
          is_active: true
        }
      });

      if (!created && !item.is_active) {
        item.is_active = true;
        await item.save();
      }

      return item;
    } catch (error) {
      console.error("Error adding to wishlist: ", error);
      throw error;
    }
  },

  removeFromWishlist: async (user_id, product_id) => {
    try {
      const item = await Wishlist.findOne({
        where: { user_id, product_id }
      });

      if (!item) {
        return null;
      }

      item.is_active = false;
      await item.save();
      return item;
    } catch (error) {
      console.error("Error removing from wishlist: ", error);
      throw error;
    }
  }
};
