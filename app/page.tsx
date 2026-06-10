"use client";

import { useMemo, useState } from "react";
import { teams } from "@/data/teams";
import {
  formatProbability,
  getOracleVerdict,
  runSimulation,
  winProbability,
} from "@/lib/simulation";
import type { PredictionResult, Team } from "@/types/worldcup";

const GITHUB_URL = "https://github.com/lanxinlin6/world-cup-oracle";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function downloadPredictionCard(
  team: Team,
  result: PredictionResult,
  topTeam: PredictionResult
) {
  const svg = `
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="675" fill="#050816"/>
  <circle cx="140" cy="80" r="230" fill="#22C55E" opacity="0.18"/>
  <circle cx="1040" cy="110" r="260" fill="#3B82F6" opacity="0.16"/>
  <rect x="70" y="70" width="1060" height="535" rx="38" fill="#0F172A" stroke="#334155" stroke-width="2"/>
  <text x="100" y="145" fill="#94A3B8" font-size="30" font-family="Arial">WORLD CUP ORACLE</text>
  <text x="100" y="230" fill="#F8FAFC" font-size="72" font-family="Arial" font-weight="700">${escapeXml(team.flag)} ${escapeXml(team.name)}</text>
  <text x="100" y="300" fill="#CBD5E1" font-size="34" font-family="Arial">Champion probability</text>
  <text x="100" y="410" fill="#22C55E" font-size="96" font-family="Arial" font-weight="700">${formatProbability(result.championProbability)}</text>
  <text x="100" y="485" fill="#E2E8F0" font-size="30" font-family="Arial">Top model pick: ${escapeXml(topTeam.team.flag)} ${escapeXml(topTeam.team.name)} · ${formatProbability(topTeam.championProbability)}</text>
  <text x="100" y="545" fill="#94A3B8" font-size="26" font-family="Arial">Predict the tournament. Blame the model later.</text>
</svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${team.id}-world-cup-oracle-card.svg`;
  link.click();

  URL.revokeObjectURL(url);
}

export default function Home() {
  const [selectedTeamId, setSelectedTeamId] = useState("argentina");
  const [runs, setRuns] = useState(5000);
  const [results, setResults] = useState<PredictionResult[]>(() =>
    runSimulation(teams, { runs: 5000 })
  );

  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTeamId) ?? teams[0],
    [selectedTeamId]
  );

  const selectedResult = useMemo(
    () => results.find((item) => item.team.id === selectedTeam.id) ?? results[0],
    [results, selectedTeam.id]
  );

  const topEight = results.slice(0, 8);
  const topTeam = results[0];

  function handleRunOracle() {
    setResults(runSimulation(teams, { runs }));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-2xl">
            🔮
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Open-source simulator
            </p>
            <h1 className="text-xl font-bold text-white">World Cup Oracle</h1>
          </div>
        </div>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
        >
          ⭐ Star on GitHub
        </a>
      </nav>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-2xl shadow-emerald-950/20">
          <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            Powered by statistics, chaos, and unreasonable national confidence.
          </div>

          <h2 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-6xl">
            Predict the tournament.
            <span className="block text-emerald-300">Blame the model later.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A suspiciously confident football prediction simulator. Pick your
            team, run thousands of Monte Carlo simulations, and prepare a
            statistically decorated argument for your group chat.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Teams</p>
              <p className="mt-2 text-3xl font-bold text-white">{teams.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Simulations</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {runs.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">Vibes</p>
              <p className="mt-2 text-3xl font-bold text-white">Unstable</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
          <label className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Choose your team
          </label>

          <select
            value={selectedTeamId}
            onChange={(event) => setSelectedTeamId(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-lg font-semibold text-white outline-none transition focus:border-emerald-400"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.flag} {team.name}
              </option>
            ))}
          </select>

          <label className="mt-6 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Simulation runs
          </label>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {[1000, 5000, 10000].map((value) => (
              <button
                key={value}
                onClick={() => setRuns(value)}
                className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                  runs === value
                    ? "border-emerald-400 bg-emerald-400 text-slate-950"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400"
                }`}
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunOracle}
            className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-lg font-black text-slate-950 transition hover:bg-emerald-300"
          >
            Run Oracle
          </button>

          <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">
              Your prophecy
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-black text-white">
                  {selectedTeam.flag} {selectedTeam.name}
                </p>
                <p className="mt-2 text-slate-300">
                  Champion probability:{" "}
                  <span className="font-bold text-emerald-300">
                    {formatProbability(selectedResult.championProbability)}
                  </span>
                </p>
              </div>

              <div className="text-right text-5xl font-black text-emerald-300">
                {formatProbability(selectedResult.championProbability)}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {getOracleVerdict(selectedResult)}
            </p>

            <button
              onClick={() =>
                downloadPredictionCard(selectedTeam, selectedResult, topTeam)
              }
              className="mt-5 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Generate share card
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
          <h3 className="text-2xl font-black text-white">Champion Probability Top 8</h3>
          <p className="mt-2 text-sm text-slate-400">
            The model has spoken. The model may regret speaking.
          </p>

          <div className="mt-6 space-y-3">
            {topEight.map((item, index) => (
              <div
                key={item.team.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-sm font-bold text-slate-300">
                      {index + 1}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {item.team.flag} {item.team.name}
                    </span>
                  </div>
                  <span className="font-black text-emerald-300">
                    {formatProbability(item.championProbability)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${Math.max(item.championProbability * 100, 2)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
          <h3 className="text-2xl font-black text-white">
            {selectedTeam.flag} {selectedTeam.name} Path of Hope
          </h3>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ProbabilityCard
              label="Reach Round of 16"
              value={selectedResult.roundOf16Probability}
            />
            <ProbabilityCard
              label="Reach Quarter-final"
              value={selectedResult.quarterFinalProbability}
            />
            <ProbabilityCard
              label="Reach Semi-final"
              value={selectedResult.semiFinalProbability}
            />
            <ProbabilityCard
              label="Reach Final"
              value={selectedResult.finalProbability}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Model notes
            </p>
            <p className="mt-3 text-slate-300">
              Match probability is estimated with rating, attack, defense, form,
              and a chaos factor. Translation: the numbers matter, but football
              still enjoys humiliating spreadsheets.
            </p>

            <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
              Example neutral match probability against {topTeam.team.flag}{" "}
              {topTeam.team.name}:{" "}
              <span className="font-bold text-emerald-300">
                {formatProbability(winProbability(selectedTeam, topTeam.team))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-6">
        <h3 className="text-2xl font-black text-white">All Teams</h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <div className="text-2xl">{team.flag}</div>
              <div className="mt-2 font-bold text-white">{team.name}</div>
              <div className="mt-1 text-sm text-slate-400">
                {team.code} · {team.confederation}
              </div>
              <div className="mt-3 text-sm text-slate-300">
                Rating: <span className="font-bold">{team.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProbabilityCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">
        {formatProbability(value)}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${Math.max(value * 100, 2)}%` }}
        />
      </div>
    </div>
  );
}