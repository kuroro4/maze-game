'use strict'

class Game{
  constructor(width,height){
  this.canvas=document.createElement('canvas');
  document.body.appendChild(this.canvas);
  this.canvas.width=width||320;
  this.canvas.height=height||320;

  this.scenes = [];

  this.currentScene;

  this.sounds = [];

  this._isAlreadyTouched = false;

  this._hasFinishedSetting = false;

  this._preloadPromises = [];

  this._temporaryCurrentScene;

  this.input = {};

  this._keys = {};
  }

preload() {

  const _assets = arguments;

  for ( let i=0; i<_assets.length; i++ ) {

      this._preloadPromises[i] = new Promise( ( resolve, reject ) => {

        if ( _assets[i].match( /\.(jpg|jpeg|png|gif)$/i ) ) {

            let _img = new Image();

            _img.src = _assets[i];

            _img.addEventListener( 'load', () => {
              resolve();
            }, { passive: true, once: true } );

            _img.addEventListener( 'error', () => {
              reject( `「${_assets[i]}」は読み込めないよ！`);
            }, { passive: true, once: true } );
          }

          else if ( _assets[i].match( /\.(wav|wave|mp3|ogg)$/i ) ) {
    					//_soundに、あなたはサウンドですよ、と教える
    					let _sound = new Sound();
    					//_sound.srcに、引数で指定した音声ファイルを代入
    					_sound.src = _assets[i];
    					//this.soundsに、読み込んだ音声を入れておく
    					this.sounds[ _assets[i] ] = _sound;
    					//音声を再生する準備をする
    					this.sounds[ _assets[i] ].load();

    					//サウンドが読み込み終わったら、成功ということで、resolve()を呼び出す
    					_sound.addEventListener( 'canplaythrough', () => {
    						resolve();
    					}, { passive: true, once: true } );

    					//サウンドが読み込めなければ、エラーということで、reject()を呼び出す
    					_sound.addEventListener( 'error', () => {
    						reject( `「${_assets[i]}」は読み込めないよ！` );
    					}, { passive: true, once: true } );
    				}

          else {
            reject( `「${_assets[i]}」の形式は、プリロードに対応していないよ！` )
          }
      } );
  }
}

main( callback ) {
    Promise.all( this._preloadPromises ).then( result => {
      callback();
    } ).catch( reject => {
      console.error( reject );
    });
}

start(){

  this.keybind('up','ArrowUp');
  this.keybind('down','ArrowDown');
  this.keybind('right','ArrowRight');
  this.keybind('left','ArrowLeft');

  this.currentScene = this.currentScene || this.scenes[0];

const _resizeEvent = () => {

  const _ratio = Math.min( innerWidth / this.canvas.width, innerHeight / this.canvas.height );
    this.canvas.style.width = this.canvas.width*_ratio + 'px';
    this.canvas.style.height = this.canvas.height*_ratio + 'px';
}

addEventListener( 'resize', _resizeEvent, { passive: true } );

_resizeEvent();

  this._mainLoop();

  this._waitUserManipulation();

  //this._setEventListener();
}

_setEventListener(){

const _keyEvent=e=>{

e.preventDefault();

for(let key in this._keys){

  switch(e.type){
  case 'keydown':
    if(e.key===this._keys[key])this.input[key]=true;
  break;

  case 'keyup':
    if(e.key===this._keys[key])this.input[key]=false;
  break;
  }
}

}

addEventListener('keydown',_keyEvent,{passive:false});

addEventListener('keyup',_keyEvent,{passive:false});



const _touchEvent = e => {

  e.preventDefault();

  const _touches = e.changedTouches[0];

  const _rect = _touches.target.getBoundingClientRect();

  const _fingerPosition = {
    x: ( _touches.clientX - _rect.left ) / _rect.width * this.canvas.width,
    y: ( _touches.clientY - _rect.top ) / _rect.height * this.canvas.height
  };

  const _eventType = e.type;

  this.currentScene.assignTouchevent( _eventType, _fingerPosition );
}

this.canvas.addEventListener( 'touchstart', _touchEvent, { passive: false } );

this.canvas.addEventListener( 'touchmove', _touchEvent, { passive: false } );

this.canvas.addEventListener( 'touchend', _touchEvent, { passive: false } );
}

_waitUserManipulation() {
		//すべての音声を再生する
		const _playAllSounds = e => {
			//デフォルトのイベントを発生させない
			e.preventDefault();
			//画面にタッチされたかどうかの変数をtrueにする
			this._isAlreadyTouched = true;

			//音声を再生するためのプロミスを入れておく配列
			const _playPromises = [];

			//this.soundsの数だけ繰り返す
			//この繰り返しは、読み込まれた音声を、最初に全て同時に再生してしまおうというもの
			//こうすることで、スマホのブラウザなどの、音声を自動で流せないという制限を解決できる
			for ( let sound in this.sounds ) {
				//音声を再生する準備をする
				this.sounds[ sound ].load();
				//音声をミュートにする
				this.sounds[ sound ].muted = true;
				//音声を再生するメソッドはPromiseを返してくれるので、soundPromiseに追加
				_playPromises.push( this.sounds[ sound ].play() );
			}

			//Promiseが成功か失敗かのチェーン
			Promise.all( _playPromises ).then( () => {
				//成功した場合は全ての音をストップする
				for ( let sound in this.sounds ) {
					this.sounds[ sound ].stop();
				}
			} ).catch( err => {
				//失敗した場合はエラーを表示
				console.log( err );
			} );

			//音声を再生するときのエラーを防ぐために、すこしだけ待つ
			setTimeout( () => {
				//イベントリスナーをセットする
				this._setEventListener();
				this._hasFinishedSetting = true;
			}, 2000 );
		} //_playAllSounds() 終了

		//タッチされたときや、なにかキーが押されたとき、_playAllSoundsを呼び出す
		this.canvas.addEventListener( 'touchstart', _playAllSounds, { passive: false, once: true } );
		addEventListener( 'keydown', _playAllSounds, { passive: false, once: true } );
	}

_mainLoop(){
  const ctx=this.canvas.getContext('2d');

  ctx.fillStyle='#000000';

  ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

  if ( !this._isAlreadyTouched ) this.startPanel();
		//設定がすでに終了しているとき
		else if ( this._hasFinishedSetting ) {

  this.currentScene.update();

  if ( this._temporaryCurrentScene !== this.currentScene ) this.currentScene.onchangescene();

  for(let i=0; i<this.currentScene.objs.length; i++){

    this.currentScene.objs[i].update(this.canvas);
  }

  this._temporaryCurrentScene = this.currentScene;
}

  requestAnimationFrame(this._mainLoop.bind(this));
}

startPanel() {
		//表示したいテキストを_textに代入
		const _text = 'タップ、またはなにかキーを押してね！'
		//表示したいテキストのフォントを_fontに代入
		const _font = "游ゴシック体, 'Yu Gothic', YuGothic, sans-serif";
		//フォントサイズは、ゲーム画面の横幅を20で割ったもの。（今回は表示したい文字が18文字なので、左右の余白も考え、20で割る）
		const _fontSize = this.canvas.width/20;
		//画家さん（コンテキスト）を呼ぶ
		const _ctx = this.canvas.getContext( '2d' );
		//テキストの横幅を取得
		const _textWidth = _ctx.measureText( _text ).width;
		//フォントの設定
		_ctx.font = `normal ${_fontSize}px ${_font}`;
		//ベースラインを文字の中央にする
		_ctx.textBaseline = 'middle';
		//テキストの色をグレーに設定
		_ctx.fillStyle = '#aaaaaa';
		//テキストを上下左右中央の位置に表示
		_ctx.fillText( _text, ( this.canvas.width - _textWidth )/2, this.canvas.height/2 );
	}


add(scene){

  if(scene instanceof Scene)this.scenes.push(scene);

  else console.error('Gameに追加できるのはSceneだけだよ！');

  }

keybind(name,key){
  this._keys[name]=key;
  this.input[name]=false;
}
}
