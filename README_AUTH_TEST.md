# Authentication Testing Guide

## How to Test the Authentication Features

### 1. Non-Authenticated User Experience
- Visit `http://localhost:5174/` (or the port shown in terminal)
- You should see:
  - Full homepage with Features, How It Works, and Testimonials sections
  - "Start Free" button in navigation
  - "Try Free Dream Interpretation" and "Sign In For Full Experience" buttons in hero
  - "Start Your Free Dream Analysis" CTA at bottom

### 2. Sign Up Flow
1. Click "Sign up" or navigate to `/signup`
2. Test with these credentials:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: TestPass123!
   - Confirm Password: TestPass123!
   - ✅ Agree to terms
3. Click "Create Account"
4. You should be automatically redirected to `/insights`

### 3. Sign In Flow
1. Navigate to `/signin` 
2. Use existing demo account:
   - Email: demo@luna.com
   - Password: password (any password with 3+ characters works)
3. Click "Sign In"
4. Should redirect to `/insights`

### 4. Authenticated User Experience
Once logged in, you should see:
- Navigation shows user avatar/initials and name instead of "Start Free"
- Clicking the user avatar opens dropdown with:
  - User info (name, email, subscription plan)
  - "My Insights" link
  - "Settings" link
  - "Sign Out" button
- Homepage hero says "Welcome Back, [FirstName]!"
- Different hero buttons: "Interpret New Dream" and "View My Insights"
- User stats displayed (dreams interpreted, streak, plan)
- Features, How It Works, and Testimonials sections are hidden
- CTA section shows "Continue Your Dream Journey"

### 5. Logout Flow
1. Click user avatar in navigation
2. Click "Sign Out" button
3. Should redirect to homepage
4. Navigation should show "Start Free" button again
5. Homepage should show non-authenticated content

### 6. Mobile Testing
- Test the mobile navigation menu
- User info should show in mobile menu when authenticated
- Logout button should be accessible in mobile menu

### Demo Users Available:
- `demo@luna.com` - Premium user with existing stats
- `test@example.com` - Free user
- Or create your own account via sign up

### Google/Apple OAuth (Development Mode):
- Google OAuth: Working with real Google accounts
- Apple OAuth: Mock implementation for development

The authentication system uses mock data by default (USE_MOCK_DATA = true in authService.ts), so no backend is required for testing. 