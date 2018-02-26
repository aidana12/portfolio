import {Component, OnInit} from '@angular/core';
import {element} from 'protractor';

declare var jquery: any;
declare var $: any;
declare const SVG: any;

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
	gameStarted: false;

	startGame() {
		const draw = SVG('board').size(309, 309)
			, border = draw.polyline('0,0 309,0 309,309 0,309 0,0')
			, tileRow = 16
			, tileCol = 16
			, tileSize = 18
			, mineQuant = 40
			, mineArray = [] // -- when mines are placed on the board, they are numbered depending on their position and put in this array
			, tileQuant = tileRow * tileCol;

		// -- draw board
		draw.attr('id', 'board');
		border.stroke({color: '#FBF9FC', width: 4}).fill('none');

		// -- place mines
		for (let m = 0; m < mineQuant; m++) {
			const mineRand = Math.floor(Math.random() * tileQuant);
			mineArray.push(mineRand);
		}

		// -- Check surroundings
		const surroundings = (p, nextFunction) => {
			if (p % 16 === 0) {
				const checkLeft = [p - 16, p - 15, p + 1, p + 17, p + 16];
				nextFunction(checkLeft);
			} else if ((p + 1) % 16 === 0) {
				const checkRight = [p - 17, p - 16, p - 1, p + 16, p + 15];
				nextFunction(checkRight);
			} else {
				const checkMiddle = [p - 17, p - 16, p - 15, p - 1, p + 1, p + 17, p + 16, p + 15];
				nextFunction(checkMiddle);
			}
		};

		// -- Calc mines around number
		for (let n = 0; n < tileQuant; n++) {
			const minesQuantArray = []
				, bomb = (bombNumber) => { // -- Calculates x, y coordinates of the bombs
				const bombCalc = draw.image('../../../assets/bomb.svg')
					, tile = draw.rect(tileSize, tileSize)
					, set = draw.group()
					, xCoordinate = (bombNumber % 16) * 19
					, yCoordinate = Math.floor(bombNumber / 16) * 19;
				bombCalc.move(xCoordinate + 7, yCoordinate + 7).size(10, 10);
				tile.move(xCoordinate + 3, yCoordinate + 3).fill('#FBF9FC');
				set.add(bombCalc).add(tile).addClass('tile');
			}
				, elementLocation = (tileNumber, MinesQuantAround, textColour) => { // -- Calculates x, y coordinates of numbers
				const stringIt = MinesQuantAround.toString()
					, set = draw.group()
					, text = draw.text(stringIt)
					, tile = draw.rect(tileSize, tileSize)
					, xCoordinate = (tileNumber % 16) * 19
					, yCoordinate = Math.floor(tileNumber / 16) * 19;
				text.move(xCoordinate + 9, yCoordinate + 7).fill(textColour).size(12).font('weight', '700');
				tile.move(xCoordinate + 3, yCoordinate + 3).fill('#FBF9FC');
				set.add(text).add(tile).style('cursor', 'pointer').addClass('tile').addClass('tile' + n);

				if (MinesQuantAround === 0) {
					set.addClass('noMines');
				}
			}
				, placeNumb = (bombCheck) => {
				for (let c = 0; c < bombCheck.length; c++) {
					const checkArray = mineArray.indexOf(bombCheck[c]);
					if (checkArray >= 0) {
						minesQuantArray.push(n);
					}
				}
			};

			if ($.inArray(n, mineArray) !== -1) {
				bomb(n);
			} else {
				surroundings(n, placeNumb);

				switch (minesQuantArray.length) {
					case 0:
						elementLocation(n, minesQuantArray.length, 'transparent');
						break;
					case 1:
						elementLocation(n, minesQuantArray.length, '#69BAE5');
						break;
					case 2:
						elementLocation(n, minesQuantArray.length, '#A6C249');
						break;
					case 3:
						elementLocation(n, minesQuantArray.length, '#F2E679');
						break;
					case 4:
						elementLocation(n, minesQuantArray.length, '#4392F1');
						break;
					case 5:
						elementLocation(n, minesQuantArray.length, '#EE8434');
						break;
					default:
						elementLocation(n, minesQuantArray.length, '#CD4E55');
				}
			}
		}

		// -- Group numbers for reveal
		const groupedTile = SVG.select('.tile rect');
		groupedTile.click(function () {
			const thisTile = this;
			const thisTileParent = thisTile.parent();
			const thisTileClass = thisTile.parent().attr('class');
			if (thisTileParent.hasClass('mine')) {
				thisTile.fill('transparent');
				// endGame();
			} else if (thisTileParent.hasClass('noMines')) {
				const numbers = thisTileClass.match(/[+-]?\d+(?:\.\d+)?/g).map(Number)[0]
					, loopThroughTiles = (tileNumber) => {
					for (let t = 0; t < tileNumber.length; t++) {
						const tileSurroundings = SVG.select('.tile' + tileNumber[t].toString() + ' rect');
						const tileParentSurroundings = $('.tile' + tileNumber[t].toString());

						if (tileParentSurroundings.hasClass('noMines') && !tileParentSurroundings.hasClass('open')) {
							console.log('hi');
							const thisSurroundingClass = tileParentSurroundings.attr('class');
							const numbers2 = thisSurroundingClass.match(/[+-]?\d+(?:\.\d+)?/g).map(Number)[0];
							tileParentSurroundings.addClass('open');
							tileSurroundings.fill('transparent');
							surroundings(numbers2, loopThroughTiles);
						} else {
							tileSurroundings.fill('transparent');
							tileParentSurroundings.addClass('open');
						}
					}
				};
				surroundings(numbers, loopThroughTiles);
				thisTile.fill('transparent');

				// const checkAgain = () => {
				// 	surroundings(numbers, loopThroughTiles);
				// };
			} else {
				thisTile.fill('transparent');
			}
		});
	}

	constructor() {
	}

	ngOnInit() {
	}
}
