import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import JoinForm from './JoinForm';
import PageContainer from '../common/PageContainer';

export default function Membership() {
    const [openMailDialog, setOpenMailDialog] = useState(false);

    const handleOpenMailDialog = () => setOpenMailDialog(true);
    const handleCloseMailDialog = () => setOpenMailDialog(false);

    return (
        <PageContainer>
            <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}
            >
                Join the Club
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                Whether you're just starting to notice the birds in your
                backyard or you're a seasoned birder, the Fredericksburg Birding
                Club welcomes you. <strong>Joining is free</strong> — register
                below or click <strong>Get Started</strong> in the header for a
                quick registration form!
            </Typography>

            {/* Side-by-Side Layout: Benefits + Registration Form */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: { xs: 3, md: 4 },
                    alignItems: 'start',
                    mb: 4
                }}
            >
                {/* Membership Benefits Card */}
                <Card
                    sx={{
                        bgcolor: '#e8f5e9',
                        border: '3px solid',
                        borderColor: 'primary.main',
                        boxShadow: '0 4px 12px rgba(44, 95, 45, 0.2)',
                        borderRadius: 2,
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 6px 20px rgba(44, 95, 45, 0.3)'
                        },
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
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Free to Join
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ mt: 1, opacity: 0.9 }}
                        >
                            All members enjoy full access to club activities
                        </Typography>
                    </Box>
                    <CardContent sx={{ p: { xs: 3, md: 4 }, flexGrow: 1 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 2, fontWeight: 600 }}
                            >
                                All Members:
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0
                                    }}
                                />
                                <Typography variant="body1">
                                    Added to the club mailing list for news,
                                    events and announcements
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0
                                    }}
                                />
                                <Typography variant="body1">
                                    Participation in all club field trips,
                                    events and programs
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0
                                    }}
                                />
                                <Typography variant="body1">
                                    Access to club web resources, sighting
                                    reports and newsletters
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 2
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0
                                    }}
                                />
                                <Typography variant="body1">
                                    Access to club web resources, sighting
                                    reports and newsletters
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                bgcolor: '#f5f5f5',
                                borderRadius: 1,
                                p: 2
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 1, fontWeight: 600 }}
                            >
                                Optional Supporting Membership:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', mb: 1.5 }}
                            >
                                $20 Individual / $25 Family per year
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 1
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0,
                                        fontSize: 20
                                    }}
                                />
                                <Typography variant="body2">
                                    Voting rights at club meetings and officer
                                    elections
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 1
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0,
                                        fontSize: 20
                                    }}
                                />
                                <Typography variant="body2">
                                    Eligibility to hold club officer positions
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    mb: 1
                                }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        color: 'primary.main',
                                        mr: 2,
                                        mt: 0.5,
                                        flexShrink: 0,
                                        fontSize: 20
                                    }}
                                />
                                <Typography variant="body2">
                                    Direct support for the club's conservation
                                    and education mission
                                </Typography>
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                    mt: 1.5,
                                    fontStyle: 'italic',
                                    color: 'text.secondary'
                                }}
                            >
                                Dues are for the calendar year and serve as a
                                donation to the club.
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Registration Form */}
                <JoinForm />
            </Box>

            {/* Alternative: Join by Mail */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Button
                    variant="text"
                    startIcon={<MailOutlineIcon />}
                    onClick={handleOpenMailDialog}
                    sx={{
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontSize: '0.95rem',
                        '&:hover': { color: 'primary.main' }
                    }}
                >
                    Prefer to join by mail?
                </Button>
            </Box>

            {/* Mail-In Dialog */}
            <Dialog
                open={openMailDialog}
                onClose={handleCloseMailDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    Join by Mail
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        To become a paid Member, send a check made out to{' '}
                        <strong>Fredericksburg Birding Club</strong> to:
                    </Typography>

                    <Box
                        sx={{
                            bgcolor: '#f5f5f5',
                            p: 3,
                            borderRadius: 1,
                            mb: 3,
                            textAlign: 'center'
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ lineHeight: 2, fontWeight: 500 }}
                        >
                            Jeannie Hartzell
                            <br />
                            Fredericksburg Birding Club
                            <br />
                            383 Brenthem Farm Dr
                            <br />
                            Fredericksburg, VA 22401
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            bgcolor: '#e8f5e9',
                            p: 2,
                            borderRadius: 1,
                            mb: 2
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1 }}
                        >
                            Membership Dues:
                        </Typography>
                        <Typography variant="body2">
                            {'\u2022'} Individual: $20 per year
                            <br />
                            {'\u2022'} Family: $25 per year
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mt: 2
                        }}
                    >
                        <EmailIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="body2">
                            <strong>Questions?</strong> Email us at{' '}
                            <a
                                href="mailto:admin@fredbirds.com"
                                style={{
                                    color: '#2d5016',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                }}
                            >
                                admin@fredbirds.com
                            </a>
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleCloseMailDialog}
                        variant="outlined"
                        color="primary"
                    >
                        Close
                    </Button>
                    <Button
                        href="mailto:admin@fredbirds.com?subject=Membership Inquiry"
                        variant="contained"
                        color="primary"
                    >
                        Email Us
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
}
