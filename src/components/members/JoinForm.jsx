import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Typography,
    Card,
    CardContent
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { registerMember } from '../../services/restdbService';
import { sendRegistrationEmail } from '../../utils/emailTemplates';

/**
 * Parse a full name string into first and last name.
 * @param {string} name - Full name (e.g. "Jane Smith")
 * @returns {{ first: string, last: string }}
 */
const parseName = (name) => {
    if (!name) return { first: '', last: '' };
    const parts = name.trim().split(/\s+/);
    return {
        first: parts[0] || '',
        last: parts.slice(1).join(' ') || ''
    };
};

const JoinForm = ({ embedded = false, onSuccess, onBack }) => {
    const { user, isAuthenticated } = useAuth0();

    // Pre-fill from Auth0 user context when authenticated
    const auth0First = user?.given_name || parseName(user?.name).first || '';
    const auth0Last = user?.family_name || parseName(user?.name).last || '';
    const auth0Email = user?.email || '';

    const [formData, setFormData] = useState({
        first: auth0First,
        last: auth0Last,
        email: auth0Email,
        phone: '',
        website: '' // honeypot field — bots fill this, humans don't see it
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const formatPhone = (value) => {
        // Strip non-digits
        const digits = value.replace(/\D/g, '');
        // Format as ###-###-####
        if (digits.length <= 3) return digits;
        if (digits.length <= 6)
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setFormData((prev) => ({
            ...prev,
            phone: formatted
        }));
    };

    const validateForm = () => {
        if (!formData.first.trim()) {
            setError('First name is required');
            return false;
        }
        if (!formData.last.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email address is required');
            return false;
        }
        // Validate email format using a temporary input element
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.value = formData.email.trim();
        if (!emailInput.checkValidity()) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const result = await registerMember({
                first: formData.first.trim(),
                last: formData.last.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                website: formData.website // honeypot value (should be empty for real users)
            });

            // Check for error responses that still return JSON
            if (result.error === 'ConflictError' || result.statusCode === 409) {
                setError(
                    'This email address is already registered. If you believe this is an error, please contact admin@fredbirds.com.'
                );
                return;
            }

            if (
                result.error === 'ValidationError' ||
                result.statusCode === 400
            ) {
                setError(
                    result.message ||
                        'Please check your information and try again.'
                );
                return;
            }

            if (result.error) {
                setError(
                    result.message || 'Something went wrong. Please try again.'
                );
                return;
            }

            // Send confirmation email (best-effort — don't block success if it fails)
            try {
                const firstName = formData.first.trim();
                await sendRegistrationEmail(
                    firstName,
                    formData.email.trim().toLowerCase()
                );
            } catch (emailErr) {
                console.error('Failed to send confirmation email:', emailErr);
            }

            // If onSuccess callback provided (embedded mode), call it
            if (onSuccess) {
                onSuccess({
                    first: formData.first.trim(),
                    last: formData.last.trim(),
                    email: formData.email.trim().toLowerCase()
                });
            } else {
                // Standalone mode - show success state
                setSuccess(true);
            }
        } catch (err) {
            console.error('Error submitting registration:', err);
            setError(
                err.message ||
                    'Unable to submit registration. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card
                sx={{
                    boxShadow: embedded ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
                    borderRadius: embedded ? 0 : 2,
                    height: '100%'
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Registration submitted successfully!
                    </Alert>
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>
                        Thank you for your interest in the Fredericksburg
                        Birding Club! Your application has been submitted and
                        will be reviewed by a club officer.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            sx={{
                boxShadow: embedded ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: embedded ? 0 : 2,
                transition: embedded ? 'none' : 'box-shadow 0.3s ease',
                '&:hover': embedded
                    ? {}
                    : { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {!embedded && (
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 3,
                        textAlign: 'center'
                    }}
                >
                    <PersonAddIcon sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Register to Join
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        Fill out the form below to apply for membership.
                    </Typography>
                </Box>
            )}
            <CardContent sx={{ p: { xs: 3, md: 4 }, flexGrow: 1 }}>
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}
                    >
                        <TextField
                            label="First Name"
                            name="first"
                            value={formData.first}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoComplete="given-name"
                        />
                        <TextField
                            label="Last Name"
                            name="last"
                            value={formData.last}
                            onChange={handleChange}
                            required
                            fullWidth
                            autoComplete="family-name"
                        />
                    </Box>

                    <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        autoComplete="email"
                    />

                    <TextField
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        fullWidth
                        autoComplete="tel"
                        placeholder="###-###-####"
                        helperText="Optional"
                    />

                    {/* Honeypot field — hidden from real users, bots will fill it */}
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            left: '-9999px',
                            opacity: 0,
                            height: 0,
                            width: 0,
                            overflow: 'hidden'
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: embedded ? 'row' : 'column'
                        }}
                    >
                        {embedded && onBack && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={onBack}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.05rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 50
                                }}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            fullWidth={!embedded}
                            sx={{
                                py: 1.5,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 50,
                                position: 'relative',
                                flexGrow: embedded ? 1 : 0
                            }}
                        >
                            {loading ? (
                                <CircularProgress
                                    size={24}
                                    sx={{ color: 'white' }}
                                />
                            ) : (
                                'Submit Registration'
                            )}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default JoinForm;
