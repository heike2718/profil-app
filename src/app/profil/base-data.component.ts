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

	user$: Observable<User>

	loadingIndicator$: Observable<boolean>;

	private message$: Observable<Message>;

	changeDataForm: FormGroup;

	loginName: AbstractControl;

	vorname: AbstractControl;

	nachname: AbstractControl;

	email: AbstractControl;

	private userSubscription: Subscription;

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
		this.loadingIndicator$ = store.loadingIndicator$;
	}

	ngOnInit() {

		this.userSubscription = this.user$.subscribe(
			user => {
				this.changeDataForm.patchValue(user);
			}

		);

		// this.messagesSubscription = this.message$.subscribe(
		// 	msg => {
		// 		if (this.formSubmitted && msg.level) {
		// 			this.submitDisabled = false;
		// 			this.cancelDisabled = false;
		// 			this.formSubmitted = false;
		// 		}
		// 	}
		// );
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
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
		store.updateLoadingIndicator(true);
		this.userService.changeProfileData(_data);

	}

	cancel(): void {
		this.userService.loadUser();
		store.updateLoadingIndicator(false);
		this.messagesService.clear();
	}

}
