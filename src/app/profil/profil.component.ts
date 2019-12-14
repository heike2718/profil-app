import { Component, OnInit, OnDestroy } from '@angular/core';
import { store } from '../shared/store/app-data';
import { Observable, Subscription } from 'rxjs';
import { User, AccountAction } from '../shared/model/app-model';

@Component({
	selector: 'prfl-profil',
	templateUrl: './profil.component.html',
	styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {

	user$: Observable<User>;

	private activeAccountAction: AccountAction;

	loading = true;

	private userSubscription: Subscription;

	constructor() {
	}

	ngOnInit() {
		this.user$ = store.user$;

		this.userSubscription = this.user$.subscribe(
			_user => this.loading = false
		);

		this.activeAccountAction = 'change data';
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	changeDataActive(): boolean {
		return this.activeAccountAction === 'change data';
	}

	changePasswordActive(): boolean {
		return this.activeAccountAction === 'change password';
	}

	deleteAccountActive(): boolean {
		return this.activeAccountAction === 'delete account';
	}


	toggleProfilAktiv(): void {
		this.activeAccountAction = 'change data';
	}

	togglePasswordAktiv(): void {
		this.activeAccountAction = 'change password';
	}

	toggleDeleteAccountActive(): void {
		this.activeAccountAction = 'delete account';
	}

	getClassnameProfil(): string {
		const base_class = 'left-nav-link left-nav-item col-12';
		return this.activeAccountAction === 'change data' ? base_class + ' left-nav-link-active' : base_class + ' left-nav-link';
	}

	getClassnamePassword(): string {
		const base_class = 'left-nav-link left-nav-item col-12';
		return this.activeAccountAction === 'change password' ? base_class + ' left-nav-link-active' : base_class + ' left-nav-link';
	}

	getClassnameDeleteAccount(): string {
		const base_class = 'left-nav-link left-nav-item col-12';
		return this.activeAccountAction === 'delete account' ? base_class + ' left-nav-link-active' : base_class + ' left-nav-link';
	}
}
