import React from 'react';

import { GameHelper } from 'common/helpers.js';
import { patch } from 'common/patch.js';
import { Subject } from 'rxjs';

class CallProxy{
  constructor(chan,frame){
    this.frame = frame;
    this.nextId = 0;
    this.chan = chan;
    this.subjects = {};
    this.frame.addEventListener('ipc-message',(...args) => this.handleMessage(...args));
  }
  
  handleMessage(event){
    let id = event.channel;
    this.subjects[id].next(...event.args);
    this.subjects[id].complete();
    this.subjects[id] = null;
    
  }

  eval(...args){
    let id = `${this.chan}: ${this.nextId++}`;
    this.frame.send('eval-with-return',id,...args)
    this.subjects[id] = new Subject();
    return this.subjects[id];
  }

  call(func,...args){
    let id = `${this.chan}: ${this.nextId++}`;
    this.frame.send('call-with-return',id,func,...args)
    this.subjects[id] = new Subject();
    return this.subjects[id];
  }
}


export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      helper: null,
      loaded: false,
      proxy: null
    }
    this.frame = null;
  }

  onFrameLoad(){
    this.frame.send('inject',patch.toString());
    this.frame.send('call','patch');
    let proxy = new CallProxy("default",this.frame);
    this.setState(Object.assign({},this.state,{
      loaded: true,
      proxy: proxy,
      helper: new GameHelper(proxy)
    }));
  }

  componentDidMount(){
    if(this.frame){
      window.frame = this.frame;
      this.frame.addEventListener('dom-ready', () => {
        this.onFrameLoad();
      });
    }
  }

  setFrame(ref){
    this.frame = ref;
  }

  render(){
    let MoTools = this.state.loaded ? <span>Has Window</span> : <span>Loading ...</span>

    return (
      <div>
        <webview 
          ref={(...a) => this.setFrame(...a)} 
          src="http://rpg.mo.ee/" 
          preload="./injector.js"
        />
        {MoTools}
      </div>
    );
  }
}