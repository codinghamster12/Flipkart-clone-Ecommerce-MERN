import { cartConstants } from "./constants";
import store from "../store";
import axios from "../helpers/axios";


const getCartItems = () => {
  return async (dispatch) => {

    try {
      dispatch({
        type: cartConstants.ADD_TO_CART_REQUEST,
      });

      console.log('get cart items - cart.js')
      const res = await axios.post(`/user/cart/getCartItems`);
      
      if (res.status === 200) {
        const { cartItems } = res.data;
        console.log(cartItems);
        if (cartItems) {
          dispatch({
            type: cartConstants.ADD_TO_CART_SUCCESS,
            payload: { cartItems },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const addToCart = (product, newQty = 1) => {
  return async (dispatch) => {

    const {
      cart: { cartItems },
      auth,
    } = store.getState();
    const qty = cartItems[product._id]
      ? parseInt(cartItems[product._id].qty + newQty)
      : 1;
    cartItems[product._id] = {
      ...product,
      qty,
    };

    console.log('add to cart - cart.js')

    if (auth.authenticate) {
      dispatch({
        type: cartConstants.ADD_TO_CART_REQUEST,
      });

      const payload = {
        cartItems: [
          {
            product: product._id,
            quantity: qty,
          },
        ],
      };
      const res = await axios.post(`/user/cart/addtocart`, payload);
      console.log(res);
      if (res.status === 201) {
        dispatch(getCartItems());
      }
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));

    dispatch({
      type: cartConstants.ADD_TO_CART_SUCCESS,
      payload: {
        cartItems,
      },
    });
  };
};

export const updateCart = () => {
  return async (dispatch) => {
    const auth= store.getState().auth
    const cartItems = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;

      console.log('update - cart.js')

    if (auth.authenticate) {
      localStorage.removeItem("cart");
      console.log('remove local storage cart')

      if (cartItems) {
        const payload = {
          cartItems: Object.keys(cartItems).map((key, index) => {
            return {
              quantity: cartItems[key].quantity,
              product: cartItems[key]._id,
            };
          }),
        };

        if (Object.keys(cartItems).length > 0) {
          const res = await axios.post(`user/cart/addtocart`, payload);
          if (res.status === 201) {
            dispatch(getCartItems());
          }
        }
      }
    } else {
      if (cartItems) {
        dispatch({
          type: cartConstants.ADD_TO_CART_SUCCESS,
          payload: {
            cartItems,
          },
        });
      }
    }
  };
};

export { getCartItems };
