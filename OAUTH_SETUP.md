# OAuth Setup Guide - Google & Apple Sign In

This guide walks you through setting up Google and Apple OAuth integration for the Luna Dream Interpreter app.

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if required)

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - App name: `Luna - Dream Interpreter`
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes (optional): `email`, `profile`
5. Save and continue through the steps

### 3. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - Name: `Luna Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `http://localhost:5174` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)

### 4. Configure Environment Variables

1. Copy your Client ID from the Google Cloud Console
2. Create a `.env` file in the project root:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
   ```

## Apple Sign In Setup

### For Web Applications

Apple Sign In for web requires additional setup and domain verification:

### 1. Apple Developer Account

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple Developer account

### 2. Configure App ID

1. Navigate to **Certificates, Identifiers & Profiles**
2. Create a new **App ID** or modify existing
3. Enable **Sign In with Apple** capability

### 3. Create Service ID

1. Create a new **Services ID**
2. Configure:
   - Description: `Luna Web Sign In`
   - Identifier: `com.luna.web.signin`
3. Enable **Sign In with Apple**
4. Configure domains and return URLs:
   - Domains: `yourdomain.com`
   - Return URLs: `https://yourdomain.com/auth/apple/callback`

### 4. Create Key

1. Create a new **Key**
2. Enable **Sign In with Apple**
3. Download the key file (.p8)

### 5. Implementation Notes

Currently, the Apple Sign In implementation is mocked for development purposes. For production:

1. Implement server-side verification
2. Handle the Apple ID JWT token
3. Configure proper domain verification
4. Set up return URL handling

## Testing

### Development Mode

Both Google and Apple integrations work in development mode:

- **Google**: Full OAuth flow with actual Google accounts
- **Apple**: Mock implementation that simulates the flow

### Production Deployment

For production deployment:

1. **Google**: Update authorized domains in Google Cloud Console
2. **Apple**: Complete domain verification and server-side implementation
3. Update environment variables with production values

## Security Considerations

1. **Never commit** your actual Client IDs to version control
2. Use environment variables for all sensitive configuration
3. Implement proper server-side token verification
4. Use HTTPS in production
5. Validate and sanitize all OAuth responses

## Troubleshooting

### Common Google OAuth Issues

1. **Invalid Client ID**: Check environment variable spelling
2. **Unauthorized Domain**: Add your domain to authorized origins
3. **Popup Blocked**: Users need to allow popups for OAuth

### Common Apple OAuth Issues

1. **Domain Not Verified**: Complete Apple's domain verification process
2. **Invalid Service ID**: Ensure Service ID matches configuration
3. **Missing Return URL**: Configure proper return URLs in Apple Developer Portal

## Support

For additional help:

1. Google OAuth: [Google Identity Documentation](https://developers.google.com/identity)
2. Apple Sign In: [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
3. React OAuth Google: [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google) 