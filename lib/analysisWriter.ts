import type {
  MatchAnalysisText,
  MatchInsight,
  MatchPrediction,
  Team,
} from "@/types/worldcup";

function getFavorite(
  teamA: Team,
  teamB: Team,
  prediction: MatchPrediction
): Team {
  if (prediction.winProbabilityA >= prediction.winProbabilityB) {
    return teamA;
  }

  return teamB;
}

function getUnderdog(
  teamA: Team,
  teamB: Team,
  prediction: MatchPrediction
): Team {
  if (prediction.winProbabilityA >= prediction.winProbabilityB) {
    return teamB;
  }

  return teamA;
}

function probabilityGap(prediction: MatchPrediction): number {
  return Math.abs(
    prediction.winProbabilityA - prediction.winProbabilityB
  );
}

function describeConfidence(gap: number): string {
  if (gap >= 0.25) {
    return "clear but not absolute";
  }

  if (gap >= 0.14) {
    return "meaningful";
  }

  if (gap >= 0.07) {
    return "narrow";
  }

  return "very slim";
}

function describeGameState(
  teamA: Team,
  teamB: Team,
  prediction: MatchPrediction
): string {
  const totalXg = prediction.expectedGoalsA + prediction.expectedGoalsB;

  if (totalXg >= 3.0) {
    return `The expected goals profile points toward an open match rather than a cagey tournament stalemate. Both teams project to create enough shooting volume for the game to swing quickly after the first goal.`;
  }

  if (totalXg >= 2.35) {
    return `The expected goals profile suggests a balanced tournament game: not necessarily end-to-end, but with enough attacking quality for both sides to create phases of pressure.`;
  }

  return `The expected goals profile leans toward a tight, lower-margin match. In this type of game, set pieces, transition moments, and individual errors usually carry more weight than long spells of possession.`;
}

function buildKeyMatchups(teamA: Team, teamB: Team): MatchInsight[] {
  return [
    {
      title: `${teamA.name} attack vs ${teamB.name} defensive block`,
      body: `${teamA.name}'s attacking index of ${teamA.attack} is tested against a ${teamB.name} defense rated ${teamB.defense}. If ${teamA.name} can create early entries into the final third, the model expects their chance quality to rise. If ${teamB.name} keep the game compact and force lower-value shots, the favourite's edge becomes much smaller.`,
    },
    {
      title: `${teamB.name} transition threat vs ${teamA.name} rest defense`,
      body: `${teamB.name}'s best route into the match is likely to come through quick attacks after turnovers. With an attack score of ${teamB.attack}, they may not need long possession spells to create danger. The key question is whether ${teamA.name}'s defense, rated ${teamA.defense}, can control the spaces behind midfield.`,
    },
    {
      title: `Form and tournament rhythm`,
      body: `${teamA.name}'s form index is ${teamA.form}, while ${teamB.name}'s is ${teamB.form}. This does not decide the match on its own, but it affects how the model prices confidence, sharpness, and the probability of sustaining pressure after difficult moments.`,
    },
  ];
}

function buildRiskFactors(
  favorite: Team,
  underdog: Team,
  prediction: MatchPrediction
): MatchInsight[] {
  const score = prediction.mostLikelyScore;

  return [
    {
      title: `The favourite still has a draw problem`,
      body: `Even when the model favours ${favorite.name}, football's low-scoring structure leaves real space for a draw. A single missed chance, an early booking, or a conservative second half can pull the match toward the most common tournament danger zone: 0-0, 1-1, or a one-goal game.`,
    },
    {
      title: `Most likely scoreline: ${score.teamA}-${score.teamB}`,
      body: `The most likely individual scoreline is ${score.teamA}-${score.teamB}, but scoreline probabilities are naturally spread out in football. That means the model is more confident about the general direction of the match than about the exact final score.`,
    },
    {
      title: `${underdog.name}'s upset path`,
      body: `${underdog.name} do not need to dominate the match to outperform the prediction. Their clearest upset path is to keep the first half level, reduce central spaces, and make the game depend on set pieces, second balls, and late-game nerves.`,
    },
  ];
}

export function writeMatchAnalysis(
  teamA: Team,
  teamB: Team,
  prediction: MatchPrediction
): MatchAnalysisText {
  const favorite = getFavorite(teamA, teamB, prediction);
  const underdog = getUnderdog(teamA, teamB, prediction);
  const gap = probabilityGap(prediction);
  const confidenceDescription = describeConfidence(gap);

  const favoriteProbability =
    favorite.id === teamA.id
      ? prediction.winProbabilityA
      : prediction.winProbabilityB;

  const underdogProbability =
    underdog.id === teamA.id
      ? prediction.winProbabilityA
      : prediction.winProbabilityB;

  const modelView = `The model makes ${favorite.name} the ${confidenceDescription} favourite, with a win probability of ${(favoriteProbability * 100).toFixed(
    1
  )}% compared with ${(underdogProbability * 100).toFixed(
    1
  )}% for ${underdog.name}. The draw remains a serious part of the forecast at ${(prediction.drawProbability * 100).toFixed(
    1
  )}%, which is important because international tournament matches often compress into low-margin game states. On expected goals, the model projects ${teamA.name} at ${prediction.expectedGoalsA.toFixed(
    2
  )} and ${teamB.name} at ${prediction.expectedGoalsB.toFixed(
    2
  )}, giving us a first read on chance quality rather than just raw team reputation.`;

  const tacticalPreview = `${describeGameState(
    teamA,
    teamB,
    prediction
  )} From a tactical point of view, the key issue is whether ${favorite.name} can turn their rating advantage into territory and high-quality chances. If they control midfield and sustain attacks, their probability edge is justified. If ${underdog.name} can slow the tempo, defend the central lane, and attack quickly into space, the match becomes much more volatile than the headline probability suggests.`;

  const keyMatchups = buildKeyMatchups(teamA, teamB);
  const riskFactors = buildRiskFactors(favorite, underdog, prediction);

  const analystVerdict = `My read is that ${favorite.name} deserve to be favoured, but this is not a prediction that should be treated as a formality. The model edge comes from stronger underlying indicators — rating, attacking quality, defensive stability, and recent form — but the match still contains clear upset mechanisms. If ${favorite.name} score first, the game should tilt strongly toward them. If ${underdog.name} reach half-time level, the pressure shifts, the draw grows in value, and the Oracle becomes much less comfortable.`;

  return {
    modelView,
    tacticalPreview,
    keyMatchups,
    riskFactors,
    analystVerdict,
  };
}
