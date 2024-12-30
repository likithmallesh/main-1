import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Home } from './components/Home';
import { BookingForm } from './components/BookingForm';
import { BookingHistory } from './components/BookingHistory';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { UserContext } from './contexts/UserContext';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="app">
          <header>
            <div className="logo-container">
              <img src="/bharat-gas-logo.png" alt="Bharat Gas Logo" className="logo" />
              <h1>Bharat Gas Agency System</h1>
            </div>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/book">Book Cylinder</Link></li>
                <li><Link to="/history">Booking History</Link></li>
                {user ? (
                  <li><button onClick={() => firebase.auth().signOut()}>Logout</button></li>
                ) : (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </header>

          <main>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/book" component={BookingForm} />
              <Route path="/history" component={BookingHistory} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Switch>
          </main>

          <footer>
            <p>&copy; 2023 Bharat Gas Agency System. All rights reserved.</p>
          </footer>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

