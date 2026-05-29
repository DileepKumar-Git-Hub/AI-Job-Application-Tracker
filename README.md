<h1 align="center">🤖 AI Job Application Tracker</h1>

<p align="center">
  <b>Smart job hunting — powered by Gemini AI</b><br/>
  Track applications · Analyze resumes · Scrape jobs · Prep for interviews
</p>

<p align="center">
  <a href="YOUR_LIVE_DEMO_LINK">
    <img src="https://img.shields.io/badge/Live_Demo-🚀_Click_Here-20232A?style=for-the-badge"/>
  </a>
</p>

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 📋 **Application Tracker** | Add, update & manage all your job applications in one place |
| 🔍 **Job Search & Scraping** | Search & pull live job listings directly into the app |
| 📄 **AI Resume Analyzer** | Upload your resume — Gemini AI gives instant feedback & match score |
| 🎯 **Interview Prep** | Get AI-generated interview questions tailored to the job role |
| 💡 **AI Tips** | Smart suggestions to improve your application success rate |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

### Backend
![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-009688?style=flat&logo=fastapi&logoColor=white)

### AI & Database
![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white)



## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Gemini API Key → [Get it here](https://makersuite.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/DileepKumar-Git-Hub/AI-Job-Application-Tracker.git
cd AI-Job-Application-Tracker
```

---

### 2. Backend Setup (Django)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY inside .env

# Run migrations
python manage.py migrate

# Start backend server
python manage.py runserver
```

---

### 3. Frontend Setup (React)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React app
npm run dev
```

---

### 4. Open in Browser
Frontend → http://localhost:3000
Backend  → http://localhost:8000

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DEBUG=True
SECRET_KEY=your_django_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1
```

---

## 📁 Project Structure

AI-Job-Application-Tracker/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── jobs/               # Job tracking app
│   ├── resume/             # Resume analysis app
│   ├── interview/          # Interview prep app
│   └── config/             # Django settings
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # API calls
│   │   └── App.js
│   └── package.json
│
└── README.md

---

## 🌐 Live Demo

🔗 **[Click here to try the live app](https://ai-job-application-trackerwer.vercel.app/)**

> Replace `YOUR_LIVE_DEMO_LINK` with your actual deployed URL (Vercel / Render / Railway etc.)

---

## 🙋‍♂️ Author

**Dileep Kumar**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/dileep-kumar-dornala)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=flat&logo=gmail&logoColor=white)](mailto:dornaladileepkumar9090909090@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/DileepKumar-Git-Hub)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by Dileep Kumar · Hyderabad, India
</p>
