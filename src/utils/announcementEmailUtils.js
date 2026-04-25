import { generateAnnouncementEmail } from './emailTemplates';
import {
    sendBulkEmails,
    validateAndCleanEmail,
    filterAndCleanEmails
} from './emailBatchService';

// Re-export validation utilities from emailBatchService for backwards compatibility
export { validateAndCleanEmail, filterAndCleanEmails };

/**
 * Generates HTML email template for an announcement
 * @deprecated Use generateAnnouncementEmail from emailTemplates.js instead
 * @param {Object} announcement - Announcement object with headline and details
 * @returns {string} HTML content for the email
 */
export const generateAnnouncementEmailHTML = (announcement) => {
    const { html } = generateAnnouncementEmail(announcement);
    return html;
};

/**
 * Generates plain text version of announcement email
 * @deprecated Use generateAnnouncementEmail from emailTemplates.js instead
 * @param {Object} announcement - Announcement object
 * @returns {string} Plain text content for the email
 */
export const generateAnnouncementEmailText = (announcement) => {
    const { text } = generateAnnouncementEmail(announcement);
    return text;
};

/**
 * Sends announcement email to selected recipients
 * Note: Opted-out members (emailOptOut: true) should be filtered out before calling this function.
 * The EmailRecipientSelector component handles this filtering automatically.
 * @param {Object} announcement - Announcement object with headline and details
 * @param {string[]} recipientEmails - Array of recipient email addresses
 * @returns {Promise<{success: number, failed: number, errors: Array, invalidEmails: Array, retried: number}>} Results summary
 */
export const sendAnnouncementEmails = async (announcement, recipientEmails) => {
    if (!announcement || !announcement.headline || !announcement.details) {
        throw new Error('Invalid announcement data');
    }

    const { subject, html, text } = generateAnnouncementEmail(announcement);

    // Use the bulk email service with announcement-specific headers
    return sendBulkEmails({
        recipients: recipientEmails,
        subject,
        html,
        text,
        headers: {
            'List-Unsubscribe': '<mailto:unsubscribe@fredbirds.com>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        },
        batchSize: 3,
        delayBetweenBatches: 2000,
        delayBetweenEmails: 500,
        maxRetries: 3,
        initialRetryDelay: 1000
    });
};

export default {
    validateAndCleanEmail,
    filterAndCleanEmails,
    generateAnnouncementEmailHTML,
    generateAnnouncementEmailText,
    sendAnnouncementEmails
};
