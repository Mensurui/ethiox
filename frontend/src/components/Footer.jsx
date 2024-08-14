import React from 'react';

const Footer = () => {
  return (
    <footer className="section has-background-dark has-text-white-ter">
      <div className="container">
        <div className="columns">
          {/* Developer Info */}
          <div className="column">
            <h3 className="title is-3 has-text-white">Developer</h3>
            <p className="mb-4">
              <strong>Name:</strong> Mensur Khalid
            </p>
            <p className="mb-4">
              <strong>Phone:</strong> +251 9-2891-6837
            </p>
            <p className="mb-4">
              <strong>Email:</strong> mensurk3000@gmail.com
            </p>
            <p className="mb-4">
              <strong>Location:</strong> Addis Ababa, Ethiopia
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="column">
            <h3 className="title is-3 has-text-white">Connect with me</h3>
            <div className="social-icons">
              <a href="https://twitter.com/arete_sage" className="icon is-large has-text-white mr-3">
                <i className="fab fa-twitter fa-2x"></i>
              </a>
              <a href="https://www.linkedin.com/in/mensur-khalid-7422791aa/" className="icon is-large has-text-white mr-3">
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
              <a href="https://instagram.com/sink.ingboat" className="icon is-large has-text-white">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

