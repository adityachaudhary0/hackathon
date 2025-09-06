# LT Line Fault Detection System

A cloud-based IoT system to detect breaks in low-tension power lines and automatically de-energize them to prevent disasters. The project includes a real-time dashboard for data visualization, alerts, and notifications.

## Project Structure

*   /midventure - Contains the Firebase Cloud Functions (the brain of the operation).
*   /firebase-simulator - Contains a Node.js simulator to test the cloud logic without hardware.
*   /dashboard - Frontend dashboard with real-time graphs, gauges, map view, alert and notification system for monitoring and visualization.

## Setup Instructions

### For the Cloud Functions (/midventure)
1.  cd midventure
2.  npm install in the functions folder to install dependencies.
3.  firebase deploy --only functions to deploy.

### For the Simulator (/firebase-simulator)
1.  cd firebase-simulator
2.  npm install to install the Firebase Admin SDK.
3.  Obtain a serviceAccountKey.json file from the Firebase Console and place it here.
4.  node simulator.js to run the test.

### For the Dashboard (/dashboard)
1.  cd dashboard/build
2.  npm install to install dependencies.
3.  Copy `src/config/firebase.example.js` to `src/config/firebase.js` and update with your Firebase config.
4.  See `FIREBASE_SETUP.md` for more details.
5.  npm run dev to start the dashboard locally.

#### Dashboard Features
- Real-time data visualization with charts and gauges
- Interactive map view
- Alert and notification system
- Hardware status monitoring
- Emergency controls