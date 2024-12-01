import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
   const [products, setProducts] = useState([]);
   const [cart, setCart] = useState({});

   useEffect(() => {
      axios
         .get("http://localhost:5000/api/products")
         .then((response) => setProducts(response.data))
         .catch((error) => console.error(error));

      const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(savedCart);
   }, []);

   const updateCart = (productId, quantity) => {
      const newCart = {
         ...cart,
         [productId]: (cart[productId] || 0) + quantity,
      };

      if (newCart[productId] <= 0) {
         delete newCart[productId];
      }

      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
   };

   return (
      <div className="home">
         <section className="welcome">
            <h2>Добро пожаловать в Пиццерию!</h2>
            <p>Здесь вы найдете лучшие пиццы в городе!</p>
         </section>

         <section className="catalog">
            <h2>Наш каталог</h2>
            <div className="catalog-grid">
               {products.map((product) => (
                  <div key={product.Product_Id} className="catalog-card">
                     {/* Контейнер для изображения с фиксированными размерами */}
                     <div className="catalog-image-container">
                        <img
                           src={"/images/" + product.Image_url} // Путь к изображению
                           alt={product.Name}
                           className="catalog-image"
                        />
                     </div>
                     <h3>{product.Name}</h3>
                     <p>{product.Description}</p>
                     <p className="price">Цена: {product.Price} ₽</p>
                     {cart[product.Product_Id] ? (
                        <div className="cart-controls">
                           <button
                              onClick={() => updateCart(product.Product_Id, -1)}
                           >
                              -
                           </button>
                           <span>{cart[product.Product_Id]}</span>
                           <button
                              onClick={() => updateCart(product.Product_Id, 1)}
                           >
                              +
                           </button>
                        </div>
                     ) : (
                        <button
                           onClick={() => updateCart(product.Product_Id, 1)}
                           className="add-to-cart"
                        >
                           Добавить в корзину
                        </button>
                     )}
                  </div>
               ))}
            </div>
         </section>
      </div>
   );
};

export default Home;
