import { Component, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { STORAGE_KEY_SESSION_EXPIRES_AT } from '../shared/model/app-model';
import { SessionService } from '../services/session.service';

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

	isCollapsed = true;

	@ViewChild(NgbCollapse, { static: true }) navbarToggler: NgbCollapse;

	constructor(private authService: AuthService
		, private sessionService: SessionService) { }

	collapseNav() {
		if (this.navbarToggler) {
			this.isCollapsed = true;
		}
	}

	isLoggedIn(): boolean {
		return !this.isLoggedOut();
	}

	isLoggedOut(): boolean {
		const expiresAt = localStorage.getItem(STORAGE_KEY_SESSION_EXPIRES_AT);
		return !expiresAt;
	}

	logout() {
		this.authService.logOut();

		// this.sessionService.clearSession();
	}

	login() {
		this.authService.logIn();
	}

}
