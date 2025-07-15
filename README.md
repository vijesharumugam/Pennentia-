# E-commerce Website

A full-stack e-commerce website built with React.js, Node.js, Express, and MongoDB.

## Project Structure

```
ecommerce-website/
│
├── client/                 # Frontend: React.js
├── server/                 # Backend: Node.js + Express + MongoDB
├── docker/                 # Docker & DevOps Setup
│
├── .env.example           # Template environment file
├── README.md              # Project overview
└── LICENSE                # License file
```

## Prerequisites

- Node.js (v16 or later)
- MongoDB
- Docker and Docker Compose (optional)

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` in both client and server directories
3. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 - Start the backend
   cd server && npm run dev
   
   # Terminal 2 - Start the frontend
   cd client && npm start
   ```

## Docker Setup

To run the application using Docker:

```bash
docker-compose -f docker/docker-compose.yml up --build
```

## Features

- User authentication
- Product catalog
- Shopping cart
- Order management
- Admin dashboard

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
