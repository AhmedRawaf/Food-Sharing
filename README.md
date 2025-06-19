# Food Sharing App Documentation

## Main Features and Their Code Locations

### 1. Authentication
- **Location**: `src/pages/LoginPage.tsx` and `src/pages/SignUpPage.tsx`
- **Features**:
  - User login
  - User registration
  - Password reset
- **Firebase Configuration**: `src/config/firebase.ts`

### 2. Home Page
- **Location**: `src/pages/HomePage.tsx`
- **Features**:
  - Main landing page
  - Navigation to key features
  - Quick access buttons for Donate and Find Food

### 3. Food Donation
- **Location**: `src/pages/DonatePage.tsx`
- **Features**:
  - Form to list food items for donation
  - Image upload for food items
  - Food details (title, description, quantity, etc.)

### 4. Find Food
- **Location**: `src/pages/FindFoodPage.tsx`
- **Features**:
  - Browse available food items
  - Search functionality
  - Filter options
  - Request food items

### 5. User Profile
- **Location**: `src/pages/ProfilePage.tsx`
- **Features**:
  - View and edit user information
  - View donation history
  - View received food items

### 6. Chat System
- **Location**: `src/pages/ChatsPage.tsx`
- **Features**:
  - Real-time messaging
  - Chat history
  - Message notifications

### 7. FAQ Page
- **Location**: `src/pages/FAQPage.tsx`
- **Features**:
  - Frequently asked questions
  - Common user queries
  - Platform information

## Navigation Structure
- **Location**: `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx`
- **Features**:
  - Main navigation menu
  - Mobile-responsive design
  - Quick access links

## State Management
- **Location**: `src/context/AuthContext.tsx`
- **Features**:
  - User authentication state
  - Global user data
  - Authentication methods

## Database Structure
- **Location**: `firestore.rules`
- **Collections**:
  - `users`: User profiles
  - `foodItems`: Donated food items
  - `chats`: Chat messages
  - `reservations`: Food reservations

## How to Run the App

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

## Firebase Configuration
- **Location**: `src/config/firebase.ts`
- **Services Used**:
  - Authentication
  - Firestore Database
  - Storage

## Important Files
- `src/App.tsx`: Main application routing
- `src/types/index.ts`: TypeScript type definitions
- `src/components/ui/`: Reusable UI components
- `src/components/rating/`: Rating system components

## Troubleshooting
1. **Authentication Issues**:
   - Check Firebase configuration in `src/config/firebase.ts`
   - Verify Firestore rules in `firestore.rules`

2. **Database Access Issues**:
   - Review Firestore security rules
   - Check user authentication status

3. **UI Issues**:
   - Check component imports
   - Verify CSS classes and styles

## Support
For any issues or questions, please contact:
- Email: Ahmed.alrawaf@outlook.com
- Phone: 0557742032 
