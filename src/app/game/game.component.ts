import {Component, OnInit} from '@angular/core';
// import { NgClass } from '@angular/common';
// import {element} from 'protractor';
// import {start} from 'repl';

declare var jquery: any;
declare var $: any;
declare const SVG: any;

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

	// -- t = tile, m = mine, b = bomb, g = group, f = flag, l = location, s = surrounding, n = number, a = array
	// -- len = length
	init = () => {
		const gameContainer = $('.game-start')
			, startGame = () => {
			const board = SVG('game').size(309, 309)
				, border = board.polyline('0,0 309,0 309,309 0,309 0,0')
				, gutter = 1
				, borderWidth = 2
				, row = 16
				, col = row
				, size = 18
				, mQ = 40
				, mA = [] // -- when mines are placed on the board, they are numbered depending on their position and put in this array
				, tQ = row * col
				, hide = 'transparent'
				, white = '#FBF9FC'
				, sCheck = (p, nextFunction) => {
				if (p % row === 0) {
					const checkLeft = [p - row, p - (row - 1), p + 1, p + (row + 1), p + row];

					nextFunction(checkLeft);
				} else if ((p + 1) % row === 0) {
					const checkRight = [p - (row + 1), p - row, p - 1, p + row, p + (row - 1)];

					nextFunction(checkRight);
				} else {
					const checkMiddle = [p - (row + 1), p - row, p - (row - 1), p - 1, p + 1, p + (row + 1), p + row, p + (row - 1)];

					nextFunction(checkMiddle);
				}
			}
				, coordinates = (order, nextStep, l, object) => {
				const t = board.rect(size, size)
					, set = board.group()
					, x = (order % row) * (row +  + gutter + borderWidth)
					, y = Math.floor(order / row) * (row +  + gutter + borderWidth);

				t.move(x + gutter + borderWidth, y +  + gutter + borderWidth).fill(white);

				if (nextStep === 1) {
					const bCalc = board.image(object);

					bCalc.move(x + 7, y + 7).size(10, l); // -- these numbers depend on dimensions of mine
					set.add(bCalc).add(t).addClass('mine tile tile' + order);
				} else if (nextStep === 2) {
					const fCalc = board.image(object);

					fCalc.move(x + 7, y + 6).size(10, l); // -- these numbers depend on dimensions of flag
					set.add(t).add(fCalc);

					set.on('contextmenu', function () {
						set.remove();
					});
				} else {
					const text = board.text(l.toString());

					text.move(x + 8.5, y + 6).fill(object).size(12).font({family: 'Lato', weight: 700}); // -- these numbers depend on dimensions of text
					set.add(text).add(t).style('cursor', 'pointer').addClass('tile tile' + order);

					if (l === 0) {
						set.addClass('noMines');
					}
				}
			};

			// -- Draw board
			border.stroke({color: white, width: borderWidth * 2}).fill('none');

			// -- Places a specified amount of mines randomly without repetition
			do {
				const mRand = Math.floor(Math.random() * tQ);
				if ($.inArray(mRand, mA) === -1) {
					mA.push(mRand);
				}
			} while (mA.length < mQ);

			// -- Calc mines around number
			for (let n = 0; n < tQ; n++) {

				if ($.inArray(n, mA) !== -1) {
					coordinates(n, 1, 10, '../../../assets/bomb.svg');
				} else {
					const mQA = []
						, placeN = (bCheck) => {
						for (let c = 0; c < bCheck.length; c++) {
							if (mA.indexOf(bCheck[c]) >= 0) {
								mQA.push(n);
							}
						}
					};

					sCheck(n, placeN);

					const len = mQA.length
						, tL = (txtColour) => { // -- Calculates x, y coordinates of numbers
						coordinates(n, 3, len, txtColour);
					};

					switch (len) {
						case 0:
							tL(hide);
							break;
						case 1:
							tL('#69BAE5');
							break;
						case 2:
							tL('#A6C249');
							break;
						case 3:
							tL('#F2E679');
							break;
						case 4:
							tL('#4392F1');
							break;
						case 5:
							tL('#EE8434');
							break;
						default:
							tL('#CD4E55');
					}
				}
			}

			// -- Reveal
			const g = SVG.select('.tile rect');

			g.click(function () {
				const thisT = this
					, thisTP = thisT.parent()
					, opened = $('.open').length;

				if (thisTP.hasClass('mine')) {
					game('.over');
				} else if (thisTP.hasClass('noMines')) {
					const numbers = thisT.parent().attr('class').match(/[+-]?\d+(?:\.\d+)?/g).map(Number)[0]
						, loopThroughTiles = (tN) => {
						for (let t = 0; t < tN.length; t++) {
							const tS = SVG.select('.tile' + tN[t].toString() + ' rect')
								, tPS = $('.tile' + tN[t].toString());

							if (tPS.hasClass('noMines') && !tPS.hasClass('open')) {
								const nS = tPS.attr('class').match(/[+-]?\d+(?:\.\d+)?/g).map(Number)[0];

								tPS.addClass('open');
								tS.fill(hide);
								sCheck(nS, loopThroughTiles);
							} else {
								tPS.addClass('open');
								tS.fill(hide);
							}
						}
					};
					sCheck(numbers, loopThroughTiles);
					thisTP.addClass('open');
				} else {
					thisTP.addClass('open');
				}

				thisT.fill(hide);

				// -- You win if you opened all tiles except for the bombs
				if (opened === tQ - mQ) {
					game('.won');
				}
			});

			g.on('contextmenu', function () {
				const thisT = this.parent()
					, numbers = this.parent().attr('class').match(/[+-]?\d+(?:\.\d+)?/g).map(Number)[0];

				if (!thisT.hasClass('open')) {
					coordinates(numbers, 2, 12, '../../../assets/flag.svg');
				}
			});

			const game = (end) => {
				gameContainer.removeClass('hideGameStart');
				$(end).addClass('show');
			};
		};

		if (!gameContainer.children().hasClass('show')) { // -- Start game if it's the first game
			gameContainer.addClass('hideGameStart').find('img').addClass('hideGameStart');
			startGame();
		} else { // -- Clean board and restart game
			gameContainer.addClass('hideGameStart').children().removeClass('show');
			$('g').remove();
			startGame();
		}
	};

	constructor() {
	}

	ngOnInit() {
	}
}
