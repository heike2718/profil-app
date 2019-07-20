import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';
import { LoggedInGuard } from './shared/logged-in.guard';


export const routerConfig: Routes = [
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'profil',
		component: ProfilComponent,
		canActivate: [LoggedInGuard]
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: '/home'
	},
	{
		path: '**',
		pathMatch: 'full',
		redirectTo: '/home'
	}
];

