import { Component, OnInit, OnDestroy } from '@angular/core';
import { store } from '../shared/store/app-data';
import { Observable, Subscription } from 'rxjs';
import { User } from '../shared/model/app-model';

@Component({
	selector: 'prfl-profil',
	templateUrl: './profil.component.html',
	styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {

	user$: Observable<User>;

	profilAktiv: boolean;

	passwordAktiv: boolean;

	loading = true;

	private userSubscription: Subscription;

	constructor() {
	}

	ngOnInit() {
		this.user$ = store.user$;

		this.userSubscription = this.user$.subscribe(
			_user => this.loading = false
		);

		this.profilAktiv = true;
		this.passwordAktiv = false;
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}


	toggleProfilAktiv(): void {
		this.profilAktiv = true;
		this.passwordAktiv = false;
	}

	togglePasswordAktiv(): void {
		this.passwordAktiv = true;
		this.profilAktiv = false;
	}

	getClassnameProfil(): string {
		const base_class = 'left-nav-link left-nav-item col-12';
		return this.profilAktiv ? base_class + ' left-nav-link-active' : base_class + ' left-nav-link';
	}

	getClassnamePassword(): string {
		const base_class = 'left-nav-link left-nav-item col-12';
		return this.passwordAktiv ? base_class + ' left-nav-link-active' : base_class + ' left-nav-link';
	}
}
