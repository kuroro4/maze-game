'use strict'


addEventListener( 'load', () => {


	const game = new Game( );

	game.preload( 'img/hapitaso.png', 'img/hapitan.png', 'img/yamada.png', 'img/start.png', 'img/goal.png', 'img/tile.png', 'img/dpad.png', 'sound/bgm.mp3', 'sound/start.mp3', 'sound/clear.mp3' );

game.keybind( 'space', ' ' );

game.main( () => {

const titleScene = () => {

	const scene = new Scene();

	const titleText = new Text( 'しのび屋敷' );

	titleText.center().middle();

	scene.add( titleText );

	scene.onchangescene = () => {
				//clear.mp3をストップ
				game.sounds[ 'sound/clear.mp3' ].stop();
				//start.mp3を再生
				game.sounds[ 'sound/start.mp3' ].start();
			}

	scene.ontouchstart = () => {
		game.currentScene = mainScene();
	}

	scene.onenterframe = () => {

		if ( game.input.space ) game.currentScene = mainScene();
	}

	return scene;
}

	const mainScene = () => {
/*
	const map = [
			[11,11,11,11,11,11,11,11,11,11],
			[11,10,10,10,10,10,10,10,10,11],
			[11, 4, 4, 4, 4, 4, 4, 4, 4,11],
			[11, 4,11, 4, 4,11,11,11, 4,11],
			[11, 4,11,11,11,11,10,10, 4,11],
			[11, 4,11,10,10,11, 4, 4, 4,11],
			[11, 4,11, 4, 4,11,11,11, 4,11],
			[11, 4, 9, 4, 4, 9,10,11, 4,11],
			[11, 4, 4, 4, 4, 4, 4,11, 4,11],
			[11,11,11,11,11,11,11,11,11,11]
		];
*/
const TILE_SIZE = 32;

const WALKING_SPEED=4;

const scene = new Scene();

const tilemap = new Tilemap( 'img/tile.png' );

tilemap.data = map;

tilemap.x = TILE_SIZE*4 - TILE_SIZE/2;
tilemap.y = TILE_SIZE*3 - TILE_SIZE/2;

tilemap.obstacles = [0,3,6,7,8,9,10,11];

scene.add(tilemap);

const start = new Tile( 'img/start.png' );

start.x = TILE_SIZE;
start.y = TILE_SIZE*2;

tilemap.add( start );

const goal = new Tile( 'img/goal.png' );

goal.x = TILE_SIZE*98;
goal.y = TILE_SIZE*98;

tilemap.add( goal );

const hapitaso = new CharacterTile('img/hapitaso.png');

hapitaso.x = hapitaso.y = TILE_SIZE*5 - TILE_SIZE/2;

hapitaso.isSynchronize = false;

tilemap.add(hapitaso);

const hapitan = new CharacterTile( 'img/hapitan.png');

hapitan.x = TILE_SIZE*7 - TILE_SIZE/2;
hapitan.y = TILE_SIZE*5 - TILE_SIZE/2;

hapitan.isSynchronize = false;

tilemap.add( hapitan );

const yamada = new CharacterTile( 'img/yamada.png' );

yamada.x = TILE_SIZE*7 - TILE_SIZE/2;
yamada.y = TILE_SIZE*6 - TILE_SIZE/2;

tilemap.add( yamada );

const party = new Party( hapitaso, hapitan, yamada );
party.speed = WALKING_SPEED;

const dpad = new DPad( 'img/dpad.png', 80 );
	dpad.x = 10;
	dpad.y = 230;
	scene.add( dpad );

	scene.onchangescene = () => {
				//start.mp3をストップ
				game.sounds[ 'sound/start.mp3' ].stop();
				//bgm.mp3をループ再生
				game.sounds[ 'sound/bgm.mp3' ].loop();
			}

let toggleForAnimation = 0;

let hasDisplayedGoalText = false;

let isMovable = true;

scene.onenterframe = () => {

	if ( ( tilemap.x - TILE_SIZE/2 ) % TILE_SIZE === 0 && ( tilemap.y - TILE_SIZE/2 ) % TILE_SIZE === 0) {

			tilemap.vx = tilemap.vy = 0;

			for ( let i in party.member ) {
				party.member[i].vx = party.member[i].vy = 0;
				party.member[i].animation = 1;
			}


	if ( hapitaso.isOverlapped( goal ) ) {

		if ( !hasDisplayedGoalText ) {

			const goalText =  new Text( '任務完了' );

			goalText.size = 50;

			goalText.center().middle();

			scene.add( goalText );

			hasDisplayedGoalText = true;

			isMovable = false;

			game.sounds[ 'sound/bgm.mp3' ].stop();

			game.sounds[ 'sound/clear.mp3' ].start();

			setTimeout( () => {
				game.currentScene = titleScene();
			}, 6000 );
		}

	}

if ( isMovable ) {

  if(game.input.left || dpad.arrow.left ) {
		party.setMemberVelocity( 'left' );
		tilemap.vx = WALKING_SPEED;
		hapitaso.direction = 1;
	}
  else if (game.input.right || dpad.arrow.right ) {
		party.setMemberVelocity( 'right' );
		tilemap.vx = -1 * WALKING_SPEED;
		hapitaso.direction = 2;
	}
  else if (game.input.up || dpad.arrow.up ) {
		party.setMemberVelocity( 'up' );
		tilemap.vy = WALKING_SPEED;
		hapitaso.direction = 3;
	}
  else if (game.input.down || dpad.arrow.down ) {
		party.setMemberVelocity(' down' );
		tilemap.vy = -1 * WALKING_SPEED;
		hapitaso.direction = 0;
	}

	const hapitasoCoordinateAfterMoveX = hapitaso.mapX - tilemap.vx/WALKING_SPEED;
	const hapitasoCoordinateAfterMoveY = hapitaso.mapY - tilemap.vy/WALKING_SPEED;

	if ( tilemap.hasObstacle(
		hapitasoCoordinateAfterMoveX,
		hapitasoCoordinateAfterMoveY ) ) {
			tilemap.vx = tilemap.vy = 0;

			for ( let i in party.member ) {
				party.member[i].vx = party.member[i].vy = 0;
			}
		}

			if ( tilemap.vx !== 0 || tilemap.vy !== 0 ) party.setMemberDirection();

		}
}
	else if ( ( tilemap.x + TILE_SIZE/2 ) % ( TILE_SIZE/2 ) === 0 && ( tilemap.y + TILE_SIZE/2 ) % ( TILE_SIZE/2 ) === 0) {

		toggleForAnimation ^= 1;

		for ( let i in party.member ) {

			if ( toggleForAnimation === 0 ) party.member[i].animation = 2;
			else party.member[i].animation = 0;
		}
	}
}

return scene;

}
game.add( titleScene() );
game.add( mainScene() );

game.start();

	} );
} );
