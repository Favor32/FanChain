# Fanchain

Claim real World Cup moments as on-chain collectibles, the instant they happen.

## What it does

Fanchain listens to a live, verified World Cup data feed. When a goal, red
card, or yellow card is confirmed, fans watching can claim that moment as a
real NFT — minted directly into their connected Solana wallet, not a
screenshot or a highlight clip.

## Why Solana

Solana is structurally required in two separate ways:

1. **Data access is on-chain.** To receive live match data from TxODDS, an
   application must hold a verified on-chain subscription — a real Solana
   transaction, not just an API key request. This project's backend
   subscribes and activates its data access this way.
2. **Ownership is on-chain.** Claimed moments are minted as real NFTs
   directly into the fan's wallet, giving permanent, verifiable ownership
   rather than a database record.

## Architecture
- **Backend (`app/api/txline/`)**: authenticates with TxODDS (JWT + long-lived
  API token, obtained via an on-chain subscribe/activate flow using Anchor),
  fetches fixtures, and relays a live Server-Sent Events stream of match
  scores to the frontend.
- **Minting (`app/api/mint/`)**: uses Metaplex/Umi to mint an NFT representing
  a claimed moment directly into the fan's connected wallet.
- **Frontend (`app/`)**: a live dashboard (`/live`) that connects to the
  scores stream, renders claimable moment cards, and handles wallet connection
  via Solana Wallet Adapter.

## Tech stack

- Next.js (App Router)
- Solana (devnet), Anchor
- Metaplex / Umi (NFT minting)
- TxODDS TxLINE API (live football data)
- Tailwind CSS

## Setup

1. Clone the repo, `npm install`
2. Set the required environment variables (see `.env.local.example` if
   provided, or the list below)
3. `npm run dev`

### Required environment variables

- `NEXT_PUBLIC_SOLANA_NETWORK`
- `NEXT_PUBLIC_SOLANA_RPC`
- `TXLINE_API_ORIGIN`
- `TXLINE_PROGRAM_ID`
- `TXLINE_API_TOKEN`
- `DEV_WALLET_SECRET_KEY`

## Notes

- Currently running on Solana Devnet.
- A "Simulate a Moment" button is included on the Live Room page to
  demonstrate the claim flow without waiting for a live match event.

