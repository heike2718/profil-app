import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, publishLast, refCount } from 'rxjs/operators';
import { store } from '../shared/store/app-data';
import { ResponsePayload, MessagesService, Message } from 'hewi-ng-lib';
import { HttpErrorService } from '../error/http-error.service';
import { environment } from '../../environments/environment';
import { User, ChangePasswordPayload, ProfileDataPayload } from '../shared/model/app-model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private http: HttpClient
		, private httpErrorService: HttpErrorService
		, private messagesService: MessagesService) { }


	loadUser(): void {

		const url = environment.apiUrl + '/profiles/profile';

		this.http.get(url).pipe(
			map(res => <ResponsePayload>res),
			publishLast(),
			refCount()
		).subscribe(
			payload => {
				if (payload.data) {
					const user = payload.data as User;
					store.initUser(user);
				}
			},
			(error => {
				this.httpErrorService.handleError(error, 'getUser');
			})
		);
	}

	changePassword(changePasswordPayload: ChangePasswordPayload): Observable<ResponsePayload> {

		const url = environment.apiUrl + '/profiles/profile/password';

		return this.http.put(url, changePasswordPayload).pipe(
			map(res => <ResponsePayload>res),
			publishLast(),
			refCount()
		);
	}

	changeProfileData(profileDataPayload: ProfileDataPayload): void {

		const url = environment.apiUrl + '/profiles/profile/data';

		this.http.put(url, profileDataPayload).pipe(
			map(res => <ResponsePayload>res),
			publishLast(),
			refCount()
		).subscribe(
			payload => {
				if (payload.data) {
					const user = payload.data as User;
					store.initUser(user);
				}
				if (payload.message) {
					const _message: Message = payload.message;
					this.messagesService.info(_message.message);
				}
				store.updateLoadingIndicator(false);
			},
			(error => {
				store.updateLoadingIndicator(false);
				this.httpErrorService.handleError(error, 'getUser');
			})
		);
	}


}
