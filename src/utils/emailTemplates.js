import { sendEmail } from '../services/restdbService';

/**
 * Generates a plain text version from HTML content
 * @param {string} html - HTML content
 * @returns {string} Plain text version
 */
const generatePlainText = (html) => {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&mdash;/g, '-')
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

/**
 * Generates the base branded email template for all club emails
 * @param {Object} config - Template configuration
 * @param {string} config.headerTitle - Title to display in the header
 * @param {string} config.content - HTML content for the email body
 * @param {boolean} [config.includeFooter=true] - Whether to include the footer
 * @returns {string} HTML email template
 */
export const generateBrandedEmailTemplate = ({
    headerTitle,
    content,
    includeFooter = true
}) => {
    const currentYear = new Date().getFullYear();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8f9fa;
            color: #1a1a1a;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 30px 20px;
        }
        .content h2 {
            color: #2d5016;
            font-size: 22px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        .content h3 {
            color: #2d5016;
            font-size: 18px;
            font-weight: 700;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .content p {
            margin: 0 0 15px 0;
            font-size: 16px;
            line-height: 1.75;
            color: #1a1a1a;
        }
        .content ul, .content ol {
            margin: 15px 0;
            padding-left: 25px;
        }
        .content li {
            margin-bottom: 10px;
            font-size: 16px;
            line-height: 1.75;
        }
        .content a {
            color: #c17817;
            text-decoration: none;
        }
        .content a:hover {
            text-decoration: underline;
        }
        .content strong {
            color: #2d5016;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 3px solid #2d5016;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #5c5c5c;
        }
        .footer a {
            color: #2d5016;
            text-decoration: none;
            font-weight: 600;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media only screen and (max-width: 600px) {
            .header h1 {
                font-size: 20px;
            }
            .content h2 {
                font-size: 20px;
            }
            .content h3 {
                font-size: 16px;
            }
            .content p, .content li {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${headerTitle}</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        ${
            includeFooter
                ? `
        <div class="footer">
            <p><strong>Fredericksburg Birding Club</strong></p>
            <p><a href="https://www.fredbirds.com">www.fredbirds.com</a></p>
            <p>&copy; ${currentYear} Fredericksburg Birding Club</p>
        </div>
        `
                : ''
        }
    </div>
</body>
</html>
    `.trim();
};

/**
 * Generates registration confirmation email for new member signups
 * @param {string} firstName - Member's first name
 * @param {string} email - Member's email address
 * @returns {Object} Email data with subject, html, and text
 */
export const generateRegistrationEmail = (firstName, email) => {
    const content = `
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>Thank you for registering with the Fredericksburg Birding Club! 
        We've received your membership request and it is now being reviewed by our officers.</p>
        <p>You'll receive another email once your membership has been approved. 
        In the meantime, here's what to look forward to as a member:</p>
        <ul>
            <li><strong>Club mailing list</strong> &mdash; stay informed about upcoming events, field trips, and club news</li>
            <li><strong>Members-only content</strong> &mdash; access the member directory and bird sighting logs</li>
            <li><strong>Local birding community</strong> &mdash; connect with fellow birders in the Fredericksburg area</li>
        </ul>
        <p>If you have any questions, feel free to reach out to us at 
        <a href="mailto:admin@fredbirds.com">admin@fredbirds.com</a>.</p>
        <p>Happy birding!<br/>
        Fredericksburg Birding Club<br/>
        <a href="https://www.fredbirds.com">www.fredbirds.com</a></p>
    `;

    const html = generateBrandedEmailTemplate({
        headerTitle: 'Welcome to the Club!',
        content
    });

    const text = generatePlainText(content);

    return {
        subject: 'Welcome to the Fredericksburg Birding Club',
        html,
        text
    };
};

/**
 * Generates approval welcome email with login setup instructions
 * @param {string} firstName - Member's first name
 * @param {string} email - Member's email address
 * @returns {Object} Email data with subject, html, and text
 */
export const generateWelcomeEmail = (firstName, email) => {
    const content = `
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>Great news &mdash; your membership with the Fredericksburg Birding Club has been approved! 
        You're now an official member.</p>
        <h3 style="margin-bottom: 8px;">Set Up Your Login</h3>
        <ol>
            <li>Visit <a href="https://www.fredbirds.com">www.fredbirds.com</a></li>
            <li>Click <strong>&ldquo;Member Login&rdquo;</strong> in the top right corner</li>
            <li>Enter your email address (<strong>${email}</strong>) and click <strong>&ldquo;Continue&rdquo;</strong></li>
            <li>You'll be redirected to our secure login page &mdash; click <strong>&ldquo;Sign Up&rdquo;</strong> to create your account</li>
            <li>Once logged in, you'll have full access to all member features</li>
        </ol>
        <p><strong>Important:</strong> You must sign up with <strong>${email}</strong> so we can match your login to your membership.</p>
        <p>As a member you can:</p>
        <ul>
            <li><strong>Member directory</strong> &mdash; find and connect with fellow club members</li>
            <li><strong>Events &amp; field trips</strong> &mdash; browse upcoming outings and register to attend</li>
            <li><strong>Bird sightings</strong> &mdash; log your sightings and see what others are spotting nearby</li>
        </ul>
        <p>You'll also be added to the club mailing list so you'll stay in the loop on all club news and activities.</p>
        <p>If you have any questions, reach out to us at 
        <a href="mailto:admin@fredbirds.com">admin@fredbirds.com</a>.</p>
        <p>Welcome aboard &mdash; we look forward to birding with you!<br/>
        Fredericksburg Birding Club<br/>
        <a href="https://www.fredbirds.com">www.fredbirds.com</a></p>
    `;

    const html = generateBrandedEmailTemplate({
        headerTitle: "You're In!",
        content
    });

    const text = generatePlainText(content);

    return {
        subject: "You're In! Welcome to the Fredericksburg Birding Club",
        html,
        text
    };
};

/**
 * Generates contact form submission email
 * @param {Object} formData - Contact form data
 * @param {string} formData.name - Sender's name
 * @param {string} formData.email - Sender's email
 * @param {string} formData.topic - Contact topic
 * @param {string} formData.message - Message content
 * @returns {Object} Email data with subject, html, text, and replyTo
 */
export const generateContactEmail = ({ name, email, topic, message }) => {
    const topicLabel = topic.charAt(0).toUpperCase() + topic.slice(1);

    const content = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Topic:</strong> ${topicLabel}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    const html = generateBrandedEmailTemplate({
        headerTitle: 'Contact Form Submission',
        content
    });

    const text = generatePlainText(content);

    return {
        subject: `Contact Form: ${topicLabel}`,
        html,
        text,
        replyTo: email
    };
};

/**
 * Generates announcement email HTML
 * @param {Object} announcement - Announcement object
 * @param {string} announcement.headline - The announcement headline
 * @param {string} announcement.details - The announcement details/content
 * @returns {Object} Email data with subject, html, and text
 */
export const generateAnnouncementEmail = (announcement) => {
    const { headline, details } = announcement;

    // Convert plain text newlines to HTML line breaks
    // Replace double newlines with paragraph breaks, single newlines with <br>
    const formattedDetails = details
        .split('\n\n')
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');

    const content = `
        <h2>${headline}</h2>
        <div>${formattedDetails}</div>
    `;

    const html = generateBrandedEmailTemplate({
        headerTitle: 'Club Announcement',
        content
    });

    const text = generatePlainText(content);

    return {
        subject: `Announcement: ${headline}`,
        html,
        text
    };
};

/**
 * Send registration confirmation email
 * @param {string} firstName - Member's first name
 * @param {string} email - Member's email address
 * @returns {Promise<Object>} Send result
 */
export const sendRegistrationEmail = async (firstName, email) => {
    const emailContent = generateRegistrationEmail(firstName, email);
    return sendEmail({
        to: email,
        ...emailContent
    });
};

/**
 * Send welcome email with login setup instructions
 * @param {string} firstName - Member's first name
 * @param {string} email - Member's email address
 * @returns {Promise<Object>} Send result
 */
export const sendWelcomeEmail = async (firstName, email) => {
    const emailContent = generateWelcomeEmail(firstName, email);
    return sendEmail({
        to: email,
        ...emailContent
    });
};

/**
 * Send contact form email
 * @param {Object} formData - Contact form data
 * @param {string} recipientEmail - Email address to send to
 * @returns {Promise<Object>} Send result
 */
export const sendContactEmail = async (formData, recipientEmail) => {
    const emailContent = generateContactEmail(formData);
    return sendEmail({
        to: recipientEmail,
        ...emailContent
    });
};

export default {
    generateBrandedEmailTemplate,
    generateRegistrationEmail,
    generateWelcomeEmail,
    generateContactEmail,
    generateAnnouncementEmail,
    sendRegistrationEmail,
    sendWelcomeEmail,
    sendContactEmail
};
