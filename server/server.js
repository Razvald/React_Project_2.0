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
   const { username, password } = req.body;

   if (!username || !password) {
      return res.status(400).send("Введите имя пользователя и пароль");
   }

   try {
      const pool = await sql.connect(dbConfig);
      await pool
         .request()
         .input("username", sql.NVarChar, username)
         .input("password", sql.NVarChar, password)
         .query(
            "INSERT INTO Users (Email, Password, Role_Id) VALUES (@username, @password, 1)"
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

      res.json({ message: "Вы успешно вошли", userId: user.User_Id });
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

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
