import "regenerator-runtime/runtime";
import "styles/tailwind.css";

import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import WalletProvider from "lib/wallets/WalletProvider";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";
import { rainbowKitConfig } from "lib/wallets/rainbowKitConfig";
// import '../node_modules/@aarc-dev/deposit-widget/dist/style.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AarcEthWalletConnector } from "@aarc-dev/eth-connector"
import "@aarc-dev/eth-connector/styles.css"
import "@aarc-dev/deposit-widget/styles.css"
import {
  AarcSwitchWidgetProvider,
  FKConfig,
  TransactionErrorData,
  TransactionSuccessData,
  OpenModal
} from "@aarc-dev/deposit-widget"
import useWallet from "lib/wallets/useWallet";
import { useAccount } from "wagmi";
import { useLocalStorageByChainId } from "lib/localStorage";
import { ethers } from "ethers";
import { zeroAddress } from "viem";
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
  const config: FKConfig = {
    appName: "Dapp Name",
    module: {
      exchange: {
        enabled: true,
      },
      onRamp: {
        enabled: true,
        onRampConfig: {
          mode: "deposit",
          customerId: "323232323",
          exchangeScreenTitle: "Deposit funds in your wallet",
          networks: ["ethereum", "polygon"],
          defaultNetwork: "polygon",
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
      tokenAddress: tokenSelection?.[LONG].from || "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      requestedAmount: 10,

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
