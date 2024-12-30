import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app';
import { UserContext } from '../contexts/UserContext';

export function PaymentQR() {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchOutstandingAmount();
    }
  }, [user]);

  const fetchOutstandingAmount = async () => {
    try {
      const db = firebase.firestore();
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      setAmount(userData.outstandingAmount || 0);
    } catch (error) {
      console.error('Error fetching outstanding amount:', error);
      setError('Failed to fetch outstanding amount. Please try again.');
    }
  };

  const generateQRCode = async () => {
    try {
      // In a real-world scenario, this would be a server-side API call
      const response = await fetch('https://api.example.com/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Failed to generate QR code. Please try again.');
    }
  };

  return (
    <div className="payment-qr">
      <h2>Make Payment</h2>
      {error && <p className="error">{error}</p>}
      <p>Outstanding Amount: ₹{amount}</p>
      <button onClick={generateQRCode} className="btn">Generate Paytm QR Code</button>
      {qrCode && (
        <div className="qr-code">
          <img src={qrCode} alt="Paytm QR Code" />
          <p>Scan this QR code with Paytm app to make the payment</p>
        </div>
      )}
    </div>
  );
}

