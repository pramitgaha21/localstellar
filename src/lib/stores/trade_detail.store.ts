import type { TradeDetails } from "backend";
import { writable } from "svelte/store";

export type TradeData = {
        trade_id: bigint,
        trade_detail: TradeDetails,
};

export const tradeData = writable<TradeData | null>(null);
