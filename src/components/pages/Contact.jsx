import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SendIcon from '@mui/icons-material/Send';
import { sendContactEmail } from '../../utils/emailTemplates';
import PageContainer from '../common/PageContainer';

const options = [
    { value: 'membership', label: 'Membership' },
    { value: 'birding', label: 'Birding' },
    { value: 'event', label: 'Event' },
    { value: 'website', label: 'Web Site' },
    { value: 'other', label: 'Other' }
];

const emailMap = new Map()
    .set(
        'membership',
        import.meta.env.VITE_CONTACT_EMAIL_MEMBERSHIP ||
            'jeannelh88@gmail.com'
    )
    .set(
        'website',
        import.meta.env.VITE_CONTACT_EMAIL_WEBSITE || 'scottbyrd681@gmail.com'
    )
    .set(
        'event',
        import.meta.env.VITE_CONTACT_EMAIL_EVENT || 'lawreysa@gmail.com'
    )
    .set(
        'birding',
        import.meta.env.VITE_CONTACT_EMAIL_BIRDING || 'lawreysa@gmail.com'
    )
    .set(
        'other',
        import.meta.env.VITE_CONTACT_EMAIL_OTHER || 'lawreysa@gmail.com'
    );

export default function Contact() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        topic: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
        if (status) setStatus(null);
    }

    function validate() {
        if (!form.name || !form.email || !form.topic || !form.message)
            return false;
        if (!/.+@.+\..+/.test(form.email)) return false;
        return true;
    }

    async function handleSubmit(e) {
        e?.preventDefault?.();
        if (!validate()) {
            setStatus({
                type: 'error',
                message: 'Please complete the form and provide a valid email.'
            });
            return;
        }
        setSubmitting(true);
        setStatus(null);
        const to = emailMap.get(form.topic);
        try {
            await sendContactEmail(form, to);
            setStatus({
                type: 'success',
                message:
                    'Message sent. Thank you — a club volunteer will get back to you soon.'
            });
            setForm({ name: '', email: '', topic: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again in a moment.'
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <PageContainer maxWidth="md">
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
            >
                Contact Us
            </Typography>
            <Typography
                variant="body1"
                sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.75 }}
            >
                Questions about membership, field trips, birding, or the
                website? Send us a note and we&apos;ll route it to the right
                club volunteer.
            </Typography>

            <Card
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1.5px solid rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                    }
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
                    <EmailOutlinedIcon sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Send a Message
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        Choose a topic so your message reaches the right person.
                        All fields are required.
                    </Typography>
                </Box>

                <CardContent
                    sx={{
                        p: { xs: 3, md: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5
                    }}
                >
                    {status && (
                        <Alert
                            severity={status.type}
                            onClose={() => setStatus(null)}
                        >
                            {status.message}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' }
                        }}
                    >
                        <TextField
                            fullWidth
                            required
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </Box>

                    <TextField
                        select
                        fullWidth
                        required
                        label="Topic"
                        name="topic"
                        value={form.topic}
                        onChange={handleChange}
                    >
                        {options.map((o) => (
                            <MenuItem key={o.value} value={o.value}>
                                {o.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        required
                        multiline
                        minRows={5}
                        label="Message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={submitting}
                        fullWidth
                        endIcon={!submitting ? <SendIcon /> : null}
                        sx={{
                            mt: 0.5,
                            py: 1.5,
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 50
                        }}
                    >
                        {submitting ? (
                            <CircularProgress
                                size={24}
                                sx={{ color: 'white' }}
                            />
                        ) : (
                            'Send Message'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </PageContainer>
    );
}
