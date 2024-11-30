import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateProduct from "./pages/CreateProduct";

const App = () => {
   const [userRole, setUserRole] = useState(null);

   useEffect(() => {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
   }, []);

   return (
      <Router>
         <nav style={{ padding: "10px", background: "#c4c4f4" }}>
            <Link to="/" style={{ margin: "0 10px" }}>
               Главная
            </Link>
            <Link to="/catalog" style={{ margin: "0 10px" }}>
               Каталог
            </Link>
            <Link to="/cart" style={{ margin: "0 10px" }}>
               Корзина
            </Link>
            <Link to="/login" style={{ margin: "0 10px" }}>
               Войти
            </Link>
            <Link to="/register" style={{ margin: "0 10px" }}>
               Регистрация
            </Link>
            <Link to="/profile" style={{ margin: "0 10px" }}>
               Профиль
            </Link>
            {userRole === "2" && (
               <Link to="/create-product" style={{ margin: "0 10px" }}>
                  Создание продукта
               </Link>
            )}
         </nav>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-product" element={<CreateProduct />} />
         </Routes>
      </Router>
   );
};

export default App;
