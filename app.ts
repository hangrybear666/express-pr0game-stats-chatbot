import { Request, Response } from 'express';
import { PlayerStatistics } from 'utils/customTypes';
const express = require('express');
require('dotenv').config();
import fs from 'fs';
import { logger } from './utils/logger';
import bot from './utils/telegramChatBot';
import { sendUnformattedAdminTelegramMessage } from './utils/telegramAdminNotificationBot';
const bodyParser = require('body-parser');

const app = express();

/**
 * bodyParser enables reading data from HTTP POST requests such as:
 * text/plain via bodyParser.text() with a limit of 2MB
 * application/json via bodyParser.json() with a limit of 4MB
 */
app.use(bodyParser.text({ limit: '2097152' }));
app.use(bodyParser.json({ limit: '4194304' }));

const morgan = require('morgan');
app.use(morgan(':method request to ":url" with length [:req[content-length]] bytes and status [:status] from [:remote-addr] :remote-user - :response-time ms'));

const STATS_JSON_PATH = `./storage/player-stats.json`;

/**
 * @description Submitting a player-stats.json file of type PlayerStatistics[] for local filesystem storage.
 * @method HTTP POST
 * @route /pr0game/stats/json/:pw
 */
app.post('/pr0game/stats/json/:pw', async (request: Request, response: Response) => {
  logger.http('Received POST request to /pr0game/stats/json/:pw');
  if (!request.params.pw || request.params.pw !== process.env.REST_PW) {
    response.status(403);
    logger.verbose('ACCESS DENIED. please provide valid pw in API route /playwright/queue/:pw');
    response.send('ACCESS DENIED. please provide valid pw in API route /playwright/queue/:pw');
    return;
  }
  const postData = request.body;
  let validJson = false;

  //   __        ___  __                __   __                            __    ___
  //  /  ` |__| |__  /  ` |__/       | /__` /  \ |\ |    \  /  /\  |    | |  \ |  |  \ /
  //  \__, |  | |___ \__, |  \    \__/ .__/ \__/ | \|     \/  /~~\ |___ | |__/ |  |   |
  try {
    const parsedPostData: PlayerStatistics[] = JSON.parse(JSON.stringify(postData));
    if (parsedPostData[0].checkDate && parsedPostData[0].serverDate && parsedPostData[0].children && parsedPostData[0].children.length > 0) {
      validJson = true;
      logger.verbose(
        `JSON is valid PlayerStatistics[] Array with length ${parsedPostData.length} and ${parsedPostData[0].children.length} children at index 0.`
      );
      response.status(202);
      response.send('SUCCESS');
    } else {
      logger.warn(`JSON is not a valid  PlayerStatistics[] Array. Errors might occur.`);
    }
  } catch (error: unknown) {
    response.status(400);
    if (error instanceof Error) {
      response.send(error.message);
      logger.error(`player-stats.json could not be parsed ${error.message}`);
    } else {
      response.send('Undefined error while parsing player-stats.json');
    }
  }

  //   __   ___  __   __     __  ___     __  ___      ___  __         __   __
  //  |__) |__  |__) /__` | /__`  |     /__`  |   /\   |  /__`     | /__` /  \ |\ |
  //  |    |___ |  \ .__/ | .__/  |     .__/  |  /~~\  |  .__/ .\__/ .__/ \__/ | \|
  if (validJson) {
    logger.verbose(`Received Array of length ${request.body ? request.body.length : ''} in request.body`);
    await new Promise<void>((resolve) => {
      // fs.writeFile is asynchronous, so we have to wait for writing to complete before reading it from filesystem
      writeJSONToFile(postData, STATS_JSON_PATH, () => {
        resolve();
      });
    });
  }
});

function writeJSONToFile(stats: PlayerStatistics[], path: string, writingFinished: () => void) {
  fs.writeFile(path, JSON.stringify(stats, null, 2), (err) => {
    if (err) {
      logger.error("Couldn't write JSON file: ", err);
    } else {
      sendUnformattedAdminTelegramMessage(`📂 Persisted stats for chatbot in: ${path}`);
      writingFinished();
    }
  });
}

//        _             _      _       _                                        _           _   _           _
//    ___| |_ __ _ _ __| |_   | |_ ___| | ___  __ _ _ __ __ _ _ __ ___      ___| |__   __ _| |_| |__   ___ | |_
//   / __| __/ _` | '__| __|  | __/ _ \ |/ _ \/ _` | '__/ _` | '_ ` _ \    / __| '_ \ / _` | __| '_ \ / _ \| __|
//   \__ \ || (_| | |  | |_   | ||  __/ |  __/ (_| | | | (_| | | | | | |  | (__| | | | (_| | |_| |_) | (_) | |_
//   |___/\__\__,_|_|   \__|   \__\___|_|\___|\__, |_|  \__,_|_| |_| |_|   \___|_| |_|\__,_|\__|_.__/ \___/ \__|
//                                            |___/
bot.startPolling;

const port = 3001;

app.listen(port, () => {
  console.log(`
Server is running at address: http://localhost:${port}
GET
http://localhost:${port}/pr0game/stats/:pw/:user_name
POST
http://localhost:${port}/pr0game/stats/json/:pw`);
});
