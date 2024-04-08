import { writable } from 'svelte/store';
import type { AppointmentSchema, SettingsSchema } from '../app';

const appointments = writable<AppointmentSchema[]>([]);

const settingsStore = writable<SettingsSchema>({
	commentList: null,
	theme: 'default'
});

export { appointments, settingsStore };
