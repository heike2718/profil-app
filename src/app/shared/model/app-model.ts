export const STORAGE_KEY_FULL_NAME = 'full_name';
export const STORAGE_KEY_SESSION_EXPIRES_AT = 'session_expires_at';


export interface UserSession {
	fullName: string;
	expiresAt: number; // expiration in milliseconds after 01.01.1970
}

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
	force: boolean;
}

export interface JWTPayload {
	jwt: string;
	expiresAtSeconds: number;
}

export interface AuthenticatedUser {
	session: UserSession;
	user: User;
}

export function isKnownUser(user: User): boolean {
	return user && user.email !== undefined;
}

