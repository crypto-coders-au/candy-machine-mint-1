import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import "@fontsource/lora";
import {
  Button,
  CircularProgress,
  Snackbar,
  Container,
  Box,
  Typography,
  Hidden,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
// import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "../utils/candy-machine";
import MintButton from "../components/MintButton";

const connection = new anchor.web3.Connection(
  "https://api.mainnet-beta.solana.com/"
);

const CANDYMACHINE = {
  id: new PublicKey("ArmgCzuYxPw8Co49gr6LKTwPoj4XoeUZT4EowZjcttTf"),
  treasury: new PublicKey("D3euPBeUybyCKv3YUs6ae58aFKdhisM3YXiFeYi1J8vF"),
  config: new PublicKey("5h6CQN2BZZfxHXeaHq2WLMKotnh3wNKbbBLMi6v4zGQ1"),
  startDate: 1632535200,
  txTimeout: 30000,
};

const TierOne = () => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(CANDYMACHINE.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  if (wallet) {
    connection.getBalance(wallet.publicKey).then((balance) => {
      setBalance(balance / LAMPORTS_PER_SOL);
    });
  }

  const onSuccess = () => {
    setAlertState({
      open: true,
      message: "Congratulations! Mint succeeded!",
      severity: "success",
    });
  };
  const onError = () => {
    setAlertState({
      open: true,
      message: "Mint failed! Please try again!",
      severity: "error",
    });
  };

  return (
    <div id="box">
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 8,
              maxWidth: "100%",
              overflow: "hidden",
            }}
          ></Box>
          <Box>
            <Box sx={{ marginBottom: 12 }}>
              <Typography component="h1" variant="h2">
                Not all dogs who wander are lost
              </Typography>
            </Box>
          </Box>
          {/* {wallet && <p>Address: {wallet.publicKey.toBase58()}</p>} */}

          <Box
            sx={{
              marginBottom: 12,
            }}
          >
            <Typography component="h2" variant="h3">
              pre-sale mint
            </Typography>
          </Box>
          <Box
            sx={{
              margin: 32,
            }}
          >
            <Typography component="h1" variant="h4">
              Minting: Price 3 SOL
            </Typography>
          </Box>
          <Box
            sx={{
              margin: 32,
            }}
          >
            {!wallet ? (
              <WalletDialogButton
                style={{ background: "white", color: "black" }}
              >
                Connect Wallet
              </WalletDialogButton>
            ) : (
              <MintButton
                connection={connection}
                candyMachineId={CANDYMACHINE.id}
                config={CANDYMACHINE.config}
                startDate={CANDYMACHINE.startDate}
                treasury={CANDYMACHINE.treasury}
                txTimeout={CANDYMACHINE.txTimeout}
                onSuccess={onSuccess}
                onError={onError}
                setItemsRemaining={setItemsRemaining}
                setItemsAvailable={setItemsAvailable}
                setItemsRedeemed={setItemsRedeemed}
              ></MintButton>
            )}
            {wallet && (
              <Typography component="h1" variant="h4">
                {/* Balance {(balance || 0).toLocaleString()} SOL */}
                {wallet && <p>Remaining: {itemsRemaining}</p>}
                {wallet && <p>Total: {itemsAvailable}</p>}
              </Typography>
            )}
          </Box>

          <Snackbar
            open={alertState.open}
            autoHideDuration={6000}
            onClose={() => setAlertState({ ...alertState, open: false })}
          >
            <Alert
              onClose={() => setAlertState({ ...alertState, open: false })}
              severity={alertState.severity}
            >
              {alertState.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </div>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

export default TierOne;
