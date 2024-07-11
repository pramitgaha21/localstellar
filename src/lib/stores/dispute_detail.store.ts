import type { DisputeDetails } from "backend";
import { writable } from "svelte/store";

export type DisputeData = {
        dispute_id: bigint;
        dispute_detail: DisputeDetails,
}

export const disputeData = writable<DisputeData | null>(null);
