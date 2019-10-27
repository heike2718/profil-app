import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { JWTService } from 'hewi-ng-lib';
import { environment } from 'src/environments/environment';
import { OauthService } from './services/oauth.service';
import { SessionService } from './services/session.service';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	title = 'Minikänguru-Benutzerdaten';
	version = environment.version;
	envName = environment.envName;
	showEnv = !environment.production;
	api = environment.apiUrl;
	logo = environment.assetsUrl + '/mja_logo.png';

	constructor(private jwtService: JWTService
		, private authService: AuthService
		, private oauthService: OauthService
		, private sessionService: SessionService) { }

	ngOnInit() {

		this.oauthService.orderClientAccessToken();

		if (this.jwtService.isJWTExpired()) {
			this.sessionService.clearSession();
		}

		// nach dem redirect vom AuthProvider ist das die Stelle, an der die Anwendung wieder ankommt.
		// Daher hier redirect-URL parsen
		const hash = window.location.hash;
		if (hash && hash.indexOf('idToken') > 0) {
			const authResult = this.jwtService.parseHash(hash);
			this.authService.setSession(authResult);
			if (this.oauthService.clientTokenWillExpireSoon()) {
				this.oauthService.orderClientAccessToken();
			}
		}
	}
}
