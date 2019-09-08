import { Injectable } from '@angular/core';
import { STORAGE_KEY_JWT_REFRESH_TOKEN, STORAGE_KEY_JWT, STORAGE_KEY_JWT_EXPIRES_AT, STORAGE_KEY_JWT_STATE } from 'hewi-ng-lib';
import { store } from '../shared/store/app-data';
import { Router } from '@angular/router';
import { STORAGE_KEY_CLIENT_ACCESS_TOKEN } from '../shared/model/app-model';

@Injectable({
	providedIn: 'root'
})
export class SessionService {

	constructor(private router: Router) { }

	clearSession() {
		localStorage.removeItem(STORAGE_KEY_JWT_REFRESH_TOKEN);
		localStorage.removeItem(STORAGE_KEY_JWT);
		localStorage.removeItem(STORAGE_KEY_JWT_EXPIRES_AT);
		localStorage.removeItem(STORAGE_KEY_JWT_STATE);
		// TODO: URL aufrufen, um beim AuthProvider das idToken zu invalidieren?
		store.updateAuthSignUpOutcome(false);
		store.clearUser();
		this.router.navigateByUrl('/home');
	}

	getClientAccessToken(): string {

		let at = localStorage.getItem(STORAGE_KEY_CLIENT_ACCESS_TOKEN);
		if (!at) {
			at = 'unknown - profil-app';
		}

		return at;

	}

}
