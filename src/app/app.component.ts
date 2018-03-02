import {Component} from '@angular/core';

declare var jquery: any;
declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	idOfOpen = 2;


	addClass(id: any) {
		this.idOfOpen = id;
		$('.mc').removeClass('overlay');

		$('html, body').animate({
			scrollTop: 0
		}, 500);
	}
}

