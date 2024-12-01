import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateProduct from "./pages/CreateProduct";
import "./styles/App.css";

const App = () => {
   const [userRole, setUserRole] = useState(null);

   useEffect(() => {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
   }, []);

   return (
      <Router>
         {/* Header */}
         <header className="app-header">
            <h1>Пиццерия</h1>
            <nav>
               <ul>
                  <li>
                     <Link to="/">Каталог</Link>
                  </li>
                  <li>
                     <Link to="/cart">Корзина</Link>
                  </li>
                  <li>
                     <Link
                        to={
                           localStorage.getItem("userId")
                              ? "/profile"
                              : "/login"
                        }
                     >
                        Личный кабинет
                     </Link>
                  </li>
                  {userRole === "2" && (
                     <li>
                        <Link to="/create-product">Создание продукта</Link>
                     </li>
                  )}
               </ul>
            </nav>
         </header>

         {/* Main Content */}
         <main className="app-main">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/cart" element={<Cart />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/profile" element={<Profile />} />
               <Route path="/create-product" element={<CreateProduct />} />
            </Routes>
         </main>

         {/* Footer */}
         <footer className="app-footer">
            <p>© 2024 Пиццерия. Все права защищены.</p>
         </footer>
      </Router>
   );
};

export default App;
