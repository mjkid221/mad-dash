import "./fonts/fonts.css"; // Imports local fonts from "./fonts/fonts.css"

import { ThemeConfig, extendTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import { fonts } from "./fonts";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
});
