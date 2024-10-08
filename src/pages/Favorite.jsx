import React, { useState, useEffect } from 'react';
import '../styles/Favorite.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/book/favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the JWT token in localStorage
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        setFavorites(data.favorites);
      } catch (error) {
        console.error(error);
        // Handle error, show message to the user, etc.
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/book/remove-from-favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the JWT token in localStorage
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      // Remove the favorite from the local state
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite._id !== favoriteId)
      );
    } catch (error) {
      console.error(error);
      // Handle error, show message to the user, etc.
    }
    window.location.reload();
  };


  return (
    <div className='favorite'>
      <div style={{ margin: '50px' }} className='data'>
        {favorites.map((favorite) => (
          <div key={favorite._id}>
            <img src={`http://localhost:8080/${favorite.image}`} alt={favorite.title} width={100} height={150} />
            <h4 style={{fontSize:'20px'}}>{favorite.title}</h4>
            <span className='flex-display'>
              <button className='add-to-cart'>Add To Bag</button>
              <FontAwesomeIcon icon={faTrash} onClick={()=>handleRemoveFavorite(favorite._id)}/>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
