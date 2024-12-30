import React, { useState, useContext } from 'react';
import firebase from 'firebase/app';
import { UserContext } from '../contexts/UserContext';

export function BookingForm() {
  const [cylinderType, setCylinderType] = useState('14.2kg');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book a cylinder.');
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection('bookings').add({
        userId: user.uid,
        cylinderType,
        quantity: parseInt(quantity),
        address,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('Booking successful!');
      setCylinderType('14.2kg');
      setQuantity(1);
      setAddress('');
    } catch (error) {
      console.error('Error booking cylinder:', error);
      alert('There was an error processing your booking. Please try again.');
    }
  };

  return (
    <div className="booking-form">
      <h2>Book a Cylinder</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cylinderType">Cylinder Type:</label>
        <select
          id="cylinderType"
          value={cylinderType}
          onChange={(e) => setCylinderType(e.target.value)}
          required
        >
          <option value="5kg">5 KG Cylinder</option>
          <option value="14.2kg">14.2 KG Cylinder</option>
          <option value="19kg">19 KG Cylinder</option>
        </select>

        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          max="2"
          required
        />

        <label htmlFor="address">Delivery Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></textarea>

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

