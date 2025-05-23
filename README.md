# Cig++ - Automated Cigarette Counter

🚭 **Smart cigarette tracking solution combining IoT hardware with mobile technology**

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange.svg)](https://firebase.google.com/)

## 📋 Project Links

- **🎥 Presentation**: [View on Canva](https://www.canva.com/design/DAGoGFpdpi0/AMbQ_cHYReLfnSq4mJdg-Q/view?utm_content=DAGoGFpdpi0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hea71ebeee8)
- **🎯 Prototype**: [Interactive Demo](https://www.canva.com/design/DAGoRdu_zHE/HV1PsdNntvHRuxzCSOIzhw/watch?utm_content=DAGoRdu_zHE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hc5fd59cb3e)

## 🎯 Overview

Cig++ is an innovative smoking cessation and tracking platform that automatically counts cigarettes through a smart IoT case. The system provides users with detailed analytics, achievement tracking, and social challenges to help reduce smoking habits.

### 🎯 Problem Statement
- Manual cigarette tracking is tedious and often abandoned
- Lack of accurate consumption data prevents effective habit assessment
- Current solutions require constant user input with limited engagement features

### ✨ Solution
- **Automated Tracking**: IoT smart case automatically detects and logs cigarettes
- **Real-time Analytics**: Comprehensive insights and consumption patterns
- **Gamification**: Achievement system and social challenges for motivation
- **Seamless Experience**: Mobile app with offline capability and data synchronization

## 🏗️ Architecture

```
┌─────────────────┐    BLE    ┌─────────────────┐    REST API    ┌─────────────────┐
│   IoT Device    │◄─────────►│  Mobile App     │◄──────────────►│   Backend       │
│  (Smart Case)   │           │ (React Native)  │                │ (Spring Boot)   │
└─────────────────┘           └─────────────────┘                └─────────────────┘
                                       │                                   │
                                       │ Firebase Auth                     │
                                       ▼                                   ▼
                              ┌─────────────────┐                ┌─────────────────┐
                              │ Firebase Auth   │                │   PostgreSQL    │
                              └─────────────────┘                └─────────────────┘
```

## 🚀 Features

### 📱 Mobile Application
- **User Authentication**: Secure Firebase-based login system
- **Automatic Tracking**: Real-time cigarette detection via BLE
- **Manual Logging**: Add/edit cigarette entries manually
- **Progress Visualization**: Interactive circular progress indicators
- **Detailed Analytics**: Daily, weekly, and monthly consumption insights
- **Achievement System**: Gamified milestones and progress tracking
- **Social Challenges**: Compete with other users
- **Offline Support**: Local data storage with cloud synchronization

### 🔧 IoT Smart Case
- **Automated Detection**: Sensors detect cigarette removal
- **Bluetooth Communication**: BLE connection with mobile app
- **Battery Management**: Low-power design for extended usage
- **Real-time Sync**: Instant data transmission to app

### 🖥️ Backend Services
- **REST API**: Comprehensive cigarette logging endpoints
- **User Management**: Profile and preference management
- **Achievement Engine**: Automated milestone tracking
- **Data Analytics**: Statistical processing and insights
- **Security**: JWT token validation and secure data handling

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Mobile App** | React Native + Expo | Cross-platform mobile application |
| **Backend** | Spring Boot (Java) | REST API server and business logic |
| **Database** | PostgreSQL | Data persistence and storage |
| **Authentication** | Firebase Auth | User authentication and authorization |
| **IoT Communication** | Bluetooth Low Energy | Device-to-app communication |
| **Embedded** | C++ (Arduino IDE) | Smart case firmware |

## 📂 Project Structure

```
Cig++/
├── 📱 Frontend/                 # React Native Mobile App
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # React contexts
│   │   ├── navigation/          # App navigation
│   │   ├── screens/             # Screen components
│   │   └── constants/           # App constants
│   └── package.json
│
├── 🖥️ Back-End/                # Spring Boot Backend
│   ├── src/main/java/com/bech/cigpp/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── model/               # Entity classes
│   │   ├── repository/          # Data access layer
│   │   └── config/              # Configuration
│   ├── pom.xml
│   └── docker-compose.yml
│
└── 📟 Embedded/                 # IoT Device Code
    └── (In Development)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 21
- PostgreSQL 15+
- Android Studio / Xcode (for mobile development)
- Firebase account

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cig++/Back-End
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Configure Firebase**
   - Add your Firebase Admin SDK JSON file to `src/main/resources/`
   - Update `application.properties` with your database credentials

4. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Add your Firebase config to the app
   - Update Firebase settings in the config files

4. **Run the mobile app**
   ```bash
   npx expo start
   ```

## 📊 API Endpoints

### Authentication
All endpoints require Firebase JWT token:
```
Authorization: Bearer <firebase_jwt_token>
```

### Cigarette Logs
- `POST /api/cigarettes` - Add new cigarette log
- `GET /api/cigarettes/{userId}` - Get user's cigarette logs
- `GET /api/cigarettes/{userId}/between` - Get logs between dates
- `DELETE /api/cigarettes/{id}` - Delete cigarette log

## 👥 Team

**BNB Tech**
- **Tomer Geva** - IoT Integration, Backend Development, Data Management
- **Omer Shalev** - Mobile Development, User Experience, Frontend Architecture

## 🎯 Target Audience

- **Curious Users**: Want to analyze their smoking habits effortlessly
- **Reduction-Focused**: Users aiming to reduce or quit smoking
- **Rehabilitation Programs**: Professional support for smoking cessation
- **Light Smokers**: Users wanting to maintain current consumption levels

## 🔒 Security & Privacy

- Firebase JWT authentication for all API endpoints
- Secure data transmission with HTTPS encryption
- Local data encryption on mobile devices
- GDPR-compliant data handling and user privacy protection

## 🚧 Current Status

- ✅ **Mobile App**: Core functionality implemented with authentication and UI
- ✅ **Backend**: REST API with PostgreSQL integration and Firebase auth
- 🔄 **IoT Device**: Hardware development and BLE integration in progress
- 🔄 **Integration**: Connecting all components for end-to-end functionality

## 📈 Future Enhancements

- Advanced machine learning analytics
- Push notifications for milestones
- Web dashboard for comprehensive data analysis
- Integration with other health tracking devices
- Social community features

## 📄 License

This project is developed as part of an academic/research initiative by BNB Tech.

## 📞 Contact

For questions, suggestions, or contributions, please reach out to the BNB Tech team.

---

*Cig++ - Making smoking awareness automatic and actionable* 🚭✨
