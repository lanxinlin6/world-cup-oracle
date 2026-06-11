import { notFound } from "next/navigation";
import { getFixtureById, getFixtureTeams } from "@/lib/fixtures";
import { predictMatch } from "@/lib/matchPrediction";
import { formatProbability } from "@/lib/simulation";
import { writeMatchAnalysis } from "@/lib/analysisWriter";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fixture = getFixtureById(id);

  if (!fixture) {
    notFound();
  }

  const { teamA, teamB } = getFixtureTeams(fixture);

  if (!teamA || !teamB) {
    notFound();
  }

  const prediction = predictMatch(teamA, teamB);
  const analysisText = writeMatchAnalysis(teamA, teamB, prediction);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10">
      <a href="/matches" className="text-sm font-bold text-emerald-300">
        ← Back to schedule
      </a>

      <div className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
          Group {fixture.group} · Match #{fixture.matchNumber}
        </p>

        <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">
          {teamA.flag} {teamA.name} vs {teamB.flag} {teamB.name}
        </h1>

        <p className="mt-4 text-slate-300">
          {fixture.date} · {fixture.timeUK} UK · {fixture.venue},{" "}
          {fixture.city}
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <ProbabilityCard
          label={`${teamA.code} win`}
          value={prediction.winProbabilityA}
        />
        <ProbabilityCard label="Draw" value={prediction.drawProbability} />
        <ProbabilityCard
          label={`${teamB.code} win`}
          value={prediction.winProbabilityB}
        />
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Prediction Summary</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard
            label={`${teamA.code} expected goals`}
            value={prediction.expectedGoalsA.toFixed(2)}
          />
          <InfoCard
            label="Most likely score"
            value={`${prediction.mostLikelyScore.teamA}-${prediction.mostLikelyScore.teamB}`}
          />
          <InfoCard
            label={`${teamB.code} expected goals`}
            value={prediction.expectedGoalsB.toFixed(2)}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
            Oracle View
          </p>

          <p className="mt-3 text-lg font-semibold leading-8 text-white">
            {prediction.verdict}
          </p>

          <p className="mt-3 text-sm text-slate-300">
            Confidence:{" "}
            <span className="font-bold text-emerald-300">
              {prediction.confidence}
            </span>
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <TeamPanel
          name={`${teamA.flag} ${teamA.name}`}
          rating={teamA.rating}
          attack={teamA.attack}
          defense={teamA.defense}
          form={teamA.form}
        />

        <TeamPanel
          name={`${teamB.flag} ${teamB.name}`}
          rating={teamB.rating}
          attack={teamB.attack}
          defense={teamB.defense}
          form={teamB.form}
        />
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Model View</h2>
        <p className="mt-4 text-base leading-8 text-slate-300">
          {analysisText.modelView}
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Tactical Preview</h2>
        <p className="mt-4 text-base leading-8 text-slate-300">
          {analysisText.tacticalPreview}
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Key Matchups</h2>

        <div className="mt-5 grid gap-4">
          {analysisText.keyMatchups.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <h3 className="font-black text-emerald-300">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Risk Factors</h2>

        <div className="mt-5 grid gap-4">
          {analysisText.riskFactors.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <h3 className="font-black text-yellow-300">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6">
        <h2 className="text-2xl font-black text-white">Analyst Verdict</h2>
        <p className="mt-4 text-lg font-semibold leading-8 text-white">
          {analysisText.analystVerdict}
        </p>
      </section>

      <section className="mt-8 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h2 className="text-2xl font-black text-white">Prediction Basis</h2>

        <ul className="mt-5 list-disc space-y-3 pl-5 text-slate-300">
          <li>The model starts from team rating as the broad strength indicator.</li>
          <li>Attack and defense indices are used to estimate expected goals.</li>
          <li>
            Recent form adjusts the probability profile without overpowering
            base quality.
          </li>
          <li>
            The Poisson score model converts expected goals into win, draw, and
            loss probabilities.
          </li>
          <li>
            The confidence label depends on the gap between the most likely
            outcomes.
          </li>
        </ul>

        <p className="mt-6 text-sm leading-7 text-slate-400">
          Player-specific injuries, suspensions, tactical news, and confirmed
          lineups should be added as source-linked updates closer to match day.
          This page is a model-based preview, not betting advice.
        </p>

        {fixture.sourceUrl && (
          <a
            href={fixture.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-emerald-300 transition hover:border-emerald-400"
          >
            Source: {fixture.sourceLabel ?? "Fixture source"}
          </a>
        )}
      </section>
    </main>
  );
}

function ProbabilityCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-4xl font-black text-emerald-300">
        {formatProbability(value)}
      </p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function TeamPanel({
  name,
  rating,
  attack,
  defense,
  form,
}: {
  name: string;
  rating: number;
  attack: number;
  defense: number;
  form: number;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
      <h2 className="text-2xl font-black text-white">{name}</h2>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <InfoCard label="Rating" value={String(rating)} />
        <InfoCard label="Attack" value={String(attack)} />
        <InfoCard label="Defense" value={String(defense)} />
        <InfoCard label="Form" value={String(form)} />
      </div>
    </div>
  );
}