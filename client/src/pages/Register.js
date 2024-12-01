import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Для редиректа

const Register = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   const [address, setAddress] = useState("");
   const [phone, setPhone] = useState("");
   const navigate = useNavigate();

   const handleRegister = async (e) => {
      e.preventDefault();

      try {
         await axios.post("http://localhost:5000/api/register", {
            username,
            password,
            email,
            address,
            phone,
         });

         setUsername("");
         setPassword("");
         setEmail("");
         setAddress("");
         setPhone("");

         navigate("/profile");
      } catch (error) {
         if (error.response && error.response.data) {
            alert(error.response.data);
         } else {
            alert("Ошибка регистрации. Попробуйте снова.");
         }
      }
   };

   return (
      <div style={{ padding: "20px" }}>
         <h1>Регистрация</h1>
         <form onSubmit={handleRegister}>
            <div>
               <label>Имя пользователя:</label>
               <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
            </div>
            <div>
               <label>Почта:</label>
               <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
            <div>
               <label>Адресс дотавки:</label>
               <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
               />
            </div>
            <div>
               <label>Телефон:</label>
               <input
                  type="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
               />
            </div>
            <button type="submit">Зарегистрироваться</button>
         </form>
      </div>
   );
};

export default Register;
