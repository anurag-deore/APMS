import { AuthErrorCodes } from 'firebase/auth';

export enum STATUS {
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	PENDING = 'PENDING'
}

export const firebaseAuthErrorMap: Record<string, string> = {
	[AuthErrorCodes.WEAK_PASSWORD]:
		'Password is weak. Please choose a stronger password'
};
