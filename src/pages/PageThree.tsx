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

const connection = new anchor.web3.Connection(
  "https://api.mainnet-beta.solana.com/"
);

const CANDYMACHINE = {
  id: new PublicKey("EXH2zyttfzggBPENkWqW6jk6djs8etuv1oAjYG17DbbS"),
  treasury: new PublicKey("D3euPBeUybyCKv3YUs6ae58aFKdhisM3YXiFeYi1J8vF"),
  config: new PublicKey("CM6HbHGyzSnFbYfhNFnYj9zKL3SXm2FLyCUwdJhPnN63"),
  startDate: 1632535200,
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
            src={process.env.PUBLIC_URL + "/images/black.png"}
            alt="Deeper Tones"
            width="100%"
            height="100%"
          />
        </Box>
        <Box>
          <Box sx={{ marginBottom: 12 }}>
            <Typography component="h1" variant="h4">
              Welcome aboard the underground NFT Rail Road!
            </Typography>
          </Box>
          <Typography component="p" variant="body1">
            Welcome aboard the underground NFT Rail Road! Black Money is a
            black-based social impact NFT project developed to generate
            long-term financial and social value for black token holders. This
            project is intended to honor our Black American ancestors who
            deserve to be celebrated for creating pathways of freedom for black
            lives by minting them and their legacy on the blockchain. Our hope
            is to bring awareness and access to cryptocurrency for our black
            community by co-creating a underground NFT drop that is comprised of
            our black friends, colleagues and family.
            <br />
            <br /> You are about the become the first owner of Black Money! Once
            purchased, please consider selling your Black Money to Black
            collectors on our secondary market at Deeper Tones, that will open
            up once we sell out. Those interested in accessing the social
            components, road map, and keeping up to date on this project please
            email: deepertonesnft@gmail.com
            <br />
            <br /> Thank you for minting your very own Black Money! This one is
            for the ancestors and for the culture!
          </Typography>
        </Box>
        {/* {wallet && <p>Address: {wallet.publicKey.toBase58()}</p>} */}

        <Box
          sx={{
            marginTop: 32,
          }}
        >
          <Typography component="h2" variant="h5">
            Mint Your Very Own NFT
          </Typography>
          <Typography component="p" variant="overline">
            Minting Price 4 SOL
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
