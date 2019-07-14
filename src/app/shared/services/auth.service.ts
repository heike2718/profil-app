import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_JWT, STORAGE_KEY_EXPIRES_AT, STORAGE_KEY_AUTH_STATE, AuthResult, AUTH_STATE_EMPTY, AUTH_STATE_SIGNUP, AUTH_STATE_LOGIN, JWTService } from 'hewi-ng-lib';
import { Router } from '@angular/router';
import { store } from '../store/app-data';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private userService: UserService
		, private sessionService: SessionService
		, private jwtService: JWTService
		, private router: Router) { }


	logIn() {
		const authUrl = this.jwtService.getLoginUrl(environment.authUrl, environment.clientId, environment.loginRedirectUrl);
		window.location.href = authUrl;
	}

	setSession(authResult: AuthResult) {

		if (authResult.state && AUTH_STATE_EMPTY === authResult.state) {
			this.sessionService.clearSession();
			return;
		}

		// packen authResult ins LocalStorage, damit es ein refresh überlebt!
		if (authResult.refreshToken) {
			localStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, authResult.refreshToken);
		}
		localStorage.setItem(STORAGE_KEY_JWT, authResult.idToken);
		localStorage.setItem(STORAGE_KEY_EXPIRES_AT, JSON.stringify(authResult.expiresAt));
		localStorage.setItem(STORAGE_KEY_AUTH_STATE, authResult.state);

		if (AUTH_STATE_SIGNUP === authResult.state) {
			store.updateAuthSignUpOutcome(true);
		}
		if (AUTH_STATE_LOGIN === authResult.state) {
			this.userService.getUser();
			this.router.navigateByUrl('/profil');
		}
	}
}
