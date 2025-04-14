# 🚨 Women Safety Network App

A **community-powered** women safety app that detects emergencies through **voice-recognized codewords** and alerts **nearby users** to assist in real-time.

---

![App Preview](safeHerPreview.png)

---

## ✨ Features

- 🎙️ **Codeword-Based Emergency Trigger**  
  Detects distress codewords in the background and automatically triggers alerts.

- 📍 **Real-Time Location Sharing**  
  Sends **live location** to emergency contacts and **nearby responders**.

- ⚠️ **Community SOS Alerts**  
  Notifies **registered users** within a configurable radius (500m–1km).

- 🗺️ **Safety Map & Heatmaps**  
  Highlights safe zones and high-risk areas based on real-time community data.

- 🛡️ **AI & Security Suite**  
  Includes **NLP & Sentiment Analysis** to reduce false triggers and **end-to-end encryption** for privacy protection.

---

## 🏗️ Tech Stack

### 📱 Frontend

- **React Native (Expo Go)** – Cross-platform mobile development
- **Tailwind CSS** – Utility-first responsive UI styling
- **React Navigation** – Smooth and intuitive navigation
- **React Native Background Service** – Runs codeword recognition in the background

### 🖥️ Backend

- **Firebase Firestore** – Real-time NoSQL database
- **Firebase Authentication** – Secure user authentication

### 🔗 APIs & Services

- **Twilio API** – Emergency **calls & SMS** notifications
- **Google Maps API** – Live location tracking and rendering safety zones
- **WebSockets** – Enables real-time community alerting
- **Firebase Cloud Messaging (FCM)** – Push notification delivery

### 🧠 AI & Security

- **Voice Recognition** – Recognizes distress codewords in real-time
- **NLP for Emergency Detection** – Avoids false triggers using natural language processing
- **Sentiment Analysis** – Analyzes voice tone for panic detection
- **Predictive Safety Alerts** – AI-driven high-risk area forecasting
- **End-to-End Encryption** – Ensures privacy of chat and location sharing

---

## 🚀 Installation & Setup

### 📦 Prerequisites

Ensure the following are installed on your machine:

- [Node.js (v14+)](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android or iOS device with the **Expo Go** app from the app store

---

### 📥 Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/women-safety-app.git
cd women-safety-app
