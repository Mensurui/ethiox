import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Adjust path as needed

const ImageRemove = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [token] = useContext(UserContext); // Retrieve the token from context
  const [feedback, setFeedback] = useState(''); // For success or error messages
  const [loading, setLoading] = useState(false); // For loading state
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // API base URL

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/images`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error);
        setFeedback('Error fetching images.');
      }
    };

    fetchImages();
  }, [token, apiUrl]);

  const handleDelete = async () => {
    if (!selectedImage) {
      setFeedback('Please select an image to delete.');
      return;
    }

    setLoading(true);
    setFeedback('');

    try {
      await axios.delete(`${apiUrl}/admin/images`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        },
        params: {
          image_id: selectedImage, // Pass imageId as a query parameter
        },
      });
      setImages(images.filter(image => image.id !== selectedImage));
      setSelectedImage('');
      setFeedback('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      setFeedback('Error deleting image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="field">
        <label className="label" htmlFor="image-dropdown">Select an image:</label>
        <div className="control">
          <div className="select">
            <select
              id="image-dropdown"
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
            >
              <option value="">-- Select an Image --</option>
              {images.map(image => (
                <option key={image.id} value={image.id}>
                  {image.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <button
            className={`button is-danger ${loading ? 'is-loading' : ''}`}
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Selected Image
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`notification ${feedback.startsWith('Error') ? 'is-danger' : 'is-success'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default ImageRemove;

