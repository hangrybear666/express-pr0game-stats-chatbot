require('dotenv').config();
import TelegramBot from 'node-telegram-bot-api';
import { logger } from './logger';
import { PlayerStatistics } from './customTypes';
import { extractUserFromPlayerstats, generateAsciiStats } from './sharedFunctions';
import fs from 'fs';
import { sendBasicAdminTelegramMessage } from './telegramAdminNotificationBot';
const token = process.env.TELEGRAM_CHAT_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true, filepath: true });

const STATS_JSON_PATH = `./storage/player-stats.json`;
// Matches "/player [whatever]"
bot.onText(/\/player (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content of the message

  const chatId = msg.chat.id;
  msg.chat.username;
  const playerName = match ? match[1] : ''; // the captured "whatever"

  if (!playerName || playerName.length < 3) {
    // TODO regular expression for alphanumeric usernames
    logger.verbose('USERNAME MALFORMED. Please provide a username with at least 3 characters.');
    bot.sendMessage(chatId, `Player Name must be provided and have at least 3 alphanumeric characters. You provided [${playerName}]`);
  } else {
    // Parse Player Name
    const parsedPlayerName = playerName ? playerName.toString().trim() : '';
    try {
      // ensure file exists before reading it from filesystem
      logger.debug('trying to read player-stats.json file');
      await import('.'.concat(STATS_JSON_PATH)); // ! import requires 2 dots for relative navigation !
      logger.debug('player-stats.json file found.');
      const stats: PlayerStatistics[] = await JSON.parse(fs.readFileSync(STATS_JSON_PATH, 'utf-8'));
      logger.verbose('player-stats.json file successfully imported.');
      const playerStats = extractUserFromPlayerstats(stats, parsedPlayerName);
      logger.verbose(`${playerStats ? playerStats.length : '0'} player statistics found for user ${parsedPlayerName}`);
      if (!playerStats || playerStats.length === 0) {
        bot.sendMessage(chatId, `Player [${parsedPlayerName}] could not be matched with existing dataset.`);
        return;
      }
      const playerStatReply = generateAsciiStats(playerStats);
      logger.playerStats(playerStatReply);
      sendPlayerStatsTelegramMessage(playerStatReply, chatId);
    } catch (error: unknown) {
      const errorMsg = 'Player Name could not be matched with existing dataset. ';
      if (error instanceof Error) {
        bot.sendMessage(chatId, errorMsg + error.message);
        logger.error(errorMsg + error.message);
      } else {
        bot.sendMessage(chatId, `Undefined error while trying to match player name: ${parsedPlayerName}`);
      }
    } finally {
      sendBasicAdminTelegramMessage(
        `/player command Playername ${playerName ? playerName : '""'} queried by ${msg.chat.username ? msg.chat.username : msg.chat.active_usernames ? msg.chat.active_usernames[0] : msg.chat.id}`
      );
    }
  }
});

//       ___       __         __   __                         __   __
// |__| |__  |    |__)       /  ` /  \  |\/|  |\/|  /\  |\ | |  \ /__`
// |  | |___ |___ |          \__, \__/  |  |  |  | /~~\ | \| |__/ .__/
bot.onText(/^\/help$/, (msg) => {
  const chatId = msg.chat.id;
  const helpMsg = `
                     *     .--.
                        / /  \`
       +               | |
              '         \\ \\__,
          *          +   '--'  *
              +   /\\
 +              .'  '.   *
        *      /======\\      +
              ;:.  _   ;
              |:. (_)  |
              |:.  _   |
    +         |:. (_)  |          *
              ;:.      ;
            .' \\:.    / \`.
           / .-'':._.'\`-. \\
           |/    /||\\    \\|
         _..--"""\`\`\`\`"""--.._
   _.-'\`\`                    \`\`'-._
 -'                                '-

 __   __                         __   __
/  \` /  \\  |\\/|  |\\/|  /\\  |\\ | |  \\ /__\`
\\__, \\__/  |  |  |  | /~~\\ | \\| |__/ .__/

/player Name  historical player stats
/mode mode    basic | short | pretty
              changes reply format
/export       download player-stats.json
`;
  bot.sendMessage(chatId, `${helpMsg}`, {
    entities: [
      {
        type: 'pre',
        offset: 0,
        language: 'Available Commands',
        length: helpMsg.length
      }
    ]
  });
});

//   ___      __   __   __  ___           __                 ___  __      __  ___      ___  __         __   __
//  |__  \_/ |__) /  \ |__)  |           |__) |     /\  \ / |__  |__) __ /__`  |   /\   |  /__`     | /__` /  \ |\ |
//  |___ / \ |    \__/ |  \  |           |    |___ /~~\  |  |___ |  \    .__/  |  /~~\  |  .__/ .\__/ .__/ \__/ | \|
//
// matches exactly the command /export
bot.onText(/^\/export$/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    // ensure file exists before reading it from filesystem
    logger.debug('trying to read player-stats.json file');
    await import('.'.concat(STATS_JSON_PATH)); // ! import requires 2 dots for relative navigation !
    logger.debug('player-stats.json file found.');
    bot.sendDocument(chatId, STATS_JSON_PATH, {}, { filename: 'player-stats.json', contentType: 'application/json' });
  } catch (error) {
    const errorMsg = 'Player-stats.json could not be exported: ';
    if (error instanceof Error) {
      bot.sendMessage(chatId, errorMsg + error.message);
      logger.error(errorMsg);
    } else {
      bot.sendMessage(chatId, `Undefined error while exporting player-stats.json.`);
    }
  } finally {
    sendBasicAdminTelegramMessage(
      `/export command queried by ${msg.chat.username ? msg.chat.username : msg.chat.active_usernames ? msg.chat.active_usernames[0] : msg.chat.id}`
    );
  }
});

function sendPlayerStatsTelegramMessage(msg: string, userChatId: number) {
  bot.sendMessage(userChatId, `${msg}`, {
    entities: [
      {
        type: 'pre',
        offset: 0,
        language: 'Player Statistics',
        length: msg.length
      }
    ]
  });
}

export default bot;
