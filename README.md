Here's a README structure based on your requirements:

---

# Task Management Application

## Short Description:
This is a task management web application that allows users to add, edit, delete, and reorder tasks in a drag-and-drop interface. Users can categorize their tasks into three sections: To-Do, In Progress, and Done. The app features Firebase Authentication, MongoDB for persistence, and real-time task synchronization.

## Live Links:
- [Live Link](https://task-management-2k25.web.app/)
- [GitHub Client Link](https://github.com/Piash2K/task-management-client.git)
- [GitHub Server Link](https://github.com/Piash2K/task-management-server.git)

## Dependencies:
- Firebase Authentication
- MongoDB
- Express.js
- Vite.js
- React.js
- react-beautiful-dnd (or other drag-and-drop library)
- Axios (for HTTP requests)
- react-router-dom
- Tailwind CSS (for styling)

## Installation Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/Piash2K/task-management-client.git
   git clone https://github.com/Piash2K/task-management-server.git
   ```

2. Navigate to the client directory and install the dependencies:
   ```bash
   cd task-management-client
   npm install
   ```

3. Navigate to the server directory and install the dependencies:
   ```bash
   cd task-management-server
   npm install
   ```

4. Create a `.env` file in both the client and server directories and add your Firebase configuration and MongoDB URI.

5. Start the server and client:
   - Start the server:
     ```bash
     npm run server
     ```
   - Start the client:
     ```bash
     npm run dev
     ```

6. Visit `http://localhost:3000` in your browser to view the app.

## Technologies Used:
- **Frontend:** React.js, Vite.js, Tailwind CSS, react-beautiful-dnd
- **Backend:** Express.js, MongoDB, Firebase Authentication
- **Additional:** Axios, react-router-dom, dotenv

---
