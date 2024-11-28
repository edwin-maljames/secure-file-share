import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
} from '@mui/material';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static" 
                sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
            >
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1,
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}
                    >
                        Secure File Share
                    </Typography>
                    {user ? (
                        <>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    mr: 2,
                                    color: 'rgba(255,255,255,0.9)'
                                }}
                            >
                                Welcome, {user.username}
                            </Typography>
                            <Button 
                                color="inherit" 
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/login')}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
