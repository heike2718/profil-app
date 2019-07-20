import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { HewiNgLibModule } from 'hewi-ng-lib';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from 'src/environments/environment';
import { routerConfig } from './router.config';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './shared/logged-in.guard';
import { ErrorComponent } from './error/error.component';
import { GlobalErrorHandlerService } from './error/global-error-handler.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';
import { LoadingComponent } from './loading/loading.component';


// Set different log level depending on environment.
let LOG_LEVEL = Level.ERROR;
if (!environment.production) {
	LOG_LEVEL = Level.DEBUG;
}
console.log('LOG_LEVEL=' + LOG_LEVEL);

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		HomeComponent,
		ErrorComponent,
		ProfilComponent,
		LoadingComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routerConfig, { useHash: true }),
		HttpClientModule,
		FormsModule,
		NgLoggerModule.forRoot(LOG_LEVEL),
		NgbModule,
		NgbCollapseModule,
		HewiNgLibModule
	],
	providers: [
		GlobalErrorHandlerService,
		{ provide: ErrorHandler, useClass: GlobalErrorHandlerService },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		LoggedInGuard
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
