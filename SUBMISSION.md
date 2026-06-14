# E-Commerce Platform - Project Submission Documentation

## 1. Project Description
The E-Commerce Platform is a full-stack, responsive web application designed to simulate a real-world online shopping experience. It features a dynamically rendered storefront, an interactive shopping cart, secure user authentication, and a protected Administrative Dashboard for managing orders.

The application adheres to modern software architecture principles, utilizing a decoupled frontend and backend. The backend exposes a RESTful API secured by stateless JSON Web Tokens (JWT), while the frontend consumes these APIs using vanilla JavaScript, ensuring lightweight and fast performance without reliance on heavy frontend frameworks.

### Core Features
- **Role-Based Access Control (RBAC):** Distinct privileges for `USER` and `ADMIN` accounts.
- **Product Catalog:** Users can browse products, search by keyword, and filter by minimum/maximum price ranges.
- **Shopping Cart & Checkout:** Persistent local cart management that syncs with the backend upon checkout, creating a verifiable order.
- **Admin Dashboard:** Secure portal for administrators to view all system-wide orders and update their fulfillment statuses (e.g., Pending, Shipped, Delivered).

## 2. Setup Instructions

### Prerequisites
- Docker Engine & Docker Compose
- Git
- Web Browser

### Local Installation & Execution
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/preeti-techcraft/ecommerce.git
   cd ecommerce
   ```

2. **Configure Environment:**
   Ensure the `.env` file is present in the root directory. It contains necessary configurations such as `MYSQL_ROOT_PASSWORD` and `JWT_SECRET`.

3. **Start the Backend Infrastructure:**
   Use Docker Compose to build and start both the Spring Boot API and the MySQL database containers.
   ```bash
   docker-compose up -d --build
   ```
   *The API will successfully bind to `http://localhost:8082`.*

4. **Launch the Frontend:**
   The frontend uses standard HTML/JS/CSS. Serve the `frontend/` directory using any local web server. For example, using Python:
   ```bash
   cd frontend
   python3 -m http.server 3000
   ```
   *Navigate to `http://localhost:3000` in your browser.*

### Default Credentials
- **Standard User:** `user1` / `user1`
- **Administrator:** `admin` / `admin`

## 3. Explanations of Key Components

### Backend Architecture (Spring Boot)
The backend follows a standard controller-service-repository pattern using Spring Boot 3. 
- **Security:** `SecurityConfig.java` enforces that all `/api/admin/**` endpoints require the `ROLE_ADMIN` authority. Authentication is handled statelessly via `JwtAuthFilter.java`, which intercepts requests, validates the Bearer token, and populates the Security Context.
- **Data Persistence:** Spring Data JPA manages entity relationships (e.g., `Order` -> `OrderItem` -> `Product`). Infinite recursion issues during JSON serialization are prevented using `@JsonIgnore` annotations.

### Frontend Architecture (Vanilla JS)
The frontend is built without frameworks to maximize performance.
- **State Management:** The shopping cart is managed via `localStorage`, allowing the cart to persist across page reloads.
- **API Interceptor:** All backend communication is centralized in `api.js`. It automatically injects the JWT token from `localStorage` into the `Authorization` header for all requests.
- **Dynamic Routing:** `auth.js` detects the user's role upon login and intelligently redirects `ADMIN` users to the Dashboard and standard users to the Storefront.

## 4. Screenshots

*(Note: If submitting via Google Docs, replace the placeholders below with actual screenshots of your running application).*

**1. Storefront & Product Catalog:**
> *[Insert screenshot of index.html showing products]*

**2. Shopping Cart & Checkout:**
> *[Insert screenshot of cart.html showing items ready for checkout]*

**3. Admin Dashboard:**
> *[Insert screenshot of admin.html showing the order management table]*
