import React, { useState } from "react";
import axios from "axios";

const CreateProduct = () => {
   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [imageUrl, setImageUrl] = useState("");
   const [categories, setCategories] = useState("");

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         await axios.post("http://localhost:5000/api/products", {
            Name: name,
            Description: description,
            Price: parseInt(price),
            Image_url: imageUrl,
            Categories: parseInt(categories),
         });

         alert("Продукт успешно добавлен!");
         setName("");
         setDescription("");
         setPrice("");
         setImageUrl("");
         setCategories("");
      } catch (error) {
         console.error(error);
         alert("Ошибка при добавлении продукта.");
      }
   };

   return (
      <div style={{ padding: "20px" }}>
         <h1>Добавить продукт</h1>
         <form onSubmit={handleSubmit}>
            <div>
               <label>Название:</label>
               <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>Тип продукта:</label>
               <input
                  type="number"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>Описание:</label>
               <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>Цена:</label>
               <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>URL изображения:</label>
               <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
               />
            </div>
            <button type="submit">Добавить</button>
         </form>
      </div>
   );
};

export default CreateProduct;
