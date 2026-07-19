import * as fs from "fs";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey as toUmiPublicKey } from "@metaplex-foundation/umi";

const umi = createUmi("https://api.devnet.solana.com");

const walletKeypairData = JSON.parse(
  process.env.DEV_WALLET_SECRET_KEY as string
);
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(walletKeypairData)
);
const umiSigner = createSignerFromKeypair(umi, umiKeypair);
umi.use(signerIdentity(umiSigner));
umi.use(mplTokenMetadata());
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipientWallet, momentType, teamName, minute } = body;

   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const imageUrl = `${baseUrl}/api/moment-image?type=${momentType}&team=${encodeURIComponent(teamName)}&minute=${minute}`;

    const nftName = `${teamName} - ${momentType.toUpperCase()} (${minute}')`;

    const mint = generateSigner(umi);

    await createNft(umi, {
      mint,
      name: nftName,
      uri: imageUrl,
      sellerFeeBasisPoints: percentAmount(0),
      tokenOwner: toUmiPublicKey(recipientWallet),
    }).sendAndConfirm(umi);

    return Response.json({
      success: true,
      mintAddress: mint.publicKey,
    });
  } catch (error) {
    console.error("Minting failed:", error);
    return Response.json({ error: "Minting failed" }, { status: 500 });
  }
}
