export type Team = {
  id: string;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  group?: string;
  rating: number;
  attack: number;
  defense: number;
  form: number;
};

export type TeamSimulationStats = {
  team: Team;
  simulations: number;
  roundOf16: number;
  quarterFinal: number;
  semiFinal: number;
  final: number;
  champion: number;
};

export type PredictionResult = {
  team: Team;
  roundOf16Probability: number;
  quarterFinalProbability: number;
  semiFinalProbability: number;
  finalProbability: number;
  championProbability: number;
};

export type SimulationOptions = {
  runs: number;
  scale?: number;
  chaos?: number;
};
