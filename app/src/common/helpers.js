import { patch } from './patch.js';

export class GameHelper{
  constructor(proxy){
    this._proxy = proxy;
  }

  get proxy(){
    return this.proxy;
  }

}