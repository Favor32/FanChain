import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type { Txoracle } from "../types/txoracle";
import * as fs from "fs";


const DEVNET_RPC = "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J");

const txoracleIdl = JSON.parse(
  fs.readFileSync("./idl/txoracle.json", "utf-8")
);

const walletKeypairData = JSON.parse(
  fs.readFileSync(process.env.ANCHOR_WALLET as string, "utf-8")
);
const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(walletKeypairData)
);
const wallet = new anchor.Wallet(walletKeypair);

const connection = new Connection(DEVNET_RPC, "confirmed");
const provider = new anchor.AnchorProvider(connection, wallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);

const idlWithDevnetAddress = { ...txoracleIdl, address: PROGRAM_ID.toBase58() };
const program = new anchor.Program<Txoracle>(idlWithDevnetAddress as Txoracle, provider);

console.log("Wallet public key:", wallet.publicKey.toBase58());
console.log("Program ID:", program.programId.toBase58());import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";

const TXL_TOKEN_MINT = new PublicKey("4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG");

const [tokenTreasuryPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("token_treasury_v2")],
  program.programId
);

const tokenTreasuryVault = getAssociatedTokenAddressSync(
  TXL_TOKEN_MINT,
  tokenTreasuryPda,
  true,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);

const [pricingMatrixPda] = PublicKey.findProgramAddressSync(
  [Buffer.from("pricing_matrix")],
  program.programId
);

const userTokenAccount = getAssociatedTokenAddressSync(
  TXL_TOKEN_MINT,
  wallet.publicKey,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
);const SERVICE_LEVEL_ID = 1; // World Cup free tier
const DURATION_WEEKS = 4;
const SELECTED_LEAGUES: number[] = []; // empty = standard free bundle

async function subscribe() {
  const accountInfo = await connection.getAccountInfo(userTokenAccount);

  if (!accountInfo) {
    console.log("Creating user token account...");
    const createAtaIx = createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      userTokenAccount,
      wallet.publicKey,
      TXL_TOKEN_MINT,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = new anchor.web3.Transaction().add(createAtaIx);
    const sig = await provider.sendAndConfirm(tx);
    console.log("Token account created:", sig);
  }

  const txSig = await program.methods
    .subscribe(SERVICE_LEVEL_ID, DURATION_WEEKS)
    .accounts({
      user: wallet.publicKey,
      pricingMatrix: pricingMatrixPda,
      tokenMint: TXL_TOKEN_MINT,
      userTokenAccount,
      tokenTreasuryVault,
      tokenTreasuryPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Subscribed! Transaction signature:", txSig);
  fs.writeFileSync("subscription-tx.txt", txSig);
  console.log("Saved transaction signature to subscription-tx.txt");
}

subscribe().catch((err) => {
});