import { fixtures } from "@/data/fixtures";
import { teams } from "@/data/teams";
import type { Fixture, Team } from "@/types/worldcup";

export function getFixtureById(id: string): Fixture | undefined {
  return fixtures.find((fixture) => fixture.id === id);
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((team) => team.id === id);
}

export function getFixtureTeams(fixture: Fixture): {
  teamA: Team | undefined;
  teamB: Team | undefined;
} {
  return {
    teamA: getTeamById(fixture.teamAId),
    teamB: getTeamById(fixture.teamBId),
  };
}

export function getGroupStageFixtures(): Fixture[] {
  return fixtures
    .filter((fixture) => fixture.stage === "Group Stage")
    .sort((a, b) => {
      const dateA = `${a.date} ${a.timeUK}`;
      const dateB = `${b.date} ${b.timeUK}`;
      return dateA.localeCompare(dateB);
    });
}