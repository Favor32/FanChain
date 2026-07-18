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
  fs.readFileSync("dev-wallet.json", "utf-8")
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

    const imageMap: Record<string, string> = {
      goal: "/moments/goal.svg",
      redcard: "/moments/redcard.svg",
      yellowcard: "/moments/yellowcard.svg",
    };
    const imagePath = imageMap[momentType] || "/moments/generic.svg";
    const imageUrl = `http://localhost:3000${imagePath}`;

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
