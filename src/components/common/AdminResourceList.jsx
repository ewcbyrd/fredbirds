import React from 'react'
import {
    Box,
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Stack,
    Typography
} from '@mui/material'
import {
    Search as SearchIcon,
    Add as AddIcon
} from '@mui/icons-material'

const AdminResourceList = ({
    items = [],
    renderItem,
    onAdd,
    onSearch,
    loading = false,
    error = null,
    emptyMessage = "No items found.",
    addButtonText = "Add New",
    searchPlaceholder = "Search...",
    showSearch = true
}) => {
    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {onAdd && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAdd}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        {addButtonText}
                    </Button>
                )}

                {showSearch && onSearch && (
                    <TextField
                        placeholder={searchPlaceholder}
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={(e) => onSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : items.length === 0 ? (
                <Alert severity="info">
                    {emptyMessage}
                </Alert>
            ) : (
                <Stack spacing={2}>
                    {items.map((item, index) => (
                        <React.Fragment key={item._id || item.id || index}>
                            {renderItem(item)}
                        </React.Fragment>
                    ))}
                </Stack>
            )}
        </Box>
    )
}

export default AdminResourceList
