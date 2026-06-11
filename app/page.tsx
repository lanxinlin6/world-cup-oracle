import Link from "next/link";
import { getGroupStageFixtures } from "@/lib/fixtures";
import { getFixtureTeams } from "@/lib/fixtures";

export default function Home() {
  const upcomingFixtures = getGroupStageFixtures().slice(0, 5);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-5 py-10">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
          World Cup Oracle
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-black text-white sm:text-6xl">
          The 2026 World Cup schedule, explained by a suspiciously confident model.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Browse the fixtures, open each match, and see win probabilities,
          expected goals, team comparison, and model reasoning.
        </p>

        <Link
          href="/matches"
          className="mt-8 inline-flex rounded-full bg-emerald-400 px-6 py-4 font-black text-slate-950 transition hover:bg-emerald-300"
        >
          View Match Schedule →
        </Link>
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Upcoming Matches</h2>

        <div className="mt-5 space-y-3">
          {upcomingFixtures.map((fixture) => {
            const { teamA, teamB } = getFixtureTeams(fixture);

            if (!teamA || !teamB) return null;

            return (
              <Link
                key={fixture.id}
                href={`/matches/${fixture.id}`}
                className="block rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-emerald-400"
              >
                <p className="text-sm text-emerald-300">
                  {fixture.date} · {fixture.timeUK} UK · Group {fixture.group}
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  {teamA.flag} {teamA.name} vs {teamB.flag} {teamB.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {fixture.venue} · {fixture.city}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}