import "regenerator-runtime/runtime";
import "styles/tailwind.css";

import React from "react";
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


function AarcProvider({ children }) {   

  const { address, isConnected, connector, chainId } = useAccount();

  console.log(address, "address")
    
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
      chainId: chainId || 1,
      walletAddress: address || "0x7C1a357e76E0D118bB9E2aCB3Ec4789922f3e050",
      tokenAddress: "0x0000000000000000000000000000000000000000",
      requestedAmount: 10,
      // contract: {
      //     contractAddress: "0x94De497a5E88Da7bc522a8203100f99Dd6e6171e",
      //     contractName: "Aave",
      //     contractPayload: "",
      //     contractGasLimit: "2000000",
      // },
    },
    // appearance: {
    //   themeColor: "#2D2D2D",
    //   textColor: "#2D2D2D",
    //   backgroundColor: "#FFF",
    //   highlightColor: "#F0F0F0",
    //   dark: {
    //     themeColor: "#FFF", // #2D2D2D
    //     textColor: "#FFF", // #FFF
    //     backgroundColor: "#2D2D2D", // #2D2D2D
    //     highlightColor: "#2D2D2D", // #FFF
    //   },
    //   // roundness: 42,
    // },

    apiKeys: {
      aarcSDK: process.env.REACT_APP_AARC_API_KEY || ""
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
