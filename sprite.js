'use strict'

class Sprite{

constructor( img, width, height ) {
  this.img = new Image();

  this.img.src = img;

  this.x = this.y = 0;

  this.width = width || 32;

  this.height = height || 32;

  this.frame = 0;

  this.vx = this.vy = 0;

  this.shiftX = this.shiftY = 0;

  this.rotate = 0;
}

update(canvas){
  this.render(canvas);
  this.onenterframe();

  this.x += this.vx;
  this.y += this.vy;
}
render(canvas){

  if( this.x + this.shiftX < -1 * this.width || this.x + this.shiftX > canvas.width )return;
  if( this.y + this.shiftY < -1 * this.height || this.y + this.shiftY > canvas.height )return;

const _frameX = this.frame % ( this.img.width / this.width );
const _frameY = ~~( this.frame / ( this.img.width / this.width ) );

  const _ctx = canvas.getContext( '2d' );

  const _translateX = this.x + this.width/2 + this.shiftX;
  const _translateY = this.y + this.height/2 + this.shiftY;

  _ctx.save();

  _ctx.translate( _translateX, _translateY);

  _ctx.rotate( this.rotate * Math.PI / 180 );

  _ctx.translate( -1*_translateX, -1*_translateY );

_ctx.drawImage(
  this.img,
  this.width * _frameX,
  this.height * _frameY,
  this.width,
  this.height,
  this.x + this.shiftX,
  this.y + this.shiftY,
  this.width,
  this.height
  );

  _ctx.restore();

}

getRelactiveFingerPosition( fingerPosition ) {

  const _relactiveFingerPosition = {
    x: fingerPosition.x - this.x - this.shiftX,
    y: fingerPosition.y - this.y - this.shiftY
  };

  const inRange = ( num, min, max ) => {
    const _inRange = ( min <= num && num <= max );
    return _inRange;
  }
if ( inRange( _relactiveFingerPosition.x, 0, this.width ) && inRange( _relactiveFingerPosition.y, 0, this.height ) ) return _relactiveFingerPosition;

return false;

}

assignTouchevent( eventType, fingerPosition ) {

  const _relactiveFingerPosition = this.getRelactiveFingerPosition( fingerPosition );

  switch ( eventType ) {
    case 'touchstart' :
      if ( _relactiveFingerPosition ) this.ontouchstart( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
      break;

    case 'touchmove' :
      if ( _relactiveFingerPosition ) this.ontouchmove( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
      break;

    case 'touchend' :
      this.ontouchend( _relactiveFingerPosition.x, _relactiveFingerPosition.y );
      break;
  }
}


onenterframe() {}

ontouchstart() {}

ontouchmove() {}

ontouchend() {}
}
