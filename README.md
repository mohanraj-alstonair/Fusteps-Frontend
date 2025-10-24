# FuSteps

FuSteps is a comprehensive platform designed to connect students, mentors, alumni, and employers in the professional development ecosystem. The platform facilitates student onboarding, resume parsing, mentorship programs, and job opportunities.

## Features

### For Students
- **Onboarding System**: Complete profile setup with academic information
- **Resume Upload & Parsing**: Automatic extraction of key information from PDF resumes
- **Mentorship Access**: Connect with experienced mentors
- **Job Opportunities**: Browse and apply for internships and jobs
- **Resource Library**: Access to courses, projects, and learning materials

### For Mentors
- **Profile Management**: Create and manage mentor profiles
- **Expertise Areas**: Specify areas of specialization and experience
- **Session Scheduling**: Manage mentoring sessions and availability
- **Feedback System**: Provide guidance and track mentee progress

### For Alumni
- **Community Engagement**: Stay connected with the network
- **Mentorship Opportunities**: Share experiences and guide current students
- **Job Postings**: Post opportunities for students
- **Events & Networking**: Participate in alumni events

### For Employers
- **Job Postings**: Create and manage job/internship listings
- **Candidate Discovery**: Access student profiles and resumes
- **Analytics**: Track application metrics and engagement

## Tech Stack

### Backend
- **Framework**: Django 5.2.6
- **Database**: MySQL
- **API**: RESTful API with JSON responses
- **Authentication**: Session-based (Django auth)
- **File Handling**: PDF processing with pdfplumber

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **HTTP Client**: Axios

## Prerequisites

Before running this project, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 16+**
- **MySQL Server**
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fusteps
```

### 2. Backend Setup (Django)

#### Create Virtual Environment
```bash
cd onboarding_project
python -m venv .venv
.venv\Scripts\activate  # On Windows
# or
source .venv/bin/activate  # On macOS/Linux
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Database Setup
1. Install and start MySQL server
2. Create a database named `registered_student`
3. Update database credentials in `onboarding_project/settings.py` if needed

#### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### (Optional) Load Sample Data
```bash
python insert_data.py
```

#### Start Django Server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup (React)

#### Install Dependencies
```bash
cd client
npm install
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage Guide

### Student Onboarding

1. **Access the Platform**: Navigate to the student dashboard
2. **Complete Profile**: Fill in personal and academic information
3. **Upload Resume**: Submit PDF resume for automatic parsing
4. **Connect with Mentors**: Browse available mentors and schedule sessions
5. **Explore Opportunities**: View internships and job listings

### Resume Upload Process

The platform supports PDF resume uploads with automatic data extraction:

```javascript
// Frontend example
import { uploadResume } from './lib/api';

const handleFileUpload = async (file) => {
  try {
    const response = await uploadResume(file);
    console.log('Resume parsed:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Mentor Registration

Mentors can register through the platform:

```javascript
// API call example
const mentorData = {
  name: "John Doe",
  email: "john.doe@example.com",
  expertise: "Software Engineering",
  experience_years: 5
};

fetch('/api/mentors/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(mentorData)
});
```

## API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Endpoints

#### Resume Management
- `POST /api/resumes/upload/` - Upload and parse resume PDF (fixed parsing error for robust data extraction in both simple and advanced modes)
- `POST /api/resumes/parse/` - Parse resume without saving

#### Student Onboarding
- `POST /api/onboarding/` - Submit student onboarding data

#### Mentor Management
- `POST /api/mentors/register/` - Register new mentor
- `POST /api/mentors/login/` - Mentor login/authentication
- `GET /api/mentors/students/` - List all student candidates (mentor access only)

#### Jobs
- `GET /api/jobs/` - List available jobs
- `POST /api/jobs/` - Create new job posting (employer only)

### Request/Response Examples

#### Upload Resume
```bash
curl -X POST http://localhost:8000/api/resumes/upload/ \
  -F "file=@resume.pdf"
```

Response:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "university": "Example University",
  "field_of_study": "Computer Science",
  "year_of_passout": "2024",
  "degree": "Bachelor of Science"
}
```

#### Mentor Students List
```bash
curl -X GET http://localhost:8000/api/mentors/students/ \
  -H "Authorization: Bearer <mentor_token>"  # Assuming token-based auth for mentors
```

Response:
```json
{
  "status": "success",
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "university": "Example University",
      "field_of_study": "Computer Science",
      "year_of_passout": "2024",
      "degree": "Bachelor of Science"
    }
  ]
}
```

#### Student Onboarding
```bash
curl -X POST http://localhost:8000/api/onboarding/ \
  -d "name=John Doe" \
  -d "email=john.doe@example.com" \
  -d "phone=+1234567890" \
  -d "university=Example University" \
  -d "field_of_study=Computer Science" \
  -d "graduationYear=2024" \
  -d "degree=Bachelor of Science"
```

Response:
```json
{
  "message": "Onboarding data saved successfully to registered_student database"
}
```

## Database Schema

### Candidate Model
- `name`: CharField (max 100)
- `email`: EmailField (max 100)
- `phone`: CharField (max 20)
- `university`: CharField (max 150)
- `field_of_study`: CharField (max 150)
- `year_of_passout`: CharField (max 4, required)
- `degree`: CharField (max 100)

### Mentor Model
- `name`: CharField (max 255)
- `email`: EmailField (unique)
- `expertise`: CharField (max 255)
- `experience_years`: IntegerField (default 0)

## Development

### Running Tests
```bash
# Backend tests
cd onboarding_project
python manage.py test

# Frontend tests (if configured)
cd client
npm test
```

### Building for Production
```bash
# Frontend build
cd client
npm run build

# Backend (Django handles static files)
cd onboarding_project
python manage.py collectstatic
```

### Code Style
- **Backend**: Follow Django best practices and PEP 8
- **Frontend**: Use ESLint and Prettier configurations
- **Commits**: Use conventional commit messages

## Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings.py
2. Configure production database settings
3. Set up static file serving (nginx/apache)
4. Use gunicorn or similar WSGI server

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve static files from `dist/` directory
3. Configure reverse proxy for API calls

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## Troubleshooting

### Common Issues

#### Database Connection Error
- Ensure MySQL server is running
- Verify database credentials in settings.py
- Check if database exists

#### CORS Errors
- Backend has CORS enabled for development
- For production, configure allowed origins properly

#### PDF Parsing Issues
- Ensure uploaded files are valid PDFs
- Check pdfplumber installation
- Review logs for parsing errors

#### Port Conflicts
- Django runs on port 8000 by default
- React dev server runs on port 5173
- Change ports in configuration if needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**FuSteps** - Bridging the gap between education and employment.
