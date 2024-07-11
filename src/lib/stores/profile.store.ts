import type { LoggedProfile } from 'backend';
import { writable } from 'svelte/store';

export type OptionalAddress = string | null;

export const walletAddress = writable<OptionalAddress>("dummy wallet address");

export type OptionalProfile = LoggedProfile | null;

export const profile = writable<OptionalProfile>(null);
