# Edu-Portal

College management system with role-based access for Admin, Teacher, and Student. Includes an AI quiz generator for teachers.

Live demo: https://vijay-21-11-2005.github.io/Edu-Portal/

## Features
Admin: manage user roles, courses, and student enrollments.
Teacher: view assigned courses, generate quizzes with AI, save them to a course.
Student: view enrolled courses, take quizzes, see scores.

## Tech Stack
Frontend: HTML, CSS, Vanilla JavaScript  
Backend: Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions)  
AI: Gemini API, called from a Supabase Edge Function so the key stays private  
Hosting: GitHub Pages

## Security
Role-based access is enforced by Row Level Security policies in the database. The Gemini key is stored as a Supabase secret and is never exposed in the frontend. The quiz function accepts teachers only.

## Run locally
1. Create a Supabase project and run the SQL schema.
2. Add your project URL and publishable key in js/supabase-config.js.
3. Open index.html in a browser.
