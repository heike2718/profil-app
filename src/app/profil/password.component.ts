import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { AppConstants } from '../shared/app.constants';
import { passwortValidator, passwortPasswortWiederholtValidator } from '../shared/validation/app.validators';
import { Observable } from 'rxjs';
import { User, TwoPasswords, ChangePasswordPayload } from '../shared/model/app-model';
import { store } from '../shared/store/app-data';
import { UserService } from '../services/user.service';
import { HttpErrorService } from '../error/http-error.service';
import { MessagesService } from 'hewi-ng-lib';
import { SessionService } from '../services/session.service';

@Component({
	selector: 'prfl-password',
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

	user$: Observable<User>;

	changePwdForm: FormGroup;

	oldPassword: AbstractControl;

	passwort: AbstractControl;

	passwortWdh: AbstractControl;

	tooltipPasswort: string;

	submitDisabled: true;

	showChangePasswordResult: boolean;

	constructor(private fb: FormBuilder
		, private userService: UserService
		, private sessionService: SessionService
		, private httpErrorService: HttpErrorService
		, private messagesService: MessagesService) {

		this.tooltipPasswort = AppConstants.tooltips.PASSWORTREGELN;
		this.showChangePasswordResult = false;

		this.changePwdForm = this.fb.group({
			'oldPassword': ['', [Validators.required, passwortValidator]],
			'passwort': ['', [Validators.required, passwortValidator]],
			'passwortWdh': ['', [Validators.required, passwortValidator]]
		}, { validator: passwortPasswortWiederholtValidator });

		this.oldPassword = this.changePwdForm.controls['oldPassword'];
		this.passwort = this.changePwdForm.controls['passwort'];
		this.passwortWdh = this.changePwdForm.controls['passwortWdh'];

	}

	ngOnInit() {

		this.user$ = store.user$;
	}

	closeModal(): void {
		this.showChangePasswordResult = false;
		store.clearUser();
		this.sessionService.clearSession();
	}

	submit(): void {

		const _twoPasswords: TwoPasswords = {
			'passwort': this.passwort.value,
			'passwortWdh': this.passwortWdh.value
		};

		const credentials: ChangePasswordPayload = {
			'passwort': this.oldPassword.value,
			'twoPasswords': _twoPasswords
		};

		this.userService.changePassword(credentials).subscribe(
			payload => {
				const level = payload.message.level;

				if (level === 'INFO') {
					this.showChangePasswordResult = true;
				} else {
					this.showChangePasswordResult = false;
					this.messagesService.error(payload.message.message);
				}

			},
			error => this.httpErrorService.handleError(error, 'changePassword')
		);
	}
}

