import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Dynamic import of nodemailer
    const nodemailer = (await import('nodemailer')).default;
    
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail SMTP with explicit configuration
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'work.talharizwan@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: monospace; padding: 20px; background: #0a0a0a; color: #f9f4eb;">
          <h2 style="color: #f9f4eb; border-bottom: 2px solid #f9f4eb; padding-bottom: 10px;">
            ▸ New Transmission Received
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>▸ From:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>▸ Signal Address:</strong> ${email}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background: rgba(249, 244, 235, 0.05); border-left: 3px solid #f9f4eb;">
            <p style="margin: 0 0 10px 0;"><strong>▸ Message:</strong></p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(249, 244, 235, 0.2);">
            <p style="font-size: 12px; color: rgba(249, 244, 235, 0.6);">
              Sent from your portfolio contact form
            </p>
          </div>
        </div>
      `,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}
