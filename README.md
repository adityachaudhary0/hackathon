# LT Line Fault Detection System

A cloud-based IoT system to detect breaks in low-tension power lines and automatically de-energize them to prevent disasters.

## Project Structure

*   /midventure - Contains the Firebase Cloud Functions (the brain of the operation).
*   /firebase-simulator - Contains a Node.js simulator to test the cloud logic without hardware.

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