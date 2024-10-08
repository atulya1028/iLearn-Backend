import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import books from "../images/books.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight } from "@fortawesome/free-solid-svg-icons";
import favorite from "../images/favorite.png";
import favoriteFill from "../images/favorite-fill.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Home.css";

export default function Home() {
  const [booksData, setBooksData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [showMore, setShowMore] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites data
  useEffect(() => {
    let isMounted = true; // flag to track if the component is still mounted
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8080/api/book/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        if (isMounted) {
          setFavorites(data.favorites.map((fav) => fav._id));
        }
      } catch (error) {
        console.log("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
    return () => { isMounted = false; }; // cleanup function
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
      toast.success("Favorite added successfully");
    } catch (error) {
      toast.error("Favorite already added");
      console.log("Error adding to favorites:", error);
    }
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
      toast.success("Favorite removed successfully");
    } catch (error) {
      console.log("Error removing from favorites:", error);
    }
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch books data
  useEffect(() => {
    let isMounted = true; // flag to track if the component is still mounted
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        if (isMounted) {
          setBooksData(data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
    return () => { isMounted = false; }; // cleanup function
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="nav-container">
        <div className="banner">
          <div className="device-container">
            {isMobile ? (
              <p className="mobile-container">
                Discover diverse perspectives and ideas through our curated
                collection of books. We invite you to explore new worlds,
                challenge your thoughts, and connect with others through the
                transformative power of books.
              </p>
            ) : (
              <p className="notebook-container">
                Discover diverse perspectives and ideas through our curated
                collection of books. We invite you to explore new worlds,
                challenge your thoughts, and connect with others through the
                transformative power of books.
              </p>
            )}
            {isMobile ? (
              <>
                <button className="m-special-button">
                  Special for you{" "}
                  <FontAwesomeIcon
                    icon={faCircleRight}
                    size="sm"
                    color="green"
                  />
                </button>
                {isMobile ? (
                  <img src={books} alt="books" className="book-icon" />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <button className="special-button">
                Special for you{" "}
                <FontAwesomeIcon icon={faCircleRight} size="sm" color="green" />
              </button>
            )}
          </div>
          {!isMobile ? (
            <img src={books} alt="books" className="book-icon" />
          ) : (
            <></>
          )}
        </div>
        <div className="head-view">
          <h4>Best Selling Books</h4>
          <div onClick={toggleShowMore} className="view">
            {showMore ? "View Less" : "View More"}
          </div>
        </div>
        <hr style={{ marginLeft: "20px", marginRight: "20px" }} />
        <div style={{ paddingTop: "50px" }} />
        {showMore ? (
          <ul className="book-list">
            {booksData.map((book) => (
              <li key={book._id}>
                <div className="box-card">
                  <img
                    src={`http://localhost:8080/${book.image}`}
                    alt={book.title}
                    className="card-image"
                  />
                  <div>{book.title}</div>
                  <div>{book.author}</div>
                  <div>₹{book.price}</div>
                </div>
                <span style={{ display: "flex", gap: "10px", paddingTop: '10px' }}>
                  <Link to={`/details/${book.title}`} className="card-text">
                    <button className="add-cart">ADD TO CART</button>
                  </Link>
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
              </li>
            ))}
          </ul>
        ) : (
          <ul className="book-list">
            {booksData.slice(0, 6).map((book) => (
              <li key={book._id}>
                <Link
                  to={`/details/${book.title}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div className="box-card">
                    <img
                      src={`http://localhost:8080/${book.image}`}
                      alt={book.title}
                      className="card-image"
                    />
                    <div className="text-hover card-text">{book.title}</div>
                    <div className="text-hover">{book.author}</div>
                    <div className="text-hover">₹{book.price}</div>
                  </div>
                </Link>
                <span
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                  }}
                >
                  <Link to={`/details/${book.title}`}>
                    <button className="add-cart">ADD TO CART</button>
                  </Link>
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
              </li>
            ))}
          </ul>
        )}
        <div style={{ height: "50px" }} />
      </div>
    </>
  );
}
