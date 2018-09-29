export type Player = {
  name: string,
  ip: string,
};

export type PlayerScore = {
  player: Player,
  highestScore: number,
};