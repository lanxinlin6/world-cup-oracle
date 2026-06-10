import type {
  PredictionResult,
  SimulationOptions,
  Team,
  TeamSimulationStats,
} from "@/types/worldcup";

function baseStrength(team: Team): number {
  return (
    team.rating +
    team.attack * 5 +
    team.defense * 4 +
    team.form * 6
  );
}

export function winProbability(
  teamA: Team,
  teamB: Team,
  scale = 90
): number {
  const diff = baseStrength(teamA) - baseStrength(teamB);
  return 1 / (1 + Math.exp(-diff / scale));
}

function simulateMatch(teamA: Team, teamB: Team, scale: number, chaos: number): Team {
  const noisyDiff =
    baseStrength(teamA) -
    baseStrength(teamB) +
    (Math.random() - 0.5) * chaos;

  const probabilityA = 1 / (1 + Math.exp(-noisyDiff / scale));

  return Math.random() < probabilityA ? teamA : teamB;
}

function createInitialBracket(teams: Team[]): Team[] {
  const seeded = [...teams].sort((a, b) => b.rating - a.rating);
  const bracket: Team[] = [];

  for (let i = 0; i < seeded.length / 2; i++) {
    bracket.push(seeded[i]);
    bracket.push(seeded[seeded.length - 1 - i]);
  }

  return bracket;
}

function createEmptyStats(teams: Team[], runs: number): Map<string, TeamSimulationStats> {
  return new Map(
    teams.map((team) => [
      team.id,
      {
        team,
        simulations: runs,
        roundOf16: 0,
        quarterFinal: 0,
        semiFinal: 0,
        final: 0,
        champion: 0,
      },
    ])
  );
}

export function runSimulation(
  teams: Team[],
  options: SimulationOptions
): PredictionResult[] {
  const { runs, scale = 90, chaos = 180 } = options;
  const stats = createEmptyStats(teams, runs);

  for (let run = 0; run < runs; run++) {
    let currentRound = createInitialBracket(teams);

    while (currentRound.length > 1) {
      const winners: Team[] = [];

      for (let i = 0; i < currentRound.length; i += 2) {
        const winner = simulateMatch(
          currentRound[i],
          currentRound[i + 1],
          scale,
          chaos
        );

        winners.push(winner);
      }

      for (const winner of winners) {
        const teamStats = stats.get(winner.id);
        if (!teamStats) continue;

        if (winners.length === 16) teamStats.roundOf16 += 1;
        if (winners.length === 8) teamStats.quarterFinal += 1;
        if (winners.length === 4) teamStats.semiFinal += 1;
        if (winners.length === 2) teamStats.final += 1;
        if (winners.length === 1) teamStats.champion += 1;
      }

      currentRound = winners;
    }
  }

  return Array.from(stats.values())
    .map((item) => ({
      team: item.team,
      roundOf16Probability: item.roundOf16 / runs,
      quarterFinalProbability: item.quarterFinal / runs,
      semiFinalProbability: item.semiFinal / runs,
      finalProbability: item.final / runs,
      championProbability: item.champion / runs,
    }))
    .sort((a, b) => b.championProbability - a.championProbability);
}

export function formatProbability(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getOracleVerdict(result: PredictionResult): string {
  const p = result.championProbability;

  if (p >= 0.18) {
    return "The Oracle is suspiciously confident. This usually ends badly on penalties.";
  }

  if (p >= 0.1) {
    return "A legitimate contender. Prepare the national confidence responsibly.";
  }

  if (p >= 0.04) {
    return "Dark horse territory. Hope is dangerous, but statistically allowed.";
  }

  if (p >= 0.015) {
    return "The model says unlikely. Your group chat says destiny.";
  }

  return "Mathematically fragile. Emotionally undefeated.";
}
