'use strict'

class Tile extends Sprite {

  constructor( img, size ) {

    super( img, size, size );

    this.size = size || 32;

    this.mapX = this.mapY = 0;

    this.isSynchronize = true
  }

  isOverlapped( tile ) {
    if ( tile instanceof Tile ) {
      const _isOverlapped = ( this.mapX === tile.mapX && this.mapY === tile.mapY );
      return _isOverlapped;
    }

    else console.error( 'Tilemapに追加できるのはTileだけだよ！' );

  }
}
