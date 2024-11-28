import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const API_URL = 'http://localhost:8000/api/files/';

// Get user files
export const getFiles = createAsyncThunk(
    'files/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await authService.axiosInstance.get(API_URL, config);
            return response.data;
        } catch (error) {
            console.error('Error fetching files:', error.response || error);
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Upload file
export const uploadFile = createAsyncThunk(
    'files/upload',
    async (fileData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            const formData = new FormData();
            formData.append('file', fileData.file);
            formData.append('name', fileData.file.name);
            
            const response = await authService.axiosInstance.post(API_URL, formData, config);
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error.response || error);
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Share file
export const shareFile = createAsyncThunk(
    'files/share',
    async ({ fileId, username }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await authService.axiosInstance.post(
                `${API_URL}${fileId}/share/`,
                { username },
                config
            );
            return response.data;
        } catch (error) {
            console.error('Error sharing file:', error.response || error);
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete file
export const deleteFile = createAsyncThunk(
    'files/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            await authService.axiosInstance.delete(`${API_URL}${id}/`, config);
            return id;
        } catch (error) {
            console.error('Error deleting file:', error.response || error);
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Download file
export const downloadFile = createAsyncThunk(
    'files/download',
    async (fileId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;
            if (!token) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob',
            };
            const response = await authService.axiosInstance.get(
                `${API_URL}${fileId}/download/`,
                config
            );
            return response.data;
        } catch (error) {
            console.error('Error downloading file:', error.response || error);
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    files: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            // Get files
            .addCase(getFiles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.files = action.payload;
            })
            .addCase(getFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Upload file
            .addCase(uploadFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.files.push(action.payload);
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Share file
            .addCase(shareFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(shareFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update the shared file in the state
                const index = state.files.findIndex(file => file.id === action.payload.id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            .addCase(shareFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete file
            .addCase(deleteFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.files = state.files.filter(file => file.id !== action.payload);
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Download file
            .addCase(downloadFile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(downloadFile.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(downloadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset } = fileSlice.actions;
export default fileSlice.reducer;
