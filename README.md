# E-Commerce Platform

A full-stack E-Commerce application featuring a beautifully designed Vanilla JS storefront and a robust Spring Boot 3 backend.

## 🚀 Features

- **Storefront**: Browse products, search and filter by price/name, add items to a shopping cart, and securely checkout.
- **Admin Dashboard**: A protected dashboard for store owners to manage customer orders and dynamically update order statuses.
- **Authentication**: Secure JWT (JSON Web Token) authentication with distinct `USER` and `ADMIN` role-based access controls.
- **Modern UI**: "Premium Light" aesthetic utilizing CSS variables, glassmorphism, and responsive design—no external CSS frameworks required.

## 💻 Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2.x (Web, Data JPA, Security)
- JSON Web Tokens (jjwt)
- MySQL 8.0 (Dockerized)
- Maven

**Frontend:**
- HTML5
- CSS3 (Vanilla)
- JavaScript (Vanilla, ES6+)

## 🛠️ Setup & Installation

### Prerequisites
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- A modern web browser

### 1. Environment Variables
The application uses a `.env` file to manage sensitive credentials securely. 
Ensure you have a `.env` file in the root directory (where `docker-compose.yml` is located) with the following structure:
```env
# Database Credentials
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=ecommerce_db

# Spring Boot Backend Config
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/ecommerce_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_secure_password

# Application Config
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION_MS=86400000
```

### 2. Start the Backend
The backend and database are fully containerized. To start the API and MySQL server, run:
```bash
docker-compose up -d --build
```
*The API will be available at `http://localhost:8082`.*

### 3. Start the Frontend
You can serve the frontend files using any lightweight static server. For example, using Python:
```bash
cd frontend
python3 -m http.server 3000
```
*The Storefront will be available at `http://localhost:3000`.*

## 🔐 Default Users
Upon first initialization, the database is seeded with the following accounts:
- **User:** `user1` / `password: user1`
- **Admin:** `admin` / `password: admin`

*Note: You can easily create new Admin accounts by checking "Register as Administrator" on the signup page.*
