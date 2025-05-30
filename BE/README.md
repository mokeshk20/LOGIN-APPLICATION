# User Authentication Backend with Node.js and SQLite

This project provides a backend implementation for user authentication using Node.js, Express, and SQLite.

## Technologies Used

- Node.js
- Express
- SQLite
- bcrypt
- jsonwebtoken
- dotenv

## Setup Instructions

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file with the necessary environment variables (see `.env.example`).
4.  Run the application: `npm start`

## API Endpoints

-   `POST /users/register`: Register a new user.
-   `POST /users/login`: Login an existing user.
-   `GET /users/:id`: Get user information by ID (requires authentication).

## Database Setup

The application uses SQLite as the database. The database file is located at `config/database.js`.

## Environment Variables

-   `JWT_SECRET`: Secret key for JWT signing.
-   `PORT`: Port for the server to listen on (default: 3000).

## Testing

Run tests using `npm test`.

## Contributing

Contributions are welcome! Please submit a pull request.