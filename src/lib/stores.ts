import { writable, type Writable } from 'svelte/store';

export const lastError: Writable<object | null> = writable(null);