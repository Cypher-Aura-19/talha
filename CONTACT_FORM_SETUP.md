# Contact Form Setup Instructions

## Overview
The contact form sends emails to `work.talharizwan@gmail.com` using Gmail SMTP via nodemailer.

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App passwords** (search for it in settings)
5. Generate a new app password:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name it: **Portfolio Contact Form**
6. Copy the 16-character password (no spaces)

### 3. Create Environment File

Create a file named `.env.local` in the root directory:

```env
EMAIL_USER=work.talharizwan@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
```

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

### 4. Test the Form

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the contact page
3. Fill out and submit the form
4. Check `work.talharizwan@gmail.com` for the email

## Form Features

- **Modern Design**: Matches your site's dark theme with monospace fonts
- **Validation**: All fields required before submission
- **Status Messages**: Success/error feedback
- **Disabled State**: Prevents multiple submissions
- **Responsive**: Works on mobile and desktop
- **Email Template**: Styled HTML email with your branding

## Troubleshooting

### Email not sending?
- Check that `.env.local` exists and has correct values
- Verify Gmail App Password is correct (no spaces)
- Check console for error messages
- Ensure 2-Step Verification is enabled on Gmail

### Form not appearing?
- Clear browser cache
- Check that CSS is loading
- Verify contact.css has the new form styles

## Alternative: Using Resend (Recommended for Production)

For production, consider using [Resend](https://resend.com) instead of Gmail SMTP:

1. Sign up at https://resend.com
2. Get your API key
3. Update `.env.local`:
   ```env
   RESEND_API_KEY=your_resend_api_key
   ```
4. Update `src/app/api/contact/route.js` to use Resend

Benefits:
- More reliable than Gmail SMTP
- Better deliverability
- No need for App Passwords
- Free tier: 100 emails/day
