import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTService, STORAGE_KEY_JWT_STATE, STORAGE_KEY_JWT } from 'hewi-ng-lib';
import { STORAGE_KEY_FULL_NAME } from './model/app-model';
import { SessionService } from '../services/session.service';

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

	constructor(@Inject(SessionService) private sessionService: SessionService
		, private router: Router) { }

	canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

		const userName = localStorage.getItem(STORAGE_KEY_FULL_NAME);

		if (!userName) {
			return false;
		}

		const sessionExpired = this.sessionService.sessionExpired();

		if (!sessionExpired) {
			return true;
		}

		this.router.navigate(['/home'], {
			queryParams: {
				return: state.url
			}
		});
		return false;
	}
}
