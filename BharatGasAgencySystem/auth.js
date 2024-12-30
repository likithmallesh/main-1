// auth.js
export default {
    registerUser,
    loginUser,
    logoutUser,
    initializeUserData
};

function registerUser(name, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User registered successfully
            const user = userCredential.user;
            console.log("User registered:", user.uid);
            // Initialize user data in Firestore
            initializeUserData(user.uid, name, email);
        })
        .catch((error) => {
            console.error("Registration error:", error.message);
            alert("Registration failed: " + error.message);
        });
}

function loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User logged in successfully
            const user = userCredential.user;
            console.log("User logged in:", user.uid);
            alert("Login successful!");
            // Redirect to home page or dashboard
            window.location.hash = '#home';
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            alert("Login failed: " + error.message);
        });
}

function logoutUser() {
    firebase.auth().signOut()
        .then(() => {
            console.log("User logged out");
            alert("You have been logged out.");
            // Redirect to home page
            window.location.hash = '#home';
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
        });
}

function initializeUserData(userId, name, email) {
    const db = firebase.firestore();
    db.collection("users").doc(userId).set({
        name: name,
        email: email,
        cylindersAllocated: 12,
        bookingHistory: []
    })
    .then(() => {
        console.log("User data initialized");
        alert("Registration successful! You can now log in.");
        // Redirect to login page
        window.location.hash = '#login';
    })
    .catch((error) => {
        console.error("Error initializing user data:", error);
    });
}

