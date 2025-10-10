# 🎬 Video Hosting Website

- Users can **register, login, and manage accounts securely** with JWT authentication.  
- Each user may create their own **channel** with details such as cover images, avatar, etc and  uploaded videos, total likes, comments, and subscribers.  
- Users can **upload, edit, and delete videos**, as well as **like or comment** on videos.  
- Users can **post short tweets or updates** on their channel.
- User can watch their channels with  uploaded videos, total likes, comments, tweets, and subscribers.  
- The system supports **fetching videos by channel or ID**, and all routes are **RESTful, modular, and secure**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**  
  - User registration, detailing & login  
  - Passwords encrypted
  - Middleware-protected routes for secure access  

- 👤 **User & Channel Management**  
  -User channel creation, updation, Deletion
  - Fetch channel details: subscribers, total videos, likes,etc
  - Update channel information
  - Update User information, user image, channel image, etc.

- 🎞️ **Video Management**  
  - Upload, update, delete videos
  - Create, update or delete Playlist  
  - Fetch videos by ID or by channel   

- 💬 **Engagement System**  
  - Like/unlike videos , Subscribe/Unsubscribe channels
  - Add, edit, delete, like/unlike comments  
  - Pos, fetch like/dislike tweets  

- 🧾 **Database**  
  - MongoDB with **Mongoose ODM**  
  - Schema references for users, channels, videos, and comments , tweet

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Language** | JavaScript |
| **Backend Framework** | Node.js, Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Authentication** | JWT, bcrypt |
| **Environment** | dotenv |
| **API Testing** | Postman |

---


