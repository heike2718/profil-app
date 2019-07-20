import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router, NavigationStart, RoutesRecognized } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
	selector: 'prfl-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

	loading$: Observable<boolean>;

	constructor(private router: Router) { }

	ngOnInit() {
		this.loading$ = this.router.events
			.pipe(
				map(event => event instanceof NavigationStart ||
					event instanceof RoutesRecognized)
			);
		// this.loading$ = of(true);
	}
}

