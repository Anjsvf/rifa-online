# Rifa Digital

**Rifa Digital** is a complete system for creating and managing digital raffles, developed with a frontend architecture in **React** and a backend using **Node.js**, **Express**, and **MongoDB**. The project also leverages tools like **TypeScript**, **Multer** for image uploads, and **Tailwind CSS** for responsive design.

## Technologies Used

### Backend:
- **Node.js** with **Express**
- **MongoDB** for data storage
- **Multer** for image uploads // not implemented.
- **TypeScript** for static typing
- **CORS** for cross-origin resource sharing
- **Mongoose** for data modeling
- **dotenv** for environment variables management

### Frontend:
- **React** with **Vite**
- **TypeScript** for static typing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling and responsiveness
- **React Router** for route management
- **React Icons** for visual icons

## Project Structure

### Backend:
```plaintext
src/
├── config/
│   └── db.ts              # MongoDB database configuration
├── controllers/
│ 
│   └── userController.ts       # Logic for managing users
├── models/
│  
│   └── userModel.ts            # User data model
├── routes/
│  
│   └── userRoutes.ts           # User routes
├
│   
├── utils/
│   ├── auth.ts                 # Authentication utility functions
│   └── middleware.ts           # Middleware for request handling


Features
Backend:
Campaign Creation: Users can create new campaigns by providing details like name, prize, and image.
Image Upload: Multer is used to handle the upload of images to the server.
Raffle Card Generation: Raffle cards are generated for each campaign.
User Authentication: Middleware to handle protected routes and user sessions.
Frontend:
Responsive Design: The application is designed to be mobile-friendly using Tailwind CSS.
Campaign Management: Users can view, create, and manage campaigns.
Axios Integration: The frontend communicates with the backend using Axios for API requests.
Routing: Multiple pages and routes are handled using React Router.
Setup
Backend:
Clone the repository:

bash
Copiar código
git clone https://github.com/your-username/rifa-digital-backend.git
cd rifa-digital-backend
Install dependencies:

bash
Copiar código
npm install
Create a .env file in the root of the project and add the following:

env
Copiar código
MONGO_URI=your-mongodb-connection-string
PORT=5000
Run the application:

bash
Copiar código
npm run dev
The backend will be running at http://localhost:5000.

Frontend:
Clone the repository:

bash
Copiar código
git clone https://github.com/your-username/rifa-digital-frontend.git
cd rifa-digital-frontend
Install dependencies:

bash
Copiar código
npm install
Start the development server:

bash
Copiar código
npm run dev
The frontend will be running at http://localhost:3000.

API Endpoints
Campaigns:
POST /campaigns: Create a new campaign.
GET /campaigns: Get a list of all campaigns.
GET /campaigns/:id: Get details of a specific campaign.
PATCH /campaigns/:id: Update a campaign.
DELETE /campaigns/:id: Delete a campaign.
Raffle Cards:
POST /campaigns/:id/cards: Generate raffle cards for a campaign.
Users:
POST /auth/login: User login.
POST /auth/register: User registration.
Contributing
If you would like to contribute to this project, please feel free to submit a pull request or open an issue.

License
This project is licensed under the MIT License.

yaml
Copiar código

---

This README is now formatted in Markdown and can be used directly in your GitHub repositories for both the frontend and backend of **Rifa Digital**!





