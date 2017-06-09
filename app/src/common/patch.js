export const patch = function(w){
  w = w || window; 
  w.astar.search = function(a, b, d, e, f){
    let g = 3000 + map_increase / 2;
    w.astar.init(a, b, g + 1);
    f = f || w.astar.manhattan;
    e = !!e;
    let h = astar.heap();
    for (h.push(b); 0 < h.size();) {
      var l = h.pop();
      if (l === d) {
        a = l;
        for (b = []; a.parent;) b.push(a),
          a = a.parent;
          return b.reverse();
      }
      l.closed = !0;
      for (let p = w.astar.neighbors(a, l, e, b, g), k = 0, q = p.length; k < q; k++) {
        var s = p[k];
        if (!s.closed && !s.isWall()) {
          var u = l.g + s.cost,
          n = s.visited;
          if (!n || u < s.g) s.visited = !0, s.parent = l, s.h = s.h || f(s.pos, d.pos), s.g = u, s.f = s.g + s.h, n ? h.rescoreElement(s) : h.push(s)
        }
      }
    }
    return [];
  }
  w.astar.getTheCost = function(a, b, d, e, f) {
    var g = 3000 + w.map_increase / 2;
    w.astar.init(a, b, g + 1);
    f = f || w.astar.manhattan;
    e = !!e;
    var h = w.astar.heap();
    for (h.push(b); 0 < h.size();) {
      var l = h.pop();
      if (l === d) {
        a = l;
        var overallCost=0;
        for (b = []; a.parent;) b.push(a),
          a = a.parent,overallCost+=a.cost;
        return overallCost;
      }
      l.closed = !0;
      for (var p = w.astar.neighbors(a, l, e, b, g), k = 0, q = p.length; k < q; k++) {
        var s = p[k];
        if (!s.closed && !s.isWall()) {
          var u = l.g + s.cost,
              n = s.visited;
          if (!n || u < s.g) s.visited = !0, s.parent = l, s.h = s.h || f(s.pos, d.pos), s.g = u, s.f = s.g + s.h, n ? h.rescoreElement(s) : h.push(s)
        }
      }
    }
    return -1;
  }
  w.findCostFromTo = function(a, b, d) {
    if (minimap) return [];
    if (0 == node_graphs[d.map].nodes[b.i][b.j].type) {
      b = w.sortClosestTo(a, [{
        i: Math.max(b.i - 1, 0),
        j: b.j
      }, {
        i: Math.min(b.i + 1, map_size_x),
        j: b.j
      }, {
        i: b.i,
        j: Math.max(b.j - 1, 0)
      }, {
        i: b.i,
        j: Math.min(b.j + 1, map_size_y)
      }]);
      for (b.reverse(); 0 < b.length && 0 == w.node_graphs[d.map].nodes[b[b.length - 1].i][b[b.length - 1].j].type;) b.pop();
      if (0 == b.length) return [];
      b = b[b.length - 1]
    }
    costOfT = w.astar.getTheCost(w.node_graphs[d.map].nodes, w.node_graphs[d.map].nodes[a.i][a.j], w.node_graphs[d.map].nodes[b.i][b.j]);
    return costOfT;
  }
  w.map_walkable = function(a, b, d) {
    return "undefined" == typeof w.on_map[a] || "undefined" == typeof w.on_map[a][b] || "undefined" == typeof w.on_map[a][b][d] || w.on_map[a][b][d].blocking ? !1 : 0 != w.node_graphs[a].nodes[b][d].type
  }
  w.genSafeMap = function(map){
    let objs = w.objects_data;
    let mCopy = [];
    for(let i=0;i<w.map_graphs[map].length;i++){
        mCopy[i] = [];
        for(let k=0; k< w.map_graphs[map][i].length;k++){
            mCopy[i][k] = w.map_graphs[map][i][k];
        }
    }
    for(let i=0;i<objs.length;i++){
      if(objs[i] && objs[i].map == map && objs[i].params.aggressive!=undefined){
        if(objs[i].params.aggressive && w.FIGHT.calculate_monster_level(objs[i])>(w.players[0].params.combat_level - 20)){
          if((w.FIGHT.calculate_monster_level(objs[i]) - w.players[0].params.combat_level) <= 5){
            w.setGraphNode(mCopy,objs[i].i,objs[i].j,Math.pow(w.FIGHT.calculate_monster_level(objs[i]),4),true);
            w.setGraphNode(mCopy,objs[i].i+1,objs[i].j,Math.pow(w.FIGHT.calculate_monster_level(objs[i]),4)*100,false);
            w.setGraphNode(mCopy,objs[i].i,objs[i].j+1,Math.pow(w.FIGHT.calculate_monster_level(objs[i]),4)*100,false);
            w.setGraphNode(mCopy,objs[i].i-1,objs[i].j,Math.pow(w.FIGHT.calculate_monster_level(objs[i]),4)*100,false);
            w.setGraphNode(mCopy,objs[i].i,objs[i].j-1,Math.pow(w.FIGHT.calculate_monster_level(objs[i]),4)*100,false);
          }else{
            w.setGraphNode(mCopy,objs[i].i,objs[i].j,0,true);
            w.setGraphNode(mCopy,objs[i].i+1,objs[i].j,0,false);
            w.setGraphNode(mCopy,objs[i].i,objs[i].j+1,0,false);
            w.setGraphNode(mCopy,objs[i].i-1,objs[i].j,0,false);
            w.setGraphNode(mCopy,objs[i].i,objs[i].j-1,0,false);
          }
        }else{
          w.setGraphNode(mCopy,objs[i].i,objs[i].j,Math.pow(w.FIGHT.calculate_monster_level(objs[i]),2) + 5,true);
        }
      }
    }
    return mCopy;
  }
  w.setSafe = function(bool,map){
    if(bool){
      w.node_graphs[map] = new w.Graph(w.genSafeMap(map));
    }else{
      w.node_graphs[map] = new w.Graph(w.map_graphs[map]);
    }
  }
  w.setAllSafe = function(bool){
    for(var myI=0; myI<w.maps;myI++){
      setSafe(bool,myI);
    }
  }
  w.pos = function(obj){
    return {j:obj.j,i:obj.i};
  }
  w.getClosest2 = function(objects){
    var minCost=null;
    var tCost;
    var objs = objects;
    var sObj = null;
    for(var k=0; k<objs.length;k++){
      tCost = w.findCostFromTo(w.players[0],w.pos(objs[k]),w.players[0]);
      if(tCost){
        if(minCost == null && typeof tCost == "number" && tCost != -1){
          minCost = tCost;
          sObj = objs[k];
        }else{
          if(typeof tCost == "number" && tCost != -1 && tCost < minCost){
            console.log("Old: " + minCost + ", new: " + tCost);
            sObj = objs[k];
            minCost = tCost;
          }
        }
        if(minCost == 0){
          break;
        }
      }
    }
    return sObj;
  }
  w.findObjects = function(name){
    var objects = [];
    for(let i=0; i<w.on_map[w.current_map].length;i++){
      if(w.on_map[w.current_map][i]){
        for(let j=0;j<w.on_map[w.current_map][i].length;j++){
          obj = w.obj_g(w.on_map[w.current_map][i][j]);
          if(obj){
            if(obj.name.toLowerCase() == name.toLowerCase()){
              objects.push(obj);
            }
          }
        }
      }
    }
    return objects;
  }
  w.moveAndAction = function(posit,callback,param){
    w.waitForDoneMove(callback,posit,param);
  }
  w.waitForDoneMove = function(callback,pos,optObj){
    if(!(w.findPathFromTo(w.players[0],pos,w.players[0]).length < 4) && w.players[0].path.length == 0){
      w.movePlayer(pos);
    }
    if(w.players[0].path.length == 0){
      callback.call(optObj);
    }else{
      setTimeout(w.waitForDoneMove,500,callback,pos,optObj);
    }
  }
  w.movePlayer = function(pos){
    w.players[0].path = w.findPathFromTo(w.players[0],pos,w.players[0]);
  }
  w.setGraphNode = function(graph,x,y,type,dc){
    if(graph[x][y] != 0 || dc){
      graph[x][y] = type;
    }
  }
  w.getClosest = function(objects){
    var sPath = null;
    var sObj;
    var tPath;
    var objs = objects;
    for(var k=0; k<objs.length;k++){
      tPath = w.findPathFromTo(w.players[0],{i:objs[k].i,j:objs[k].j},w.players[0]);
      if(tPath){
        if(sPath == null && (tPath.length || Math.sqrt(Math.pow(objs[k].j-w.players[0].j,2) + Math.pow(objs[k].i-w.players[0].i,2))<2 )){
          sPath = tPath;
          sObj = objs[k];
        }else{
          if( Math.sqrt(Math.pow(objs[k].j-w.players[0].j,2) + Math.pow(objs[k].i-w.players[0].i,2))<2 || (tPath.length && (sPath.length > tPath.length))){
            console.log("newPath: " + tPath.length + " : " + sPath.length + " : " +  (tPath.length && (sPath.length > tPath.length)));
            sPath = tPath;
            sObj = objs[k];
          }
        }
        if(sPath && !sPath.length){
          break;
        }
      }
    }
    return sObj;
  }
  w.interact = function(obj,l){
    var l=l|0;
    var o = obj_g(obj);
    if(o){
      if(DEFAULT_FUNCTIONS[o.activities[l].toLowerCase()]){
        DEFAULT_FUNCTIONS[o.activities[l].toLowerCase()](o,players[0]);
      }else if(o.base().fn[o.activities[l].toLowerCase()]){
        o.base().fn[o.activities[l].toLowerCase()](o,players[0]);
      }
    }
  }
  w.objectAt = function(i,j){
    return w.obj_g(w.on_map[w.current_map][i][j]);
  }
} 