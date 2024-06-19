import React, { ChangeEvent, FC, useState } from "react";
import { Input, Button } from "./styled/styled";

interface JettonMintFormProps {
  connected: boolean;
  mint: (amount: bigint) => void;
}

const JettonMintForm: FC<JettonMintFormProps> = ({ connected, mint }) => {
  const [amount, setAmount] = useState<string>("");

  const convertToBigInt = (value: string): bigint | null => {
    try {
      return BigInt(value);
    } catch (error) {
      console.error(`Error converting "${value}" to bigint:`, error);
      return null;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const amountAdInt = convertToBigInt(amount);
    if (amount != null && amount != "" && amountAdInt != null && amountAdInt > 0) {
      mint(BigInt(amount));
    }
  };

  const amountAdInt = convertToBigInt(amount);
  const isEnableMint = connected && amount != "" && amountAdInt != null && amountAdInt > 0;

  return (
    <form className="mint-jettons" onSubmit={handleSubmit}>
      <Input
        name="amount"
        type="text"
        onChange={handleChange}
        value={amount}
        style={{
          padding: "10px 10px",
          marginRight: "10px",
          width: "20%",
        }}
      />
      <Button disabled={!isEnableMint} type="submit">
        Mint jettons
      </Button>
    </form>
  );
};

export default JettonMintForm;
