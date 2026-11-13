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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import JoinDialog from '../auth/JoinDialog';
import PageContainer from '../common/PageContainer';

export default function Membership() {
    const [openMailDialog, setOpenMailDialog] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);

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
                Club welcomes you. <strong>Joining is free</strong> — no login
                required. After you join, you can create a login with the same
                email for full website access.
            </Typography>

            <Box sx={{ mb: 4 }}>
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
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Free to Join
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ mt: 1, opacity: 0.9 }}
                        >
                            Join free now, then create a login for full website
                            access.
                        </Typography>
                    </Box>
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 2, fontWeight: 600 }}
                            >
                                When you join:
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
                                    Added as a club member in the member
                                    directory
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
                                    Welcome at club field trips, events and
                                    programs
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
                                    Option to create a free website login for
                                    full site access
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
                                Optional supporting dues:
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
                                Dues are optional. They cover the calendar year
                                and serve as a donation to the club. They are
                                not required to join or to use the website.
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<PersonAddIcon />}
                                onClick={() => setJoinDialogOpen(true)}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1.05rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 50
                                }}
                            >
                                Join the Club
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Supporting dues by mail */}
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
                    How to pay supporting dues by mail
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
                    Supporting Dues by Mail
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        Supporting dues are optional and are not required to
                        join. To pay by check, make it out to{' '}
                        <strong>Fredericksburg Birding Club</strong> and mail
                        it to:
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
                            Optional supporting dues:
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
                        href="mailto:admin@fredbirds.com?subject=Supporting Dues Inquiry"
                        variant="contained"
                        color="primary"
                    >
                        Email Us
                    </Button>
                </DialogActions>
            </Dialog>

            <JoinDialog
                open={joinDialogOpen}
                onClose={() => setJoinDialogOpen(false)}
            />
        </PageContainer>
    );
}
