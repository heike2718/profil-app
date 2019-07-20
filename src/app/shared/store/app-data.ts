import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/app-model';
import * as _ from 'lodash';


const initialUser: User = {
	loginName: undefined,
	email: undefined,
	vorname: undefined,
	nachname: undefined
};

@Injectable({
	providedIn: 'root'
})
export class DataStore {

	private userSubject = new BehaviorSubject<User>(initialUser);

	private authSignUpOutcomeSubject = new BehaviorSubject<boolean>(false);

	private clientAccessTokenSubject = new BehaviorSubject<string>('');

	user$: Observable<User> = this.userSubject.asObservable();

	authSignUpOutcome$: Observable<boolean> = this.authSignUpOutcomeSubject.asObservable();

	clientAccessToken$: Observable<string> = this.clientAccessTokenSubject.asObservable();


	updateAuthSignUpOutcome(success: boolean) {
		this.authSignUpOutcomeSubject.next(success);
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
