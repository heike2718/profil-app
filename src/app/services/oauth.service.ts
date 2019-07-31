import * as moment_ from 'moment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorService } from '../error/http-error.service';
import { environment } from '../../environments/environment';
import { publishLast, refCount, map } from 'rxjs/operators';
// tslint:disable-next-line:max-line-length
import { OAuthAccessTokenPayload, STORAGE_KEY_CLIENT_ACCESS_TOKEN, STORAGE_KEY_CLIENT_REFRESH_TOKEN, STORAGE_KEY_CLIENT_EXPIRES_AT, RefreshAccessTokenPayload, TokenPayload } from '../shared/model/app-model';
import { ResponsePayload, STORAGE_KEY_JWT_REFRESH_TOKEN, STORAGE_KEY_JWT, STORAGE_KEY_JWT_EXPIRES_AT, MessagesService } from 'hewi-ng-lib';
import { store } from '../shared/store/app-data';
import { Logger } from '@nsalaun/ng-logger';
import { SessionService } from './session.service';

const moment = moment_;

@Injectable({
	providedIn: 'root'
})
export class OauthService {

	constructor(private http: HttpClient
		, private httpErrorService: HttpErrorService
		, private sessionService: SessionService
		, private messagesService: MessagesService
		, private logger: Logger
	) { }

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

	refreshJWT() {

		const url = environment.apiUrl + '/token';

		const requestPayload: RefreshAccessTokenPayload = {
			clientAccessToken: localStorage.getItem(STORAGE_KEY_CLIENT_ACCESS_TOKEN),
			userRefreshToken: localStorage.getItem(STORAGE_KEY_JWT_REFRESH_TOKEN)
		};

		this.http.post(url, requestPayload).pipe(
			map(res => <ResponsePayload>res),
			publishLast(),
			refCount()
		).subscribe(
			payload => {
				const level = payload.message.level;
				if (level === 'INFO') {

					const data: TokenPayload = payload.data;

					if (data) {
						// das expiresAt sind Sekunden seit 01.01.1970
						localStorage.setItem(STORAGE_KEY_JWT, data.jwt);
						localStorage.setItem(STORAGE_KEY_JWT_EXPIRES_AT, JSON.stringify(data.jwtExpiresAtUnixEpochSeconds));
						localStorage.setItem(STORAGE_KEY_CLIENT_ACCESS_TOKEN, data.clientAccessToken);
					}
				} else {
					this.sessionService.clearSession();
					if (level === 'WARN') {
						this.messagesService.warn(payload.message.message);
					} else {
						this.messagesService.error(payload.message.message);
					}
				}

			},
			error => this.httpErrorService.handleError(error, 'refreshJWT'),
			() => this.logger.debug('refreshJWT call completed')
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
