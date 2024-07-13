import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, Result } from '@stellar/stellar-sdk/contract';
import type { u32, i32, u64, u128, i128, u256, Option } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CB26UXG4TBJU3D63GXWBNKGM3AHWCZHXPMYOZ3WCHA7ZHZRNQU7TNQTU";
    };
};
export declare const Errors: {
    0: {
        message: string;
    };
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
    7: {
        message: string;
    };
    8: {
        message: string;
    };
    9: {
        message: string;
    };
    10: {
        message: string;
    };
    11: {
        message: string;
    };
    12: {
        message: string;
    };
    13: {
        message: string;
    };
    14: {
        message: string;
    };
    15: {
        message: string;
    };
    16: {
        message: string;
    };
    17: {
        message: string;
    };
};
export interface BalanceKey {
    token: string;
    user_address: string;
}
export interface BalanceDetail {
    freezed_balance: i128;
    locked_balance: i128;
    total_balance: i128;
}
export type UserStatus = {
    tag: "Blacklisted";
    values: void;
} | {
    tag: "Whitelisted";
    values: void;
};
export interface UserDetail {
    no_of_successful_trades: u128;
    no_of_unsuccessful_trades: u128;
    ongoing_offers: Array<u256>;
    ongoing_trades: Array<u256>;
    past_trades: Map<u256, void>;
    registered_at: u64;
    status: UserStatus;
    username: string;
}
export interface LoggedProfile {
    balance: Map<string, BalanceDetail>;
    no_of_successful_trades: u128;
    no_of_unsuccessful_trades: u128;
    ongoing_offers: Array<u256>;
    ongoing_trades: Array<u256>;
    past_trades: Array<u256>;
    registered_at: u64;
    status: UserStatus;
    username: string;
}
export type OfferType = {
    tag: "Buy";
    values: void;
} | {
    tag: "Sell";
    values: void;
};
export interface OfferDetail {
    accepted_payment_methods: Array<string>;
    currency: string;
    offer_by: readonly [string, string];
    offer_id: u256;
    offer_type: OfferType;
    rate: u32;
    terms: string;
    time_limit: u32;
    token: string;
    total_tradeable_amount: i128;
    trade_limit: readonly [i128, i128];
}
export type TradeStatus = {
    tag: "Ongoing";
    values: void;
} | {
    tag: "InDispute";
    values: void;
} | {
    tag: "Cancelled";
    values: void;
} | {
    tag: "Ended";
    values: void;
};
export interface TradeDetails {
    bounded_offer_id: u256;
    buyer: readonly [string, string];
    buyer_marked_paid_at: Option<u64>;
    currency: string;
    dispute_id: Option<u128>;
    msg_count: u32;
    rate: u32;
    seller: readonly [string, string];
    seller_released_at: Option<u64>;
    status: TradeStatus;
    token: string;
    total_amount: i128;
    total_amount_to_be_paid: u128;
    trade_started_at: u64;
}
export interface TradeChatKey {
    msg_id: u32;
    trade_id: u256;
}
export interface TradeChatDetail {
    at: u64;
    by: string;
    message: string;
}
export type DisputeStatus = {
    tag: "Ongoing";
    values: void;
} | {
    tag: "WaitingApproval";
    values: void;
} | {
    tag: "Rejected";
    values: void;
} | {
    tag: "Closed";
    values: void;
};
export declare enum Decision {
    ReleaseToBuyer = 0,
    ReleaseToSeller = 1
}
export interface DisputeDetails {
    bounded_trade_id: u256;
    created_at: u64;
    decision: Option<u32>;
    dispute_started_by: string;
    dispute_status: DisputeStatus;
    ended_at: Option<u64>;
    is_claim_approved: Option<boolean>;
    msg_count: u32;
    other_party: string;
}
export interface DisputeChatKey {
    dispute_id: u128;
    msg_id: u32;
}
export type StorageKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Commission";
    values: void;
} | {
    tag: "Moderators";
    values: void;
} | {
    tag: "AllowedTokens";
    values: void;
} | {
    tag: "User";
    values: readonly [string];
} | {
    tag: "Balance";
    values: readonly [BalanceKey];
} | {
    tag: "Offer";
    values: readonly [u256];
} | {
    tag: "Trade";
    values: readonly [u256];
} | {
    tag: "Dispute";
    values: readonly [u128];
} | {
    tag: "TradeChats";
    values: readonly [TradeChatKey];
} | {
    tag: "DipsuteChats";
    values: readonly [DisputeChatKey];
} | {
    tag: "TradeCount";
    values: void;
} | {
    tag: "OfferCount";
    values: void;
} | {
    tag: "DisputeCount";
    values: void;
};
export interface Client {
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: ({ caller, commission }: {
        caller: string;
        commission: i32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a change_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    change_admin: ({ caller, new_admin }: {
        caller: string;
        new_admin: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<string>>>;
    /**
     * Construct and simulate a change_commission_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    change_commission_fee: ({ caller, new_fee }: {
        caller: string;
        new_fee: i32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<i32>>>;
    /**
     * Construct and simulate a add_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    add_token: ({ caller, tokens }: {
        caller: string;
        tokens: Array<string>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a remove_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    remove_token: ({ caller, tokens }: {
        caller: string;
        tokens: Array<string>;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    register: ({ addr, username }: {
        addr: string;
        username: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<LoggedProfile>>>;
    /**
     * Construct and simulate a login transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    login: ({ addr }: {
        addr: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<LoggedProfile>>>;
    /**
     * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    withdraw: ({ addr, token, amount }: {
        addr: string;
        token: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<BalanceDetail>>>;
    /**
     * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    deposit: ({ addr, token, amount }: {
        addr: string;
        token: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<BalanceDetail>>>;
    /**
     * Construct and simulate a offer_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    offer_list: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Map<u256, OfferDetail>>>;
    /**
     * Construct and simulate a my_offer_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    my_offer_list: ({ addr }: {
        addr: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<Map<u256, OfferDetail>>>>;
    /**
     * Construct and simulate a create_offer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    create_offer: ({ addr, offer_type, currency, token, total_amount, rate, trade_limit, time_limit, payment_methods, terms }: {
        addr: string;
        offer_type: OfferType;
        currency: string;
        token: string;
        total_amount: i128;
        rate: u32;
        trade_limit: readonly [i128, i128];
        time_limit: u32;
        payment_methods: Array<string>;
        terms: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<OfferDetail>>>;
    /**
     * Construct and simulate a get_dispute_detail transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_dispute_detail: ({ addr, id }: {
        addr: string;
        id: u128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<DisputeDetails>>>;
    /**
     * Construct and simulate a get_trade_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_trade_details: ({ addr, trade_id }: {
        addr: string;
        trade_id: u256;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeDetails>>>;
    /**
     * Construct and simulate a my_active_trade_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    my_active_trade_list: ({ addr }: {
        addr: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<Map<u256, TradeDetails>>>>;
    /**
     * Construct and simulate a my_past_trade_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    my_past_trade_list: ({ addr }: {
        addr: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<Map<u256, TradeDetails>>>>;
    /**
     * Construct and simulate a place_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    place_order: ({ addr, offer_id, amount }: {
        addr: string;
        offer_id: u256;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeDetails>>>;
    /**
     * Construct and simulate a close_trade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    close_trade: ({ addr, trade_id }: {
        addr: string;
        trade_id: u256;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeDetails>>>;
    /**
     * Construct and simulate a dispute_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    dispute_list: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Map<u128, DisputeDetails>>>;
    /**
     * Construct and simulate a raise_dispute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    raise_dispute: ({ addr, trade_id }: {
        addr: string;
        trade_id: u256;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<DisputeDetails>>>;
    /**
     * Construct and simulate a decision_on_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    decision_on_claim: ({ addr, dispute_id, approval }: {
        addr: string;
        dispute_id: u128;
        approval: boolean;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<DisputeDetails>>>;
    /**
     * Construct and simulate a mod_decision_on_dispute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    mod_decision_on_dispute: ({ addr, dispute_id, decision }: {
        addr: string;
        dispute_id: u128;
        decision: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<DisputeDetails>>>;
    /**
     * Construct and simulate a send_dispute_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    send_dispute_message: ({ addr, dispute_id, msg }: {
        addr: string;
        dispute_id: u128;
        msg: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<DisputeDetails>>>;
    /**
     * Construct and simulate a read_dispute_messages transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    read_dispute_messages: ({ dispute_id }: {
        dispute_id: u128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<Array<TradeChatDetail>>>>;
    /**
     * Construct and simulate a read_dispute_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    read_dispute_message: ({ dispute_id, msg_id }: {
        dispute_id: u128;
        msg_id: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeChatDetail>>>;
    /**
     * Construct and simulate a send_trade_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    send_trade_message: ({ addr, trade_id, msg }: {
        addr: string;
        trade_id: u256;
        msg: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeDetails>>>;
    /**
     * Construct and simulate a read_trade_messages transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    read_trade_messages: ({ trade_id }: {
        trade_id: u256;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<Array<TradeChatDetail>>>>;
    /**
     * Construct and simulate a read_trade_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    read_trade_message: ({ trade_id, msg_id }: {
        trade_id: u256;
        msg_id: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeChatDetail>>>;
    /**
     * Construct and simulate a notify_about_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    notify_about_payment: ({ addr, trade_id }: {
        addr: string;
        trade_id: u256;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeDetails>>>;
    /**
     * Construct and simulate a confirm_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    confirm_payment: ({ addr, trade_id }: {
        addr: string;
        trade_id: u256;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<Result<TradeDetails>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        initialize: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        change_admin: (json: string) => AssembledTransaction<Result<string, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        change_commission_fee: (json: string) => AssembledTransaction<Result<number, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        add_token: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        remove_token: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        register: (json: string) => AssembledTransaction<Result<LoggedProfile, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        login: (json: string) => AssembledTransaction<Result<LoggedProfile, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        withdraw: (json: string) => AssembledTransaction<Result<BalanceDetail, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        deposit: (json: string) => AssembledTransaction<Result<BalanceDetail, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        offer_list: (json: string) => AssembledTransaction<Map<bigint, OfferDetail>>;
        my_offer_list: (json: string) => AssembledTransaction<Result<Map<bigint, OfferDetail>, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        create_offer: (json: string) => AssembledTransaction<Result<OfferDetail, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        get_dispute_detail: (json: string) => AssembledTransaction<Result<DisputeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        get_trade_details: (json: string) => AssembledTransaction<Result<TradeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        my_active_trade_list: (json: string) => AssembledTransaction<Result<Map<bigint, TradeDetails>, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        my_past_trade_list: (json: string) => AssembledTransaction<Result<Map<bigint, TradeDetails>, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        place_order: (json: string) => AssembledTransaction<Result<TradeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        close_trade: (json: string) => AssembledTransaction<Result<TradeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        dispute_list: (json: string) => AssembledTransaction<Map<bigint, DisputeDetails>>;
        raise_dispute: (json: string) => AssembledTransaction<Result<DisputeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        decision_on_claim: (json: string) => AssembledTransaction<Result<DisputeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        mod_decision_on_dispute: (json: string) => AssembledTransaction<Result<DisputeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        send_dispute_message: (json: string) => AssembledTransaction<Result<DisputeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        read_dispute_messages: (json: string) => AssembledTransaction<Result<TradeChatDetail[], import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        read_dispute_message: (json: string) => AssembledTransaction<Result<TradeChatDetail, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        send_trade_message: (json: string) => AssembledTransaction<Result<TradeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        read_trade_messages: (json: string) => AssembledTransaction<Result<TradeChatDetail[], import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        read_trade_message: (json: string) => AssembledTransaction<Result<TradeChatDetail, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        notify_about_payment: (json: string) => AssembledTransaction<Result<TradeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        confirm_payment: (json: string) => AssembledTransaction<Result<TradeDetails, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
    };
}
