# 🌸 Period Tracker Web Application

A full-stack period tracker application that helps users record and monitor their menstrual cycles along with symptoms, notes, and flow details.

---

## 🛠️ Tech Stack

- **Frontend**: React, Axios, Vite, Material UI
- **Backend**: Node.js, Express.js, PostgreSQL
- **Deployment**: 
  - Frontend: GitHub Pages
  - Backend: Render

---

## 🚀 Features

- Add and edit cycle details with start/end dates
- Record symptoms: cramps, headache, fatigue, nausea, mood swings, bloating
- Track flow details: intensity, color, clotting
- Add personal notes
- Complete or delete cycles
- Paginated view of cycles
- Calendar and statistics components

---

## 📦 Setup Instructions

### 📥 Clone the Repository

    ```bash
    git clone https://github.com/rajeev2004/period-tracker.git
    cd period-tracker

### **Backend Setup**
1. Navigate to backend:

   ```bash
   cd backend

2. Install dependencies:

   ```bash
   npm install

3. Make a postgreSQL database and run this SQL manually:

    ```bash
    CREATE TABLE cycles (
        id SERIAL PRIMARY KEY,
        start_date DATE NOT NULL,
        end_date DATE,
        cramps BOOLEAN DEFAULT FALSE,
        headache BOOLEAN DEFAULT FALSE,
        fatigue BOOLEAN DEFAULT FALSE,
        nausea BOOLEAN DEFAULT FALSE,
        mood_swings BOOLEAN DEFAULT FALSE,
        bloating BOOLEAN DEFAULT FALSE,
        notes TEXT,
        flow_intensity TEXT,
        flow_color TEXT,
        clotting TEXT
    );

4. Create a .env file and add the following environment variables: 
    ```bash

    DATABASE_URL=your_database_url
    PORT=5000

4. Start the backend server (ensure the database is set up):
    ```bash

    node server.js

### **Frontend Setup**
1. Navigate to frontend:
   ```bash

   cd frontend

2. Install dependencies:
    ```bash

    npm install

3. Create a .env file and add the following:
    ```bash

    VITE_API_BACKEND=http://localhost:5000

4. Start the frontend development server:
    ```bash

    npm run dev

5. Access the application at http://localhost:5173

## Demo

You can check out the live website [here](https://rajeev2004.github.io/period-tracker/)

![period-tracker Screenshot](https://raw.githubusercontent.com/rajeev2004/period-tracker/refs/heads/main/frontend/src/assets/period-tracker%20ss.png?raw=true)
