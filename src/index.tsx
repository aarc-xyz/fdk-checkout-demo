import "regenerator-runtime/runtime";
import "styles/tailwind.css";

import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import WalletProvider from "lib/wallets/WalletProvider";
import App from "./App/App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "@aarc-xyz/eth-connector/styles.css"
import "@aarc-xyz/fund-kit-widget/styles.css"



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





  return <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { formatTokenAmount, formatTokenAmountWithUsd, formatUsd } from "./lib/numbers";
