const admin = require('firebase-admin');

console.log("1. Starting simulator...");

// 1. Initialize Firebase Admin SDK with the private key
try {
  const serviceAccount = require('./serviceAccountKey.json');
  console.log("2. Service account key loaded successfully.");
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://midventure-13334-default-rtdb.firebaseio.com'
  });
  console.log("3. Firebase Admin initialized successfully.");
} catch (error) {
  console.error("CRITICAL ERROR INITIALIZING FIREBASE:", error.message);
  console.error("Make sure serviceAccountKey.json is in the same folder and has valid JSON.");
  process.exit(1);
}

// Get references to the Firestore and Realtime Database
const db = admin.firestore();
const rtdb = admin.database();
console.log("4. Got database references.");

// Define a "device ID" for our simulator
const deviceId = 'esp32_line_1';

// 2. Listen for Commands (Like the ESP32 would)
console.log('5. Setting up listener for commands...');
const commandRef = rtdb.ref('commands/' + deviceId);

commandRef.on('value', (snapshot) => {
  const command = snapshot.val();
  console.log("6. Checking for commands...");
  if (command) {
    console.log('RECEIVED COMMAND FROM CLOUD: ', command);
    console.log('--> Simulator would now cut power to the line! <--');
    commandRef.set(null);
  }
});

// 3. Send Fake Sensor Data
function sendNormalData() {
  console.log("7. Preparing to send NORMAL data...");
  const readingsRef = db.collection('sensors').doc(deviceId).collection('readings');
  const normalData = {
    current: 5.7,
    voltage: 223,
    timestamp: new Date()
  };

  readingsRef.add(normalData)
    .then(() => console.log('Sent NORMAL data: Current=5.7A, Voltage=223V'))
    .catch(error => console.error('Error sending data:', error));
}

function sendFaultData() {
  console.log("8. Preparing to send FAULT data...");
  const readingsRef = db.collection('sensors').doc(deviceId).collection('readings');
  const faultData = {
    current: 0.05,
    voltage: 0,
    timestamp: new Date()
  };

  readingsRef.add(faultData)
    .then(() => console.log('Sent FAULT data: Current=0.05A, Voltage=0V'))
    .catch(error => console.error('Error sending fault data:', error));
}

// 4. Run the simulation
console.log("9. Starting simulation in 3 seconds...");
setTimeout(() => {
  console.log('--- Simulating NORMAL operation ---');
  sendNormalData();

  setTimeout(() => {
    console.log('--- Simulating a LINE BREAK ---');
    sendFaultData();
  }, 5000);

}, 3000);