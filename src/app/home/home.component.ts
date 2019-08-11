import { Component, OnInit } from '@angular/core';
import { STORAGE_KEY_JWT_STATE, JWTService } from 'hewi-ng-lib';

@Component({
	selector: 'prfl-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor(private jwtService: JWTService) { }

	ngOnInit() { }

	isLoggedIn(): boolean {

		const authState = localStorage.getItem(STORAGE_KEY_JWT_STATE);
		if (authState && 'signup' === authState) {
			return false;
		}

		return !this.jwtService.isJWTExpired();
	}


}
