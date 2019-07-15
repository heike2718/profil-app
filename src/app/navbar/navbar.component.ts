import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../shared/services/session.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	isCollapsed = true;

	@ViewChild(NgbCollapse) navbarToggler: NgbCollapse;

	constructor(private sessionService: SessionService
		, private authService: AuthService) { }

	ngOnInit() {
	}

	collapseNav() {
		if (this.navbarToggler) {
			this.isCollapsed = true;
		}
	}

	isLoggedIn(): boolean {
		return false;
	}

	isLoggedOut(): boolean {
		return !this.isLoggedIn();
	}

	logout() {
		this.sessionService.clearSession();
	}

	login() {
		this.authService.logIn();
	}

	signup(): void {

	}
}
