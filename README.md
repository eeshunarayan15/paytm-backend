# Paytm Clone

This project is a full-stack web application that emulates the basic functionalities of a digital payment platform like Paytm. It allows users to sign up, manage their accounts, and transfer money to other users. The application is built with a Node.js backend and a React frontend.

## Key Features

- **User Authentication**: Secure user registration and login using JWT-based authentication.
- **Account Management**: Every user is provided with a digital wallet and an initial account balance.
- **Fund Transfer**: Users can seamlessly transfer funds to other registered users.
- **Transaction History**: Users can view a detailed history of their past transactions.
- **User Search**: A search functionality allows users to find other users on the platform by name or username.
- **Admin Capabilities**: Admins have the ability to deposit funds into user accounts and view a comprehensive list of all system transactions.

## Technical Stack

### Backend

- **Node.js**: A JavaScript runtime environment for executing server-side code.
- **Express**: A fast and minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database used to store user and transaction data.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB.
- **JSON Web Tokens (JWT)**: Used for implementing secure, token-based authentication.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Bcrypt**: A library for hashing user passwords securely.

### Frontend

- **React**: A JavaScript library for building dynamic user interfaces.
- **Vite**: A modern build tool that provides a faster and leaner development experience for web projects.
- **React Router**: A library for handling client-side routing in the React application.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB

### Installation and Setup

#### Backend

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/paytm-clone.git
    cd paytm-clone
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables:
    ```
    JWT_SECRET=your_jwt_secret
    MONGO_URI=your_mongodb_connection_string
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The backend server will be running on `http://localhost:3000`.

#### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd paytm-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend development server will be running on `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

The backend API provides the following endpoints:

### User API

-   **`POST /api/v1/user/signup`**: Register a new user.
-   **`POST /api/v1/user/sign`**: Log in an existing user.
-   **`POST /api/v1/user/change-password`**: Change the password for the logged-in user.
-   **`POST /api/v1/user/change-email`**: Change the email for the logged-in user.
-   **`POST /api/v1/user/change-name`**: Change the name for the logged-in user.
-   **`GET /api/v1/user/bulk`**: Search for users by name or username.
-   **`DELETE /api/v1/user/delete-account`**: Delete the account of the logged-in user.

### Account API

-   **`GET /api/v1/account/balance`**: Get the account balance for the logged-in user.
-   **`POST /api/v1/account/transfer`**: Transfer funds from the logged-in user to another user.
-   **`POST /api/v1/account/deposit`**: Deposit funds into a user's account (admin only).
-   **`GET /api/v1/account/profile`**: Get the profile of the logged-in user.
-   **`GET /api/v1/account/all-users`**: Get a list of all users (admin only).

### Transaction API

-   **`GET /api/v1/transaction/user`**: Get all transactions for the logged-in user.
-   **`GET /api/v1/transaction/all`**: Get all transactions in the system (admin only).
