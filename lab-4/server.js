const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));

let users = [
  {
    login: { name: "user_1", id: 1 },
    role: "Пользователь",
    email: "email1@example.ru",
    createdAt: new Date().toLocaleTimeString(),
  },
  {
    login: { name: "admin_1", id: 2 },
    role: "Администратор",
    email: "email2@example.ru",
    createdAt: new Date().toLocaleTimeString(),
  },
];

app.get("/", (req, res) => {
  const rows = users
    .map(
      (user) => `
        <tr>
          <td>${user.login.name}</td>
          <td>${user.role}</td>
          <td>${user.email}</td>
          <td>${user.createdAt}</td>
          <td>
            <form method="POST" action="/delete/${user.login.id}" style="display:inline">
              <button type="submit">❌ Удалить</button>
            </form>
          </td>
        </tr>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Пользователи системы</title>
      <style>
        table { border-collapse: collapse; width: 500px; }
        td, th { border: 1px solid #ccc; padding: 8px; }
        button { cursor: pointer; }
        form { margin: 0; }
      </style>
    </head>
    <body>
      <h2>Пользователи системы</h2>

      <table>
        <tr>
          <th>Логин</th>
          <th>Роль</th>
          <th>Email</th>
          <th>Дата регистрации</th>
          <th>Действия</th>
        </tr>
        ${rows}
      </table>

      <form method="POST" action="/add">
        <h3>Добавить пользователя</h3>
        <input name="loginName" placeholder="Логин" required />
        <input name="role" placeholder="Роль" required />
        <input name="email" placeholder="Email" required />
        <button type="submit">Добавить</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/add", (req, res) => {
  const { loginName, role, email } = req.body;

  users.push({
    login: { name: loginName, id: Date.now() }, // уникальный login
    role,
    email,
    createdAt: new Date().toLocaleTimeString(),
  });

  res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
  console.log(req.params.id);
  const id = Number(req.params.id);

  users = users.filter((user) => user.login.id !== id);

  res.redirect("/");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
