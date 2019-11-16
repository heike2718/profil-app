import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { AuthResult, ResponsePayload } from 'hewi-ng-lib';
import { store } from '../shared/store/app-data';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../error/http-error.service';
import { map, publishLast, refCount } from 'rxjs/operators';
// tslint:disable-next-line:max-line-length
import { AuthenticatedUser, STORAGE_KEY_FULL_NAME, STORAGE_KEY_SESSION_EXPIRES_AT, STORAGE_KEY_DEV_SESSION_ID } from '../shared/model/app-model';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private httpClient: HttpClient
		, private httpErrorService: HttpErrorService
		, private router: Router) { }


	logIn() {

		const url = environment.apiUrl + '/auth/login';

		this.httpClient.get(url).pipe(
			map(res => <ResponsePayload>res),
			publishLast(),
			refCount()
		).subscribe(
			payload => {
				window.location.href = payload.message.message;
			},
			(error => {
				this.httpErrorService.handleError(error, 'logIn');
			}));

	}


	createSession(authResult: AuthResult) {

		window.location.hash = '';

		if ('login' === authResult.state) {

			const url = environment.apiUrl + '/auth/session';
			store.updateBlockingIndicator(true);

			this.httpClient.post(url, authResult.idToken).pipe(
				map(res => <ResponsePayload>res),
				publishLast(),
				refCount()
			).subscribe(
				payload => {
					if (payload.data) {
						const authUser = payload.data as AuthenticatedUser;

						localStorage.setItem(STORAGE_KEY_FULL_NAME, authUser.session.fullName);
						localStorage.setItem(STORAGE_KEY_SESSION_EXPIRES_AT, JSON.stringify(authUser.session.expiresAt));

						if (authUser.session.sessionId && !environment.production) {
							localStorage.setItem(STORAGE_KEY_DEV_SESSION_ID, authUser.session.sessionId);
						}

						store.initUser(authUser.user);
						store.updateBlockingIndicator(false);
						this.router.navigateByUrl('/profil');
					}
				},
				(error => {
					this.httpErrorService.handleError(error, 'getUser');
				})
			);



		} else {
			console.log('authResult.state = ' + authResult.state);
		}

	}
}
