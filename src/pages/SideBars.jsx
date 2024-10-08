import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignIn, faInfoCircle, faContactCard, faBusinessTime, faSignOut } from "@fortawesome/free-solid-svg-icons";

const SideBars = ({ isOpen, toggleSidebar, loggedIn, handleLogout }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fetch user profile data when the component mounts
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    fetch("http://localhost:8080/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the JWT token in the Authorization header
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the response contains the user's name under the 'name' property
        setUserName(data.user.name);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        // Handle error or redirect to login page if unauthorized
      });
  };

  const handleMenuItemClick = () => {
    toggleSidebar(); // Close the sidebar when a menu item is clicked
  };

  const handleLoginClick = () => {
    toggleSidebar(); // Toggle the sidebar when the Login/Register button is clicked
  };

  const handleLogoutClick = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Update the logged-in state or any other relevant state
    handleLogout();
    // Close the sidebar
    toggleSidebar();
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
      <p style={{margin:'10px'}}>Welcome, {userName}</p>
      <List>
        <ListItem button component={Link} to="/" onClick={handleMenuItemClick}>
          <ListItemText>
            <FontAwesomeIcon icon={faHome} color="blue" /> Home
          </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/about-us" onClick={handleMenuItemClick}>
          <ListItemText>
            <FontAwesomeIcon icon={faInfoCircle} color="blue" /> About Us
          </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/contact" onClick={handleMenuItemClick}>
          <ListItemText>
            <FontAwesomeIcon icon={faContactCard} color="blue" /> Contact Us
          </ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/business" onClick={handleMenuItemClick}>
          <ListItemText>
            <FontAwesomeIcon icon={faBusinessTime} color="blue" /> Business
          </ListItemText>
        </ListItem>
        {loggedIn ? (
          <>
            <ListItem>
              <ListItemText>{userName}</ListItemText>
            </ListItem>
            <ListItem button component={Link} to="/" onClick={handleLogoutClick}>
              <ListItemText>
                <FontAwesomeIcon icon={faSignOut} color="blue" /> Logout
              </ListItemText>
            </ListItem>
          </>
        ) : (
          <ListItem button component={Link} to="/login" onClick={handleLoginClick}>
            <ListItemText>
              <FontAwesomeIcon icon={faSignIn} color="blue" /> Login/Register
            </ListItemText>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default SideBars;
