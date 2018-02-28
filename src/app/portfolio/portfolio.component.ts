import {Component, OnInit} from '@angular/core';
import {PortfolioItem} from '../portfolio-item';
import {PortfolioItems} from '../portfolio-items';

@Component({
	selector: 'app-portfolio',
	templateUrl: './portfolio.component.html',
	styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

	PortfolioItem = PortfolioItems;

	constructor() {
	}

	ngOnInit() {
	}

}
