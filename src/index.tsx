import "regenerator-runtime/runtime";
import "styles/tailwind.css";

import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import WalletProvider from "lib/wallets/WalletProvider";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AarcEthWalletConnector } from "@aarc-xyz/eth-connector"
import "@aarc-xyz/eth-connector/styles.css"
import "@aarc-xyz/fund-kit-widget/styles.css"
import {
  AarcSwitchWidgetProvider,
  FKConfig,
  TransactionErrorData,
  TransactionSuccessData,
  ThemeName
} from "@aarc-xyz/fund-kit-widget"

import { useAccount } from "wagmi";
import { useLocalStorageByChainId } from "lib/localStorage";
import { ethers } from "ethers";

import { ARBITRUM, getConstant } from "config/chains";
import { getTokenBySymbol } from "config/tokens";
import { SWAP, LONG, SHORT } from "lib/legacy";

const queryClient = new QueryClient()


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <WalletProvider>
        <AarcProvider>
          <App />
        </AarcProvider>
      </WalletProvider>
    </Router>
  </React.StrictMode >
);

const { ZeroAddress } = ethers;

function AarcProvider({ children }) {

  let { address } = useAccount();

  const chainId = ARBITRUM
  const defaultCollateralSymbol = getConstant(chainId, "defaultCollateralSymbol");
  const [swapOption, setSwapOption] = useLocalStorageByChainId(chainId, "Swap-option-v2", LONG);
  const defaultTokenSelection = useMemo(
    () => ({
      [SWAP]: {
        from: ZeroAddress,
        to: getTokenBySymbol(chainId, defaultCollateralSymbol).address,
      },
      [LONG]: {
        from: ZeroAddress,
        to: ZeroAddress,
      },
      [SHORT]: {
        from: getTokenBySymbol(chainId, defaultCollateralSymbol).address,
        to: ZeroAddress,
      },
    }),
    [chainId, defaultCollateralSymbol]
  );
  const [tokenSelection, setTokenSelection] = useLocalStorageByChainId(
    chainId || 1,
    "Exchange-token-selection-v2",
    defaultTokenSelection
  );

  console.log(address, "address")
  console.log(tokenSelection, "tokenSelection")

  useEffect(() => {
    console.log(swapOption, "swapOption")
    console.log(tokenSelection, "tokenSelection")
  }, [swapOption])

  const config: FKConfig = {
    appName: "Dapp Name",
    module: {
      exchange: {
        enabled: true,
      },
      onRamp: {
        enabled: true,
        onRampConfig: {
          customerId: "323232323",
          exchangeScreenTitle: "Deposit funds in your wallet",
        },
      },
      bridgeAndSwap: {
        enabled: true,
        fetchOnlyDestinationBalance: false,
        routeType: "Value",
      },
    },
    destination: {
      chainId: chainId,
      walletAddress: address || "0x7C1a357e76E0D118bB9E2aCB3Ec4789922f3e050",
      tokenAddress: tokenSelection?.[swapOption as any].from || "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      requestedAmount: 10,

    },
    appearance: {
      // themeColor: "#2D2D2D",
      // textColor: "#2D2D2D",
      // backgroundColor: "#FFF",
      // highlightColor: "#F0F0F0",
      dark: {
        themeColor: "#2C42FC", // #2D2D2D
        textColor: "#FFF", // #FFF
        backgroundColor: "#16182E", // #2D2D2D
        highlightColor: "#08091B", // #FFF
        borderColor: "#24263B",
      },
      theme: ThemeName.DARK,
      // roundness: 42,
    },


    apiKeys: {
      aarcSDK: process.env.REACT_APP_AARC_API_KEY || "",
    },
    events: {
      onTransactionSuccess: (data: TransactionSuccessData) => {
        console.log("onTransactionSuccess", data)
      },
      onTransactionError: (data: TransactionErrorData) => {
        console.log("onTransactionError", data)
      },
      onWidgetClose: () => {
        console.log("onWidgetClose")
      },
      onWidgetOpen: () => {
        console.log("onWidgetOpen")
      },
    },
  }

  return <QueryClientProvider client={queryClient}>
    <AarcSwitchWidgetProvider config={config}>
      <AarcEthWalletConnector>
        {children}
      </AarcEthWalletConnector>
    </AarcSwitchWidgetProvider>
  </QueryClientProvider>
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { formatTokenAmount, formatTokenAmountWithUsd, formatUsd } from "./lib/numbers";
