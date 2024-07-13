import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CB26UXG4TBJU3D63GXWBNKGM3AHWCZHXPMYOZ3WCHA7ZHZRNQU7TNQTU",
  }
} as const

export const Errors = {
  0: {message:""},
  1: {message:""},
  2: {message:""},
  3: {message:""},
  4: {message:""},
  5: {message:""},
  6: {message:""},
  7: {message:""},
  8: {message:""},
  9: {message:""},
  10: {message:""},
  11: {message:""},
  12: {message:""},
  13: {message:""},
  14: {message:""},
  15: {message:""},
  16: {message:""},
  17: {message:""}
}

export interface BalanceKey {
  token: string;
  user_address: string;
}


export interface BalanceDetail {
  freezed_balance: i128;
  locked_balance: i128;
  total_balance: i128;
}

export type UserStatus = {tag: "Blacklisted", values: void} | {tag: "Whitelisted", values: void};


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

export type OfferType = {tag: "Buy", values: void} | {tag: "Sell", values: void};


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

export type TradeStatus = {tag: "Ongoing", values: void} | {tag: "InDispute", values: void} | {tag: "Cancelled", values: void} | {tag: "Ended", values: void};


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

export type DisputeStatus = {tag: "Ongoing", values: void} | {tag: "WaitingApproval", values: void} | {tag: "Rejected", values: void} | {tag: "Closed", values: void};

export enum Decision {
  ReleaseToBuyer = 0,
  ReleaseToSeller = 1,
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

export type StorageKey = {tag: "Admin", values: void} | {tag: "Commission", values: void} | {tag: "Moderators", values: void} | {tag: "AllowedTokens", values: void} | {tag: "User", values: readonly [string]} | {tag: "Balance", values: readonly [BalanceKey]} | {tag: "Offer", values: readonly [u256]} | {tag: "Trade", values: readonly [u256]} | {tag: "Dispute", values: readonly [u128]} | {tag: "TradeChats", values: readonly [TradeChatKey]} | {tag: "DipsuteChats", values: readonly [DisputeChatKey]} | {tag: "TradeCount", values: void} | {tag: "OfferCount", values: void} | {tag: "DisputeCount", values: void};


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({caller, commission}: {caller: string, commission: i32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a change_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  change_admin: ({caller, new_admin}: {caller: string, new_admin: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a change_commission_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  change_commission_fee: ({caller, new_fee}: {caller: string, new_fee: i32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<i32>>>

  /**
   * Construct and simulate a add_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_token: ({caller, tokens}: {caller: string, tokens: Array<string>}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a remove_token transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  remove_token: ({caller, tokens}: {caller: string, tokens: Array<string>}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a register transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  register: ({addr, username}: {addr: string, username: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<LoggedProfile>>>

  /**
   * Construct and simulate a login transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  login: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<LoggedProfile>>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({addr, token, amount}: {addr: string, token: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<BalanceDetail>>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({addr, token, amount}: {addr: string, token: string, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<BalanceDetail>>>

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
  }) => Promise<AssembledTransaction<Map<u256, OfferDetail>>>

  /**
   * Construct and simulate a my_offer_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  my_offer_list: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<Map<u256, OfferDetail>>>>

  /**
   * Construct and simulate a create_offer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_offer: ({addr, offer_type, currency, token, total_amount, rate, trade_limit, time_limit, payment_methods, terms}: {addr: string, offer_type: OfferType, currency: string, token: string, total_amount: i128, rate: u32, trade_limit: readonly [i128, i128], time_limit: u32, payment_methods: Array<string>, terms: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<OfferDetail>>>

  /**
   * Construct and simulate a get_dispute_detail transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_dispute_detail: ({addr, id}: {addr: string, id: u128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<DisputeDetails>>>

  /**
   * Construct and simulate a get_trade_details transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_trade_details: ({addr, trade_id}: {addr: string, trade_id: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeDetails>>>

  /**
   * Construct and simulate a my_active_trade_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  my_active_trade_list: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<Map<u256, TradeDetails>>>>

  /**
   * Construct and simulate a my_past_trade_list transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  my_past_trade_list: ({addr}: {addr: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<Map<u256, TradeDetails>>>>

  /**
   * Construct and simulate a place_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  place_order: ({addr, offer_id, amount}: {addr: string, offer_id: u256, amount: i128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeDetails>>>

  /**
   * Construct and simulate a close_trade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_trade: ({addr, trade_id}: {addr: string, trade_id: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeDetails>>>

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
  }) => Promise<AssembledTransaction<Map<u128, DisputeDetails>>>

  /**
   * Construct and simulate a raise_dispute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  raise_dispute: ({addr, trade_id}: {addr: string, trade_id: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<DisputeDetails>>>

  /**
   * Construct and simulate a decision_on_claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decision_on_claim: ({addr, dispute_id, approval}: {addr: string, dispute_id: u128, approval: boolean}, options?: {
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
  }) => Promise<AssembledTransaction<Result<DisputeDetails>>>

  /**
   * Construct and simulate a mod_decision_on_dispute transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mod_decision_on_dispute: ({addr, dispute_id, decision}: {addr: string, dispute_id: u128, decision: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<DisputeDetails>>>

  /**
   * Construct and simulate a send_dispute_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  send_dispute_message: ({addr, dispute_id, msg}: {addr: string, dispute_id: u128, msg: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<DisputeDetails>>>

  /**
   * Construct and simulate a read_dispute_messages transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  read_dispute_messages: ({dispute_id}: {dispute_id: u128}, options?: {
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
  }) => Promise<AssembledTransaction<Result<Array<TradeChatDetail>>>>

  /**
   * Construct and simulate a read_dispute_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  read_dispute_message: ({dispute_id, msg_id}: {dispute_id: u128, msg_id: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeChatDetail>>>

  /**
   * Construct and simulate a send_trade_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  send_trade_message: ({addr, trade_id, msg}: {addr: string, trade_id: u256, msg: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeDetails>>>

  /**
   * Construct and simulate a read_trade_messages transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  read_trade_messages: ({trade_id}: {trade_id: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<Array<TradeChatDetail>>>>

  /**
   * Construct and simulate a read_trade_message transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  read_trade_message: ({trade_id, msg_id}: {trade_id: u256, msg_id: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeChatDetail>>>

  /**
   * Construct and simulate a notify_about_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  notify_about_payment: ({addr, trade_id}: {addr: string, trade_id: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeDetails>>>

  /**
   * Construct and simulate a confirm_payment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  confirm_payment: ({addr, trade_id}: {addr: string, trade_id: u256}, options?: {
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
  }) => Promise<AssembledTransaction<Result<TradeDetails>>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAADEJhY2tlbmRFcnJvcgAAABIAAAAAAAAADVVuaW5pdGlhbGl6ZWQAAAAAAAAAAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAAEFVzZXJBbHJlYWR5RXhpc3QAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAA9Ob25FeGlzdGluZ1VzZXIAAAAABAAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAUAAAAAAAAAE05lZ2F0aXZlQW1vdW50Rm91bmQAAAAABgAAAAAAAAASQXJpdGhtZXRpY092ZXJmbG93AAAAAAAHAAAAAAAAAA1Ub29NYW55T2ZmZXJzAAAAAAAACAAAAAAAAAAQVW5zdXBwb3J0ZWRUb2tlbgAAAAkAAAAAAAAAEk5vbkV4aXN0aW5nVHJhZGVJZAAAAAAACgAAAAAAAAASTm9uRXhpc3RpbmdPZmZlcklkAAAAAAALAAAAAAAAABROb25FeGlzdGluZ0NoYXRJbmRleAAAAAwAAAAAAAAAEkFscmVhZHlNYWRlUGF5bWVudAAAAAAADQAAAAAAAAAOVHJhZGVOb3RBY3RpdmUAAAAAAA4AAAAAAAAAD0Rpc3B1dGVJbmFjdGl2ZQAAAAAPAAAAAAAAABROb25FeGlzdGluZ0Rpc3B1dGVJZAAAABAAAAAAAAAAD0ludmFsaWREZWNpc2lvbgAAAAAR",
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
        "AAAAAQAAAAAAAAAAAAAADUJhbGFuY2VEZXRhaWwAAAAAAAADAAAAAAAAAA9mcmVlemVkX2JhbGFuY2UAAAAACwAAAAAAAAAObG9ja2VkX2JhbGFuY2UAAAAAAAsAAAAAAAAADXRvdGFsX2JhbGFuY2UAAAAAAAAL",
        "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" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
        change_admin: this.txFromJSON<Result<string>>,
        change_commission_fee: this.txFromJSON<Result<i32>>,
        add_token: this.txFromJSON<Result<void>>,
        remove_token: this.txFromJSON<Result<void>>,
        register: this.txFromJSON<Result<LoggedProfile>>,
        login: this.txFromJSON<Result<LoggedProfile>>,
        withdraw: this.txFromJSON<Result<BalanceDetail>>,
        deposit: this.txFromJSON<Result<BalanceDetail>>,
        offer_list: this.txFromJSON<Map<u256, OfferDetail>>,
        my_offer_list: this.txFromJSON<Result<Map<u256, OfferDetail>>>,
        create_offer: this.txFromJSON<Result<OfferDetail>>,
        get_dispute_detail: this.txFromJSON<Result<DisputeDetails>>,
        get_trade_details: this.txFromJSON<Result<TradeDetails>>,
        my_active_trade_list: this.txFromJSON<Result<Map<u256, TradeDetails>>>,
        my_past_trade_list: this.txFromJSON<Result<Map<u256, TradeDetails>>>,
        place_order: this.txFromJSON<Result<TradeDetails>>,
        close_trade: this.txFromJSON<Result<TradeDetails>>,
        dispute_list: this.txFromJSON<Map<u128, DisputeDetails>>,
        raise_dispute: this.txFromJSON<Result<DisputeDetails>>,
        decision_on_claim: this.txFromJSON<Result<DisputeDetails>>,
        mod_decision_on_dispute: this.txFromJSON<Result<DisputeDetails>>,
        send_dispute_message: this.txFromJSON<Result<DisputeDetails>>,
        read_dispute_messages: this.txFromJSON<Result<Array<TradeChatDetail>>>,
        read_dispute_message: this.txFromJSON<Result<TradeChatDetail>>,
        send_trade_message: this.txFromJSON<Result<TradeDetails>>,
        read_trade_messages: this.txFromJSON<Result<Array<TradeChatDetail>>>,
        read_trade_message: this.txFromJSON<Result<TradeChatDetail>>,
        notify_about_payment: this.txFromJSON<Result<TradeDetails>>,
        confirm_payment: this.txFromJSON<Result<TradeDetails>>
  }
}