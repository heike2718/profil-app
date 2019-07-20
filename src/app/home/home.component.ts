import { Component, OnInit } from '@angular/core';
import { OauthService } from '../services/oauth.service';
import { STORAGE_KEY_JWT_STATE, JWTService } from 'hewi-ng-lib';

@Component({
	selector: 'prfl-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor(private oauthService: OauthService
		, private jwtService: JWTService) { }

	ngOnInit() {

		if (this.oauthService.clientTokenExpired) {
			this.oauthService.orderAccessToken();
		}
	}

	isLoggedIn(): boolean {

		const authState = localStorage.getItem(STORAGE_KEY_JWT_STATE);
		if (authState && 'signup' === authState) {
			return false;
		}

		return !this.jwtService.isJWTExpired();
	}


}
