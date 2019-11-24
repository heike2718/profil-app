import { Component, OnInit } from '@angular/core';
import { STORAGE_KEY_FULL_NAME } from '../shared/model/app-model';

@Component({
	selector: 'prfl-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

	isLoggedIn(): boolean {

		const user = localStorage.getItem(STORAGE_KEY_FULL_NAME);

		if (user !== null) {
			return true;
		}

		return false;
	}


}
