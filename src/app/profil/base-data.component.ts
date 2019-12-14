import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User, ProfileDataPayload } from '../shared/model/app-model';
import { store } from '../shared/store/app-data';
import { emailValidator } from '../shared/validation/app.validators';
import { UserService } from '../services/user.service';
import { MessagesService } from 'hewi-ng-lib';

@Component({
	selector: 'prfl-base-data',
	templateUrl: './base-data.component.html',
	styleUrls: ['./base-data.component.css']
})
export class BaseDataComponent implements OnInit, OnDestroy {

	user$: Observable<User>;

	changeDataForm: FormGroup;

	loginName: AbstractControl;

	vorname: AbstractControl;

	nachname: AbstractControl;

	email: AbstractControl;

	private userSubscription: Subscription;

	private blockingIndicatorSubscription: Subscription;

	private csrfTokenSubscription: Subscription;

	private cachedUser: User;

	private csrfToken = '';

	showBlockingIndicator: boolean;

	constructor(private fb: FormBuilder
		, private userService: UserService
		, private messagesService: MessagesService) {

		this.changeDataForm = this.fb.group({
			loginName: ['', [Validators.required]],
			vorname: ['', [Validators.required]],
			nachname: ['', [Validators.required]],
			email: ['', [Validators.required, emailValidator]]
		});

		this.loginName = this.changeDataForm.controls.loginName;
		this.vorname = this.changeDataForm.controls.vorname;
		this.nachname = this.changeDataForm.controls.nachname;
		this.email = this.changeDataForm.controls.email;
	}

	ngOnInit() {

		this.user$ = store.user$;

		this.userSubscription = this.user$.subscribe(
			user => {
				this.cachedUser = user;
				this.changeDataForm.patchValue(user);
			}

		);

		this.blockingIndicatorSubscription = store.blockingIndicator$.subscribe(
			value => this.showBlockingIndicator = value
		);

		this.csrfTokenSubscription = store.csrfToken$.subscribe(
			token => this.csrfToken = token
		);
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
		if (this.blockingIndicatorSubscription) {
			this.blockingIndicatorSubscription.unsubscribe();
		}
		if (this.csrfTokenSubscription) {
			this.csrfTokenSubscription.unsubscribe();
		}
	}

	submit(): void {
		const _data: ProfileDataPayload = {
			loginName: this.loginName.value.trim(),
			email: this.email.value.trim(),
			nachname: this.nachname.value.trim(),
			vorname: this.vorname.value.trim()
		};

		this.messagesService.clear();
		this.userService.changeProfileData(_data, this.cachedUser, this.csrfToken);

	}

	cancel(): void {
		this.userService.resetUser(this.cachedUser);
		this.messagesService.clear();
	}

}
