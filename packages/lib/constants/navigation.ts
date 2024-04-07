type AsyncOrSyncFunction = () => void | Promise<void>;

export enum NavigationIconSelector {
  MadLads = "madLads",
  Twitter = "twitter",
  Discord = "discord",
}

export interface NavItem {
  label?: string;
  href?: string;
  icon?: NavigationIconSelector;
  onClick?: AsyncOrSyncFunction;
  children?: Array<NavItem>;
  isDisabled?: boolean;
}

export type NavItems = NavItem[];

export const navigationItems: NavItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Gold Transferoor",
    href: "/gold-transferoor",
  },
  {
    label: "Airdropper",
    href: "/airdropper",
  },
  {
    label: "P2P",
    href: "/p2p",
    isDisabled: true,
  },
  {
    label: "Official Links",
    children: [
      {
        icon: NavigationIconSelector.MadLads,
        href: "https://madlads.com",
      },
      {
        icon: NavigationIconSelector.Twitter,
        href: "https://twitter.com/MadLads",
      },
      {
        icon: NavigationIconSelector.Discord,
        href: "https://discord.gg/madlads",
      },
    ],
  },
];

export const NAVBAR_HEIGHT = "104px";
