import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTService, STORAGE_KEY_JWT_STATE, STORAGE_KEY_JWT } from 'hewi-ng-lib';

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

	constructor(@Inject(JWTService) private jwtService: JWTService
		, private router: Router) { }

	canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

		const jwt = localStorage.getItem(STORAGE_KEY_JWT);
		if (!jwt) {
			return false;
		}

		const authState = localStorage.getItem(STORAGE_KEY_JWT_STATE);
		if (authState && 'signup' === authState) {
			return false;
		}
		if (this.jwtService.isJWTExpired()) {
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
