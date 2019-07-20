import { Component, OnInit } from '@angular/core';
import { store } from '../shared/store/app-data';
import { Observable } from 'rxjs';
import { User } from '../shared/model/app-model';

@Component({
	selector: 'prfl-profil',
	templateUrl: './profil.component.html',
	styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

	user$: Observable<User>;

	constructor() {
		this.user$ = store.user$;
	}

	ngOnInit() {

	}
}
