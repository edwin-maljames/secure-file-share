import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../../features/files/fileSlice';
import {
    Button,
    Box,
    Typography,
    Alert,
    LinearProgress,
    Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const dispatch = useDispatch();
    const { isLoading, isError, message } = useSelector((state) => state.files);

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        const fileData = {
            file: selectedFile,
            name: selectedFile.name,
        };

        await dispatch(uploadFile(fileData));
        setSelectedFile(null);
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Typography variant="h6" component="h2">
                    Upload File
                </Typography>

                {isError && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                )}

                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                    >
                        Choose File
                        <input
                            type="file"
                            hidden
                            onChange={handleFileSelect}
                        />
                    </Button>

                    {selectedFile && (
                        <Typography variant="body2" color="textSecondary">
                            Selected: {selectedFile.name}
                        </Typography>
                    )}

                    {isLoading && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress />
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!selectedFile || isLoading}
                        sx={{ mt: 2 }}
                    >
                        Upload
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default FileUpload;
