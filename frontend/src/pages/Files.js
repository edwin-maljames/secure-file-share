import React from 'react';
import { Container } from '@mui/material';
import FileUpload from '../components/Files/FileUpload';
import FileList from '../components/Files/FileList';

const Files = () => {
    return (
        <Container>
            <FileUpload />
            <FileList />
        </Container>
    );
};

export default Files;
