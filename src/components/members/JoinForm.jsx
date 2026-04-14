import React, { useState } from 'react';
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

const JoinForm = () => {
    const [formData, setFormData] = useState({
        first: '',
        last: '',
        email: '',
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

            setSuccess(true);
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderRadius: 2,
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
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
                transition: 'box-shadow 0.3s ease',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
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

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 50,
                            position: 'relative'
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
            </CardContent>
        </Card>
    );
};

export default JoinForm;
