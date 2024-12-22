const TelegramBot = require('node-telegram-bot-api');
const token = '7244253089:AAEOr1W_zDYRZi8WAr3zhRmtjlH9QF5tGP0';
const bot = new TelegramBot(token, { polling: false });

const chatId = '1436538631'; 
// bot.sendMessage(chatId, 'Hello, this is a test message!');
bot.sendMessage(chatId,`Press me!`, { parse_mode: "MarkDown" });

