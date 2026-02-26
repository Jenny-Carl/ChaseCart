import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="section__container footer__container">
        {/* Contact Info */}
        <div className="footer__col">
          <h4>CONTACT INFO</h4>
          <p>
            <span>
              <i className="ri-map-pin-2-line"></i>
            </span>
            550, Cumberland St, Ottawa
          </p>
          <p>
            <span>
              <i className="ri-mail-send-line"></i>
            </span>
            cegcapstoneproject@gmail.com
          </p>
          <p>
            <span>
              <i className="ri-phone-line"></i>
            </span>
            +1 555-123-4567
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer__col">
          <h4>QUICK LINKS</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
            <li>
              <a href="/shop">Shop</a>
            </li>
          </ul>
        </div>
      </footer>

        {/* Copyright */}
        <div className="footer__bar">
          <p>&copy; {new Date().getFullYear()} ChaseCart. All rights reserved.</p>
        </div>
    </>
  );
};

export default Footer;
