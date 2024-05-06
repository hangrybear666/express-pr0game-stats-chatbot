import { IndividualUserStats, PlayerStatistics } from './customTypes';

export function extractUserFromPlayerstats(stats: PlayerStatistics[], userName: string): IndividualUserStats[] {
  const individualUserStats: IndividualUserStats[] = [];
  for (const obj of stats) {
    for (const child of obj.children) {
      if (child.name === userName) {
        individualUserStats.push({
          serverDate: obj.serverDate,
          checkDate: obj.checkDate,
          ...child
        });
      }
    }
  }
  return individualUserStats;
}

//                                    _             _    ____   ____ ___ ___                _               _
//     __ _  ___ _ __   ___ _ __ __ _| |_ ___      / \  / ___| / ___|_ _|_ _|    ___  _   _| |_ _ __  _   _| |_
//    / _` |/ _ \ '_ \ / _ \ '__/ _` | __/ _ \    / _ \ \___ \| |    | | | |    / _ \| | | | __| '_ \| | | | __|
//   | (_| |  __/ | | |  __/ | | (_| | ||  __/   / ___ \ ___) | |___ | | | |   | (_) | |_| | |_| |_) | |_| | |_
//    \__, |\___|_| |_|\___|_|  \__,_|\__\___|  /_/   \_\____/ \____|___|___|   \___/ \__,_|\__| .__/ \__,_|\__|
//    |___/                                                                                    |_|
export function generateAsciiStats(individualStats: IndividualUserStats[]): string {
  let asciiArt = '';
  individualStats.forEach((playerStat) => {
    asciiArt = createAsciiVariant_Basic(asciiArt, playerStat);
  });
  return asciiArt;
}

// -------05. Mai 2024, 12:00:01-------
// =============Prof. Eich=============
// Gesamt     Rang   3     57415 Punkte
// Gebäude    Rang   3     39254 Punkte
// Forschung  Rang   4      8331 Punkte
// Flotte     Rang  34      8853 Punkte
// Def        Rang 118       977 Punkte
function createAsciiVariant_Basic(
  asciiArt: string,
  { serverDate, name, rank, buildingsRank, researchRank, fleetRank, defenseRank, total, buildings, research, fleet, defense }: IndividualUserStats
) {
  asciiArt += `${padBothWith(serverDate, 36, '-')} \n`;
  asciiArt += `${padBothWith(name, 36, '=')}\n`;
  asciiArt += `${padEnd('Gesamt', 10)} Rang ${padStart(rank, 3)} ${padStart(total, 9)} Punkte\n`;
  asciiArt += `${padEnd('Gebäude', 10)} Rang ${padStart(buildingsRank, 3)} ${padStart(buildings, 9)} Punkte\n`;
  asciiArt += `${padEnd('Forschung', 10)} Rang ${padStart(researchRank, 3)} ${padStart(research, 9)} Punkte\n`;
  asciiArt += `${padEnd('Flotte', 10)} Rang ${padStart(fleetRank, 3)} ${padStart(fleet, 9)} Punkte\n`;
  asciiArt += `${padEnd('Def', 10)} Rang ${padStart(defenseRank, 3)} ${padStart(defense, 9)} Punkte\n\n`;
  return asciiArt;
}

//    _          _                     __                  _   _
//   | |__   ___| |_ __   ___ _ __    / _|_   _ _ __   ___| |_(_) ___  _ __  ___
//   | '_ \ / _ \ | '_ \ / _ \ '__|  | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
//   | | | |  __/ | |_) |  __/ |     |  _| |_| | | | | (__| |_| | (_) | | | \__ \
//   |_| |_|\___|_| .__/ \___|_|     |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
//                |_|
function padStart(value: number | string, width: number): string {
  return value.toString().padStart(width);
}

function padEnd(value: number | string, width: number): string {
  return value.toString().padEnd(width);
}

function padBothWith(value: number | string, width: number, fillString: string): string {
  const paddingLength = width - value.toString().length;
  const startPaddingLength = Math.floor(paddingLength / 2);
  const endPaddingLength = Math.ceil(paddingLength / 2);
  const startPadding = fillString.repeat(startPaddingLength);
  const endPadding = fillString.repeat(endPaddingLength);
  return startPadding + value + endPadding;
}
