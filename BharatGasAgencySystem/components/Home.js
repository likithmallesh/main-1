import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="home">
      <h2>Welcome to Bharat Gas Agency System</h2>
      <p>Bharat Gas, a trusted name in LPG distribution, brings you convenient online booking for your gas cylinders.</p>
      <h3>Our Products</h3>
      <div className="cylinder-grid">
        {['5kg', '14.2kg', '19kg'].map((size) => (
          <div key={size} className="cylinder-card">
            <img src={`/cylinder-${size}.png`} alt={`${size} Cylinder`} />
            <h4>{size} Cylinder</h4>
            <p>{size === '5kg' ? 'Perfect for small families or occasional use.' :
               size === '14.2kg' ? 'Ideal for regular household use.' :
               'Best for large families or commercial use.'}</p>
            <Link to="/book" className="btn">Book Now</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

