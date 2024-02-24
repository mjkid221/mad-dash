type AsyncOrSyncFunction = () => void | Promise<void>;

export enum NavigationIconSelector {
  MadLads = "madLads",
  Twitter = "twitter",
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
    label: "P2P Trading",
    href: "/",
    isDisabled: true,
  },
  {
    label: "Official Links",
    children: [
      {
        // label: "Mad Lads",
        icon: NavigationIconSelector.MadLads,
        href: "https://madlads.com",
      },
      {
        // label: "Twitter",
        icon: NavigationIconSelector.Twitter,
        href: "https://twitter.com",
      },
    ],
  },
];

export const NAVBAR_HEIGHT = "104px";
