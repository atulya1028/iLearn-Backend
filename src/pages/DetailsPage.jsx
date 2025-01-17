// DetailsPage.jsx

import React, { useState, useEffect } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import "../styles/Detail.css";
import favorite from "../images/favorite.png";
import favoriteFill from "../images/favorite-fill.png";
import { ToastContainer,toast } from "react-toastify";

const DetailsPage = () => {
  const param = useParams();
  const [book, setBook] = useState(null);
  const [selectedValue, setSelectedValue] = useState(1); 
  const [readMore, setReadMore] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [setTotalPrice] = useState(0);

  const navigate = useNavigate();

  // Fetch favorites data
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/api/book/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        setFavorites(data.favorites.map((fav) => fav._id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  // Function to check if a book is in favorites
  const isFavorite = (bookId) => favorites.includes(bookId);

  // Function to add a book to favorites
  const handleFavorite = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/book/add-to-favorites/${bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to favorites");
      }

      const updatedFavorites = [...favorites, bookId];
      setFavorites(updatedFavorites);
      console.log("Book added to favorites:", updatedFavorites);
      toast.success("Favorite added successfully");
    } catch (error) {
      toast.error("Favorite already added");
      console.error("Error adding to favorites:", error);
    }
    window.location.reload();
    window.location.reload();
  };

  // Function to remove a book from favorites
  const handleRemoveFavorite = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/book/remove-from-favorites/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from favorites");
      }

      const updatedFavorites = favorites.filter((favId) => favId !== bookId);
      setFavorites(updatedFavorites);
      console.log("Book removed from favorites:", updatedFavorites);
      toast.success("Favorite removed successfully");
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
    window.location.reload();
    window.location.reload();
  };

  const apiUrl = `http://localhost:8080/api/books/${param.title}`;

  const handleChange = (e) => {
    setSelectedValue(parseInt(e.target.value)); 
  };

  const handleReadMore = () => {
    setReadMore(!readMore);
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/add-to-cart/${param.title}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you have a token stored in localStorage
        },
        body: JSON.stringify({ price: book.price, quantity: selectedValue }), // Send the selected quantity
      });
      const data = await response.json();
      console.log(data); // You can handle the response here

      // Update state to show total price
      setTotalPrice(data.totalPrice);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    window.location.reload();
  };

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [apiUrl]);
  
  const handlePayNow = () =>{
    handleAddToCart();
    navigate('/create-order');
  }

  return (
    <div className="detail-container">
      <ToastContainer/>
      {book && (
        <Link to={`/details/${book.title}`} className="link-to-details">
          View Details
        </Link>
      ) ? (
        <div>
          <div className="block">
            <img
              src={`http://localhost:8080/${book.image}`}
              alt={book.title}
              className="detail-image"
            />
            <div className="sub-block">
              <div className="block2">
                <h1 className="title">{book.title}</h1>
                <h6 className="author">{book.author}</h6>
              </div>
              <div className="block3">
                <h3>
                  ₹{parseFloat(book.price).toFixed(2)}
                </h3>
                <span>
                <img
                      src={isFavorite(book._id) ? favoriteFill : favorite}
                      alt="Favorite"
                      className="favorite-icon"
                      onClick={() =>
                        isFavorite(book._id)
                          ? handleRemoveFavorite(book._id)
                          : handleFavorite(book._id)
                      }
                      width={20}
                      height={20}
                    />
                </span>
              </div>
              <select
                value={selectedValue}
                onChange={handleChange}
                className="drop-down"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <div className="btn-setting">
                <div className="btn-handle">
                  <button className="cart-b" onClick={handleAddToCart}>ADD TO CART</button>
                  <button className="buy-b" onClick={handlePayNow}>BUY NOW</button>
                </div>
              </div>
              <div className="desc-setting">
                <h2>Description</h2>
                <div style={{ display: "flex" }}>
                  <div>
                    {book.description ? (
                      <p className="desc">
                        {readMore ? book.description : book.description.slice(0, 100) + '...'}
                      </p>
                    ) : (
                      <p className="desc">Description not available</p>
                    )}
                    <div onClick={handleReadMore} className="read">
                      {readMore ? "View Less" : "View More"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 style={{ textDecoration: "underline" ,paddingLeft:'20px'}}>Product Details</h3>
          <table>
            <tbody>
              <tr>
                <th>Title:</th>
                <td>{book.title}</td>
              </tr>
              <tr>
                <th>Author:</th>
                <td>{book.author}</td>
              </tr>
              <tr>
                <th>SKU:</th>
                <td>{book.sku}</td>
              </tr>
              <tr>
                <th>EAN:</th>
                <td>{book.ean}</td>
              </tr>
              <tr>
                <th>Language:</th>
                <td>{book.language}</td>
              </tr>
              <tr>
                <th>Binding:</th>
                <td>{book.binding}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DetailsPage;
