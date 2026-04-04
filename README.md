# 🚀 Task Management Application

A full-stack Task Management Application built using **Next.js, Node.js, Express, Prisma, and PostgreSQL (Supabase)**.
This project supports authentication, task management, filtering, and a responsive UI.

---

## 🔗 Live Demo

* 🌐 Frontend: https://task-management-app-sigma-one.vercel.app/
* ⚙️ Backend API: https://task-management-app-wdde.onrender.com

---

## 📌 Features

### 🔐 Authentication

* User Registration & Login
* JWT-based authentication
* Protected routes
* Secure password hashing (bcrypt)

---

### 📋 Task Management

* Create, Update, Delete tasks
* Toggle task status (completed / pending)
* User-specific tasks

---

### 🔍 Advanced Features

* Pagination
* Search (by title)
* Filter (by status)
* Optimistic UI updates

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Axios
* Framer Motion

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL (Supabase)

---

## 🧱 Project Structure

```
task-management-app/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
│
├── frontend/
│   ├── app/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
PORT=3000
```

---

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://task-management-app-wdde.onrender.com
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/task-management-app.git
cd task-management-app
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
npx prisma generate
npm run dev
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

* Backend deployed on Render
* Frontend deployed on Vercel

---

## 🧠 Key Learnings

* Building scalable REST APIs
* Authentication with JWT
* Prisma ORM & relational database design
* Full-stack integration
* Deployment & environment handling

---

## 📌 Future Improvements

* Refresh token implementation
* Role-based access control
* Unit & integration testing
* Better UI/UX enhancements

---

## 👨‍💻 Author

**Kanishk Negi**

