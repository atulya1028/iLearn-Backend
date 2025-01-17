import React, { useState, useEffect } from "react";
import "../styles/Cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import emptyBox from "../images/empty-box.png";
import { useNavigate } from "react-router-dom";
import '../styles/Cart.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const profileToken = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/cart/get", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();
        setCart(data.cartItems || []);
        setDeliveryInstructions(data.deliveryInstructions || "");
      } catch (error) {
        console.error("Error fetching cart data:", error.message);
      }
    };

    getCartItems();
  }, []);

  const handleQuantityChange = async (event, itemId, newQuantity) => {
    try {
      event.preventDefault();

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/cart/update/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedCart = await response.json();
      setCart(updatedCart.cartItems || []);
    } catch (error) {
      console.error("Error updating quantity:", error.message);
    }
    window.location.reload();
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/cart/proceed-to-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryInstructions }), // Ensure deliveryInstructions is included
      });

      if (!response.ok) {
        throw new Error("Failed to checkout");
      }

      const data = await response.json();
      console.log(data);
      navigate('/create-order');
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/cart/remove-from-cart/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      const updatedCart = await response.json();
      setCart(updatedCart.cartItems || []);
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
    window.location.reload();
  };

  const handleCart = () => {
    if (profileToken == null) {
      toast.error("Please sign in");
      console.log("Please sign in");
    } else {
      handleCheckout();
    }
  };

  return (
    <>
      <ToastContainer />
      <h4 className="heading">My Bag</h4>
      <div className="cart">
        <div className="main">
          <div className="block1">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div className="details" key={item._id}>
                  <div className="items">
                    <img
                      src={`http://localhost:8080/${item.book.image}`}
                      alt={item.book.title}
                      width={100}
                      height={150}
                    />
                    <span className="title-top">
                      <h6 style={{ width: "100px" }}>{item.book.title}</h6>
                      <h6>₹ {item.price}</h6>
                      <select
                        name="quantity"
                        id="quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            e,
                            item._id,
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                          <option key={qty} value={qty}>
                            {qty}
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <h6>₹ {item.price * item.quantity}</h6>
                        <FontAwesomeIcon icon={faTrash} size="1x" onClick={() => handleDeleteItem(item._id)} />
                      </span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <img src={emptyBox} className="empty-box" alt="Empty Cart" />
            )}
          </div>
          {cart.length > 0 && (
            <div className="order">
              <h5>Order Summary</h5>
              <div className="order-details">
                <h5>Amount Payable:</h5>
                <h5>
                  ₹{" "}
                  {cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </h5>
              </div>
              <div className="order-details">
                <h5>(includes GST)</h5>
              </div>
              <hr />
              <div className="order-details">
                <h5>Delivery instructions</h5>
              </div>
              <textarea
                name="deliveryInstructions"
                id="deliveryInstructions"
                cols="30"
                rows="7"
                style={{
                  width: "100%",
                  border: "1px solid black",
                  borderRadius: "5px",
                }}
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
              ></textarea>
              <button
                style={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                  marginTop: '10px'
                }}
                onClick={handleCart}
              >
                Proceed To Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
