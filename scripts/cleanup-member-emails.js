/**
 * Script to clean up member email addresses with whitespace issues
 *
 * This script will:
 * 1. Fetch all members with problematic email addresses
 * 2. Clean the email addresses (trim whitespace)
 * 3. Update the member records in the database
 *
 * Run with: node scripts/cleanup-member-emails.js
 *
 * IMPORTANT: This will modify the database. Review the changes before confirming.
 */

const BASE_URL = 'https://fredbirds-api.azurewebsites.net';

/**
 * Validates and cleans an email address
 * @param {string} email - Email address to validate
 * @returns {{isValid: boolean, cleaned: string|null, issues: string[]}} Validation result
 */
function validateEmail(email) {
    const issues = [];

    if (!email || typeof email !== 'string') {
        return {
            isValid: false,
            cleaned: null,
            issues: ['Empty or non-string value']
        };
    }

    const original = email;
    const cleaned = email.trim();

    // Check for whitespace issues
    if (original !== cleaned) {
        issues.push('Has leading/trailing whitespace');
    }

    if (original.includes('\t')) {
        issues.push('Contains tab characters');
    }

    if (original.includes('\n')) {
        issues.push('Contains newline characters');
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleaned)) {
        issues.push('Invalid email format');
        return { isValid: false, cleaned: cleaned, issues };
    }

    return { isValid: issues.length === 0, cleaned, issues };
}

async function fetchAllMembers() {
    try {
        const response = await fetch(`${BASE_URL}/members`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
    }
}

async function updateMemberEmail(memberId, cleanedEmail) {
    try {
        const response = await fetch(`${BASE_URL}/members/${memberId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
            },
            body: JSON.stringify({ email: cleanedEmail })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `HTTP ${response.status}: ${response.statusText} - ${errorText}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error(`Error updating member ${memberId}:`, error);
        throw error;
    }
}

async function main() {
    console.log('Fetching all members from API...\n');

    const members = await fetchAllMembers();
    console.log(`Found ${members.length} total members\n`);

    // Identify members needing cleanup
    const needsCleanup = [];

    members.forEach((member) => {
        const { isValid, cleaned, issues } = validateEmail(member.email);

        if (issues.length > 0 && cleaned) {
            needsCleanup.push({
                id: member._id,
                firstName: member.firstName,
                lastName: member.lastName,
                originalEmail: member.email,
                cleanedEmail: cleaned,
                issues: issues
            });
        }
    });

    console.log('='.repeat(80));
    console.log('EMAIL CLEANUP PLAN');
    console.log('='.repeat(80));
    console.log(`Total members: ${members.length}`);
    console.log(`Members needing cleanup: ${needsCleanup.length}`);
    console.log('='.repeat(80));

    if (needsCleanup.length === 0) {
        console.log('\n✓ No cleanup needed! All email addresses are clean.');
        return;
    }

    console.log('\nTHE FOLLOWING EMAILS WILL BE UPDATED:\n');

    needsCleanup.forEach((item, index) => {
        console.log(`${index + 1}. ${item.firstName} ${item.lastName}`);
        console.log(`   FROM: ${JSON.stringify(item.originalEmail)}`);
        console.log(`   TO:   ${JSON.stringify(item.cleanedEmail)}`);
        console.log(`   Issues: ${item.issues.join(', ')}`);
        console.log('');
    });

    console.log('='.repeat(80));
    console.log('PROCEEDING WITH CLEANUP...');
    console.log('='.repeat(80));
    console.log('');

    const results = {
        success: 0,
        failed: 0,
        errors: []
    };

    // Update emails one at a time to avoid rate limiting
    for (let i = 0; i < needsCleanup.length; i++) {
        const member = needsCleanup[i];
        const progress = `[${i + 1}/${needsCleanup.length}]`;

        try {
            console.log(
                `${progress} Updating ${member.firstName} ${member.lastName}...`
            );
            await updateMemberEmail(member.id, member.cleanedEmail);
            results.success++;
            console.log(`${progress} ✓ Success`);
        } catch (error) {
            results.failed++;
            results.errors.push({
                member: `${member.firstName} ${member.lastName}`,
                email: member.originalEmail,
                error: error.message
            });
            console.log(`${progress} ✗ Failed: ${error.message}`);
        }

        // Small delay between requests to be nice to the API
        if (i < needsCleanup.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    console.log('');
    console.log('='.repeat(80));
    console.log('CLEANUP COMPLETE');
    console.log('='.repeat(80));
    console.log(`Successful updates: ${results.success}`);
    console.log(`Failed updates: ${results.failed}`);

    if (results.failed > 0) {
        console.log('\nFAILED UPDATES:');
        results.errors.forEach((err, index) => {
            console.log(`${index + 1}. ${err.member} (${err.email})`);
            console.log(`   Error: ${err.error}`);
        });
    }

    console.log('\n✓ Cleanup script completed!');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
