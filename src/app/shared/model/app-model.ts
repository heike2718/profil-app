export const SUFFIX_KEY_CLIENT_ACCESS_TOKEN = 'client_access_token';
export const STORAGE_KEY_CLIENT_EXPIRES_AT = 'prfl_client_token_expires_at';
export const STORAGE_KEY_CLIENT_ACCESS_TOKEN = 'prfl_client_access_token';

export interface OAuthAccessTokenPayload {
	accessToken: string;
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

export interface RefreshAccessTokenPayload {
	clientAccessToken: string[];
	userRefreshToken: string;
}

export interface JWTPayload {
	jwt: string;
	expiresAtSeconds: number;
}

export function isKnownUser(user: User): boolean {
	return user && user.email !== undefined;
}

