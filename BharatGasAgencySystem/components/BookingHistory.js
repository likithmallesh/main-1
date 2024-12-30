import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import { UserContext } from '../contexts/UserContext';

export function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      const unsubscribe = db.collection('bookings')
        .where('userId', '==', user.uid)
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

  if (!user) {
    return <p>Please log in to view your booking history.</p>;
  }

  return (
    <div className="booking-history">
      <h2>Your Booking History</h2>
      {bookings.length === 0 ? (
        <p>You have no booking history yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Cylinder Type</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.timestamp.toDate().toLocaleDateString()}</td>
                <td>{booking.cylinderType}</td>
                <td>{booking.quantity}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

