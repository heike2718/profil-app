import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';
import { JWTService, STORAGE_KEY_JWT_STATE } from 'hewi-ng-lib';

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	isCollapsed = true;

	@ViewChild(NgbCollapse) navbarToggler: NgbCollapse;

	constructor(private sessionService: SessionService
		, private authService: AuthService
		, private jwtService: JWTService) { }

	ngOnInit() {
	}

	collapseNav() {
		if (this.navbarToggler) {
			this.isCollapsed = true;
		}
	}

	isLoggedIn(): boolean {
		const authState = localStorage.getItem(STORAGE_KEY_JWT_STATE);
		if (authState && 'signup' === authState) {
			return false;
		}
		return !this.jwtService.isJWTExpired();
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
}
