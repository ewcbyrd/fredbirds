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
 * Validates and cleans an email address
 * @param {string} email - Email address to validate
 * @returns {string|null} Cleaned email address or null if invalid
 */
export const validateAndCleanEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return null;
    }

    // Trim whitespace (spaces, tabs, newlines)
    const cleaned = email.trim();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleaned)) {
        return null;
    }

    return cleaned;
};

/**
 * Filters and cleans an array of email addresses
 * @param {string[]} emails - Array of email addresses
 * @returns {{valid: string[], invalid: Array<{email: string, reason: string}>}} Cleaned valid emails and invalid entries
 */
export const filterAndCleanEmails = (emails) => {
    const valid = [];
    const invalid = [];

    if (!Array.isArray(emails)) {
        return { valid, invalid };
    }

    emails.forEach((email) => {
        const cleaned = validateAndCleanEmail(email);
        if (cleaned) {
            valid.push(cleaned);
        } else {
            invalid.push({
                email: email || '(empty)',
                reason: 'Invalid email format or whitespace issue'
            });
        }
    });

    return { valid, invalid };
};

/**
 * Sends announcement email to selected recipients
 * Note: Opted-out members (emailOptOut: true) should be filtered out before calling this function.
 * The EmailRecipientSelector component handles this filtering automatically.
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

    // Validate and clean email addresses
    const { valid: cleanedEmails, invalid: invalidEmails } =
        filterAndCleanEmails(recipientEmails);

    // Log any invalid emails that were filtered out
    if (invalidEmails.length > 0) {
        console.warn(
            `Filtered out ${invalidEmails.length} invalid email addresses:`,
            invalidEmails
        );
    }

    // Check if we have any valid emails left after filtering
    if (cleanedEmails.length === 0) {
        throw new Error('No valid email addresses found after validation');
    }

    const htmlContent = generateAnnouncementEmailHTML(announcement);
    const textContent = generateAnnouncementEmailText(announcement);
    const subject = `Announcement: ${announcement.headline}`;

    const results = {
        success: 0,
        failed: 0,
        errors: [],
        invalidEmails: invalidEmails, // Include invalid emails in results
        retried: 0
    };

    // Configuration for throttling and retry
    const BATCH_SIZE = 3; // Reduced from 10 to avoid overwhelming backend
    const DELAY_BETWEEN_BATCHES = 2000; // Increased to 2 seconds
    const DELAY_BETWEEN_EMAILS = 500; // 500ms delay between individual emails
    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 1000; // Start with 1 second

    /**
     * Send a single email with retry logic and exponential backoff
     * @param {string} email - Recipient email address
     * @param {number} attempt - Current attempt number (1-based)
     * @returns {Promise<{email: string, success: boolean, error?: string, retries?: number}>}
     */
    const sendEmailWithRetry = async (email, attempt = 1) => {
        try {
            await sendEmail({
                to: email,
                subject: subject,
                html: htmlContent,
                text: textContent,
                headers: {
                    'List-Unsubscribe': '<mailto:unsubscribe@fredbirds.com>',
                    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
                }
            });
            console.log(
                `Email sent successfully to: ${email}${attempt > 1 ? ` (after ${attempt - 1} retries)` : ''}`
            );
            return {
                email,
                success: true,
                retries: attempt - 1
            };
        } catch (error) {
            const errorMessage = error.message || 'Unknown error';
            const is500Error =
                errorMessage.includes('500') ||
                errorMessage.includes('Internal Server Error');

            // Retry on 500 errors up to MAX_RETRIES
            if (is500Error && attempt < MAX_RETRIES) {
                const retryDelay =
                    INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
                console.warn(
                    `HTTP 500 error for ${email}, retrying in ${retryDelay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
                );

                await new Promise((resolve) => setTimeout(resolve, retryDelay));
                return sendEmailWithRetry(email, attempt + 1);
            }

            console.error(
                `Failed to send email to ${email} after ${attempt} attempts:`,
                error
            );
            return {
                email,
                success: false,
                error: errorMessage,
                retries: attempt - 1
            };
        }
    };

    // Send emails individually with throttling
    // Process in small batches with delays to avoid overwhelming the backend
    for (let i = 0; i < cleanedEmails.length; i += BATCH_SIZE) {
        const batch = cleanedEmails.slice(i, i + BATCH_SIZE);

        console.log(
            `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(cleanedEmails.length / BATCH_SIZE)} (${batch.length} emails)`
        );

        // Process emails in batch sequentially with delays between each
        for (let j = 0; j < batch.length; j++) {
            const email = batch[j];
            const result = await sendEmailWithRetry(email);

            // Tally results
            if (result.success) {
                results.success++;
                if (result.retries > 0) {
                    results.retried++;
                }
            } else {
                results.failed++;
                results.errors.push({
                    email: result.email,
                    error: result.error
                });
            }

            // Delay between individual emails within batch
            if (j < batch.length - 1) {
                await new Promise((resolve) =>
                    setTimeout(resolve, DELAY_BETWEEN_EMAILS)
                );
            }
        }

        // Longer delay between batches
        if (i + BATCH_SIZE < cleanedEmails.length) {
            console.log(
                `Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`
            );
            await new Promise((resolve) =>
                setTimeout(resolve, DELAY_BETWEEN_BATCHES)
            );
        }
    }

    // If all emails failed, throw an error
    if (results.failed === cleanedEmails.length) {
        throw new Error('Failed to send emails to all recipients');
    }

    // If some failed but not all, log warning but don't throw
    if (results.failed > 0) {
        console.warn(
            `${results.failed} out of ${cleanedEmails.length} emails failed to send`
        );
    }

    return results;
};

export default {
    validateAndCleanEmail,
    filterAndCleanEmails,
    generateAnnouncementEmailHTML,
    generateAnnouncementEmailText,
    sendAnnouncementEmails
};
