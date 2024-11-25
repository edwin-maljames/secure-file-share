# Secure File Sharing Web Application

A full-stack web application for secure file sharing built with React and Django. This application allows users to securely upload, download, and share files with other users.

## Quick Start with Docker

1. Prerequisites:
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Make sure Docker Desktop is running (check for the whale icon in your menu bar)

2. Run the application:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd secure-file-share

   # Start the application
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Features

- 🔐 Secure Authentication with JWT
- 📁 File Upload and Download
- 🔄 File Sharing between Users
- 🛡️ Protected Routes
- 👥 User-specific File Access
- 🎨 Modern Material UI Design

## Tech Stack

### Frontend
- React 18.3.1
- Redux Toolkit (State Management)
- Material-UI (UI Components)
- React Router (Navigation)
- Axios (API Calls)

### Backend
- Django 5.0.1
- Django Rest Framework
- Simple JWT (Authentication)
- SQLite (Development Database)

## Development Setup

If you prefer to run the applications separately:

### Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Project Structure
```
secure-file-share/
├── backend/                 # Django backend
│   ├── files/              # File management app
│   ├── authentication/     # Authentication app
│   └── secure_file_share/  # Main Django project
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── features/      # Redux slices
│   │   └── services/      # API services
│   └── public/
├── docker-compose.yml      # Docker configuration
└── README.md              # Project documentation
```

## Security Features

- JWT-based authentication
- Protected API endpoints
- User-specific file access control
- CORS configuration
- Secure file handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

1. **Docker Issues**
   - Make sure Docker Desktop is running
   - Try `docker-compose down` followed by `docker-compose up --build`
   - Check Docker logs: `docker-compose logs`

2. **Frontend Issues**
   - Check console for errors
   - Verify API URL configuration
   - Clear browser cache and reload

3. **Backend Issues**
   - Check Django logs in Docker
   - Verify database migrations
   - Check CORS settings

## Future Enhancements

1. User Registration
2. File Preview
3. Advanced File Encryption
4. User Profiles
5. Comprehensive Sharing Permissions
6. Cloud Storage Integration
7. File Version Control
8. Activity Logging
