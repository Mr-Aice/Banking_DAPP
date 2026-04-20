'use client'

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Holesky } from "@thirdweb-dev/chains";

export default function ThirdwebProviderV4({ children }) {
    return (
        <ThirdwebProvider activeChain={Holesky} clientId={"8c1fb3a6f097fefbc089e3996564f9ff"}>
            {children}
        </ThirdwebProvider>
    );
}