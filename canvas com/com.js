//Global variables
var handlers={},l;

//Canvas Object Model
COM={
	objs:[],
	components:[],
	init:function(canvas){
		this.canvas=document.getElementById(canvas)
		this.ctx=this.canvas.getContext('2d')
	},
	
	
	add_component:function(name,array){
		this.components[name]=array;	
	},
	add_obj:function(id,name,array){
		
		//To copy and not link the two objects
		this.objs[id]={};
		for(var a in this.components[name]){
			this.objs[id][a]=this.components[name][a]
		}
		for(var a in array){
			this.objs[id][a]=array[a];
		}
		
	},
	remove_obj:function(id){
		delete this.objs[id];
		
	},
	get:function(id){
		return this.objs[id];
	},
	each:function(func){
		for(a in this.objs){
			func(this.objs[a]);
		}
	},
	bind:function(event,callback){
		if (!handlers[event]) handlers[event] = {};
		var hd = handlers[event];
		
		if (!hd[this[0]]) hd[this[0]] = [];
			hd[this[0]].push(callback); 
		return this;
	},
	unbind:function(event){
		if (handlers[event]) delete handlers[event];
		return this;
	},
	trigger:function(event, data){
		if(handlers[event] && handlers[event][this[0]]){
			var callbacks = handlers[event][this[0]];
			for (var i=0; i < callbacks.length; i++) {
    			callbacks[i].call(this, data);
			}
		}
		return this;
	},
	on:function(obj,event,callback){
		
		COM.bind('EnterFrame',function(frame){
			switch(event){
				case 'hover':
				for(var i in this.pointer.fingers){	

					if(this.pointer.fingers[i].x>obj.left&&this.pointer.fingers[i].x<(obj.left+obj.width)&&this.pointer.fingers[i].y>obj.top&&this.pointer.fingers[i].y<(obj.top+obj.height)){
						obj.current="hover";
						callback({o:obj,pointer:this.pointer,i:i});
					}
				}
				break;
				case 'hoverHand':
					if(frame.hands.length>0){
						for(var i=0;i<frame.hands.length;i++){
							handx=frame.hands[i].palmPosition[0]
							handy=frame.hands[i].palmPosition[1]
						}
					}
				break;
				case 'escked':
				
				for(var i in this.pointer.fingers){

					if(obj.current=="hover"){
						
						if(this.pointer.fingers[i].x<obj.left||this.pointer.fingers[i].x>(obj.left+obj.width)||this.pointer.fingers[i].y<obj.top||this.pointer.fingers[i].y>(obj.top+obj.height)){

							obj.current="esc";
							callback({o:obj,pointer:this.pointer,i:i});
						}
					}
				}
				break;
			}
		});
	},
	draw:function(){
		//console.time('drawing');
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.save();
		for(var a in this.objs){
			//console.log(this.objs[a]);
			this.objs[a].draw(this.ctx);
			this.ctx.restore();
		}
		
		//console.timeEnd('drawing');
	},
	pointer:{
		offsety:50,
		scalefactor:4/1000,
		hands:{},
		fingers:{},
		init:function(frame){
			//console.group('Pointer');
			this.w=COM.canvas.width
			this.h=COM.canvas.height
			this.handup(frame);
			this.fingerup(frame);
			//console.groupEnd();
		},
		handup:function(frame){
			for(var i=0;i<frame.hands.length;i++){
				this.hands[i]={
					x:this.realx(frame.hands[i].palmPosition[0]),
					y:this.realy(frame.hands[i].palmPosition[1])
				}
			}
		},
		fingerup:function(frame){
			for(var i=0;i<frame.fingers.length;i++){
				this.fingers[i]={
					x:this.realx(frame.fingers[i].tipPosition[0]),
					y:this.realy(frame.fingers[i].tipPosition[1])
				}
			}
		},
		realx:function(x){
			return (this.w/2*this.scalefactor*x)+this.w/2;
		},
		realy:function(y){
			return this.offsety+this.h-(this.h*(y/350));
			
		}
	}
}