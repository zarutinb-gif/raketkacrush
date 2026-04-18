import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

app.use(express.static("."));

import TelegramBot from "node-telegram-bot-api";

app.use(express.static(".")); 

const env = fs.readFileSync(".env", "utf8")
  .split("\n")
  .filter(Boolean)
  .reduce((acc, line) => {
    const [key, value] = line.split("=");
    acc[key.trim()] = value.trim();
    return acc;
  }, {});

const BOT_TOKEN = env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "Запустить игру 🚀", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Играть",
            web_app: { url: "https://raketkacrush-rvau.vercel.app" }
          }
        ]
      ]
    }
  });
});

app.use(express.json());

const ADMIN_PASSWORD = "12345"; // 

let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

app.post("/admin/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

app.get("/admin/users", (req, res) => {
  res.json(users);
});

app.post("/admin/balance", (req, res) => {
  const { id, amount } = req.body;

  if (!users[id]) {
    return res.json({ message: "Пользователь не найден" });
  }

  users[id].balance += amount;

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Баланс изменён" });
});

app.listen(3000, () => console.log("Admin panel running"));
