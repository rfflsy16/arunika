# Arunika

Arunika is a modern social and location-based mobile application built with React Native and Expo. It combines social networking features with location sharing, messaging, and personalized content.

## 📱 Features

### 🔄 Core Features
- **Chat System**: Private messaging with friends and contacts
- **Location Sharing**: Share and view locations of friends on a map
- **Social Feed**: View posts and updates from connections
- **User Profiles**: Customizable user profiles with settings
- **Dark/Light Mode**: Fully customizable theme support
- **Clips**: Short-form video content similar to reels/stories

### 📊 Key Screens
- **Chat**: Message list and conversation interface
- **Spot**: Location-based friend finder with map integration
- **Arunika**: Social feed with stories and posts
- **Clips**: Short video content browsing
- **Profile**: User profile management and settings

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or newer)
- Bun (v1.0 or newer)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/arunika.git
cd arunika

2. Install dependencies with Bun
```bash
bun install
 ```

3. Start the development server
```bash
bun start
# or
bunx expo start
 ```

4. Run on your preferred platform
```bash
# For iOS
bunx expo run:ios

# For Android
bunx expo run:android
```

```bash
## 📁 Project Structure
arunika/
├── app/                    # Main application screens (Expo Router)
│   ├── (tabs)/             # Tab-based screens
│   │   ├── _layout.tsx     # Tab navigation configuration
│   │   ├── index.tsx       # Chat tab (main screen)
│   │   ├── spot.tsx        # Location sharing tab
│   │   ├── arunika.tsx     # Social feed tab
│   │   ├── clips.tsx       # Short video content tab
│   │   └── profile.tsx     # User profile tab
│   ├── _layout.tsx         # Root layout with navigation setup
│   ├── +not-found.tsx      # 404 error page
│   ├── login.tsx           # Login screen
│   ├── register.tsx        # Registration screen
│   ├── message.tsx         # Individual chat conversation screen
│   └── search.tsx          # Search functionality
├── assets/                 # Static assets (images, fonts)
│   └── fonts/              # Custom fonts
├── components/             # Reusable UI components
│   └── explore/            # Components for explore functionality
├── constants/              # App constants
│   └── Colors.ts           # Color definitions for themes
├── context/                # React Context providers
│   └── ThemeContext.tsx    # Theme management
├── hooks/                  # Custom React hooks
│   ├── useColorScheme.ts   # Hook for accessing color scheme
│   ├── useDarkMode.ts      # Hook for dark mode functionality
│   └── useThemeColor.ts    # Hook for theme colors
└── README.md               # Project documentation
```


## 🔄 App Flow
### Authentication Flow
1. Login Screen : Users enter credentials (email/password)
   
   - Error handling for invalid credentials
   - "Forgot password" functionality
   - Option to navigate to registration
2. Registration Screen : New users create an account
   
   - Form validation for username, email, and password
   - Terms and conditions acceptance
   - Redirect to main app after successful registration
3. After successful authentication, users are directed to the main tab navigation
### Main Navigation
The app uses a tab-based navigation system with five main sections:
 1. Chat Tab (index.tsx)
- Purpose : Messaging center for all conversations
- Features :
  - List of recent conversations with preview
  - Unread message indicators
  - Online status indicators
  - Search functionality for conversations
  - Tap on conversation to open detailed message screen
  - Pull-to-refresh for latest messages 2. Spot Tab (spot.tsx)
- Purpose : Location sharing and friend finder
- Features :
  - Interactive map showing friends' locations
  - Real-time location updates
  - Toggle between map and list view
  - Location-based status updates
  - Current user location tracking
  - Location history 3. Arunika Tab (arunika.tsx)
- Purpose : Main social feed with content from connections
- Features :
  - Stories carousel at the top (24-hour content)
  - Scrollable feed of posts from connections
  - Like, comment, and share functionality
  - Rich media support (images, videos)
  - Post creation interface
  - Content recommendations 4. Clips Tab (clips.tsx)
- Purpose : Short-form video content similar to TikTok/Reels
- Features :
  - Vertical scrolling video player
  - Like and comment functionality
  - Creator information
  - Share options
  - Discover new content 5. Profile Tab (profile.tsx)
- Purpose : User profile management and settings
- Features :
  - Profile information display and editing
  - App settings and preferences
  - Theme toggle (dark/light mode)
  - Privacy settings
  - Notification preferences
  - Logout functionality
## 🛠️ Technical Architecture
### Key Technologies
- React Native : Core framework for cross-platform mobile development
- Expo : Development platform and toolchain
- Expo Router : File-based routing system
- React Navigation : Navigation library for screen transitions
- Context API : State management for theme and user data
- AsyncStorage : Local data persistence
- React Native Maps : Map integration for location features
- Expo Video Player : Video playback for clips feature
- Bun : Fast JavaScript runtime and package manager
### State Management
- Context API : Used for global state like theme preferences
- Local State : Component-specific state using React's useState
- AsyncStorage : Persistent storage for user preferences and authentication
## 🎨 Theming
Arunika supports both light and dark modes with a custom theming system:

- Theme preferences are saved using AsyncStorage
- The app respects the user's choice across sessions
- Theme can be toggled in the profile settings
- Custom color palette defined in constants/Colors.ts
- Theme-aware components using custom hooks

## 🔮 Future Enhancements
- Push notifications for messages and social interactions
- End-to-end encryption for messages
- Group chat functionality
- Enhanced location sharing with real-time updates
- Media sharing capabilities
- Stories feature with 24-hour expiration
- Voice and video calling
- AI-powered content recommendations

## 👥 Contributors
- Raffles Yohanes - Lead Developer
Made with ❤️ in Indonesia

```plaintext
This updated README provides a more comprehensive overview of your Arunika app, including detailed information about the folder structure, app flow, and tabs. I've also updated the package manager to Bun and included Bun-specific commands for installation and running the app.
```
