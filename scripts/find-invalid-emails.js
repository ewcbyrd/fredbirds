/**
 * Script to identify members with invalid or problematic email addresses
 *
 * Run with: node scripts/find-invalid-emails.js
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

    // Check for multiple @ signs
    const atCount = (cleaned.match(/@/g) || []).length;
    if (atCount !== 1) {
        issues.push(`Invalid @ count: ${atCount}`);
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleaned)) {
        issues.push('Invalid email format');
        return { isValid: false, cleaned: cleaned, issues };
    }

    return { isValid: issues.length === 0, cleaned, issues };
}

async function fetchActiveMembers() {
    try {
        const response = await fetch(`${BASE_URL}/members/active`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const members = await response.json();
        return members;
    } catch (error) {
        console.error('Error fetching members:', error);
        throw error;
    }
}

async function main() {
    console.log('Fetching active members from API...\n');

    const members = await fetchActiveMembers();
    console.log(`Found ${members.length} active members\n`);

    const problematic = [];
    const valid = [];

    members.forEach((member) => {
        const { isValid, cleaned, issues } = validateEmail(member.email);

        if (!isValid || issues.length > 0) {
            problematic.push({
                name: `${member.firstName} ${member.lastName}`,
                email: member.email,
                cleaned: cleaned,
                issues: issues,
                memberId: member._id
            });
        } else {
            valid.push(member.email);
        }
    });

    console.log('='.repeat(80));
    console.log('EMAIL VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`Total active members: ${members.length}`);
    console.log(`Valid emails: ${valid.length}`);
    console.log(`Problematic emails: ${problematic.length}`);
    console.log('='.repeat(80));

    if (problematic.length > 0) {
        console.log('\nPROBLEMATIC EMAIL ADDRESSES:\n');

        problematic.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name}`);
            console.log(`   Original: ${JSON.stringify(item.email)}`);
            console.log(`   Cleaned:  ${JSON.stringify(item.cleaned)}`);
            console.log(`   Issues:   ${item.issues.join(', ')}`);
            console.log(`   ID:       ${item.memberId}`);
            console.log('');
        });

        // Export as JSON for easy processing
        console.log('\n='.repeat(80));
        console.log('JSON EXPORT (copy this for processing):');
        console.log('='.repeat(80));
        console.log(JSON.stringify(problematic, null, 2));
    } else {
        console.log('\n✓ All email addresses are valid!');
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
