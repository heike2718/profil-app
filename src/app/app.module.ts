import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { HewiNgLibModule } from 'hewi-ng-lib';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { routerConfig } from './router.config';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './shared/logged-in.guard';
import { GlobalErrorHandlerService } from './error/global-error-handler.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilComponent } from './profil/profil.component';
import { LoadingComponent } from './loading/loading.component';
import { BaseDataComponent } from './profil/base-data.component';
import { PasswordComponent } from './profil/password.component';
import { FormErrorComponent } from './shared/components/form-error/form-error.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		HomeComponent,
		ProfilComponent,
		LoadingComponent,
		BaseDataComponent,
		PasswordComponent,
		FormErrorComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routerConfig, { useHash: true }),
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgbCollapseModule,
		HewiNgLibModule
	],
	providers: [
		GlobalErrorHandlerService,
		{ provide: ErrorHandler, useClass: GlobalErrorHandlerService },
		LoggedInGuard
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
