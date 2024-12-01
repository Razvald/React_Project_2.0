import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Для редиректа

const Profile = () => {
   const [user, setUser] = useState(null);
   const [orders, setOrders] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      // Получаем ID пользователя из localStorage
      const userId = localStorage.getItem("userId");

      if (!userId) {
         navigate("/login"); // Если нет userId, редиректим на страницу логина
      } else {
         // Загружаем данные пользователя
         fetch(`http://localhost:5000/api/users/${userId}`)
            .then((response) => response.json())
            .then((data) => setUser(data));

         // Загружаем заказы пользователя
         fetch(`http://localhost:5000/api/orders/user/${userId}`)
            .then((response) => response.json())
            .then((data) => setOrders(data));
      }
   }, [navigate]);

   const handleLogout = () => {
      navigate("/login"); // Редирект на страницу входа
      localStorage.clear();
      window.location.reload();
   };

   if (!user) {
      return <div>Загрузка...</div>;
   }

   return (
      <div style={{ padding: "20px" }}>
         <h1>Мой профиль</h1>
         <div>
            <h3>Данные пользователя</h3>
            <p>Имя: {user.Name}</p>
            <p>Email: {user.Email}</p>
            <p>Телефон: {user.Phone}</p>
            <p>Адрес: {user.Address}</p>
         </div>

         <div>
            <h3>Мои заказы</h3>
            {orders.length > 0 ? (
               <ul>
                  {orders.map((order) => (
                     <li key={order.Order_Id}>
                        <p>Заказ №{order.Order_Id}</p>
                        <p>Дата: {order.Order_Date}</p>
                        <p>Статус: {order.Status_Title}</p>
                        <p>Общая сумма: {order.Total_Price} ₽</p>
                     </li>
                  ))}
               </ul>
            ) : (
               <p>Вы еще не сделали заказ.</p>
            )}
         </div>

         <button
            onClick={handleLogout}
            style={{
               marginTop: "20px",
               padding: "10px 20px",
               backgroundColor: "#f4f4f4",
               border: "none",
               borderRadius: "5px",
            }}
         >
            Выйти
         </button>
      </div>
   );
};

export default Profile;
