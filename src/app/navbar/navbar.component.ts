import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'prfl-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	isCollapsed = true;

	@ViewChild(NgbCollapse) navbarToggler: NgbCollapse;

	constructor() { }

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

	}

	login() {

	}

	signup(): void {

	}
}
