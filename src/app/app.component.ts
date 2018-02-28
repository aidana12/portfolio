import {Component} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	isClassVisible: false;
	idOfOpen = 2;

	addClass(id: any) {
		this.idOfOpen = id;
	}
}

