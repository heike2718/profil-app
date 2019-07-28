export const STORAGE_KEY_CLIENT_EXPIRES_AT = 'client_token_expires_at';
export const STORAGE_KEY_CLIENT_REFRESH_TOKEN = 'client_refresh_token';
export const STORAGE_KEY_CLIENT_ACCESS_TOKEN = 'client_access_token';

export interface OAuthAccessTokenPayload {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
}

export interface TwoPasswords {
	passwort: string;
	passwortWdh: string;
}

export interface ChangePasswordPayload {
	passwort: string;
	twoPasswords: TwoPasswords;
}

export interface ProfileDataPayload {

	loginName: string;
	email: string;
	vorname?: string;
	nachname?: string;

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

