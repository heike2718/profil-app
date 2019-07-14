import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Logger } from '@nsalaun/ng-logger';

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

	constructor(private injector: Injector) { }

	handleError(error: any): void {

		// ErrorHandler wird vor allen anderen Injectables instanziiert,
		// so dass man Logger und MessagesService nicht im Konstruktor injecten kann.
		const logger = this.injector.get(Logger);
		const router = this.injector.get(Router);

		logger.debug(JSON.stringify(error));

		if (error instanceof HttpErrorResponse) {
			logger.debug('das sollte nicht vorkommen, da diese Errors vom HttpInterceptor behandelt werden');
		} else {
			logger.error('Unerwarteter Fehler: ' + error.message);
		}

		router.navigateByUrl('/error');
	}
}
