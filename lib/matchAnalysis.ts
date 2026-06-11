import { fixtures } from "@/data/fixtures";
import { teams } from "@/data/teams";
import { teamNews } from "@/data/teamNews";
import { predictMatch } from "@/lib/matchPrediction";
import type { MatchAnalysis } from "@/types/worldcup";

export function getMatchAnalysis(fixtureId: string): MatchAnalysis | null {
  const fixture = fixtures.find((item) => item.id === fixtureId);

  if (!fixture) return null;

  const teamA = teams.find((team) => team.id === fixture.teamAId);
  const teamB = teams.find((team) => team.id === fixture.teamBId);

  if (!teamA || !teamB) return null;

  const prediction = predictMatch(teamA, teamB);

  const teamANews = teamNews.filter((item) => item.teamId === teamA.id);
  const teamBNews = teamNews.filter((item) => item.teamId === teamB.id);

  const favorite =
    prediction.winProbabilityA > prediction.winProbabilityB ? teamA : teamB;

  const underdog =
    prediction.winProbabilityA > prediction.winProbabilityB ? teamB : teamA;

  return {
    fixture,
    modelSummary: `${teamA.name} ${Math.round(
      prediction.winProbabilityA * 100
    )}% · Draw ${Math.round(
      prediction.drawProbability * 100
    )}% · ${teamB.name} ${Math.round(prediction.winProbabilityB * 100)}%`,
    tacticalSummary: `${favorite.name} rate higher in the current model, but ${underdog.name} can still shift the match through transitions, set pieces, and tournament chaos.`,
    verdict: prediction.verdict,
    confidence: prediction.confidence,
    teamAContext: {
      teamId: teamA.id,
      strengths: [
        `Attack index: ${teamA.attack}`,
        `Defense index: ${teamA.defense}`,
        `Recent form: ${teamA.form}`,
      ],
      concerns: [],
      keyPlayers: teamANews,
      sources: teamANews.flatMap((item) => item.sources),
    },
    teamBContext: {
      teamId: teamB.id,
      strengths: [
        `Attack index: ${teamB.attack}`,
        `Defense index: ${teamB.defense}`,
        `Recent form: ${teamB.form}`,
      ],
      concerns: [],
      keyPlayers: teamBNews,
      sources: teamBNews.flatMap((item) => item.sources),
    },
    sources: [
      {
        label: "FIFA World Cup 2026 official fixtures",
        url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums",
        publisher: "FIFA",
      },
    ],
  };
}