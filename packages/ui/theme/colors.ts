import { ColorHues } from "@chakra-ui/react";

/**
 * Custom colors for the Chakra UI theme.
 * These should be formatted as per the example `customColor` below, with all variants, 50, 100...900 included.
 *
 * @see https://themera.vercel.app/ for a handy tool to generate chakra colour themes
 */
export const colors: Record<string, ColorHues | string> = {
  // Mad Lads color scheme
  red: {
    "50": "#FCE8E8",
    "100": "#F7C0C0",
    "200": "#F29797",
    "300": "#ED6E6E",
    "400": "#E84545",
    "500": "#f62038",
    "600": "#B51717",
    "700": "#881111",
    "800": "#5B0B0B",
    "900": "rgb(24 1 1)",
  },
  aqua: {
    "50": "#EAF6FB",
    "100": "#C3E7F3",
    "200": "#9DD7EC",
    "300": "#76C8E4",
    "400": "#50B8DD",
    "500": "#2AA9D5",
    "600": "#2187AB",
    "700": "#196580",
    "800": "#114355",
    "900": "#08222B",
  },
  gray: {
    "50": "#EFF1F2",
    "100": "#EAEAEA",
    "200": "#D4D4D4",
    "300": "#BEBEBE",
    "400": "#A8A8A8",
    "500": "#929292",
    "600": "#7C7C7C",
    "700": "#666666",
    "800": "#505050",
    "900": "#1B1B1B",
  },
};
