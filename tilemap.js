'use strict'

class Tilemap {
 constructor(img,size){
this.img = new Image();

this.img.src = img;

this.x = this.y = 0;

this.vx = this.vy = 0;

this.size = size || 32;

this.data = [];

this.tiles = [];

this.obstacles = [0];

 }

add( tile ) {

  if ( tile instanceof Tile ) {

    tile.mapX = tile.x / this.size;
    tile.mapY = tile.y / this.size;

    if ( !tile.isSynchronize) {
      tile.mapX = ( tile.x - this.x ) / this.size;
      tile.mapY = ( tile.y - this.y ) / this.size;
    }

  this.tiles.push( tile );
  }
  else console.error( 'Tilemapに追加できるのはTileだけだよ！' );
}

hasObstacle( mapX, mapY ) {

  const _isObstacleTile = this.obstacles.some( obstacle => obstacle === this.data[mapY][mapX] );

  return _isObstacleTile;
}

  update(canvas){
    this.render(canvas);

    this.onenterframe();

    this.x += this.vx;
    this.y += this.vy;

    for ( let i=0; i<this.tiles.length; i++ ) {

      if ( this.tiles[i].isSynchronize ) {

      this.tiles[i].shiftX = this.x;

      this.tiles[i].shiftY = this.y;
    }

      this.tiles[i].update( canvas );

      this.tiles[i].mapX = this.tiles[i].x / this.size;
      this.tiles[i].mapY = this.tiles[i].y / this.size;

      if ( !this.tiles[i].isSynchronize ) {
        this.tiles[i].mapX = ( this.tiles[i].x - this.x ) / this.size;
        this.tiles[i].mapY = ( this.tiles[i].y - this.y ) / this.size;
      }
    }
  }

  render(canvas) {
    for(let y=0; y < this.data.length; y++) {

    const _tileY = this.size * y + this.y;

      if(_tileY < -1 * this.size || _tileY > canvas.height) continue;

      for(let x = 0; x < this.data[y].length; x++) {

    const _tileX = this.size * x + this.x

        if(_tileX < -1 * this.size || _tileX > canvas.width)continue;

    const _frameX = this.data[y][x] % (this.img.width / this.size);

    const _frameY = ~~(this.data[y][x] / (this.img.width / this.size));

    const _ctx = canvas.getContext('2d');

    _ctx.drawImage(
    this.img,
    this.size * _frameX,
    this.size * _frameY,
    this.size,
    this.size,
    _tileX,
    _tileY,
    this.size,
    this.size
        );
      }
    }
  }

  getRelactiveFingerPosition( fingerPosition ) {

  		const _relactiveFingerPosition = {
  			x: fingerPosition.x - this.x,
  			y: fingerPosition.y - this.y
  		};


  		const inRange = ( num, min, max ) => {

  			const _inRange = ( min <= num && num <= max );

  			return _inRange;
  		}

      if ( inRange( _relactiveFingerPosition.x, 0, this.size*this.data[0].length ) && inRange( _relactiveFingerPosition.y, 0, this.size*this.data.length ) ) return _relactiveFingerPosition;
      return false;
    }

    assignTouchevent( eventType, fingerPosition ) {

		const _relactiveFingerPosition = this.getRelactiveFingerPosition( fingerPosition );


		if ( !_relactiveFingerPosition ) return;


		switch ( eventType ) {
			case 'touchstart' :

				this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchmove' :

				this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
			case 'touchend' :

				this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
				break;
		}


		for ( let i=0; i<this.tiles.length; i++ ) {

			this.tiles[i].assignTouchevent( eventType, fingerPosition );
		}
	}

  onenterframe() {}

  ontouchstart() {}

  ontouchmove() {}

  ontouchend() {}
}
