import React, { useState, useContext } from 'react';
import firebase from 'firebase/app';
import { UserContext } from '../contexts/UserContext';

export function Feedback() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { user } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = firebase.firestore();
      await db.collection('feedback').add({
        userId: user.uid,
        rating,
        comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (submitted) {
    return <div className="feedback-success">Thank you for your feedback!</div>;
  }

  return (
    <div className="feedback">
      <h2>Provide Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating:</label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} Star{value !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn">Submit Feedback</button>
      </form>
    </div>
  );
}

