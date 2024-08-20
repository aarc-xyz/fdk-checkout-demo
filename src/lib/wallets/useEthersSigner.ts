import { ethers } from "ethers";
import { Config, useConnectorClient } from "wagmi";
import { useMemo } from "react";
import type { Account, Chain, Client, Transport } from "viem";

import { UncheckedJsonRpcSigner } from "lib/rpc/UncheckedJsonRpcSigner";
import { switchNetwork } from ".";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  if(!client) {
    switchNetwork(42161, false)
  }
  let network ;
  if(chain?.name)
   network = {
    chainId: chain?.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  } 
  else 
  network = {
    chainId: 42161,
    name: "Avalanche",
    ensAddress : ""
  }

  const provider = new ethers.BrowserProvider(transport, network);
  const signer = new UncheckedJsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });

  return useMemo(() => {
    if (!client) {
      return undefined;
    }

    return clientToSigner(client);
  }, [client]);
}
