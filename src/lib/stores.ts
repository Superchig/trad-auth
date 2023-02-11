// FIXME(Chris): Break this up into individual files

import { writable, type Writable } from 'svelte/store';

export const lastError: Writable<object | null> = writable(null);