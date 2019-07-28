import * as moment_ from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../error/http-error.service';
import { environment } from '../../environments/environment';
import { publishLast, refCount } from 'rxjs/operators';
// tslint:disable-next-line:max-line-length
import { OAuthAccessTokenPayload, STORAGE_KEY_CLIENT_ACCESS_TOKEN, STORAGE_KEY_CLIENT_REFRESH_TOKEN, STORAGE_KEY_CLIENT_EXPIRES_AT } from '../shared/model/app-model';
import { ResponsePayload } from 'hewi-ng-lib';
import { store } from '../shared/store/app-data';

const moment = moment_;

@Injectable({
	providedIn: 'root'
})
export class OauthService {

	constructor(private http: HttpClient, private httpErrorService: HttpErrorService) { }

	orderAccessToken() {

		const url = environment.apiUrl + '/accesstoken';

		this.http.get<ResponsePayload>(url).pipe(
			publishLast(),
			refCount()
		).subscribe(
			(respPayload: ResponsePayload) => {
				const tokenPayload = respPayload.data as OAuthAccessTokenPayload;
				this.storeClientToken(tokenPayload);
			},
			error => this.httpErrorService.handleError(error, 'getClient')
		);

	}

	private storeClientToken(token: OAuthAccessTokenPayload) {
		localStorage.setItem(STORAGE_KEY_CLIENT_ACCESS_TOKEN, token.accessToken);
		localStorage.setItem(STORAGE_KEY_CLIENT_REFRESH_TOKEN, token.refreshToken);
		localStorage.setItem(STORAGE_KEY_CLIENT_EXPIRES_AT, JSON.stringify(token.expiresAt));
		store.updateClientAccessToken(token.accessToken);
	}

	clientTokenExpired(): boolean {

		// client_token_expires_at ist in Millisekunden seit 01.01.1970
		const expiration = this.getExpirationAsMoment();
		if (expiration === null) {
			return true;
		}
		const expired = moment().isAfter(expiration);
		return expired;
	}

	private getExpirationAsMoment() {
		if (!localStorage.getItem(STORAGE_KEY_CLIENT_EXPIRES_AT)) {
			return null;
		}
		const expiration = localStorage.getItem(STORAGE_KEY_CLIENT_EXPIRES_AT);
		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	}
}
