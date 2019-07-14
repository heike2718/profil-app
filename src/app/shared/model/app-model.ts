export interface TwoPasswords {
	passwort: string;
	passwortWdh: string;
}

export interface ChangePasswordPayload {
	passwort: string;
	twoPasswords: TwoPasswords;
}

export interface User {
	loginName?: string;
	email: string;
	vorname?: string;
	nachname?: string;
}

export function isKnownUser(user: User): boolean {
	return user && user.email !== undefined;
}

