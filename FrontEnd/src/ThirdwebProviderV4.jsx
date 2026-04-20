'use client'

import { ThirdwebProvider } from "@thirdweb-dev/react"; //Mainnet pr switch krny ky liye activeChain idhr sy change krni hy plus smart contract bhi usi chain pr deploy hoga. aur clientid bhi change ho jaye gi
import { Holesky } from "@thirdweb-dev/chains";

export default function ThirdwebProviderV4({ children }) {
    return (
        <ThirdwebProvider activeChain={Holesky} clientId={"8c1fb3a6f097fefbc089e3996564f9ff"}> 
            {children}
        </ThirdwebProvider>
    );
}