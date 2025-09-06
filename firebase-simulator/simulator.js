// simulator.js
const admin = require('firebase-admin');

console.log("🔁 Starting LIVE data simulator...");
console.log("Press Ctrl+C to stop the simulation.");

// 1. Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://midventure-13334-default-rtdb.firebaseio.com' // USE YOUR URL
});

const db = admin.firestore();
const deviceId = 'esp32_line_1'; // Your device ID

// Function to generate a random value within a range (for realistic data)
function getRandomFloat(min, max, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// Function to send a new reading to Firestore
async function sendReading() {
  // Simulate realistic data: current between 4A and 6A, voltage between 220V and 240V
  const normalData = {
    current: getRandomFloat(4.0, 6.0),
    voltage: getRandomFloat(220, 240),
    timestamp: new Date()
  };

  const readingsRef = db.collection('sensors').doc(deviceId).collection('readings');

  try {
    await readingsRef.add(normalData);
    console.log(`📤 Live data sent: ${normalData.current}A, ${normalData.voltage}V`);
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

// Function to simulate a line break fault
function simulateFault() {
  console.log('\n🚨 SIMULATING LINE BREAK FAULT IN 5 SECONDS...\n');
  setTimeout(() => {
    const faultData = {
      current: 0.05, // Current drops to near zero
      voltage: 0,    // Voltage drops to zero
      timestamp: new Date()
    };

    const readingsRef = db.collection('sensors').doc(deviceId).collection('readings');
    readingsRef.add(faultData)
      .then(() => {
        console.log('🚨🚨🚨 FAULT INJECTED: Current=0.05A, Voltage=0V');
        console.log('The cloud function should detect this and send a TURN_OFF command.');
      })
      .catch(error => console.error('Error sending fault data:', error));
  }, 5000);
}

// Start the continuous simulation
console.log("Emitting live sensor data every 3 seconds...");
// Send data every 3000 milliseconds (3 seconds)
const intervalId = setInterval(sendReading, 3000);

// Listen for a keyboard interrupt to stop the simulation cleanly
process.on('SIGINT', () => {
  console.log('\n\nStopping live simulation...');
  clearInterval(intervalId);
  process.exit();
});

// Optional: Uncomment the line below to automatically simulate a fault after 30 seconds.
setTimeout(simulateFault, 30000);