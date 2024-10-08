import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/iLearn.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUserCircle, faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import SideBars from "./SideBars";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import '../styles/Header.css';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [userProfile, setUserProfile] = useState(null);
  const [viewProfile, setViewProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [setSearchResults] = useState([]); // Fix: Removed extra 'set' from useState
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const navigate = useNavigate();
  const profileBoxRef = useRef(null); // Create a ref for the profile box

  const handleProfile = () => {
    setViewProfile(!viewProfile);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.refreshHeader) {
      console.log("Header refreshed!");
    }
  }, [location.state]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    handleProfile();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoggedIn(false);
          return;
        }

        const response = await fetch("http://localhost:8080/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
          localStorage.setItem('userId', data.user._id);
          setLoggedIn(true);
        } else {
          console.error("Profile Fetch Error:", response.statusText);
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error.message);
        setLoggedIn(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576 || window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/book/search?q=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        console.log(data);
        navigate(`/details/${searchTerm}`); 
      } else {
        console.error('Error searching:', response.statusText);
      }
    } catch (error) {
      console.error('Error searching:', error.message);
    }
  };

  const fetchCartItemsCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartItemsCount(0);
        return;
      }
  
      const response = await fetch("http://localhost:8080/api/cart/cart-items-count", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setCartItemsCount(data.cartItemCount);
      } else {
        console.error("Cart Items Count Fetch Error:", response.statusText);
      }
    } catch (error) {
      console.error("Cart Items Count Fetch Error:", error.message);
    }
  };

  useEffect(() => {
    fetchCartItemsCount();
  }, []);
  
  useEffect(() => {
    if (!loggedIn) {
      setCartItemsCount(0);
    } else {
      fetchCartItemsCount();
    }
  }, [loggedIn]);

  useEffect(() => {
    const fetchFavoriteCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setFavoriteCount(0);
          return;
        }

        const response = await fetch("http://localhost:8080/api/book/favorite-count", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavoriteCount(data.favoriteCount);
        } else {
          console.error("Favorite Count Fetch Error:", response.statusText);
        }
      } catch (error) {
        console.error("Favorite Count Fetch Error:", error.message);
      }
    };

    fetchFavoriteCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileBoxRef.current && !profileBoxRef.current.contains(event.target)) {
        setViewProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileBoxRef]);

  return (
    <>
      {isMobile ? (
        <>
          <header>
            <span className="head">
              <span>
                <FontAwesomeIcon
                  color="black"
                  fontSize={25}
                  icon={faBars}
                  onClick={toggleSidebar}
                  style={{
                    marginTop: "10px",
                    padding: "5",
                    marginLeft: "20",
                    marginRight: "20",
                    borderRadius: "5px",
                  }}
                />
                <img src={logo} alt="logo" className="logo-img" />
              </span>
              <span>
                <Link to='/favorite'> <FontAwesomeIcon icon={faHeart} className="fav" /></Link>
                <span className="favorite-count">{favoriteCount}</span>
                <Link to='/cart'>
                  <FontAwesomeIcon icon={faBagShopping} className="bag" />
                </Link>
                {cartItemsCount > 0 && <div className="cart-items-count">{cartItemsCount}</div>}
              </span>
            </span>
            <SideBars
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              loggedIn={loggedIn}
              handleLogout={handleLogout}
            />
          </header>
          <span className="search">
            <input
              className="search-box"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name"
            />
            <FontAwesomeIcon icon={faSearch} onClick={handleSearch} className="search">
              Search
            </FontAwesomeIcon>
          </span>
        </>
      ) : (
        <header className="head">
          <Link to="/">
            <img src={logo} width="220px" height="150px" alt="iLearn" />
          </Link>
          <input
            className="search-box"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Author, Name"
          />
          <FontAwesomeIcon icon={faSearch} onClick={handleSearch} className="search">
            Search
          </FontAwesomeIcon>
          <div>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link to='/favorite'> 
                <FontAwesomeIcon icon={faHeart} className="fav" />
              </Link>
              <span className="favorite-count">{favoriteCount}</span>
              <Link to='/cart'>
                <FontAwesomeIcon icon={faBagShopping} className="bag" />
              </Link>
              {cartItemsCount > 0 && <span className="cart-items-count">{cartItemsCount}</span>}
              <FontAwesomeIcon
                icon={faUserCircle}
                className="user-circle"
                onClick={handleProfile}
                style={{ cursor: "pointer" }}
              />
              {viewProfile ? (
                <div className="profile" ref={profileBoxRef}> {/* Attach the ref here */}
                  <div className="profile-box">
                    {loggedIn && userProfile ? (
                      <div style={{ fontSize: "15px" }}>
                        Welcome, <span>{userProfile.name}</span>
                      </div>
                    ) : (
                      <></>
                    )}
                    {loggedIn && userProfile ? (
                      <Link to='/login' className="login-register" onClick={handleLogout}>Logout</Link>
                    ) : (
                      <Link to="/login" className="login-register" onClick={handleProfile}>
                        Login/Register
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </span>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
