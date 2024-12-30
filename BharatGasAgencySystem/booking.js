// booking.js
export default {
    bookCylinder,
    getBookingHistory,
    sendBookingNotification
};

function bookCylinder(userId, cylinderType, quantity, address) {
    const db = firebase.firestore();
    const bookingRef = db.collection("bookings").doc();
    const userRef = db.collection("users").doc(userId);

    db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
            throw "User does not exist!";
        }

        const userData = userDoc.data();
        if (userData.cylindersAllocated <= 0) {
            throw "No cylinders available for booking!";
        }

        const newBooking = {
            userId: userId,
            cylinderType: cylinderType,
            quantity: parseInt(quantity),
            address: address,
            status: "pending",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        transaction.set(bookingRef, newBooking);
        transaction.update(userRef, {
            cylindersAllocated: userData.cylindersAllocated - parseInt(quantity),
            bookingHistory: firebase.firestore.FieldValue.arrayUnion(bookingRef.id)
        });
    })
    .then(() => {
        console.log("Booking successful");
        alert("Your booking has been placed successfully!");
        // Send email notification
        sendBookingNotification(userId, cylinderType, quantity);
    })
    .catch((error) => {
        console.error("Error booking cylinder:", error);
        alert("There was an error processing your booking. Please try again.");
    });
}

function getBookingHistory(userId) {
    const db = firebase.firestore();
    db.collection("bookings")
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
            const bookings = [];
            querySnapshot.forEach((doc) => {
                bookings.push({ id: doc.id, ...doc.data() });
            });
            console.log("Booking history:", bookings);
            // Display booking history in the UI
            displayBookingHistory(bookings);
        })
        .catch((error) => {
            console.error("Error getting booking history:", error);
        });
}

function sendBookingNotification(userId, cylinderType, quantity) {
    // Implement email notification logic here
    console.log(`Sending booking notification to user: ${userId} for ${quantity} ${cylinderType} cylinder(s)`);
}

function displayBookingHistory(bookings) {
    const mainContent = document.getElementById('mainContent');
    let historyHTML = '<h2>Your Booking History</h2>';
    
    if (bookings.length === 0) {
        historyHTML += '<p>You have no booking history yet.</p>';
    } else {
        historyHTML += '<table class="booking-history">';
        historyHTML += '<tr><th>Date</th><th>Cylinder Type</th><th>Quantity</th><th>Status</th></tr>';
        bookings.forEach(booking => {
            historyHTML += `
                <tr>
                    <td>${booking.timestamp.toDate().toLocaleDateString()}</td>
                    <td>${booking.cylinderType}</td>
                    <td>${booking.quantity}</td>
                    <td>${booking.status}</td>
                </tr>
            `;
        });
        historyHTML += '</table>';
    }
    
    mainContent.innerHTML = historyHTML;
}

