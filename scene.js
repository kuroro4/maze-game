'use strict'

class Scene{

  constructor(){
    this.objs = [];
  }

  add(obj){
    //this.objs.push(obj);
    if ( obj instanceof Sprite || obj instanceof Text || obj instanceof Tilemap ) this.objs.push( obj );
		//引数がSprite、Text、Tilemapでなければ、コンソールにエラーを表示
		else console.error( 'Sceneに追加できるのはSprite、Text、Tilemapだけだよ！' );
  }
update(canvas){
   this.onenterframe();
}

assignTouchevent( eventType, fingerPosition ) {

  switch ( eventType ) {
    case 'touchstart' :
      this.ontouchstart( fingerPosition.x, fingerPosition.y );
      break;

    case 'touchmove' :
      this.ontouchmove( fingerPosition.x, fingerPosition.y );
      break;

    case 'touchend' :
      this.ontouchend( fingerPosition.x, fingerPosition.y );
      break;
  }

for ( let i=0; i<this.objs.length; i++ ) {

  this.objs[i].assignTouchevent( eventType, fingerPosition );
    }
}

onenterframe() {}

ontouchstart() {}

ontouchmove() {}

ontouchend() {}

onchangescene() {}

}
