import React, { useEffect, useState } from "react";
import logo from "../images/iLearn.png";
import books from "../images/books.gif";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Payment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLessThan } from "@fortawesome/free-solid-svg-icons";

export const Payment = () => {
  const [shippingData, setShippingData] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/cart/get-checkout",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you have stored the token in localStorage
            },
          }
        );
        const data = await response.json();
        setCartItems(data.cartItems);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCartDetails();
  }, []);

  useEffect(() => {
    const fetchShippingDetails = async () => {
      let token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/cart/get-shipping-details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch shipping details");
        }
        const data = await response.json();
        setShippingData(data);
      } catch (error) {
        console.error("Error fetching shipping details:", error);
      }
    };

    fetchShippingDetails();
  }, []);

  useEffect(() => {
    const calculateSubtotal = () => {
      let total = 0;
      cartItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      setSubtotal(total);
    };

    calculateSubtotal();
  }, [cartItems]);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subtotal, // Use your subtotal
          currency: "INR",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Razorpay key id
        amount: data.amount, // Amount is in currency subunits
        currency: data.currency,
        name: "Your App Name",
        description: "Test Transaction",
        order_id: data.id, // Get the order ID from the response
        handler: function (response) {
          // Handle successful payment
          console.log(response);
          // You may want to save the payment details in your database here
        },
        prefill: {
          name: shippingData.name, // Change as per your data
          email: shippingData.email,
          contact: shippingData.contact, // Assuming you have this in your shipping data
        },
        theme: {
          color: "#F37254", // Change to your preferred color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const gotoHome = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="header-p">
        <img src={logo} alt="logo" onClick={gotoHome} className="logo-co" />
        <img src={books} alt="Book icon" className="books-co" />
      </div>
      <div className="payment-body">
        <div className="content">
          <div className="box1">
            <span className="one-line">
              <h6 className="short-font">Contact</h6>
              <h6 className="short-font">{shippingData.email}</h6>
              <Link to="/create-order" className="short-font change-link">
                <FontAwesomeIcon icon={faLessThan} />
                Change
              </Link>
            </span>
            <span className="one-line">
              <h6 className="short-font">Shipping Address</h6>
              <h6 className="short-font">{shippingData.name}</h6>
              <h6 className="short-font">{shippingData.address}</h6>
              <h6 className="short-font">{shippingData.city}</h6>
              <h6 className="short-font">{shippingData.state}</h6>
              <h6 className="short-font">{shippingData.zip}</h6>
              <Link to="/create-order" className="short-font change-link">
                <FontAwesomeIcon icon={faLessThan} />
                Change
              </Link>
            </span>
          </div>
          <div className="box2">
            <h4 className="final-price">Total Price: ₹ {subtotal}</h4>
            <button className="pay-now" onClick={handlePayment}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
