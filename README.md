# Pagebound
A Goodreads-inspired platform that provides personalized AI-powered book recommendations alongside social features for an engaging user experience.

## Features
- User ratings and reviews for books
- AI-driven, NLP-powered personalized book recommendations
- Social interactions: follow users, comment on reviews
- Admin dashboard for content moderation and analytics

## Getting Started
### Prerequisites
- Python 3.x  
- Node.js & npm or Yarn (for frontend, Vite-based)  
- PostgreSQL database 

### Installation
1. **Backend setup**:
``` bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
cd src
pip install -r requirements.txt
```
2. **Database setup**:
Configure your PostgreSQL database credentials in the .env file (see .env.example).
Run migrations:
```bash
python manage.py migrate
```
3. **Frontend setup**:
``` bash
cd site
npm install
```

### Running the app
- **Start backend server**:
``` bash
cd src
python manage.py runserver
```
- **Start frontend dev server (Vite)**:
``` bash
cd site
npm run dev
```
Then open http://localhost:5173 in your browser.

