import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { JWTService } from 'hewi-ng-lib';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	title = 'Minikänguru-Konten';

	constructor(private jwtService: JWTService
		, private authService: AuthService) { }

	ngOnInit() {

		// nach dem redirect vom AuthProvider ist das die Stelle, an der die Anwendung wieder ankommt.
		// Daher hier redirect-URL parsen
		const hash = window.location.hash;
		if (hash && hash.indexOf('accessToken') > 0) {
			const authResult = this.jwtService.parseHash(hash);
			this.authService.setSession(authResult);
		}
	}

}
