# Full-Stack Airbnb Clone

This project is a full-stack web application that replicates the core functionalities of Airbnb. It provides a platform for users to register as either Guests or Hosts. Guests can browse, search, and book property listings, while Hosts can manage their properties and view reservations.
## Key Features

-   **Dual User Roles**: Users can sign up as a `Guest` to book stays or as a `Host` to list properties.
-   **JWT Authentication**: Secure user authentication and session management using JSON Web Tokens.
-   **Property Listings**:
    -   **Guests**: View all available properties, see detailed information for each, and search for listings by title, category, location, or price.
    -   **Hosts**: A dedicated dashboard for full CRUD (Create, Read, Update, Delete) management of their own property listings.
-   **Booking System**:
    -   Guests can select dates and book a property. The system checks for date availability to prevent overlapping bookings.
    -   Guests can view a list of all their past and upcoming bookings.
    -   Hosts can view a list of all reservations made for their properties.
-   **User Profile Management**:
    -   Users can view and update their personal information, including date of birth, contact details, and a personal bio.
    -   Functionality to securely update the account password.

## Technology Stack

### Backend

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB
-   **ODM**: Mongoose
-   **Authentication**: JSON Web Tokens (jsonwebtoken)
-   **Password Hashing**: bcryptjs

### Frontend

-   **Framework**: React.js
-   **Build Tool**: Vite
-   **Routing**: React Router
-   **HTTP Client**: Axios
-   **Styling**: Custom CSS

## Getting Started

To run this project locally, follow the steps below.

### Prerequisites

-   Node.js (v16.x or higher)
-   npm (v8.x or higher)
-   MongoDB (running locally or a cloud instance)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a `.env` file in the `backend` directory and add the following variables. Replace the placeholder values with your actual configuration.

    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```

4.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the environment variable:**
    The project is pre-configured to connect to the backend server running on port 5000. The `frontend/.env` file should contain:

    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The React application will open in your browser at `http://localhost:5173` (or another available port).

## API Endpoints

The backend exposes the following RESTful API endpoints:

| Method | Endpoint                          | Description                               | Protected |
| :----- | :-------------------------------- | :---------------------------------------- | :-------- |
| `POST` | `/api/auth/register`              | Register a new user (Guest or Host).      | No        |
| `POST` | `/api/auth/login`                 | Log in a user.                            | No        |
| `GET`  | `/api/profile`                    | Get the logged-in user's profile.         | Yes       |
| `PUT`  | `/api/profile`                    | Update the user's profile information.    | Yes       |
| `PUT`  | `/api/profile/update-password`    | Update the user's password.               | Yes       |
| `GET`  | `/api/listings`                   | Get all public listings.                  | No        |
| `GET`  | `/api/listings/search`            | Search for listings based on criteria.    | No        |
| `GET`  | `/api/listings/:id`               | Get details for a single listing.         | No        |
| `POST` | `/api/Booking/create-booking`     | Create a new booking for a listing.       | Yes       |
| `GET`  | `/api/Booking/get-bookings`       | Get all bookings for the logged-in guest. | Yes       |
| `GET`  | `/api/admin/listings`             | Get all listings for the logged-in host.  | Yes (Host)|
| `POST` | `/api/admin/listings`             | Create a new listing.                     | Yes (Host)|
| `PUT`  | `/api/admin/listings/:id`         | Update an existing listing.               | Yes (Host)|
| `DELETE`|`/api/admin/listings/:id`         | Delete a listing.                         | Yes (Host)|
| `GET`  | `/api/admin-bookings/bookings`    | Get all bookings for a host's properties. | Yes (Host)|
