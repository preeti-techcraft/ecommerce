# E-Commerce API Documentation

The backend exposes a fully functional REST API secured via JWT authentication. Swagger UI is also pre-configured and can be accessed interactively by running the backend and navigating to:
**`http://localhost:8082/swagger-ui/index.html`**

Below is a detailed breakdown of the primary endpoints.

---

## 1. Authentication (`/api/auth`)

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "USER" // Optional: "ADMIN" or "USER"
  }
  ```
- **Response** `200 OK`: Returns the created User object.

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword"
  }
  ```
- **Response** `200 OK`: 
  ```json
  {
    "token": "eyJhbGciOiJIUzI1...",
    "username": "johndoe",
    "role": "USER"
  }
  ```
  *Note: Provide this token in the `Authorization: Bearer <token>` header for all secured routes.*

---

## 2. Products (`/api/products`)

### Get All Products (Storefront)
- **URL**: `/api/products`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters** (Optional): 
  - `search` (string): Filter by product name
  - `minPrice` (decimal): Filter by minimum price
  - `maxPrice` (decimal): Filter by maximum price
- **Response** `200 OK`: Array of product objects.

---

## 3. Shopping Cart & Checkout (`/api/cart`)

### Add to Cart
- **URL**: `/api/cart/add?productId={id}&quantity={qty}`
- **Method**: `POST`
- **Auth Required**: Yes (`USER` or `ADMIN`)
- **Response** `200 OK`: Updated Cart object.

### Get User Cart
- **URL**: `/api/cart`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response** `200 OK`: Current Cart object with line items.

### Checkout
- **URL**: `/api/cart/checkout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Response** `200 OK`: The finalized Order object. Converts the current cart into a `PENDING` order.

---

## 4. User Orders (`/api/orders`)

### Get My Orders
- **URL**: `/api/orders/my-orders`
- **Method**: `GET`
- **Auth Required**: Yes
- **Response** `200 OK`: Array of Order objects belonging to the authenticated user.

---

## 5. Admin Dashboard (`/api/admin`)

*All routes in this section require a valid JWT belonging to an account with the `ADMIN` role.*

### Get All System Orders
- **URL**: `/api/admin/orders`
- **Method**: `GET`
- **Auth Required**: Yes (`ADMIN` only)
- **Response** `200 OK`: Array of all orders placed by all users.

### Update Order Status
- **URL**: `/api/admin/orders/{orderId}/status?status={STATUS}`
- **Method**: `PUT`
- **Auth Required**: Yes (`ADMIN` only)
- **Valid Statuses**: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- **Response** `200 OK`: The updated Order object.
