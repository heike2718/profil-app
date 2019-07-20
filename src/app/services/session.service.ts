import { Injectable } from '@angular/core';
import { STORAGE_KEY_JWT_REFRESH_TOKEN, STORAGE_KEY_JWT, STORAGE_KEY_JWT_EXPIRES_AT, STORAGE_KEY_JWT_STATE } from 'hewi-ng-lib';
import { store } from '../shared/store/app-data';
import { Router } from '@angular/router';

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


}
