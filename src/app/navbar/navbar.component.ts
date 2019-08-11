import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { JWTService, STORAGE_KEY_JWT_STATE, STORAGE_KEY_JWT } from 'hewi-ng-lib';
import { Subscription, interval } from 'rxjs';
import { OauthService } from '../services/oauth.service';
import { SessionService } from '../services/session.service';

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

	isCollapsed = true;

	private refrehJWTTimerSubscription: Subscription;

	private refreshClientTokenTimerSubscription: Subscription;

	@ViewChild(NgbCollapse) navbarToggler: NgbCollapse;

	constructor(private sessionService: SessionService
		, private oauthService: OauthService
		, private authService: AuthService
		, private jwtService: JWTService) { }

	ngOnInit() {

		// alle 1 Minute 50 Sekunden
		this.refreshClientTokenTimerSubscription = interval((2 * 60 - 10) * 1000)
			.subscribe(() => {
				if (this.oauthService.clientWillExpireSoon()) {
					this.oauthService.orderClientAccessToken();
				}
			});

		// alle 2 Minuten
		this.refrehJWTTimerSubscription = interval(2 * 60 * 1000)
			.subscribe(() => {
				if (this.isLoggedIn()) {
					const _expMinutes = this.jwtService.jwtDurationMinutes();
					if (_expMinutes <= 3) {
						this.oauthService.refreshJWT();
					}
				}
			});
	}

	ngOnDestroy() {

		if (this.refreshClientTokenTimerSubscription) {
			this.refreshClientTokenTimerSubscription.unsubscribe();
		}

		if (this.refrehJWTTimerSubscription) {
			this.refrehJWTTimerSubscription.unsubscribe();
		}
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
