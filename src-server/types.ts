export type Player = {
  name: string,
  email: string,
  ip: string,
};

export type PlayerScore = {
  player: Player,
  highestScore: number,
};