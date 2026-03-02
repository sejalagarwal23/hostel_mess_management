# MERN Backend — Hostel Management System

## Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostelDB
   JWT_SECRET=your_jwt_secret
   ```
4. `npm run dev`

## Folder Structure
```
server/
├── config/         # DB connection
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── controllers/    # Route handlers
├── middleware/     # Auth middleware
├── server.js       # Entry point
└── package.json
```
