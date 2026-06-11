import type { MatchPrediction, Team } from "@/types/worldcup";

function factorial(n: number): number {
  if (n <= 1) return 1;

  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

function poissonProbability(goals: number, lambda: number): number {
  return (Math.pow(lambda, goals) * Math.exp(-lambda)) / factorial(goals);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function calculateExpectedGoals(attackingTeam: Team, defendingTeam: Team): number {
  const baseGoals = 1.35;

  const attackFactor = attackingTeam.attack / 80;
  const defenseFactor = 80 / defendingTeam.defense;
  const formFactor = 0.9 + attackingTeam.form / 500;
  const ratingFactor = 1 + (attackingTeam.rating - defendingTeam.rating) / 2500;

  return clamp(
    baseGoals * attackFactor * defenseFactor * formFactor * ratingFactor,
    0.25,
    3.5
  );
}

function getConfidence(
  winA: number,
  draw: number,
  winB: number
): "Low" | "Medium" | "High" {
  const top = Math.max(winA, draw, winB);
  const values = [winA, draw, winB].sort((a, b) => b - a);
  const gap = values[0] - values[1];

  if (top > 0.58 && gap > 0.2) return "High";
  if (top > 0.45 && gap > 0.1) return "Medium";

  return "Low";
}

function getVerdict(teamA: Team, teamB: Team, winA: number, draw: number, winB: number): string {
  const top = Math.max(winA, draw, winB);

  if (draw === top) {
    return "The Oracle sees a draw. Somewhere, a spreadsheet just parked the bus.";
  }

  const favorite = winA > winB ? teamA : teamB;
  const underdog = winA > winB ? teamB : teamA;
  const gap = Math.abs(winA - winB);

  if (gap < 0.08) {
    return `${favorite.name} are barely favored. This is less a prediction and more a polite shrug.`;
  }

  if (gap < 0.18) {
    return `${favorite.name} have the edge, but ${underdog.name} are absolutely allowed to ruin the model's afternoon.`;
  }

  return `${favorite.name} look strong here. The Oracle is confident, which historically is when football becomes funny.`;
}

export function predictMatch(teamA: Team, teamB: Team): MatchPrediction {
  const expectedGoalsA = calculateExpectedGoals(teamA, teamB);
  const expectedGoalsB = calculateExpectedGoals(teamB, teamA);

  let winProbabilityA = 0;
  let drawProbability = 0;
  let winProbabilityB = 0;

  let mostLikelyScore = {
    teamA: 0,
    teamB: 0,
    probability: 0,
  };

  const maxGoals = 7;

  for (let goalsA = 0; goalsA <= maxGoals; goalsA++) {
    for (let goalsB = 0; goalsB <= maxGoals; goalsB++) {
      const probability =
        poissonProbability(goalsA, expectedGoalsA) *
        poissonProbability(goalsB, expectedGoalsB);

      if (goalsA > goalsB) {
        winProbabilityA += probability;
      } else if (goalsA === goalsB) {
        drawProbability += probability;
      } else {
        winProbabilityB += probability;
      }

      if (probability > mostLikelyScore.probability) {
        mostLikelyScore = {
          teamA: goalsA,
          teamB: goalsB,
          probability,
        };
      }
    }
  }

  const total = winProbabilityA + drawProbability + winProbabilityB;

  winProbabilityA /= total;
  drawProbability /= total;
  winProbabilityB /= total;

  return {
    teamA,
    teamB,
    expectedGoalsA,
    expectedGoalsB,
    winProbabilityA,
    drawProbability,
    winProbabilityB,
    mostLikelyScore,
    confidence: getConfidence(winProbabilityA, drawProbability, winProbabilityB),
    verdict: getVerdict(teamA, teamB, winProbabilityA, drawProbability, winProbabilityB),
  };
}