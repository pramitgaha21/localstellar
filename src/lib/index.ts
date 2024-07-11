import { nativeToScVal } from "@stellar/stellar-sdk";
import { Client } from "backend";



export const BackendContractAddress = 'CB26UXG4TBJU3D63GXWBNKGM3AHWCZHXPMYOZ3WCHA7ZHZRNQU7TNQTU';


export const rpcUrl = 'https://soroban-testnet.stellar.org';

export const stringToSymbol = (value: string) => {
        return nativeToScVal(value, { type: "symbol" })
}

export const genClient = (publicKey: string) => {
        const backend = new Client({
                contractId: BackendContractAddress,
                rpcUrl,
                networkPassphrase: 'Test SDF Network ; September 2015',
                allowHttp: true,
                publicKey,
                errorTypes: {
                        0: { message: "Contract Uninitialized" },
                        1: { message: "Contract Alreay Initialized" },
                        2: { message: "User Alreay Registered" },
                        3: { message: "Unauthorized Access" },
                        4: { message: "User isn't Registered" },
                        5: { message: "Not Enough Balance" },
                        6: { message: "Negative Value Provided" },
                        7: { message: "Arithmetic Overflow" },
                        8: { message: "Too Many Offers" },
                        9: { message: "Unsupported Token" },
                        10: { message: "Non Existing Trade Id" },
                        11: { message: "Non Existing Offer Id" },
                        12: { message: "Non Existing Chat Index" },
                        13: { message: "Payment Already Made" },
                        14: { message: "Trade isn't in Active State" },
                        15: { message: "Dispute isn't in Active State" },
                        16: { message: "Non Existing Dispute Id" },
                        17: { message: "Invalid Decision" },
                }
        });
        return backend
}
