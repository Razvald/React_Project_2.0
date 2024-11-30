import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Для редиректа

const Login = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();

      try {
         const response = await axios.post("http://localhost:5000/api/login", {
            username,
            password,
         });

         localStorage.setItem("userId", response.data.userId);
         localStorage.setItem("userRole", response.data.userRole);
         setUsername("");
         setPassword("");

         navigate("/profile");
         // Перезагрузка страницы
         window.location.reload();
      } catch (error) {
         console.error(error);
         alert("Ошибка входа. Проверьте данные.");
      }
   };

   return (
      <div style={{ padding: "20px" }}>
         <h1>Вход</h1>
         <form onSubmit={handleLogin}>
            <div>
               <label>Имя пользователя:</label>
               <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
            </div>
            <div>
               <label>Пароль:</label>
               <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <button type="submit">Войти</button>
         </form>
      </div>
   );
};

export default Login;
