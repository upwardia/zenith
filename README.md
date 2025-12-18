# Zenith

Zenith is the codebase for the mobile app for Upwardia - a platform designed to help you build healthy habits, earn rewards, and protect your family's future.

## Prerequisites

Before you start, you need to install a few tools on your computer.

### 1. Node.js (Required)
This is the environment needed to run the app.
- **Windows / Mac**: [Download Node.js LTS](https://nodejs.org/).
- Install it and keep clicking "Next" until finished.

### 2. Git (Required)
This tool downloads the code.
- **Windows**: [Download Git for Windows](https://git-scm.com/download/win).
- **Mac**: You likely already have it. If not, [Download Git for Mac](https://git-scm.com/download/mac).


---

## Installation

### Step 1: Download the Code
1.  Open **Command Prompt** (Windows) or **Terminal** (Mac).
2.  Navigate to where you want to save the project (e.g., your Desktop):
    ```bash
    cd Desktop
    ```
3.  Clone the repository:
    ```bash
    git clone <YOUR_REPOSITORY_URL_HERE>
    ```
    *(If you don't have the URL, you can download the ZIP file from GitHub, extract it, and open that folder).*

### Step 2: Install Dependencies
1.  In your terminal, navigate into the project folder:
    ```bash
    cd <project-folder-name>
    ```
    *(Replace `<project-folder-name>` with the name of the folder created by git clone, e.g., `zenith`)*

2.  Type the following command and press Enter:
    ```bash
    npm install
    ```
    *This looks for the `package.json` file and installs all the necessary libraries. It might take a few minutes.*

---

## Running the App (Expo Go)

The easiest way to run the app is on your physical phone.

### Step 1: Install Expo Go
-   **iOS**: Download [Expo Go from the App Store](https://apps.apple.com/us/app/expo-go/id982107779).
-   **Android**: Download [Expo Go from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent).

### Step 2: Start the Server
1.  In your terminal, make sure you are inside the project folder, then type:
    ```bash
    npx expo start
    ```
2.  You will see a QR code appear in the terminal.

### Step 3: Run on Phone
1.  Make sure your **Phone** and **Computer** are on the **SAME Wi-Fi network**.
2.  **Android**: Open Expo Go app -> Scan QR Code.
3.  **iOS**: Open default Camera app -> Scan QR Code -> Tap the notification to open in Expo Go.

The app should now load on your phone!

---

## Troubleshooting

-   **"Command not found"**: Ensure you installed Node.js and restarted your computer/terminal.
-   **App stuck on "Loading"**: Double-check that your phone and computer are on the exact same Wi-Fi network.
-   **Metro Bundler Error**: Press `Ctrl + C` in the terminal to stop the process, then run `npx expo start -c` to clear the cache.

---

## Features

-   **Daily Dashboard**: Track your daily progress, streak, and points.
-   **Missions**: Complete health, money, and mind missions to earn points.
-   **Wallet**: View your balance, transaction history, and redeem rewards.
-   **Profile**: Manage your account and view stats.

## Tech Stack

-   **Framework**: React Native (Expo)
-   **Language**: TypeScript
-   **Styling**: NativeWind (Tailwind CSS)
-   **State**: Zustand & TanStack Query
