import { Component, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { STORAGE_KEY_FULL_NAME } from '../shared/model/app-model';

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

	isCollapsed = true;

	@ViewChild(NgbCollapse, { static: true }) navbarToggler: NgbCollapse;

	constructor(private sessionService: SessionService
		, private authService: AuthService) { }

	collapseNav() {
		if (this.navbarToggler) {
			this.isCollapsed = true;
		}
	}

	isLoggedIn(): boolean {
		return !this.isLoggedOut();
	}

	isLoggedOut(): boolean {
		const fullName = localStorage.getItem(STORAGE_KEY_FULL_NAME);
		return !fullName;
	}

	logout() {
		this.sessionService.clearSession();
	}

	login() {
		this.authService.logIn();
	}

}
