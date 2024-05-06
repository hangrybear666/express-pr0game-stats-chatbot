require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';
const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN!;
const adminChatId = process.env.TELEGRAM_ADMIN_USER_CHAT_ID!;
const bot = new TelegramBot(token, { polling: false, webHook: false, baseApiUrl: '', filepath: false, onlyFirstMatch: false, request: undefined });

function sendBasicAdminTelegramMessage(msg: string) {
  bot.sendMessage(adminChatId, `ℹ️ ${msg}`);
}

function sendErrorAdminTelegramMessage(msg: string) {
  // for custom emojis this might be necessary <tg-emoji emoji-id="5368324170671202286">❌</tg-emoji>
  bot.sendMessage(adminChatId, `❌ ${msg}`, { parse_mode: 'HTML' });
}

function sendWarnAdminTelegramMessage(msg: string) {
  // for custom emojis this might be necessary <tg-emoji emoji-id="5368324170671202286">⚠️</tg-emoji>
  bot.sendMessage(adminChatId, `⚠️ ${msg}`, { parse_mode: 'HTML' });
}

export { sendBasicAdminTelegramMessage, sendErrorAdminTelegramMessage, sendWarnAdminTelegramMessage };
