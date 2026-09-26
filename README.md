# 🚀 PathNova — Career Compass

> **Discover the career that fits you. Understand why. Build your path forward.**

PathNova is an **AI-powered career discovery platform** designed to help students move from career uncertainty to a personalized, actionable career path.

Instead of simply listing career options, PathNova combines **personality, interests, aptitude, skills, values, work style, motivation, and career goals** to generate personalized career insights, recommendations, skill gaps, and education-to-career roadmaps.

🔗 **Live Demo:** https://pathnova-career-compass.vercel.app

---

## 🎯 Problem

Choosing a career is often difficult because students have access to too much information but very little **personalized guidance**.

Students commonly struggle with questions like:

* Which career actually suits me?
* What are my strengths and weaknesses?
* Do my interests match my career goals?
* What skills am I missing?
* What should I learn next?
* What does a career actually look like day-to-day?

PathNova aims to turn these questions into a **structured career discovery experience**.

---

## 💡 Solution

PathNova creates a personalized career profile by combining multiple dimensions of a student's profile:

* 🧠 Personality
* 🎯 Interests
* 📊 Aptitude
* 💎 Values
* 🛠️ Skills
* 💼 Work style
* 🔥 Motivation
* ❤️ Emotional intelligence
* 📚 Learning preferences
* 🚀 Career goals

The platform then uses these insights to generate **explainable career recommendations** and a personalized path toward those careers.

---

## ✨ Key Features

### 🧠 Multi-Dimensional Career Assessment

A structured assessment covering:

* Big Five personality traits
* RIASEC interests
* Logical reasoning
* Numerical reasoning
* Verbal reasoning
* Spatial reasoning
* Abstract reasoning
* Values
* Skills
* Work style
* Motivation
* Learning preferences
* Career goals

---

### 🤖 AI-Powered Career Analysis

PathNova analyzes assessment results to generate a personalized career profile including:

* Personality insights
* Strengths
* Growth areas
* Interests
* Aptitudes
* Values
* Learning style
* Communication style
* Leadership style
* Motivation
* Preferred work environment

---

### 🎯 Explainable Career Recommendations

Instead of simply suggesting a career, PathNova provides:

* Career match percentage
* Reasons behind the recommendation
* Relevant strengths
* Potential skill gaps
* Required skills
* Education pathway
* Career development direction

This makes the recommendations easier to understand and act upon.

---

### 🗺️ Personalized Career Roadmap

Users receive an education-to-career roadmap based on their current academic stage.

The roadmap helps connect:

**Current Stage → Skills → Education → Experience → Target Career**

---

### 🧪 Career Experience

Users can explore careers through interactive simulations designed around real-world scenarios.

Career experiences include:

* 👨‍💻 Software Engineer
* 🩺 Doctor
* ⚖️ Lawyer
* 🏛️ Architect
* 🚀 Entrepreneur
* 📊 Data Scientist
* 🎨 UX Designer
* 🧠 Psychologist
* ✈️ Pilot
* 👩‍🏫 Teacher

Each experience can include:

* Day-in-the-life activities
* Decision-based scenarios
* Required skills
* Education paths
* Career insights
* AI-generated feedback
* Salary information
* Future demand

---

### 📊 Personal Dashboard

The dashboard brings the user's career journey together in one place.

Users can track:

* Saved careers
* Assessment history
* Learning roadmap
* Goals
* Progress
* AI recommendations
* Career comparisons
* Notifications
* Career reports

---

### 📄 Personalized Career Report

Users can generate a comprehensive report containing their:

* Career profile
* Personality insights
* Strengths
* Growth areas
* Career recommendations
* Skill gaps
* Career roadmap

---

### 👨‍👩‍👧 Parent Insights

The platform is designed to make career discussions easier by presenting student career insights in a structured and understandable format.

---

## 🛠️ Tech Stack

| Technology           | Purpose                             |
| -------------------- | ----------------------------------- |
| **React**            | Frontend UI                         |
| **TypeScript**       | Type-safe development               |
| **Vite**             | Development and build tooling       |
| **Tailwind CSS**     | Styling and responsive UI           |
| **Supabase**         | Backend infrastructure              |
| **PostgreSQL**       | Database                            |
| **Supabase Auth**    | User authentication                 |
| **Supabase Storage** | File/storage management             |
| **AI Integration**   | Career analysis and recommendations |
| **Vercel**           | Deployment                          |

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      PathNova       │
                    │   Career Compass    │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication     Assessment       Dashboard
              │                │                │
              │                ▼                │
              │         Profile Analysis        │
              │                │                │
              │                ▼                │
              │       Career Recommendations   │
              │                │                │
              │                ▼                │
              │       Skill Gap Analysis       │
              │                │                │
              │                ▼                │
              │      Career Roadmap             │
              │                                 │
              └───────────────┬─────────────────┘
                              ▼
                         Supabase
                    PostgreSQL + Auth
```

---

## 📂 Project Structure

```text
pathnova-career-compass/
│
├── public/
│   └── static assets
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   └── ...
│
├── supabase/
│   └── database/backend configuration
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.*
└── README.md
```

---

## 🔄 User Journey

```text
Landing Page
      ↓
Sign Up / Login
      ↓
Career Assessment
      ↓
AI Analysis
      ↓
Personalized Career Profile
      ↓
Career Recommendations
      ↓
Skill Gap Analysis
      ↓
Career Roadmap
      ↓
Career Experiences
      ↓
Dashboard & Progress Tracking
```

---

## 🎨 Design Principles

PathNova is designed around:

* Clean and modern UI
* Student-friendly language
* Clear information hierarchy
* Responsive layouts
* Accessible interactions
* Data-driven career exploration
* Explainable recommendations
* Smooth user experience

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShreyaSankpal/pathnova-career-compass.git
```

### 2. Navigate to the project

```bash
cd pathnova-career-compass
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required Supabase and application credentials.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Never commit real API keys or secrets to GitHub.

### 5. Start the development server

```bash
npm run dev
```

The application will be available locally at the development URL shown by Vite.

---

## 🔮 Future Improvements

Planned improvements include:

* 🤖 AI career mentor
* 💼 Internship recommendations
* 🎓 Personalized course recommendations
* 📈 Advanced career analytics
* 🧑‍💼 Mentor matching
* 🔔 Smarter career notifications
* 🏆 Gamified career milestones
* 📱 Improved mobile experience
* 🌎 More career paths and experiences

---

## 🧠 What This Project Demonstrates

This project demonstrates experience with:

* Modern frontend development
* TypeScript
* React architecture
* Responsive UI development
* Authentication
* Database integration
* Supabase
* AI-powered product design
* Multi-step assessment systems
* Personalized recommendation systems
* Dashboard development
* Product-oriented UX

---

## 📌 Project Status

**Active Development**

PathNova is being developed as a scalable career discovery platform rather than a static UI prototype.

---

## 👩‍💻 Author

**Shreya Sankpal**

Computer Engineering Student




---

## 📄 Disclaimer

PathNova is an educational career-discovery platform. Career recommendations are intended to support exploration and should not be treated as definitive professional, educational, or psychological advice.
