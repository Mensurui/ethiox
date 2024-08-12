import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Adjust path as needed

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [token] = useContext(UserContext); // Retrieve the token from context

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post('/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        },
      });
      setMessage('File uploaded successfully!');
    } catch (error) {
      setMessage('Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="title is-4">Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="file has-name is-boxed">
          <label className="file-label">
            <input className="file-input" type="file" accept="image/*" onChange={handleFileChange} />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fas fa-upload"></i>
              </span>
              <span className="file-label">Choose a file…</span>
            </span>
            {file && <span className="file-name">{file.name}</span>}
          </label>
        </div>
        <button className="button is-primary mt-4" type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="notification is-primary mt-4">{message}</p>}
    </div>
  );
};

export default ImageUpload;

