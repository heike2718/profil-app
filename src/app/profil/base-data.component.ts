import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User } from '../shared/model/app-model';
import { store } from '../shared/store/app-data';
import { emailValidator } from '../shared/validation/app.validators';

@Component({
	selector: 'prfl-base-data',
	templateUrl: './base-data.component.html',
	styleUrls: ['./base-data.component.css']
})
export class BaseDataComponent implements OnInit, OnDestroy {

	user$: Observable<User>

	changeDataForm: FormGroup;

	loginName: AbstractControl;

	vorname: AbstractControl;

	nachname: AbstractControl;

	email: AbstractControl;

	submitDisabled: true;

	private userSubscription: Subscription;


	constructor(private fb: FormBuilder) {

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
			user => this.changeDataForm.patchValue(user)
		);
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	submit(): void {

	}

}
