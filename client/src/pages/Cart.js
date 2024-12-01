import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cart.css"; // Подключаем стили

const Cart = () => {
   const [cart, setCart] = useState({});
   const [products, setProducts] = useState([]);
   const [userId, setUserId] = useState(null); // Теперь это состояние
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      // Получаем userId из localStorage
      const savedUserId = localStorage.getItem("userId");
      setUserId(savedUserId);

      const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(savedCart);

      axios
         .get("http://localhost:5000/api/products")
         .then((res) => {
            console.log(res.data); // Выводим весь ответ от API
            setProducts(res.data);
         })
         .catch((err) => console.error("Ошибка загрузки продуктов:", err));
   }, []);

   // Обновление корзины
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

   // Очистка корзины
   const clearCart = () => {
      setCart({});
      localStorage.removeItem("cart");
   };

   // Оформление заказа
   const handleCheckout = async () => {
      if (!userId) {
         alert("Вы должны быть авторизованы, чтобы оформить заказ.");
         return;
      }

      const cartItems = products.filter((product) => cart[product.Product_Id]);
      const orderProducts = cartItems.map((product) => ({
         Product_Id: product.Product_Id,
         Quantity: cart[product.Product_Id],
         Price: product.Price,
      }));

      setIsSubmitting(true);
      try {
         await axios.post("http://localhost:5000/api/orders", {
            userId: userId,
            products: orderProducts,
         });

         alert("Заказ успешно оформлен!");
         clearCart(); // Очистка корзины после оформления заказа
      } catch (error) {
         console.error("Ошибка оформления заказа:", error);
         alert("Произошла ошибка при оформлении заказа.");
      } finally {
         setIsSubmitting(false);
      }
   };

   // Подсчёт общей суммы заказа
   const cartItems = products.filter((product) => cart[product.Product_Id]);

   const totalAmount = cartItems.reduce((total, product) => {
      return total + product.Price * cart[product.Product_Id];
   }, 0);

   return (
      <div className="cart-container">
         <h1>Корзина</h1>
         {cartItems.length > 0 ? (
            <div>
               <ul className="cart-list">
                  {cartItems.map((product) => (
                     <li key={product.Product_Id} className="cart-item">
                        <img
                           src={"/images/" + product.Image_url} // Путь относительно public
                           alt={product.Name}
                           className="cart-item-image"
                        />
                        <h3>{product.Name}</h3>
                        <p>
                           Цена: {product.Price * cart[product.Product_Id]} ₽
                        </p>
                        <div className="cart-item-controls">
                           <button
                              className="cart-btn"
                              onClick={() => updateCart(product.Product_Id, -1)}
                           >
                              -
                           </button>
                           <span className="cart-quantity">
                              {cart[product.Product_Id]}
                           </span>
                           <button
                              className="cart-btn"
                              onClick={() => updateCart(product.Product_Id, 1)}
                           >
                              +
                           </button>
                        </div>
                     </li>
                  ))}
               </ul>

               <div className="cart-summary">
                  <p>Итого к оплате: {totalAmount} ₽</p>
                  <div className="cart-actions">
                     <button className="clear-cart-btn" onClick={clearCart}>
                        Очистить корзину
                     </button>
                     <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? "Оформление..." : "Оформить заказ"}
                     </button>
                  </div>
               </div>
            </div>
         ) : (
            <p>Корзина пуста</p>
         )}
      </div>
   );
};

export default Cart;
