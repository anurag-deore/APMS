import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

interface AuthUser {
	user: User | null;
	isAuthenticated: boolean;
}

const authUser = writable<AuthUser>(undefined);

export { authUser };
