import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import {AboutComponent} from './about/about.component';
import {GameComponent} from './game/game.component';
import {InstagramComponent} from './instagram/instagram.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {InfoComponent} from './info/info.component';
import {AnimationComponent} from './animation/animation.component';


@NgModule({
	declarations: [
		AppComponent,
		MenuComponent,
		AboutComponent,
		GameComponent,
		InstagramComponent,
		PortfolioComponent,
		InfoComponent,
		AnimationComponent
	],
	imports: [
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
