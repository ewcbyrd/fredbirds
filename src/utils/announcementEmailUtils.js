import { sendEmail } from '../services/restdbService';

/**
 * Generates HTML email template for an announcement
 * @param {Object} announcement - Announcement object with headline and details
 * @param {string} announcement.headline - The announcement headline
 * @param {string} announcement.details - The announcement details/content
 * @returns {string} HTML content for the email
 */
export const generateAnnouncementEmailHTML = (announcement) => {
    const { headline, details } = announcement;

    // Convert plain text newlines to HTML line breaks
    // Replace double newlines with paragraph breaks, single newlines with <br>
    const formattedDetails = details
        .split('\n\n')
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');

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
        .content p {
            margin: 0 0 15px 0;
            font-size: 16px;
            line-height: 1.75;
            color: #1a1a1a;
        }
        .content a {
            color: #c17817;
            text-decoration: none;
        }
        .content a:hover {
            text-decoration: underline;
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
            .content p {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Club Announcement</h1>
        </div>
        <div class="content">
            <h2>${headline}</h2>
            <div>${formattedDetails}</div>
        </div>
        <div class="footer">
            <p><strong>Fredericksburg Birding Club</strong></p>
            <p><a href="https://www.fredbirds.com">www.fredbirds.com</a></p>
            <p>&copy; ${new Date().getFullYear()} Fredericksburg Birding Club</p>
        </div>
    </div>
</body>
</html>
    `.trim();
};

/**
 * Generates plain text version of announcement email
 * @param {Object} announcement - Announcement object
 * @param {string} announcement.headline - The announcement headline
 * @param {string} announcement.details - The announcement details/content
 * @returns {string} Plain text content for the email
 */
export const generateAnnouncementEmailText = (announcement) => {
    const { headline, details } = announcement;

    // Strip HTML tags from details for plain text version
    const plainDetails = details
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ');

    return `
CLUB ANNOUNCEMENT

${headline}

${plainDetails}

---
Fredericksburg Birding Club
www.fredbirds.com
© ${new Date().getFullYear()} Fredericksburg Birding Club
    `.trim();
};

/**
 * Sends announcement email to selected recipients
 * @param {Object} announcement - Announcement object with headline and details
 * @param {string[]} recipientEmails - Array of recipient email addresses
 * @returns {Promise<{success: number, failed: number, errors: Array}>} Results summary
 */
export const sendAnnouncementEmails = async (announcement, recipientEmails) => {
    if (!announcement || !announcement.headline || !announcement.details) {
        throw new Error('Invalid announcement data');
    }

    if (!Array.isArray(recipientEmails) || recipientEmails.length === 0) {
        throw new Error('No recipients specified');
    }

    const htmlContent = generateAnnouncementEmailHTML(announcement);
    const textContent = generateAnnouncementEmailText(announcement);
    const subject = `Announcement: ${announcement.headline}`;

    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    // Send emails individually to protect privacy (no exposed email addresses)
    // But send in batches of 10 in parallel for better performance
    const BATCH_SIZE = 10;

    for (let i = 0; i < recipientEmails.length; i += BATCH_SIZE) {
        const batch = recipientEmails.slice(i, i + BATCH_SIZE);

        const batchPromises = batch.map(async (email) => {
            try {
                await sendEmail({
                    to: email,
                    subject: subject,
                    html: htmlContent,
                    text: textContent,
                    headers: {
                        'List-Unsubscribe':
                            '<mailto:unsubscribe@fredbirds.com>',
                        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
                    }
                });
                console.log(`Email sent successfully to: ${email}`);
                return { email, success: true };
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error);
                return { email, success: false, error: error.message };
            }
        });

        // Wait for this batch to complete before moving to next batch
        const batchResults = await Promise.all(batchPromises);

        // Tally results
        batchResults.forEach((result) => {
            if (result.success) {
                results.success++;
            } else {
                results.failed++;
                results.errors.push({
                    email: result.email,
                    error: result.error
                });
            }
        });

        // Add 1 second delay between batches to respect rate limits (10 req/sec)
        if (i + BATCH_SIZE < recipientEmails.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    // If all emails failed, throw an error
    if (results.failed === recipientEmails.length) {
        throw new Error('Failed to send emails to all recipients');
    }

    // If some failed but not all, log warning but don't throw
    if (results.failed > 0) {
        console.warn(
            `${results.failed} out of ${recipientEmails.length} emails failed to send`
        );
    }

    return results;
};

export default {
    generateAnnouncementEmailHTML,
    generateAnnouncementEmailText,
    sendAnnouncementEmails
};
