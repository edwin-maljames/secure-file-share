import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, deleteFile, shareFile, downloadFile } from '../../features/files/fileSlice';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';

const FileList = () => {
    const dispatch = useDispatch();
    const { files, isLoading, isError, message } = useSelector((state) => state.files);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [shareUsername, setShareUsername] = useState('');

    useEffect(() => {
        dispatch(getFiles());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            dispatch(deleteFile(id));
        }
    };

    const handleShareClick = (file) => {
        setSelectedFile(file);
        setShareDialogOpen(true);
    };

    const handleShare = () => {
        if (selectedFile && shareUsername) {
            dispatch(shareFile({
                fileId: selectedFile.id,
                username: shareUsername
            }));
            setShareDialogOpen(false);
            setShareUsername('');
            setSelectedFile(null);
        }
    };

    const handleDownload = async (file) => {
        try {
            const result = await dispatch(downloadFile(file.id)).unwrap();
            // Create a blob from the file data
            const blob = new Blob([result]);
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            // Trigger download
            document.body.appendChild(link);
            link.click();
            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Uploaded At</TableCell>
                            <TableCell>Shared With</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>
                                    {new Date(file.uploaded_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {file.shared_with?.length > 0
                                        ? file.shared_with.map(user => user.username).join(', ')
                                        : 'Not shared'}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Download">
                                        <IconButton
                                            onClick={() => handleDownload(file)}
                                            color="primary"
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share">
                                        <IconButton
                                            onClick={() => handleShareClick(file)}
                                            color="primary"
                                        >
                                            <ShareIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            onClick={() => handleDelete(file.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
                <DialogTitle>Share File</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        value={shareUsername}
                        onChange={(e) => setShareUsername(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleShare} variant="contained" color="primary">
                        Share
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FileList;
