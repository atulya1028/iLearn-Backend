import React, { useState, useEffect } from "react";
import "../styles/CreateOrder.css";
import logo from "../images/iLearn.png";
import books from "../images/books.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLessThan } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../pages/Footer";

export const CreateOrder = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    country: "India",
    saveInfo: false,
    deliveryInstructions: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState([]);
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

    // Load form data from localStorage
    const savedFormData = JSON.parse(localStorage.getItem("formData"));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);

  useEffect(() => {
    const calculateSubtotal = () => {
      let total = 0;
      cartItems.forEach((item) => {
        total += item.price * item.quantity;
      });
      setSubtotal(total);
      setTotal(total);
    };

    calculateSubtotal();
  }, [cartItems]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8080/api/cart/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you have stored the token in localStorage
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data);
      navigate("/payment");

      localStorage.setItem("formData", JSON.stringify(formData));
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
      <div className="header">
        <img src={logo} alt="logo" onClick={gotoHome} className="logo-co" />
        <img src={books} alt="Book icon" height={250} className="books-co" />
      </div>
      <div className="flex-box">
        <div className="shipping-details">
          <h3>Shipping address</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="country-box">
              <label htmlFor="country">Country/Region</label>
              <br />
              <select
                name="country"
                id="country"
                className="country-choice"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              >
                <option value="India">India</option>
              </select>
            </div>
            <br />
            <span className="intro">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </span>
            <br />
            <input
              type="text"
              placeholder="Address"
              className="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Apartment, suites,etc. (optional)"
              className="apartment"
              value={formData.apartment}
              onChange={(e) =>
                setFormData({ ...formData, apartment: e.target.value })
              }
            />
            <br />
            <br />
            <span className="loc">
              <input
                type="text"
                placeholder="City"
                className="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
              <div className="state-box">
                <label htmlFor="state">State</label>
                <select
                  name="state"
                  id="state"
                  className="state-choice"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData({ ...formData, state: e.target.value });
                    console.log(e.target.value)
                  }
                  }
                >
                  <option value="Andaman and Nicobar">
                    Andaman and Nicobar Islands
                  </option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">
                    Dadra and Nagar Haveli and Daman and Diu
                  </option>
                  <option value="Delhi (National Capital Territory of Delhi)">Delhi (National Capital Territory of Delhi)</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharastra">Maharastra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Sikkim">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bangal">West Bengal</option>
                </select>
              </div>
              <input
                type="number"
                name="pincode"
                id="pincode"
                placeholder="PIN code"
                className="pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
              />
            </span>
            <input
              type="number"
              name=""
              id=""
              className="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <br />
            <br />
            <span className="check-box">
              <input
                type="checkbox"
                className="save"
                checked={formData.saveInfo}
                onChange={(e) =>
                  setFormData({ ...formData, saveInfo: e.target.checked })
                }
              />
              &nbsp;
              <h6 className="save-info">Save this information for next time</h6>
            </span>
            <span className="to-cart">
              <Link to="/cart" className="cart-btn">
                <FontAwesomeIcon icon={faLessThan} color="black" size="1xs" />
                &nbsp; &nbsp;
                <h6 style={{ fontSize: "12px" }}> Return to cart</h6>
              </Link>
              <button type="submit" className="shipping-btn">
                Continue to shipping
              </button>
            </span>
          </form>
        </div>
        <div className="item-details">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <>
                <span key={item._id} className="book-box">
                  <img
                    src={`http://localhost:8080/${item.book.image}`}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h5 className="text">{item.book.title}</h5>
                  <h5 className="text">₹ {item.price}</h5>
                </span>
                <br />
                <div className="subtotal">
                  <h6>Subtotal</h6>
                  <h6>₹ {subtotal}</h6>
                </div>
                <br />
              {/*   <div className="ship">
                  <h6>Shipping</h6>
                  <h6>Calculated at next step</h6>
                </div> */}
                <br />
                <div className="order-total">
                  <h3>Total</h3>
                  <span className="price">
                    <h6 className="inr">INR</h6>
                    &nbsp;
                    <h3>₹ {total}</h3>
                  </span>
                </div>
              </>
            ))
          ) :<p>Np items in the cart</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};
