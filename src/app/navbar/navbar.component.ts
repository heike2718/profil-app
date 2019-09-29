import * as moment_ from 'moment';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { JWTService, STORAGE_KEY_JWT_STATE, LogService } from 'hewi-ng-lib';
import { Subscription, interval, timer } from 'rxjs';
import { OauthService } from '../services/oauth.service';
import { SessionService } from '../services/session.service';
import { STORAGE_KEY_HEARTBEAT } from '../shared/model/app-model';

const moment = moment_;

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

	isCollapsed = true;

	private refrehJWTTimerSubscription: Subscription;

	private refreshClientTokenTimerSubscription: Subscription;

	private detectSleepSubscription: Subscription;

	@ViewChild(NgbCollapse, { static: true }) navbarToggler: NgbCollapse;

	constructor(private sessionService: SessionService
		, private oauthService: OauthService
		, private authService: AuthService
		, private jwtService: JWTService
		, private logService: LogService) { }

	ngOnInit() {

		localStorage.setItem(STORAGE_KEY_HEARTBEAT, JSON.stringify(moment()));

		// jede Sekunde einen heartbeat-timestamp setzen und wenn der letzte heartbeat länger als 5 Sekunden zurück liegt,
		// token refreshen.
		this.detectSleepSubscription = timer(0, 2000).subscribe(_t => {

			const lastHeartbeat = this.getHeartbeatAsMoment();
			const now = moment();
			if (lastHeartbeat.add(10, 'seconds').isBefore(now)) {
				// this.oauthService.orderClientAccessToken();
				// if (this.isLoggedIn) {
				// 	this.oauthService.refreshJWT(true);
				// }
				// Das ständige refreshen der Token hat sich nicht bewährt. Daher zunächst einmal
				// nur beobachten.
				const message = 'ProfilApp about to enter sleep modus: ' + this.sessionService.getClientAccessToken();
				this.logService.info(message, this.sessionService.getClientAccessToken());
			}
			localStorage.setItem(STORAGE_KEY_HEARTBEAT, JSON.stringify(moment()));
		});

		// alle 1 Minute 50 Sekunden
		this.refreshClientTokenTimerSubscription = interval((2 * 60 - 10) * 1000)
			.subscribe(() => {
				if (this.oauthService.clientTokenWillExpireSoon()) {
					this.oauthService.orderClientAccessToken();
				}
			});

		// alle 2 Minuten
		this.refrehJWTTimerSubscription = interval(2 * 60 * 1000)
			.subscribe(() => {
				if (this.isLoggedIn()) {
					const _expMinutes = this.jwtService.jwtDurationMinutes();
					if (_expMinutes <= 3) {
						this.oauthService.refreshJWT(false);
					}
				}
			});
	}

	ngOnDestroy() {

		if (this.detectSleepSubscription) {
			this.detectSleepSubscription.unsubscribe();
		}

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

	private getHeartbeatAsMoment() {

		const val = localStorage.getItem(STORAGE_KEY_HEARTBEAT);

		if (!val) {
			return null;
		}
		const result = JSON.parse(val);
		return moment(result);
	}

}
