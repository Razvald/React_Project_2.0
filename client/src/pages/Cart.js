import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
   const [cart, setCart] = useState({});
   const [products, setProducts] = useState([]);
   const [userId] = useState(1); // Например, hardcoded userId
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(savedCart);

      fetch("http://localhost:5000/api/products")
         .then((res) => res.json())
         .then((data) => setProducts(data));
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

   const clearCart = () => {
      setCart({});
      localStorage.removeItem("cart");
   };

   const handleCheckout = async () => {
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
         console.error(error);
         alert("Ошибка при оформлении заказа.");
      } finally {
         setIsSubmitting(false);
      }
   };

   const cartItems = products.filter((product) => cart[product.Product_Id]);

   return (
      <div style={{ padding: "20px" }}>
         <h1>Корзина</h1>
         {cartItems.length > 0 ? (
            <div>
               <ul>
                  {cartItems.map((product) => (
                     <li
                        key={product.Product_Id}
                        style={{ marginBottom: "20px" }}
                     >
                        <h3>{product.Name}</h3>
                        <p>Цена: {product.Price} ₽</p>
                        <div
                           style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                           }}
                        >
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
                     </li>
                  ))}
               </ul>
               <button
                  onClick={clearCart}
                  style={{ marginTop: "20px", padding: "10px 20px" }}
               >
                  Очистить корзину
               </button>
               <div style={{ marginTop: "20px" }}>
                  <button
                     onClick={handleCheckout}
                     disabled={isSubmitting}
                     style={{ padding: "10px 20px" }}
                  >
                     {isSubmitting ? "Оформление..." : "Оформить заказ"}
                  </button>
               </div>
            </div>
         ) : (
            <p>Корзина пуста</p>
         )}
      </div>
   );
};

export default Cart;
