import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User, ProfileDataPayload, isKnownUser } from '../shared/model/app-model';
import { store } from '../shared/store/app-data';
import { emailValidator } from '../shared/validation/app.validators';
import { UserService } from '../services/user.service';
import { MessagesService, Message } from 'hewi-ng-lib';

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

	private cachedUser: User;

	showBlockingIndicator: boolean;

	constructor(private fb: FormBuilder
		, private userService: UserService
		, private messagesService: MessagesService) {

		this.changeDataForm = this.fb.group({
			'loginName': ['', [Validators.required]],
			'vorname': ['', [Validators.required]],
			'nachname': ['', [Validators.required]],
			'email': ['', [Validators.required, emailValidator]]
		});

		this.loginName = this.changeDataForm.controls['loginName'];
		this.vorname = this.changeDataForm.controls['vorname'];
		this.nachname = this.changeDataForm.controls['nachname'];
		this.email = this.changeDataForm.controls['email'];

		this.user$ = store.user$;
	}

	ngOnInit() {

		this.userSubscription = this.user$.subscribe(
			user => {
				this.cachedUser = user;
				this.changeDataForm.patchValue(user);
			}

		);

		this.blockingIndicatorSubscription = store.blockingIndicator$.subscribe(
			value => this.showBlockingIndicator = value
		);
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
		if (this.blockingIndicatorSubscription) {
			this.blockingIndicatorSubscription.unsubscribe();
		}
	}

	submit(): void {
		const _data: ProfileDataPayload = {
			'loginName': this.loginName.value.trim(),
			'email': this.email.value.trim(),
			'nachname': this.nachname.value.trim(),
			'vorname': this.vorname.value.trim()
		};

		this.messagesService.clear();
		this.userService.changeProfileData(_data, this.cachedUser);

	}

	cancel(): void {
		this.userService.resetUser(this.cachedUser);
		this.messagesService.clear();
	}

}
