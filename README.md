# Assignment Management System

## Description

This project is a web-based assignment management system designed to streamline the assignment creation, submission, and grading process for educational institutions. It offers secure and user-friendly interfaces for administrators, teachers, and students.

## Features

### Robust Authentication (Supabase Auth)

- Secure logins with passwords and email checkups.
- Two-factor authentication using magic link for enhanced security.
- Access control based on user roles (admins, teachers, students).

### Comprehensive Administrator Dashboard

- Manage user accounts (add, delete, edit) for teachers and students.
- Grant or revoke admin privileges for other users.
- View and manage all user details (teachers, students) with filtering options (department, semester).

### Teacher Dashboard

- Create and manage assignments for specific courses/subjects.
- View assigned students based on department and semester.
- Track submission status (submitted/not submitted) for each assignment.
- Grade submitted assignments and provide feedback to students (real-time).

### Student Dashboard

- View assigned tasks based on their enrolled courses/departments and semesters.
- Submit assignments by uploading response files.
- View assignment grading status and feedback provided by teachers (real-time).

### Real-time Updates

- All data updates (assignments, submissions, grades) are reflected instantaneously across all dashboards, ensuring everyone has the latest information.

### Persistent Assignment Storage (Supabase Storage with AWS S3 Bucket)

- Supabase Storage provides a user-friendly interface for teachers and students to upload and manage assignment files.
- Leveraging AWS S3 for efficient and scalable file storage.

## Technologies Used

### Front-end

- React JS (main library)
- NextUI (component library)
- Redux Toolkit (state management)
- Axios (HTTP client)
- dayjs (date/time manipulation)
- FilePond (file upload library)
- Framer Motion (animation library)

### Styling

- Tailwind CSS (utility-first framework)
- PostCSS (CSS preprocessor)
- Autoprefixer (adds vendor prefixes)

### Dev Tools & Testing

- Vite (build tool)
- ESLint (linting)
- Vitest (testing)

### Backend

- Supabase (Backend-as-a-Service)

### Deployment

- Vercel (deployment platform)

## Additional Notes

- Live Link: [Manage Assignments](https://assignment-management-system-nine.vercel.app/)
- GitHub Repository: [Assignment-Management-System](https://github.com/Soumya-0x000/Assignment-Management-System)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn


### Installation

1. Clone the Repository:

   ```
   git clone https://github.com/Soumya-0x000/Assignment-Management-System
   ```
2. Navigate to the project directory:

   ```
   cd Assignment-Management-System
   ```
3. Install the dependencies:
   Choose one of the following commands:

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

### Setup Environment Variables

Create a file named `.env` in the root of the project directory. This file will store your Supabase environment variables. You can find instructions on obtaining these values in the [Supabase documentation](https://supabase.com/docs/guides/getting-started).

Add the following lines to your `.env` file, replacing the placeholders with your actual values:
``VITE_SUPABASE_URL=your_supabase_url``

``VITE_SUPABASE_KEY=your_supabase_anon_key``

``VITE_SERVICE_ROLE_KEY=your_supabase_service_role_key``

### Run the Development Server

Start the development server using:
    ``npm run dev``
    or
    ``yarn start``

### Open the Application

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
