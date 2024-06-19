import { Address } from "ton-core";
import { useJettonContract } from "../hooks/useJettonContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { Card, FlexBoxCol, FlexBoxRow, Button, Ellipsis } from "./styled/styled";
import JettonMintForm from "./JettonMintForm";

export function Jetton() {
  const { wallet, connected } = useTonConnect();
  const { jettonWalletAddress, balance, mint } = useJettonContract();

  return (
    <Card title="Jetton">
      <FlexBoxCol>
        <h3>Jetton</h3>
        <FlexBoxRow>
          Wallet
          <Ellipsis>{wallet ? Address.parse(wallet as string).toString() : "Loading..."}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
          Jetton Wallet
          <Ellipsis>{jettonWalletAddress ? jettonWalletAddress : "Loading..."}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
          Balance
          <Ellipsis>{balance ?? "Loading..."}</Ellipsis>
        </FlexBoxRow>

        <JettonMintForm connected={connected} mint={mint} />
      </FlexBoxCol>
    </Card>
  );
}
