import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/app-model';
import * as _ from 'lodash';


export const initialUser: User = {
	loginName: '',
	email: '',
	vorname: '',
	nachname: ''
};

@Injectable({
	providedIn: 'root'
})
export class DataStore {

	private userSubject = new BehaviorSubject<User>(initialUser);

	private authSignUpOutcomeSubject = new BehaviorSubject<boolean>(false);

	private clientAccessTokenSubject = new BehaviorSubject<string>('');

	private loadingIndicatorSubject = new BehaviorSubject<boolean>(false);

	user$: Observable<User> = this.userSubject.asObservable();

	authSignUpOutcome$: Observable<boolean> = this.authSignUpOutcomeSubject.asObservable();

	clientAccessToken$: Observable<string> = this.clientAccessTokenSubject.asObservable();

	loadingIndicator$: Observable<boolean> = this.loadingIndicatorSubject.asObservable();


	updateAuthSignUpOutcome(success: boolean) {
		this.authSignUpOutcomeSubject.next(success);
	}

	updateLoadingIndicator(show: boolean) {
		this.loadingIndicatorSubject.next(show);
	}

	initUser(user: User): void {
		this.userSubject.next(_.cloneDeep(user));
	}

	clearUser(): void {
		this.userSubject.next(initialUser);
	}
	updateClientAccessToken(token: string) {
		this.clientAccessTokenSubject.next(token);
	}
}

export const store = new DataStore();
