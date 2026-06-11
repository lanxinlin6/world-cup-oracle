import type { PlayerNote } from "@/types/worldcup";

export const teamNews: PlayerNote[] = [
  {
    teamId: "france",
    playerName: "Kylian Mbappé",
    role: "Forward",
    status: "key_player",
    note: "Primary attacking reference point. His pace and finishing heavily influence France's expected goal ceiling.",
    sources: [
      {
        label: "France team profile",
        url: "https://www.fifa.com/",
        publisher: "FIFA",
      },
    ],
  },
  {
    teamId: "senegal",
    playerName: "Sadio Mané",
    role: "Forward",
    status: "key_player",
    note: "Key transition threat and attacking leader for Senegal.",
    sources: [
      {
        label: "Senegal team profile",
        url: "https://www.fifa.com/",
        publisher: "FIFA",
      },
    ],
  },
];