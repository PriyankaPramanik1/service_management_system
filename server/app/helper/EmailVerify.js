// const nodemailer = require('nodemailer');

// const sendMail = async (req, user) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 587,
//             secure: false,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         const mailOptions = {
//             from: process.env.EMAIL_FROM,
//             to: user.email,
//             subject: "Confirmation email",
//             html: `<p>Dear ${user.name},</p>
// <p>Welcome to our team! We're excited to have you on board.</p>
// <p>Below are your login credentials:</p>
// <h2>Email ID: ${user.email}</h2>
// <h2>Password: ${user.password}</h2>
// <p>Please keep these credentials secure and do not share them with anyone.</p>
// <p>If you have any questions or concerns, feel free to reach out to us.</p>
// `
//         };

//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// module.exports = sendMail


const emailValidate = require('nodemailer')

const transporter = emailValidate.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async (to, password, name) => {

    try {
        const VerificationLink = `${process.env.FRONTEND_HOST}/login`;
        console.log("to", to);

        const currentDate = new Date().toLocaleString();
        const currentYear = new Date().getFullYear();
        const emailOptions = {
            from: `"Admin Team" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your login credential",
            html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Login Credentials</title>
                        <style>
                            /* Reset styles for email compatibility */
                            body, html {
                                margin: 0 !important;
                                padding: 0 !important;
                                font-family: Arial, Helvetica, sans-serif !important;
                                line-height: 1.4 !important;
                                color: #333333 !important;
                                background-color: #f5f7fa !important;
                                width: 100% !important;
                            }
                            
                            .email-container {
                                max-width: 600px !important;
                                width: 100% !important;
                                margin: 0 auto !important;
                                background: #ffffff !important;
                                border-radius: 8px !important;
                                overflow: hidden !important;
                                border: 1px solid #dddddd !important;
                            }
                            
                            .email-header {
                                background: #4285f4 !important;
                                color: #ffffff !important;
                                padding: 20px 25px !important;
                                text-align: center !important;
                            }
                            
                            .email-logo {
                                font-size: 20px !important;
                                font-weight: bold !important;
                                margin: 0 !important;
                            }
                            
                            .email-content {
                                padding: 25px !important;
                            }
                            
                            .email-subject {
                                font-size: 18px !important;
                                font-weight: bold !important;
                                margin-bottom: 15px !important;
                                color: #202124 !important;
                                line-height: 1.3 !important;
                            }
                            
                            .sender-info {
                                margin-bottom: 15px !important;
                                padding-bottom: 15px !important;
                                border-bottom: 1px solid #eaeaea !important;
                            }
                            
                            .sender-name {
                                font-weight: bold !important;
                                font-size: 14px !important;
                                margin-bottom: 5px !important;
                                color: #202124 !important;
                            }
                            
                            .sender-email {
                                color: #5f6368 !important;
                                font-size: 12px !important;
                            }
                            
                            .recipient-info {
                                font-size: 12px !important;
                                color: #5f6368 !important;
                                margin-bottom: 10px !important;
                            }
                            
                            .email-time {
                                color: #5f6368 !important;
                                font-size: 12px !important;
                                margin-bottom: 20px !important;
                            }
                            
                            .email-body {
                                line-height: 1.6 !important;
                                color: #444444 !important;
                                font-size: 14px !important;
                            }
                            
                            .email-body p {
                                margin-bottom: 15px !important;
                            }
                            
                            .credentials-box {
                                background-color: #f8f9fa !important;
                                border-left: 4px solid #4285f4 !important;
                                padding: 15px !important;
                                margin: 20px 0 !important;
                                border-radius: 0 4px 4px 0 !important;
                            }
                            
                            .credential-item {
                                margin: 10px 0 !important;
                                font-family: 'Courier New', Courier, monospace !important;
                                background: white !important;
                                padding: 10px !important;
                                border: 1px solid #e0e0e0 !important;
                                border-radius: 4px !important;
                                font-size: 13px !important;
                            }
                            
                            .security-note {
                                background-color: #fff8e1 !important;
                                border: 1px solid #ffd54f !important;
                                padding: 12px !important;
                                margin: 20px 0 !important;
                                font-size: 12px !important;
                                border-radius: 4px !important;
                                line-height: 1.5 !important;
                            }
                            
                            .login-button {
                                display: inline-block !important;
                                background: #4285f4 !important;
                                color: white !important;
                                text-decoration: none !important;
                                padding: 12px 25px !important;
                                border-radius: 4px !important;
                                font-weight: bold !important;
                                margin: 15px 0 !important;
                                font-size: 14px !important;
                                text-align: center !important;
                                border: none !important;
                            }
                            
                            .email-footer {
                                background: #f8f9fa !important;
                                padding: 15px 25px !important;
                                border-top: 1px solid #eaeaea !important;
                                font-size: 12px !important;
                                color: #5f6368 !important;
                                text-align: center !important;
                                line-height: 1.5 !important;
                            }
                            
                            .company-name {
                                font-weight: bold !important;
                                color: #4285f4 !important;
                            }
                            
                            .reply-section {
                                margin-top: 20px !important;
                                padding-top: 20px !important;
                                border-top: 1px solid #eaeaea !important;
                                font-size: 12px !important;
                                color: #5f6368 !important;
                                font-style: italic !important;
                            }
                            
                            /* Mobile responsiveness */
                            @media only screen and (max-width: 600px) {
                                .email-container {
                                    width: 100% !important;
                                    border-radius: 0 !important;
                                    margin: 0 !important;
                                }
                                
                                .email-content {
                                    padding: 15px !important;
                                }
                                
                                .email-header {
                                    padding: 15px 20px !important;
                                }
                                
                                .email-subject {
                                    font-size: 16px !important;
                                }
                                
                                .login-button {
                                    display: block !important;
                                    width: 100% !important;
                                    box-sizing: border-box !important;
                                }
                            }
                            
                            /* Print styles */
                            @media print {
                                body {
                                    background: white !important;
                                }
                                
                                .email-container {
                                    box-shadow: none !important;
                                    border: 1px solid #000 !important;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="email-container">
                            <div class="email-header">
                                <div class="email-logo">Service Management System</div>
                            </div>
                            
                            <div class="email-content">
                                <div class="email-subject">Your Login Credentials - Account Created</div>
                                
                                <div class="sender-info">
                                    <div class="sender-name">Admin Team</div>
                                    <div class="sender-email">${process.env.EMAIL_USER}</div>
                                </div>
                                
                                <div class="recipient-info">
                                    <strong>To:</strong> ${to}
                                </div>
                                
                                <div class="email-time">
                                    <strong>Sent:</strong> ${currentDate}
                                </div>
                                
                                <div class="email-body">
                                    <p>Dear ${name},</p>
                                    
                                    <p>Welcome to Service Management System! Your account has been successfully created and is ready for use.</p>
                                    
                                    <p>Below are your login credentials:</p>
                                    
                                    <div class="credentials-box">
                                        <div class="credential-item">
                                            <strong>Email Address:</strong> ${to}
                                        </div>
                                        <div class="credential-item">
                                            <strong>Temporary Password:</strong> ${password}
                                        </div>
                                    </div>
                                    
                                    <div class="security-note">
                                        <strong>Security Notice:</strong> For your account's security, please change your password immediately after your first login. Never share your credentials with anyone.
                                    </div>
                                    
                                    <p>You can access your account by clicking the button below:</p>
                                    
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000/login'}" class="login-button">Access Your Account</a>
                                    
                                    <p>If you encounter any issues during login or have questions about our platform, please don't hesitate to contact our support team.</p>
                                    
                                    <p>We're excited to have you on board!</p>
                                    
                                    <p>Best Regards,<br>
                                    <strong>Admin Team</strong><br>
                                    <span class="company-name">Service Management System</span></p>
                                </div>
                                
                                <div class="reply-section">
                                    <p>This is an automated message. Please do not reply to this email.</p>
                                </div>
                            </div>
                            
                            <div class="email-footer">
                                <div style="margin-bottom: 8px;">
                                    This email was sent to ${to} as part of your account registration.
                                </div>
                                <div>
                                    © ${currentYear} Service Management System. All rights reserved.
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>`
        }

        await transporter.sendMail(emailOptions)
        console.log(`Enmail sent successfully to ${to} `);

        return true;

        // Return OTP only for development/testing
        // return process.env.NODE_ENV === 'development' ? otp : true;

    } catch (error) {
        console.error('Email sending error:', error)
        return false
    }
}

module.exports = sendEmail 