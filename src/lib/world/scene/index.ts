import * as thr from "three";
import { EventEmitter } from "events";

export class WorldScene extends EventEmitter {
  private _scene: thr.Scene;
  private _camera: thr.Camera;
  private _renderer: thr.WebGLRenderer;
  private _textureLoader: thr.TextureLoader;
  private _light: thr.DirectionalLight;
  private _ambientLight: thr.AmbientLight;

  private _paused: boolean;

  constructor() {
    super();

    this._scene = new thr.Scene();

    this._ambientLight = new thr.AmbientLight(0x555555);

    this._light = new thr.DirectionalLight();
    this._light.position.set( 0.5, 0.5, 1 );

    this._scene.add(this._ambientLight);
    this._scene.add(this._light);

    this._camera = new thr.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this._camera.position.z = 5;

    this._renderer = new thr.WebGLRenderer();
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.shadowMap.enabled = true;

    this._textureLoader = new thr.TextureLoader();

    document.body.appendChild( this._renderer.domElement );

    this._paused = true;
  }

  on(eventName: 'frame', listener: (time: DOMHighResTimeStamp) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener);
  }

  emit(eventName: 'frame', time: DOMHighResTimeStamp): boolean;
  emit(eventName: string | symbol, ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }

  get paused() {
    return this._paused;
  }

  pause() {
    this._paused = true;
  }

  start() {
    this._paused = false;
    requestAnimationFrame( (time) => this.animate(time) );
  }

  animate(time: DOMHighResTimeStamp) {
    if (!this._paused)
      requestAnimationFrame( (time) => this.animate(time) );

    this.emit('frame', time);
  
    this._renderer.render( this._scene, this._camera );
  }

  createTexturedCube(textureName: string) {
    const geometry = new thr.BoxGeometry(1, 1, 1);
    let texture;

    try {
      texture = this._textureLoader.load(textureName);
    } catch (e) {
      console.log(e);
    }

    const material = new thr.MeshPhongMaterial({
      color: 0xffffff,
      map: texture
    });

    const cube = new thr.Mesh( geometry, material );

    this._scene.add(cube);

    return cube;
  }

  get camera() {
    return this._camera;
  }

  get scene() {
    return this._scene;
  }

  get renderer() {
    return this._renderer;
  }

  static createScene() {
    const PScene = new this();

    const grid = new thr.GridHelper();
    grid.position.y -= 1;

    PScene._scene.add( grid );

    return PScene;
  }
}