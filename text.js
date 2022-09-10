'use strict'

class Text {

constructor( text ) {

  this.text = text;

  this.font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";

  this.x = this.y = 0;

  this.vx = this.vy = 0;

  this.baseline = 'top';

  this.size = 10;

  this.color = '#FFD400';

  this.weight = 'normal';

  this._width = 0;

  this._height = 0;

  this._isCenter = false;

  this._isMiddle = false;
}

center() {
  this._isCenter = true;

  return this;
}

middle() {
  this.baseline = 'middle'

  this._isMiddle = true;

  return this;
}


update( canvas ) {

  const _ctx = canvas.getContext( '2d' );

  _ctx.font = `${this.weight} ${this.size}px ${this.font}`;

  _ctx.fillStyle = this.color;

  _ctx.textBaseline = this.baseline;

  this._width = _ctx.measureText( this.text ).width;

  this._height = Math.abs( _ctx.measureText( this.text ).actualBoundingBoxAscent ) + Math.abs( _ctx.measureText( this.text ).actualBoundingBoxDescent );

if ( this._isCenter ) this.x = ( canvas.width - this._width ) / 2;

if ( this._isMiddle ) this.y = canvas.height / 2;

  this.render( canvas, _ctx );

  this.onenterframe();

  this.x += this.vx;
  this.y += this.vy;
}

render( canvas, ctx ) {

  if ( this.x < -1 * this._width || this.x > canvas.width ) return;
  if ( this.y < -1 * this._height || this.y > canvas.height + this._height ) return;

  ctx.fillText( this.text, this.x, this.y );
}

getRelactiveFingerPosition( fingerPosition ) {

let _relactiveFingerPosition = {
  x: fingerPosition.x - this.x,
  y: fingerPosition.y - this.y + this._height
};
if ( this.baseline === 'top' || this.baseline === 'hanging' ) {
  _relactiveFingerPosition = {
    x: fingerPosition.x - this.x,
    y: fingerPosition.y - this.y
  };
}
if ( this.baseline === 'middle' ) {
  _relactiveFingerPosition = {
    x: fingerPosition.x - this.x,
    y: fingerPosition.y - this.y + this._height/2
  };
}
const inRange = ( num, min, max ) => {
  const _inRange = (min <= num && num <=max );
  return _inRange;
}

if ( inRange( _relactiveFingerPosition.x, 0, this._width ) && inRange( _relactiveFingerPosition.y, 0, this._height ) ) return _relactiveFingerPosition;
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
