import { generateAnnouncementEmail } from './emailTemplates';
import { sendBulkEmails } from './emailBatchService';

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
    sendAnnouncementEmails
};
