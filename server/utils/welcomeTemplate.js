const sendEmail = require("../config/email");

// 🌟 प्रीमियम रियूजेबल ईमेल टेम्पलेट (User, Admin, Organizer सभी के लिए)
const sendWelcomeEmail = async (email, name, role) => {
    try {
        const welcomeSubject = `Welcome to DarshanEase - Registration Successful! 🙏`;
        const welcomeHTML = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ffedd5; border-radius: 16px; background-color: #fffaf7; max-w: 500px; margin: 0 auto;">
                <h2 style="color: #ea580c; text-align: center; margin-bottom: 5px;">🙏 DarshanEase Shrines</h2>
                <p style="text-align: center; font-size: 12px; color: #9ca3af; margin-top: 0; margin-bottom: 20px;">Ministry of Religious Trust Automation Ledger</p>
                <p>Dear <b>${name}</b>,</p>
                <p>Your official registration on the <b>DarshanEase Platform</b> has been processed and activated successfully.</p>
                <div style="background-color: #eff6ff; padding: 15px; border-radius: 12px; border: 1px solid #bfdbfe; margin: 20px 0;">
                    <p style="margin: 0; font-size: 13px; color: #1e3a8a;"><b>Account Roster Details:</b></p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; font-family: monospace; color: #1e293b; line-height: 1.6;">
                        <strong>Registered Email:</strong> ${email}<br/>
                        <strong>Allocated Role:</strong> <span style="text-transform: uppercase; color: #ea580c; font-weight: bold;">${role}</span><br/>
                        <strong>Security Status:</strong> Verified Node Active 🟢
                    </p>
                </div>
                <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">You can now login to manage time slots, track real-time routes to holy shrines, order pure prasad distribution, or audit transaction balance ledgers.</p>
                <p style="margin-top: 30px; border-top: 1px dashed #fed7aa; padding-top: 15px; font-size: 11px; color: #9ca3af; text-align: center;">
                    Thank you for joining the DarshanEase Foundation Network.
                </p>
            </div>
        `;
        await sendEmail(email, welcomeSubject, welcomeHTML);
        console.log(`✉️ Registration greetings dispatched to: ${email} [Role: ${role}]`);
    } catch (e) {
        console.warn("⚠️ Mail trigger skipped. Check server/.env cloud credentials mapping.");
    }
};

module.exports = sendWelcomeEmail;
