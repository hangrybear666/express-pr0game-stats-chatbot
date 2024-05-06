// _____   _____    ___    _____   _____
// /  ___| |_   _|  / _ \  |_   _| /  ___|
// \ `--.    | |   / /_\ \   | |   \ `--.
//  `--. \   | |   |  _  |   | |    `--. \
// /\__/ /   | |   | | | |   | |   /\__/ /
// \____/    \_/   \_| |_/   \_/   \____/

export type PlayerStatistics = {
  serverDate: string;
  checkDate: Date;
  children: {
    name: string;
    rank: number;
    buildingsRank: number;
    researchRank: number;
    fleetRank: number;
    defenseRank: number;
    total: number;
    buildings: number;
    research: number;
    fleet: number;
    defense: number;
  }[];
};

export type IndividualUserStats = {
  serverDate: string;
  checkDate: Date;
  name: string;
  rank: number;
  buildingsRank: number;
  researchRank: number;
  fleetRank: number;
  defenseRank: number;
  total: number;
  buildings: number;
  research: number;
  fleet: number;
  defense: number;
};

export enum PointTypeEnum {
  total = '1',
  fleet = '2',
  research = '3',
  buildings = '4',
  defense = '5'
}

export type PointType = 'total' | 'buildings' | 'research' | 'fleet' | 'defense';
