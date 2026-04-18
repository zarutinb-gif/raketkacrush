import fs from "fs";
import TelegramBot from "node-telegram-bot-api";

// Ручная загрузка .env
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
            web_app: { url: "https://raketakrush.vercel.app" }
          }
        ]
      ]
    }
  });
});
