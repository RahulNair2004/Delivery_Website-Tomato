import userModel from '../models/userModel.js';

//add items to cart
const addToCart = async (req, res) => {
    try {
      const { userId, itemId } = req.body;
  
      if (!userId || !itemId) {
        return res.status(400).json({ success: false, message: "Missing userId or itemId" });
      }
  
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update cart data
      const cartData = user.cartData || {};
      cartData[itemId] = (cartData[itemId] || 0) + 1;
  
      // Save updated cart
      user.cartData = cartData;
      await user.save();
  
      res.status(200).json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
//remove items from cart
const removeFromCart = async (req, res) => {
    try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
        return res.json({ success: false, message: "User not found" });
      }
  
      let cartData = userData.cartData || {}; // Ensure cartData is initialized
  
      if (cartData[req.body.itemId] > 0) {
        cartData[req.body.itemId] -= 1;
  
        // If the quantity reaches 0, optionally delete the item
        if (cartData[req.body.itemId] === 0) {
          delete cartData[req.body.itemId];
        }
      }
  
      await userModel.findByIdAndUpdate(req.body.userId, { cartData });
      res.json({ success: true, message: "Removed from the Cart" });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error" });
    }
  };
  

// fetch user cart data
const getCart = async (req, res) => {
    try {
      const userData = await userModel.findById(req.body.userId);
      if (!userData) {
        return res.json({ success: false, message: "User not found" });
      }
  
      const cartData = userData.cartData || {}; // Ensure cartData is initialized
      res.json({ success: true, cartData });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error" });
    }
  };

export {addToCart, removeFromCart, getCart};