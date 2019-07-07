import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
		HomeComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routerConfig, { useHash: true }),
		NgLoggerModule.forRoot(LOG_LEVEL),
		NgbModule,
		NgbCollapseModule,
		HewiNgLibModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
