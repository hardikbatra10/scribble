export type Point = {x: number, y: number};
export type Stroke = {points: Point[]; color: string; size: number};
export type SessionId = string | number;
export type Phase = "lobby" | "drawing" | "roundEnd" | "gameOver";

export type Player = {
  id: string;
  name: string;
  score: number;
  hasGuessed: boolean;
};