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

export type MatchPrediction = {
  teamA: Team;
  teamB: Team;
  expectedGoalsA: number;
  expectedGoalsB: number;
  winProbabilityA: number;
  drawProbability: number;
  winProbabilityB: number;
  mostLikelyScore: {
    teamA: number;
    teamB: number;
    probability: number;
  };
  confidence: "Low" | "Medium" | "High";
  verdict: string;
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

export type MatchStage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third-place Playoff"
  | "Final";

export type Fixture = {
  id: string;
  matchNumber: number;
  stage: MatchStage;
  group?: string;
  date: string;
  timeUK: string;
  venue: string;
  city: string;
  country: string;
  teamAId: string;
  teamBId: string;
  status: "scheduled" | "live" | "finished";
  scoreA?: number;
  scoreB?: number;
  sourceLabel?: string;
  sourceUrl?: string;
};

export type MatchInsight = {
  title: string;
  body: string;
};

export type MatchAnalysisText = {
  modelView: string;
  tacticalPreview: string;
  keyMatchups: MatchInsight[];
  riskFactors: MatchInsight[];
  analystVerdict: string;
};

export type EvidenceSource = {
  label: string;
  url: string;
  publisher?: string;
  publishedAt?: string;
};

export type PlayerNote = {
  teamId: string;
  playerName: string;
  role: string;
  status:
    | "key_player"
    | "injury_doubt"
    | "injured"
    | "suspended"
    | "returning"
    | "watch";
  note: string;
  sources: EvidenceSource[];
};

export type TeamMatchContext = {
  teamId: string;
  strengths: string[];
  concerns: string[];
  keyPlayers: PlayerNote[];
  sources: EvidenceSource[];
};

export type MatchAnalysis = {
  fixture: Fixture;
  modelSummary: string;
  tacticalSummary: string;
  verdict: string;
  confidence: "Low" | "Medium" | "High";
  teamAContext: TeamMatchContext;
  teamBContext: TeamMatchContext;
  sources: EvidenceSource[];
};