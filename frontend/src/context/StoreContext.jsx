import { createContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";

// Create context
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:9000";
  const [token, setToken] = useState("");
  const [food_list,setFoodList] = useState([]);

  // Function to add an item to the cart
  const addToCart = async (itemId) => {
    if (!itemId) {
      console.error("Invalid itemId:", itemId);
      return;
    }
  
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error(
          "Error adding to cart:",
          error.response?.data || error.message
        );
      }
    }
  };
  

  // Function to remove an item from the cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
  
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error(
          "Error removing from cart:",
          error.response?.data || error.message
        );
      }
    }
  };
  
  

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };
  

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data?.foods) {
        setFoodList(response.data.foods);
      } else {
        console.error("Invalid food list response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching food list:", error.message);
    }
  };
  

  const loadCartData = async (token) =>
  {
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
  }
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      } else {
        console.warn("No token found in localStorage.");
      }
    }
    loadData();
  }, []);
  

  // Define context value
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  // Provide context value to children
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
