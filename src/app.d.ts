// See https://kit.svelte.dev/docs/types#app

import type { STATUS } from '$lib/constants';
import type { Timestamp } from 'firebase/firestore';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export interface AppointmentSchema {
	token?: string;
	timestamp?: Timestamp;
	status: STATUS;
	comment?: string | null;
	type?: string;
	phone: string;
	name: string;
	address: string;
	email: string;
	purpose: string;
	id?: string;
}

export interface SettingsSchema {
	commentList: string[] | null;
	theme: string;
}

export {};
