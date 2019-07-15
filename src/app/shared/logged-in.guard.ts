import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTService } from 'hewi-ng-lib';

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

	constructor(@Inject(JWTService) private jwtService: JWTService
		, private router: Router) { }

	canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

		if (this.jwtService.isLoggedIn()) {
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
