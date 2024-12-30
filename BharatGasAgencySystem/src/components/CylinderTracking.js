import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import { UserContext } from '../contexts/UserContext';

export function CylinderTracking() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      const unsubscribe = db.collection('bookings')
        .where('userId', '==', user.uid)
        .where('status', 'in', ['pending', 'processing', 'out_for_delivery'])
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          const bookingsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBookings(bookingsData);
        });

      return () => unsubscribe();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '🕒';
      case 'processing':
        return '🏭';
      case 'out_for_delivery':
        return '🚚';
      default:
        return '❓';
    }
  };

  return (
    <div className="cylinder-tracking">
      <h2>Cylinder Tracking</h2>
      {bookings.length === 0 ? (
        <p>No active bookings to track.</p>
      ) : (
        <ul className="tracking-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="tracking-item">
              <div className="tracking-icon">{getStatusIcon(booking.status)}</div>
              <div className="tracking-details">
                <p><strong>Booking ID:</strong> {booking.id}</p>
                <p><strong>Cylinder Type:</strong> {booking.cylinderType}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Status:</strong> {booking.status.replace('_', ' ').toUpperCase()}</p>
                <p><strong>Booked On:</strong> {booking.timestamp.toDate().toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

