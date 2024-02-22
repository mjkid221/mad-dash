import type { BigNumberish } from "@ethersproject/bignumber";
import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import { ethers } from "ethers";
import { v1 } from "uuid";

import { Blockchain } from "./types";

export function toTitleCase(str: string) {
  return str?.slice(0, 1)?.toUpperCase() + str?.toLowerCase()?.slice(1);
}

/**
 * A globally unique ID generator, useful for stateless or readonly things
 * @returns
 * uuid/v1, in case we need to extract the timestamp when debugging
 */
export function generateUniqueId() {
  return v1();
}

export function isMobile(): boolean {
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    return false;
  }

  return true;
}

/**
 * True if we're in the mobile environment.
 */
export const IS_MOBILE =
  !globalThis.chrome && !globalThis.___toApp && !globalThis.browser;
// `global.chrome` is in chromium and the service worker
// `global.___toApp` is in mobile's hidden webview (bg script)
// `global.browser` is in Firefox and Safari

export function isServiceWorker(): boolean {
  return globalThis.clients !== undefined;
}

/**
 * Make any necessary changes to URIs before the client queries them.
 *
 * TODO: replace host with host of caching layer for thumbnail generation, caching,
 * SVG sanitization, etc.
 */
export function externalResourceUri(
  uri: string,
  options: { cached?: boolean } = {}
): string {
  if (uri) {
    uri = uri.replace(/\0/g, "");
  }
  if (uri && uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
    // return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  if (uri && uri.startsWith("ar://")) {
    return uri.replace("ar://", "https://arweave.net/");
  }
  if (options.cached) {
    return `https://swr.xnftdata.com/1min/${uri}`;
  }
  return `${uri}`;
}

export function proxyImageUrl(
  url: string,
  size = 400,
  unbounded?: boolean
): string {
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    if (url.includes("swr.xnftdata.com/avatars/")) {
      url += `?size=${size}`;
    }
    return `https://imageresizer.xnftdata.com/fit=contain,${
      unbounded ? `width=${size},` : `width=${size},height=${size},`
    }quality=85/${url}`;
  }
  return url;
}

export function toDisplayBalance(
  nativeBalance: BigNumberish,
  decimals: BigNumberish,
  truncate = true,
  skipFormat = false
): string {
  let displayBalance: string;
  if (skipFormat && typeof nativeBalance === "string") {
    displayBalance = nativeBalance;
  } else {
    displayBalance = ethers.utils.formatUnits(nativeBalance, decimals);
  }

  if (truncate) {
    try {
      displayBalance = `${displayBalance.split(".")[0]}.${displayBalance
        .split(".")[1]
        .slice(0, 5)}`;
    } catch {
      // pass
    }
  }

  return ethers.utils.commify(displayBalance);
}

export function reverseScientificNotation(n: number): string {
  const str = n.toString();
  if (!str.includes("e")) {
    return str;
  }

  const [base, exp] = str.split("e");
  const decimals = parseInt(exp);

  if (decimals < 0) {
    const sign = base[0] === "-" ? "-" : "";
    return `${sign}0.${Array(Math.abs(decimals) - 1)
      .fill("0")
      .join("")}${base.replace(/[-.]/g, "")}`;
  }

  const baseSplit = base.split(".");
  const baseDecimals = baseSplit.length === 1 ? 0 : baseSplit[1].length;
  return `${base.replace(".", "")}${Array(decimals - baseDecimals)
    .fill("0")
    .join("")}`;
}
