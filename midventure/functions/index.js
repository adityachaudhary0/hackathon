// Import the v2 version of the Functions SDK
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
// Import the Firebase Admin SDK
const admin = require("firebase-admin");

// Initialize the Admin SDK
admin.initializeApp({
  databaseURL: "https://midventure-13334-default-rtdb.firebaseio.com" // <-- ADD THIS LINE
});

// This is our detection algorithm!
// It triggers every time a new sensor reading is added to the "sensors" collection.
exports.monitorLineFault = onDocumentCreated("sensors/{deviceId}/readings/{readingId}", async (event) => {
  // Get the data from the new document
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No data associated with the event");
    return;
  }

  const data = snapshot.data();

  // Your detection logic here!
  // Example simple logic: If current is near zero.
  const current = data.current;
  const voltage = data.voltage;

  // 1. Check for a break (this is a simple threshold)
  if (current < 0.1) { // Adjust this threshold based on your sensor
    console.log("⚠️ Fault detected! Current dropped to:", current);

    // 2. Get the device ID from the context
    const deviceId = event.params.deviceId;

    // 3. Send a command to the Realtime Database to TURN OFF
    const ref = admin.database().ref("commands/" + deviceId);
    await ref.set("TURN_OFF"); // This is what the ESP32 will listen for.

    // 4. (Optional) You can also send an SMS here using Twilio API.
    console.log("➡️ TURN_OFF command sent for device:", deviceId);
  }
});