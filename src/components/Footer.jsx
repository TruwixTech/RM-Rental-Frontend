// Footer.jsx
import React from 'react'
import '../assets/csss/Footer.css'
import logo1 from '../assets/img/logo1.png'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
    <footer className='footer'>

        <div className="footer-top">
      <div className="footer-section-left">
        <img src={logo1} alt="Logo" className="footer-logo" />
       
        <p style={{marginTop: "15px", color: "grey"}}>
          Reach Out To Our Team Of Experienced Design Professionals For
          Personalized Consultation, Detailed Planning, And Seamless Execution
          Of Your Interior Design Project.
        </p>
      </div>
      <div className='footer-section-group'>

      
      <div className="footer-section">
        
        <h4>SHOPPING SERVICES</h4>
          <Link className='footer-link text-decoration-none'>Catalog</Link>
          <Link className='footer-link text-decoration-none'>Schedule Consultation</Link>
          <Link className='footer-link text-decoration-none'>Stores</Link>
          <Link className='footer-link text-decoration-none'>Trade program</Link>
        
      </div>
      <div className="footer-section">
        
          <h4>ABOUT</h4>
          <Link className='footer-link text-decoration-none'>Reviews</Link>
          <Link className='footer-link text-decoration-none'>Careers</Link>
          <Link className='footer-link text-decoration-none'>Financing</Link>
          <Link className='footer-link text-decoration-none'>Patents</Link>
          <Link className='footer-link text-decoration-none'>Our Blog</Link>
        
      </div>
      <div className="footer-section">
        
          <h4>RESOURCES</h4>
          <Link className='footer-link text-decoration-none'>Look Up Order Status</Link>
          <Link className='footer-link text-decoration-none'>Assembly Instructions</Link>
          <Link className='footer-link text-decoration-none'>Returns</Link>
          <Link className='footer-link text-decoration-none'>Shipping & Delivery</Link>
          <Link className='footer-link text-decoration-none'>FAQ</Link>
          <Link className='footer-link text-decoration-none'>Refer a Friend</Link>
        
      </div>
      <div className="footer-section">
        
        <h4>CONTACT</h4>
          <span>Email: support@RMrentals.com</span>
          <span>Hours:</span>
          <span>Monday to Friday — 10am to 8pm</span>
          <span>Saturday to Sunday — 10am to 2pm</span>
          <span>15 W 27th Street, 9th Floor NY, 10001</span>
        
      </div>
      </div>
    </div>
      <div className="footer-bottom">
        <p>&copy; Copyright 2024, RM Furnitures RENTALS All Rights Reserved</p>
        <p>
          <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
        </p>
      </div>
    </footer>
    </div>
  )
}

export default Footer