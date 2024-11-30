const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
   server: "localhost",
   database: "Web_Pizza",
   user: "TestUser",
   password: "StrongPassword!",
   options: {
      encrypt: false,
      trustServerCertificate: true,
   },
};

// Регистрация
app.post("/api/register", async (req, res) => {
   const { username, password, email, phone, address } = req.body;

   if (!username || !password || !email || !phone || !address) {
      return res.status(400).send("Все поля должны быть заполнены");
   }

   try {
      const pool = await sql.connect(dbConfig);
      const existingUser = await pool
         .request()
         .input("email", sql.NVarChar, email)
         .query("SELECT * FROM Users WHERE Email = @email");

      if (existingUser.recordset.length > 0) {
         return res
            .status(400)
            .send("Пользователь с таким email уже существует");
      }

      await pool
         .request()
         .input("name", sql.NVarChar, username)
         .input("email", sql.NVarChar, email)
         .input("password", sql.NVarChar, password)
         .input("phone", sql.NVarChar, phone)
         .input("address", sql.NVarChar, address)
         .query(
            "INSERT INTO Users (Name, Email, Password, Phone, Address, Role_Id) VALUES (@name, @email, @password, @phone, @address, 1)"
         );
      res.send("Регистрация прошла успешно");
   } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка сервера");
   }
});

app.post("/api/login", async (req, res) => {
   const { username, password } = req.body;

   if (!username || !password) {
      return res.status(400).send("Введите имя пользователя и пароль");
   }

   try {
      const pool = await sql.connect(dbConfig);
      const result = await pool
         .request()
         .input("username", sql.NVarChar, username)
         .input("password", sql.NVarChar, password)
         .query(
            "SELECT * FROM Users WHERE Email = @username AND Password = @password"
         );

      const user = result.recordset[0];
      if (!user) {
         return res.status(401).send("Неверные имя пользователя или пароль");
      }

      res.json({
         message: "Вы успешно вошли",
         userId: user.User_Id,
         userRole: user.Role_Id,
      });
   } catch (err) {
      console.error(err);
      res.status(500).send("Ошибка сервера");
   }
});

// Получение данных пользователя по ID
app.get("/api/users/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const pool = await sql.connect(dbConfig);
      const result = await pool
         .request()
         .input("UserId", sql.Int, id)
         .query("SELECT * FROM Users WHERE User_Id = @UserId");
      if (result.recordset.length > 0) {
         res.json(result.recordset[0]);
      } else {
         res.status(404).send("User not found");
      }
   } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
   }
});

// Получение заказов пользователя по User_Id
app.get("/api/orders/user/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().input("UserId", sql.Int, id).query(`
            SELECT o.Order_Id, o.Order_Date, o.Total_Price, s.Title AS Status_Title
            FROM Orders o
            JOIN Status s ON o.Status_Id = s.Status_Id
            WHERE o.User_Id = @UserId
         `);
      res.json(result.recordset);
   } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
   }
});

// API для оформления заказа
app.post("/api/orders", async (req, res) => {
   const { userId, products } = req.body;

   try {
      // Рассчитываем общую цену
      const totalPrice = products.reduce(
         (total, product) => total + product.Price * product.Quantity,
         0
      );

      // Создаем заказ в таблице Orders
      const pool = await sql.connect(dbConfig);
      const result = await pool
         .request()
         .input("User_Id", sql.Int, userId)
         .input("Total_Price", sql.Int, totalPrice)
         .input("Status_Id", sql.Int, 1) // Статус заказа, например, 1 - в процессе
         .query(
            "INSERT INTO Orders (User_Id, Total_Price, Status_Id, Order_Date) OUTPUT Inserted.Order_Id VALUES (@User_Id, @Total_Price, @Status_Id, GETDATE())"
         );

      const orderId = result.recordset[0].Order_Id;

      // Добавляем детали заказа в таблицу Order_Details
      const orderDetailsPromises = products.map((product) => {
         return pool
            .request()
            .input("Order_Id", sql.Int, orderId)
            .input("Product_Id", sql.Int, product.Product_Id)
            .input("Quantity", sql.Int, product.Quantity)
            .query(
               "INSERT INTO Order_Details (Order_Id, Product_Id, Quantity) VALUES (@Order_Id, @Product_Id, @Quantity)"
            );
      });

      // Ожидаем завершения всех операций
      await Promise.all(orderDetailsPromises);

      res.status(201).json({ message: "Заказ успешно оформлен", orderId });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка при оформлении заказа" });
   }
});

// API endpoint для получения продуктов
app.get("/api/products", async (req, res) => {
   try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query("SELECT * FROM Products");
      res.json(result.recordset);
   } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
   }
});

// API endpoint для добавления продуктов
app.post("/api/products", async (req, res) => {
   const { Name, Description, Price, Image_url, Categories } = req.body;

   try {
      const pool = await sql.connect(dbConfig);
      await pool
         .request()
         .input("Name", sql.NVarChar, Name)
         .input("Description", sql.NVarChar, Description)
         .input("Price", sql.Int, Price)
         .input("Image_url", sql.NVarChar, Image_url)
         .input("Categories", sql.Int, Categories)
         .query(
            "INSERT INTO Products (Name, Description, Price, Image_url, Category_Id) VALUES (@Name, @Description, @Price, @Image_url, @Categories)"
         );

      res.status(201).json({ message: "Продукт добавлен успешно" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка на сервере" });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
