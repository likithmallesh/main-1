import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import { UserContext } from '../contexts/UserContext';

export function BookingForm() {
  const [cylinderType, setCylinderType] = useState('14.2kg');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to book a cylinder.');
      return;
    }

    try {
      const db = firebase.firestore();
      const bookingRef = await db.collection('bookings').add({
        userId: user.uid,
        cylinderType,
        quantity: parseInt(quantity),
        address,
        paymentMethod,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Update user's outstanding amount
      const cylinderPrices = {
        '5kg': 350,
        '14.2kg': 900,
        '19kg': 1200
      };
      const totalAmount = cylinderPrices[cylinderType] * quantity;

      await db.collection('users').doc(user.uid).update({
        outstandingAmount: firebase.firestore.FieldValue.increment(totalAmount)
      });

      alert('Booking successful!');
      if (paymentMethod === 'paytm') {
        history.push('/payment');
      } else {
        history.push('/history');
      }
    } catch (error) {
      console.error('Error booking cylinder:', error);
      setError('There was an error processing your booking. Please try again.');
    }
  };

  return (
    <div className="booking-form">
      <h2>Book a Cylinder</h2>
      {error && <p className="error">{error}</p>}
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

        <label htmlFor="paymentMethod">Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        >
          <option value="cod">Cash on Delivery</option>
          <option value="paytm">Paytm QR Code</option>
        </select>

        <button type="submit" className="btn">Book Now</button>
      </form>
    </div>
  );
}

