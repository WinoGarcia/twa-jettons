import { useEffect, useState } from "react";
import { Address, fromNano, OpenedContract, toNano } from "ton-core";
import { Mint, SampleJetton } from "../../build/SampleJetton/tact_SampleJetton";
import { JettonDefaultWallet } from "../../build/SampleJetton/tact_JettonDefaultWallet";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useTonWallet } from "@tonconnect/ui-react";

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export function useJettonContract() {
  const { client } = useTonClient();
  const { wallet, sender } = useTonConnect();
  const [balance, setBalance] = useState<string | null>();

  const jettonContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;

    const contract = SampleJetton.fromAddress(Address.parse("kQAfWnjZbMEXztjP7HHKhcXiEJ1yd_rFk2e37BYvBM5-N_bt"));

    return client.open(contract) as OpenedContract<SampleJetton>;
  }, [client, wallet]);

  const jettonWalletContract = useAsyncInitialize(async () => {
    if (!jettonContract || !wallet || !client) return;

    const jettonWalletAddress = await jettonContract.getGetWalletAddress(Address.parse(wallet));

    const jettonWallet = JettonDefaultWallet.fromAddress(jettonWalletAddress);

    return client.open(jettonWallet);
  }, [jettonContract, client]);

  useEffect(() => {
    async function getBalance() {
      if (!jettonWalletContract) return;

      const newBalance = (await jettonWalletContract.getGetWalletData()).balance;
      if (balance !== fromNano(newBalance)) {
        setBalance(fromNano(newBalance));
      }

      await sleep(15000);
      getBalance();
    }
    getBalance();
  }, [jettonWalletContract]);

  return {
    jettonWalletAddress: jettonWalletContract?.address.toString(),
    balance: balance,
    mint: (amount: bigint) => {
      const message: Mint = {
        $$type: "Mint",
        amount: amount,
      };

      jettonContract?.send(
        sender,
        {
          value: toNano("0.05"),
        },
        message
      );
    },
  };
}
