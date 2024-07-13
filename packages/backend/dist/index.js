import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CB26UXG4TBJU3D63GXWBNKGM3AHWCZHXPMYOZ3WCHA7ZHZRNQU7TNQTU",
    }
};
export const Errors = {
    0: { message: "" },
    1: { message: "" },
    2: { message: "" },
    3: { message: "" },
    4: { message: "" },
    5: { message: "" },
    6: { message: "" },
    7: { message: "" },
    8: { message: "" },
    9: { message: "" },
    10: { message: "" },
    11: { message: "" },
    12: { message: "" },
    13: { message: "" },
    14: { message: "" },
    15: { message: "" },
    16: { message: "" },
    17: { message: "" }
};
export var Decision;
(function (Decision) {
    Decision[Decision["ReleaseToBuyer"] = 0] = "ReleaseToBuyer";
    Decision[Decision["ReleaseToSeller"] = 1] = "ReleaseToSeller";
})(Decision || (Decision = {}));
export class Client extends ContractClient {
    options;
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAADEJhY2tlbmRFcnJvcgAAABIAAAAAAAAADVVuaW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEFVzZXJBbHJlYWR5RXhpc3QAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAA9Ob25FeGlzdGluZ1VzZXIAAAAABAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAUAAAAAAAAAE05lZ2F0aXZlQW1vdW50Rm91bmQAAAAABgAAAAAAAAASQXJpdGhtZXRpY092ZXJmbG93AAAAAAAHAAAAAAAAAA1Ub29NYW55T2ZmZXJzAAAAAAAACAAAAAAAAAAQVW5zdXBwb3J0ZWRUb2tlbgAAAAkAAAAAAAAAEk5vbkV4aXN0aW5nVHJhZGVJZAAAAAAACgAAAAAAAAASTm9uRXhpc3RpbmdPZmZlcklkAAAAAAALAAAAAAAAABROb25FeGlzdGluZ0NoYXRJbmRleAAAAAwAAAAAAAAAEkFscmVhZHlNYWRlUGF5bWVudAAAAAAADQAAAAAAAAAOVHJhZGVOb3RBY3RpdmUAAAAAAA4AAAAAAAAAD0Rpc3B1dGVJbmFjdGl2ZQAAAAAPAAAAAAAAABROb25FeGlzdGluZ0Rpc3B1dGVJZAAAABAAAAAAAAAAD0ludmFsaWREZWNpc2lvbgAAAAAR",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAApjb21taXNzaW9uAAAAAAAFAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAAMY2hhbmdlX2FkbWluAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAluZXdfYWRtaW4AAAAAAAATAAAAAQAAA+kAAAATAAAH0AAAAAxCYWNrZW5kRXJyb3I=",
            "AAAAAAAAAAAAAAAVY2hhbmdlX2NvbW1pc3Npb25fZmVlAAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAduZXdfZmVlAAAAAAUAAAABAAAD6QAAAAUAAAfQAAAADEJhY2tlbmRFcnJvcg==",
            "AAAAAAAAAAAAAAAJYWRkX3Rva2VuAAAAAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAZ0b2tlbnMAAAAAA+oAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAAMcmVtb3ZlX3Rva2VuAAAAAgAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAAAAAAZ0b2tlbnMAAAAAA+oAAAATAAAAAQAAA+kAAAPtAAAAAAAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAAIcmVnaXN0ZXIAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAIdXNlcm5hbWUAAAARAAAAAQAAA+kAAAfQAAAADUxvZ2dlZFByb2ZpbGUAAAAAAAfQAAAADEJhY2tlbmRFcnJvcg==",
            "AAAAAAAAAAAAAAAFbG9naW4AAAAAAAABAAAAAAAAAARhZGRyAAAAEwAAAAEAAAPpAAAH0AAAAA1Mb2dnZWRQcm9maWxlAAAAAAAH0AAAAAxCYWNrZW5kRXJyb3I=",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAADAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAB9AAAAANQmFsYW5jZURldGFpbAAAAAAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAADAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAABAAAD6QAAB9AAAAANQmFsYW5jZURldGFpbAAAAAAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAAKb2ZmZXJfbGlzdAAAAAAAAAAAAAEAAAPsAAAADAAAB9AAAAALT2ZmZXJEZXRhaWwA",
            "AAAAAAAAAAAAAAANbXlfb2ZmZXJfbGlzdAAAAAAAAAEAAAAAAAAABGFkZHIAAAATAAAAAQAAA+kAAAPsAAAADAAAB9AAAAALT2ZmZXJEZXRhaWwAAAAH0AAAAAxCYWNrZW5kRXJyb3I=",
            "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",
            "AAAAAAAAAAAAAAAUcmVhZF9kaXNwdXRlX21lc3NhZ2UAAAACAAAAAAAAAApkaXNwdXRlX2lkAAAAAAAKAAAAAAAAAAZtc2dfaWQAAAAAAAQAAAABAAAD6QAAB9AAAAAPVHJhZGVDaGF0RGV0YWlsAAAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAASc2VuZF90cmFkZV9tZXNzYWdlAAAAAAADAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAIdHJhZGVfaWQAAAAMAAAAAAAAAANtc2cAAAAAEAAAAAEAAAPpAAAH0AAAAAxUcmFkZURldGFpbHMAAAfQAAAADEJhY2tlbmRFcnJvcg==",
            "AAAAAAAAAAAAAAATcmVhZF90cmFkZV9tZXNzYWdlcwAAAAABAAAAAAAAAAh0cmFkZV9pZAAAAAwAAAABAAAD6QAAA+oAAAfQAAAAD1RyYWRlQ2hhdERldGFpbAAAAAfQAAAADEJhY2tlbmRFcnJvcg==",
            "AAAAAAAAAAAAAAAScmVhZF90cmFkZV9tZXNzYWdlAAAAAAACAAAAAAAAAAh0cmFkZV9pZAAAAAwAAAAAAAAABm1zZ19pZAAAAAAABAAAAAEAAAPpAAAH0AAAAA9UcmFkZUNoYXREZXRhaWwAAAAH0AAAAAxCYWNrZW5kRXJyb3I=",
            "AAAAAAAAAAAAAAAUbm90aWZ5X2Fib3V0X3BheW1lbnQAAAACAAAAAAAAAARhZGRyAAAAEwAAAAAAAAAIdHJhZGVfaWQAAAAMAAAAAQAAA+kAAAfQAAAADFRyYWRlRGV0YWlscwAAB9AAAAAMQmFja2VuZEVycm9y",
            "AAAAAAAAAAAAAAAPY29uZmlybV9wYXltZW50AAAAAAIAAAAAAAAABGFkZHIAAAATAAAAAAAAAAh0cmFkZV9pZAAAAAwAAAABAAAD6QAAB9AAAAAMVHJhZGVEZXRhaWxzAAAH0AAAAAxCYWNrZW5kRXJyb3I=",
            "AAAAAQAAAAAAAAAAAAAACkJhbGFuY2VLZXkAAAAAAAIAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAMdXNlcl9hZGRyZXNzAAAAEw==",
            "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"]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        change_admin: (this.txFromJSON),
        change_commission_fee: (this.txFromJSON),
        add_token: (this.txFromJSON),
        remove_token: (this.txFromJSON),
        register: (this.txFromJSON),
        login: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        deposit: (this.txFromJSON),
        offer_list: (this.txFromJSON),
        my_offer_list: (this.txFromJSON),
        create_offer: (this.txFromJSON),
        get_dispute_detail: (this.txFromJSON),
        get_trade_details: (this.txFromJSON),
        my_active_trade_list: (this.txFromJSON),
        my_past_trade_list: (this.txFromJSON),
        place_order: (this.txFromJSON),
        close_trade: (this.txFromJSON),
        dispute_list: (this.txFromJSON),
        raise_dispute: (this.txFromJSON),
        decision_on_claim: (this.txFromJSON),
        mod_decision_on_dispute: (this.txFromJSON),
        send_dispute_message: (this.txFromJSON),
        read_dispute_messages: (this.txFromJSON),
        read_dispute_message: (this.txFromJSON),
        send_trade_message: (this.txFromJSON),
        read_trade_messages: (this.txFromJSON),
        read_trade_message: (this.txFromJSON),
        notify_about_payment: (this.txFromJSON),
        confirm_payment: (this.txFromJSON)
    };
}