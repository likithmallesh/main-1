import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  const cylinders = [
    {
      size: '5kg',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/KO/QG/XG/3775979/5-kg-lpg-gas-cylinder-500x500.jpg',
      description: 'Perfect for small families or occasional use.'
    },
    {
      size: '14.2kg',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/ZV/NM/VE/3775979/14-2-kg-lpg-gas-cylinder-500x500.jpg',
      description: 'Ideal for regular household use.'
    },
    {
      size: '19kg',
      image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/UD/DP/MY/3775979/19-kg-lpg-gas-cylinder-500x500.jpg',
      description: 'Best for large families or commercial use.'
    }
  ];

  return (
    <div className="home">
      <h2>Welcome to Bharat Gas Agency System</h2>
      <p>Bharat Gas, a trusted name in LPG distribution, brings you convenient online booking for your gas cylinders.</p>
      <h3>Our Products</h3>
      <div className="cylinder-grid">
        {cylinders.map((cylinder) => (
          <div key={cylinder.size} className="cylinder-card">
            <img src={cylinder.image} alt={`${cylinder.size} Cylinder`} />
            <h4>{cylinder.size} Cylinder</h4>
            <p>{cylinder.description}</p>
            <Link to="/book" className="btn">Book Now</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

