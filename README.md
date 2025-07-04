# 🛒 Master E-Commerce Demo

This is a simple **Spring Boot + React (Vite)** E-Commerce application showcasing:
- ✅ JWT Authentication
- ✅ Role-Based Access Control (admin / vendor / customer)
- ✅ Product Management (add / edit / delete)
- ✅ Orders for customers & admin
- ✅ Flipkart / Amazon inspired UI
- ✅ Lucide React icons
- ✅ Modern responsive design

---

## 🚀 **Tech Stack**

| Layer         | Tech                                  |
|---------------|---------------------------------------|
| Backend       | Java Spring Boot 3, Spring Security   |
| Auth          | JWT with stateless sessions           |
| Frontend      | React + Vite, Lucide Icons, Axios     |
| Styling       | Custom CSS inspired by Flipkart theme |

---

## 🗂️ **Project Structure**

root/
├── backend/ # Spring Boot project
├── frontend/ # React Vite app
| ├── src/
| | ├── components/ # OrdersPage, ProductsPage, DashboardPage, LandingPage
| | ├── api/axios.js # Axios instance with base URL
| ├── public/
| ├── index.html
| ├── App.css # Base/global styles
| ├── LandingPage.css # Landing page styles
| ├── Dashboard.css # Dashboard styles
├── README.md


  
---

## 🔐 **Roles**

| Role     | Permissions                                  |
|----------|----------------------------------------------|
| `ADMIN`  | View/manage all products & orders            |
| `VENDOR` | Add/edit products                            |
| `CUSTOMER` | Place orders, view own orders               |

---

## ✨ **Features**

✅ JWT-based login modal on landing page  
✅ Sidebar Dashboard with orders/products tabs  
✅ Customers see **only their orders**  
✅ Admins/vendors can **add/edit/delete** products  
✅ Orders & products styled like Flipkart grid/tables  
✅ Lucide React icons for actions (edit/save/delete)

---

## ⚡ **Getting Started**

### 1️⃣ **Backend**

1. `cd backend/`  
2. Configure your `application.properties` (DB, JWT secret, CORS)  
3. Run with:
   ```bash
   ./mvnw spring-boot:run

| Endpoint                    | Description                        |
| --------------------------- | ---------------------------------- |
| `POST /api/auth/login`      | Login and get JWT                  |
| `GET /api/products`         | Get all products                   |
| `POST /api/products`        | Add product (vendor/admin only)    |
| `PUT /api/products/{id}`    | Update product (vendor/admin only) |
| `DELETE /api/products/{id}` | Delete product (admin only)        |
| `GET /api/orders`           | Get all orders (admin only)        |
| `GET /api/orders/my`        | Get logged-in customer’s orders    |
| `POST /api/orders`          | Place order (customer only)        |


