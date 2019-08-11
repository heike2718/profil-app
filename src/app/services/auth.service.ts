import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { STORAGE_KEY_JWT_REFRESH_TOKEN, STORAGE_KEY_JWT, STORAGE_KEY_JWT_EXPIRES_AT, STORAGE_KEY_JWT_STATE, AuthResult, JWTService } from 'hewi-ng-lib';
import { Router } from '@angular/router';
import { store } from '../shared/store/app-data';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import { STORAGE_KEY_CLIENT_ACCESS_TOKEN } from '../shared/model/app-model';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private userService: UserService
		, private jwtService: JWTService
		, private router: Router) { }


	logIn() {

		const accessToken = localStorage.getItem(STORAGE_KEY_CLIENT_ACCESS_TOKEN);
		if (accessToken) {
			const authUrl = this.jwtService.getLoginUrl(environment.authUrl, accessToken, environment.loginRedirectUrl, 'login', null);
			window.location.href = authUrl;

		}

	}

	setSession(authResult: AuthResult) {

		window.location.hash = '';

		// packen authResult ins LocalStorage, damit es ein refresh überlebt!
		if (authResult.refreshToken) {
			localStorage.setItem(STORAGE_KEY_JWT_REFRESH_TOKEN, authResult.refreshToken);
			localStorage.setItem(STORAGE_KEY_JWT, authResult.idToken);
			localStorage.setItem(STORAGE_KEY_JWT_EXPIRES_AT, JSON.stringify(authResult.expiresAt));
			localStorage.setItem(STORAGE_KEY_JWT_STATE, authResult.state);
		}


		if ('signup' === authResult.state) {
			store.updateAuthSignUpOutcome(true);
			// TODO: Benutzerkonto anlegen
		}
		if ('login' === authResult.state) {
			this.userService.loadUser();
		} else {
			console.log('authResult.state = ' + authResult.state);
		}

	}
}
