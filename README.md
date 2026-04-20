# Donation Platform (DApp, Fullstack)

A fullstack crowdfunding decentralized application built with Solidity, Hardhat, React, Vite, Tailwind CSS, and thirdweb.

This repository includes:
- A smart contract backend for campaign creation and donations.
- A React frontend for browsing campaigns, creating campaigns, donating, and viewing campaign funding details.

## Tech Stack

### Blockchain / Smart Contracts
- Solidity `0.8.9`
- Hardhat
- thirdweb CLI and contract tooling

### Frontend
- React `18`
- Vite `6`
- Tailwind CSS `3`
- React Router DOM `6`
- thirdweb React SDK (`@thirdweb-dev/react`)
- Ethers.js `5`
- React Toastify

## Repository Structure

```text
Complete Project/
  backend/
    web3/
      contracts/
        CrowdFunding.sol
      hardhat.config.js
      package.json
  FrontEnd/
    src/
      components/
      constants/
      context/
      pages/
      App.jsx
      main.jsx
      ThirdwebProviderV4.jsx
      client.js
    package.json
    vite.config.js
    tailwind.config.js
```

## Features

- Create campaigns with title, story, target amount, deadline, and image.
- Browse all campaigns on dashboard.
- Search campaigns by title and description.
- Filter campaigns by ongoing/ended state.
- View campaign details, progress, creator, and donor list.
- Donate to campaigns directly from connected wallet.
- View personal campaigns in profile.
- View campaign funding details on payment page.
- Wallet connection via thirdweb hooks/components.

## Smart Contract Overview

Contract: `backend/web3/contracts/CrowdFunding.sol`

### Exposed Functions
- `createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image)`
- `donateToCampaign(uint256 _id)` (payable)
- `getDonators(uint256 _id)`
- `getCampaigns()`

### Contract Behavior Notes
- Donations are immediately forwarded to the campaign owner wallet.
- `amountCollected` is updated when transfer succeeds.
- Campaign and donation arrays are stored on-chain.

## Prerequisites

- Node.js `>= 18`
- npm or yarn
- A web3 wallet (MetaMask recommended)

## 1) Backend Setup (Hardhat + Contract)

```bash
cd backend/web3
npm install
```

Create `.env` in `backend/web3`:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x
```

Run contract tooling:

```bash
npm run build
npm run deploy
```

### Backend Scripts
- `npm run build` -> Detect contract extensions
- `npm run deploy` -> Deploy via thirdweb CLI
- `npm run release` -> Release contract version

## 2) Frontend Setup (React + Vite)

```bash
cd FrontEnd
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Network and Configuration Notes

Current codebase has mixed network configuration:
- Hardhat config is set to `goerli`.
- Frontend provider uses `Holesky` in `FrontEnd/src/ThirdwebProviderV4.jsx`.

Before production use, align all of the following to one chain:
- Contract deployment network.
- `activeChain` in frontend provider.
- Frontend contract address in `FrontEnd/src/context/index.jsx`.

## Environment Variables

### Required
- Backend: `backend/web3/.env`
  - `PRIVATE_KEY`

### Recommended
Frontend currently hardcodes thirdweb client IDs in source files. Move these to environment variables for cleaner configuration management.

## Known Issues (Important)

1. Frontend-contract mismatch for withdraw flow:
- `FrontEnd/src/pages/Withdraw.jsx` calls methods (`withdrawFunds`, `getAvailableWithdrawableAmount`, `getWithdrawals`) that are not present in current `CrowdFunding.sol`.
- Result: Withdraw page cannot work with current contract.

2. Contract deadline validation bug:
- In `createCampaign`, the `require` check validates `campaign.deadline < block.timestamp`, which references the empty storage slot and does not enforce `_deadline` being in the future.
- Replace check with `_deadline > block.timestamp`.

3. Campaign details QR verification path references undefined runtime pieces:
- The QR verification branch in `CampaignDetails.jsx` references `provider` and event assumptions that are not implemented in the current contract.

## Suggested Pre-Push Checklist

- Align blockchain network across backend and frontend.
- Redeploy contract and update address in frontend context.
- Fix contract deadline validation logic.
- Remove or implement missing withdraw contract methods.
- Verify all routes (`/`, `/create-campaign`, `/campaign-details/:id`, `/profile`, `/payment`, `/withdraw`).
- Run frontend build successfully.

## Helpful Commands

From `backend/web3`:

```bash
npm run build
npm run deploy
```

From `FrontEnd`:

```bash
npm run dev
npm run build
```

## License

See `FrontEnd/LICENSE.md`.

## Acknowledgements

- thirdweb
- Hardhat
- Vite
- React
