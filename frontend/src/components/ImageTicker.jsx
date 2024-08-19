import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ImageTicker.css'; // Import the CSS file

const ImageTicker = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const response = await axios.get('https://exr.et/api/user/ad'); // Replace with your actual endpoint
        console.log('Fetched image data:', response.data); // Debugging log
        setImageUrls(response.data.map(image => image.url));
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchImageUrls();
  }, []);

  useEffect(() => {
    console.log('Image URLs state:', imageUrls); // Debugging log
  }, [imageUrls]);

  return (
    <div className="overflow-hidden">
      <div className="flex -mx-4 img-ticker">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            className="w-64 mx-4 self-start flex-none"
            src={url}
            alt={`Image ${index + 1}`}
          />
        ))}
        {imageUrls.map((url, index) => (
          <img
            key={index + imageUrls.length}
            className="w-64 mx-4 self-start flex-none"
            src={url}
            alt={`Image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageTicker;

