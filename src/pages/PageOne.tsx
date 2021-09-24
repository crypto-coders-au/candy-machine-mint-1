import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
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

const connection = new anchor.web3.Connection("https://api.devnet.solana.com/");

const CANDYMACHINE = {
  id: new PublicKey("AkKwzkNoMW9jwrkZpYvhfFXJoGbP3FmizXzw3MbUvBJF"),
  treasury: new PublicKey("Acf2R8R5vRGhQ4PGpXRbGBRsHwoZYpn3TvrKyb9Zj6Ew"),
  config: new PublicKey("AuTLgvGhpjH6iPNMoxrcwnxhaaZgKtMAj4nBWf78byJ"),
  startDate: 1630422000000,
  txTimeout: 30000,
};

const TierOne = () => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

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
    <Container component="main" maxWidth="sm">
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
        >
          <img
            src="images/banner.png"
            alt="Deeper Tones"
            width="100%"
            height="100%"
          />
        </Box>
        <Box>
          <Typography component="h1" variant="h4">
            Deeper Tones Candy Machine
          </Typography>
          <Typography component="p" variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        </Box>
        {/* {wallet && <p>Address: {wallet.publicKey.toBase58()}</p>} */}

        <Box
          sx={{
            marginTop: 32,
          }}
        >
          <Typography component="h2" variant="h5">
            Mint Your Very Own Green NFT
          </Typography>
          <Typography component="p" variant="overline">
            Minting Price 1 SOL
          </Typography>

          {!wallet ? (
            <WalletDialogButton>Connect Wallet</WalletDialogButton>
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
            ></MintButton>
          )}
          {wallet && (
            <Typography component="p" variant="overline">
              Balance {(balance || 0).toLocaleString()} SOL
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
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

export default TierOne;
