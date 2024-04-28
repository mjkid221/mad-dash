import { LadBadge } from "@mad-land/lib";

interface MadLadBadgeInfo {
  src: string;
  title: string;
  description?: string;
  date?: string;
}
export const madLadBadgeInfo: Record<LadBadge, MadLadBadgeInfo> = {
  [LadBadge.BackpackLaunch]: {
    src: "/assets/badges/bp-drop.png",
    title: "Pyth Drop Event",
    description: "Awarded for participating in the Backpack Exchange launch.",
    date: "Nov 20, 2023",
  },
  [LadBadge.Pythia]: {
    src: "/assets/badges/pythia.png",
    title: "Beseech the Oracle Event",
    description: "Awarded for participating in the Pythia 1:1 raffle.",
    date: "Dec 1, 2023",
  },
  [LadBadge.TensorRaffle]: {
    src: "/assets/badges/tensor-raffle.png",
    title: "Tensor Glitch",
    description: "Awarded for participating in the Tensor 1:1 raffle.",
    date: "Feb 12, 2024",
  },
  [LadBadge.Wormhole]: {
    src: "/assets/badges/wormhole.png",
    title: "Wormhole (W)",
    date: "Feb 8, 2024",
  },
  [LadBadge.RickRoll]: {
    src: "/assets/badges/rickroll.png",
    title: "WL",
    date: "Feb 21, 2024",
  },
};
