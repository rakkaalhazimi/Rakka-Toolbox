enum Rank {
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
  VI = 'VI',
};

export enum AllianceEnum {
  YAN = 'Yan',
  SARGON = 'Sargon',
  VICTORIA = 'Victoria',
  KJERAG = 'Kjerag',
  LATERANO = 'Laterano',
  ÆGIR = 'Ægir',
  SIRACUSA = 'Siracusa',
  KAZIMIERZ = 'Kazimierz',
  PRECISION = 'Precision',
  SWIFT = 'Swift',
  AGILE = 'Agile',
  ARCANE = 'Arcane',
  DURABLE = 'Durable',
  AID = 'Aid',
  FORESIGHT = 'Foresight',
  MARVEL = 'Marvel',
  INVESTOR = 'Investor',
  RAID = 'Raid',
  RESILIENT = 'Resilient',
  HARMONY = 'Harmony',
  ASSIST_OPERATOR = 'Assist Operator',
  SOLO = 'Solo',
}

export class AllianceCount {
  count: number = 1;
  requiredToActivate: number = 1;
  imageUrl: string = '';
}

export type Operator = {
  name: string;
  faction: string;
  star: number;
  class_: string;
  branch: string;
  rank: Rank;
  imageUrl: string;
};

export type Alliance = {
  name: AllianceEnum;
  desc: string;
  operatorsToActivate: number;
  operators: Operator[];
  imageUrl: string;
};
