import React, { useEffect, useState } from "react";
import axios from "axios";

const Catalog = () => {
   const [products, setProducts] = useState([]);
   const [cart, setCart] = useState({});

   useEffect(() => {
      axios
         .get("http://localhost:5000/api/products") // Получаем продукты с сервера
         .then((response) => setProducts(response.data))
         .catch((error) => console.error(error));

      // Загружаем корзину из localStorage при загрузке компонента
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(savedCart);
   }, []);

   const updateCart = (productId, quantity) => {
      // Обновляем количество товара в корзине
      const newCart = {
         ...cart,
         [productId]: (cart[productId] || 0) + quantity,
      };

      if (newCart[productId] <= 0) {
         delete newCart[productId]; // Удаляем товар, если количество <= 0
      }

      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart)); // Сохраняем в localStorage
   };

   return (
      <div style={{ padding: "20px" }}>
         <h1>Каталог продуктов</h1>
         <ul>
            {products.map((product) => (
               <li key={product.Product_Id} style={{ marginBottom: "20px" }}>
                  <h3>{product.Name}</h3>
                  <p>{product.Description}</p>
                  <p>Цена: {product.Price} ₽</p>

                  {/* Если продукт в корзине, показываем кнопки `-`, `+` и количество */}
                  {cart[product.Product_Id] ? (
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: "10px",
                        }}
                     >
                        <button
                           onClick={() => updateCart(product.Product_Id, -1)}
                           style={{ padding: "5px 10px" }}
                        >
                           -
                        </button>
                        <span>{cart[product.Product_Id]}</span>
                        <button
                           onClick={() => updateCart(product.Product_Id, 1)}
                           style={{ padding: "5px 10px" }}
                        >
                           +
                        </button>
                     </div>
                  ) : (
                     <button
                        onClick={() => updateCart(product.Product_Id, 1)}
                        style={{
                           backgroundColor: "#f4f4f4",
                           padding: "10px 20px",
                           border: "none",
                           borderRadius: "5px",
                        }}
                     >
                        Добавить в корзину
                     </button>
                  )}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default Catalog;
