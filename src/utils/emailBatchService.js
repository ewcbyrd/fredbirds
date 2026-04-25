import { sendEmail } from '../services/restdbService';

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
 * Sends bulk emails with batching, throttling, and retry logic
 * @param {Object} config - Configuration object
 * @param {string[]} config.recipients - Array of recipient email addresses
 * @param {string} config.subject - Email subject
 * @param {string} config.html - HTML email content
 * @param {string} config.text - Plain text email content
 * @param {Object} [config.headers] - Optional email headers
 * @param {number} [config.batchSize=3] - Number of emails to send in each batch
 * @param {number} [config.delayBetweenBatches=2000] - Delay in ms between batches
 * @param {number} [config.delayBetweenEmails=500] - Delay in ms between individual emails
 * @param {number} [config.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [config.initialRetryDelay=1000] - Initial retry delay in ms (exponential backoff)
 * @returns {Promise<{success: number, failed: number, errors: Array, invalidEmails: Array, retried: number}>} Results summary
 */
export const sendBulkEmails = async ({
    recipients,
    subject,
    html,
    text,
    headers = {},
    batchSize = 3,
    delayBetweenBatches = 2000,
    delayBetweenEmails = 500,
    maxRetries = 3,
    initialRetryDelay = 1000
}) => {
    if (!Array.isArray(recipients) || recipients.length === 0) {
        throw new Error('No recipients specified');
    }

    if (!subject || !html) {
        throw new Error('Subject and HTML content are required');
    }

    // Validate and clean email addresses
    const { valid: cleanedEmails, invalid: invalidEmails } =
        filterAndCleanEmails(recipients);

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

    const results = {
        success: 0,
        failed: 0,
        errors: [],
        invalidEmails: invalidEmails,
        retried: 0
    };

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
                html: html,
                text: text,
                headers: headers
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
            if (is500Error && attempt < maxRetries) {
                const retryDelay = initialRetryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                console.warn(
                    `HTTP 500 error for ${email}, retrying in ${retryDelay}ms (attempt ${attempt + 1}/${maxRetries})`
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
    for (let i = 0; i < cleanedEmails.length; i += batchSize) {
        const batch = cleanedEmails.slice(i, i + batchSize);

        console.log(
            `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cleanedEmails.length / batchSize)} (${batch.length} emails)`
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
                    setTimeout(resolve, delayBetweenEmails)
                );
            }
        }

        // Longer delay between batches
        if (i + batchSize < cleanedEmails.length) {
            console.log(
                `Waiting ${delayBetweenBatches}ms before next batch...`
            );
            await new Promise((resolve) =>
                setTimeout(resolve, delayBetweenBatches)
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
    sendBulkEmails
};
