# 🧠 Mental Health Score Predictor

> A full-stack Machine Learning web application that predicts a student's Mental Health Score based on lifestyle, academic, and social media usage patterns.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📌 Overview

Mental health among students is influenced by multiple factors such as social media usage, sleep patterns, study habits, physical activity, and stress levels.

This project predicts a student's **Mental Health Score (0–10)** using a Machine Learning model trained on behavioral data.

The application provides an elegant user interface where users can enter their information and instantly receive their predicted score.

---

## ✨ Features

- Predicts Mental Health Score using Machine Learning
- FastAPI REST API backend
- Modern responsive frontend built using HTML, CSS and JavaScript
- Real-time client-side validation
- Interactive score gauge visualization
- Automatic preprocessing using Scikit-Learn Pipeline
- Country grouping for unseen countries
- REST API integration using Fetch API
- CORS enabled backend
- Clean modular architecture

---

# 🖥️ Application Preview

### User enters details

- Age
- Gender
- Country
- Academic Level
- Social Media Platform
- Purpose of Usage
- Daily Screen Time
- Daily Unlocks
- Study Hours
- Physical Activity
- Sleep Duration
- Stress Level

↓

### Backend Prediction

FastAPI

↓

Random Forest Model

↓

Predicted Mental Health Score

↓

Interactive Gauge Display

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- Fetch API

## Backend

- FastAPI
- Pydantic
- Uvicorn
- Joblib

## Machine Learning

- Scikit-Learn
- Random Forest Regressor
- Pipeline
- ColumnTransformer
- OneHotEncoder
- OrdinalEncoder
- StandardScaler
- FunctionTransformer

---

# 📂 Project Structure

```
Mental-Health-Predictor/

│── main.py
│── Mental_Health_Model.pkl
│── requirements.txt
│── index.html
│── style.css
│── script.js
│── README.md
```

---

# ⚙️ Machine Learning Workflow

Dataset

↓

Data Cleaning

↓

Feature Engineering

↓

Preprocessing Pipeline

↓

Random Forest Regressor

↓

Model Evaluation

↓

Save Model (.pkl)

↓

FastAPI Deployment

---

# 📊 Features Used

- Age
- Gender
- Country
- Academic Level
- Most Used Platform
- Purpose Of Use
- Average Daily Usage Hours
- Daily Unlocks
- Study Hours
- Physical Activity Hours
- Sleep Hours Per Night
- Stress Level

---

# 🧠 Prediction Pipeline

The backend automatically performs:

- Country grouping
- Feature preprocessing
- Encoding categorical variables
- Scaling numerical features
- Random Forest prediction

using a Scikit-Learn Pipeline before returning the prediction.

---

# 🚀 Running the Project

## Clone Repository

```bash
git clone https://github.com/yourusername/mental-health-score-predictor.git
```

```
cd mental-health-score-predictor
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run FastAPI

```bash
python -m uvicorn main:app --reload --port 8000
```

---

## Open Frontend

Run

```
index.html
```

using Live Server

or

```
http://127.0.0.1:5500
```

---

Backend

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

# 📈 API Endpoint

### POST

```
/predict
```

### Example Request

```json
{
  "age": 21,
  "gender": "Female",
  "country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Education",
  "avg_daily_usage_hours": 5.5,
  "daily_unlocks": 65,
  "study_hours": 6,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 7,
  "stress_level": "Medium"
}
```

### Example Response

```json
{
  "predicted_mental_health_score": 6.82
}
```

---

# 📊 Model Performance

Model Used

- Random Forest Regressor

Evaluation Metrics

- R² Score
- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)

---

# 💡 What I Learned

- Building REST APIs with FastAPI
- Model serialization using Joblib
- Machine Learning Pipelines
- Feature Engineering
- Client-Server Architecture
- Frontend–Backend Integration
- API Testing using Swagger
- JavaScript Fetch API
- Error Handling
- Responsive UI Design

---

# 🎯 Future Improvements

- User Authentication
- Database Integration
- Deployment on Render
- Docker Support
- User History Dashboard
- Model Monitoring
- Explainable AI (SHAP)

---

# 👩‍💻 Author

**Diksha Verma**

B.Tech CSE (AI & ML)

JSS Academy of Technical Education, Noida

---

⭐ If you found this project useful, consider giving it a star.