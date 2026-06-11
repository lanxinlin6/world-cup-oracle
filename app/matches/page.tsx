import Link from "next/link";
import { getFixtureTeams, getGroupStageFixtures } from "@/lib/fixtures";

export default function MatchesPage() {
  const fixtures = getGroupStageFixtures();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          World Cup Oracle
        </p>

        <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
          2026 World Cup Match Schedule
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Browse the group-stage schedule. Open a match to see win probability,
          expected goals, scoreline prediction, and model reasoning.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
        <div className="grid grid-cols-[90px_130px_90px_1.4fr_1fr_120px] border-b border-slate-800 bg-slate-900/80 px-5 py-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-400">
          <div>Match</div>
          <div>Date</div>
          <div>Time</div>
          <div>Fixture</div>
          <div>Venue</div>
          <div>Analysis</div>
        </div>

        {fixtures.map((fixture) => {
          const { teamA, teamB } = getFixtureTeams(fixture);

          if (!teamA || !teamB) {
            return (
              <div
                key={fixture.id}
                className="grid grid-cols-[90px_130px_90px_1.4fr_1fr_120px] border-b border-slate-800 px-5 py-4 text-sm text-red-300"
              >
                <div>#{fixture.matchNumber}</div>
                <div>{fixture.date}</div>
                <div>{fixture.timeUK}</div>
                <div>
                  Missing team data: {fixture.teamAId} / {fixture.teamBId}
                </div>
                <div>{fixture.venue}</div>
                <div>Fix teams.ts</div>
              </div>
            );
          }

          return (
            <Link
              key={fixture.id}
              href={`/matches/${fixture.id}`}
              className="grid grid-cols-[90px_130px_90px_1.4fr_1fr_120px] border-b border-slate-800 px-5 py-4 text-sm text-slate-200 transition hover:bg-emerald-400/10"
            >
              <div className="font-bold text-slate-400">
                #{fixture.matchNumber}
              </div>

              <div>{fixture.date}</div>

              <div>{fixture.timeUK} UK</div>

              <div>
                <span className="font-bold text-white">
                  {teamA.flag} {teamA.name}
                </span>
                <span className="mx-2 text-slate-500">vs</span>
                <span className="font-bold text-white">
                  {teamB.flag} {teamB.name}
                </span>
                <div className="mt-1 text-xs text-emerald-300">
                  Group {fixture.group}
                </div>
              </div>

              <div className="text-slate-400">
                {fixture.venue}
                <div className="mt-1 text-xs">
                  {fixture.city}, {fixture.country}
                </div>
              </div>

              <div className="font-bold text-emerald-300">Open →</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}