import axios from "axios";
import * as fs from "fs";
import * as anchor from "@coral-xyz/anchor";
import nacl from "tweetnacl";

const API_ORIGIN = "https://txline-dev.txodds.com";

const walletKeypairData = JSON.parse(
  fs.readFileSync("dev-wallet.json", "utf-8")
);
const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(walletKeypairData)
);

const txSig = fs.readFileSync("subscription-tx.txt", "utf-8").trim();
const SELECTED_LEAGUES: number[] = [];

async function activate() {
  // Step 1: Get a fresh guest JWT (the old one may have expired by now)
  const authResponse = await axios.post(`${API_ORIGIN}/auth/guest/start`);
  const jwt = authResponse.data.token;
  console.log("Got fresh JWT");// Step 2: Sign a message proving this is really our wallet
  const messageString = `${txSig}:${SELECTED_LEAGUES.join(",")}:${jwt}`;
  const message = new TextEncoder().encode(messageString);
  const signatureBytes = nacl.sign.detached(message, walletKeypair.secretKey);
  const walletSignature = Buffer.from(signatureBytes).toString("base64");

  // Step 3: Call the activation endpoint
  const activationResponse = await axios.post(
    `${API_ORIGIN}/api/token/activate`,
    {
      txSig,
      walletSignature,
      leagues: SELECTED_LEAGUES,
    },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );

  const apiToken = activationResponse.data.token || activationResponse.data;
  console.log("API Token:", apiToken);

  fs.writeFileSync("api-token.txt", apiToken);
  console.log("Saved to api-token.txt");
}

activate().catch((err) => {
  console.error("Activation failed:", err.response?.data || err.message);
});