var intui = intui || {};
intui.loader = (function(){
  var templ = '<div class="_intui_loader"><div class="_intui_loader_wrap"><div class="_intui_loader_nub _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick2 _intui_loader_c"/><div class="_intui_loader_tick _intui_loader_c"/><div class="_intui_loader_tick _intui_loader_c"/><div class="_intui_loader_tick _intui_loader_c"/><div class="_intui_loader_tick _intui_loader_c"/></div></div>';
  var d = 40;
  var loading = false;
  var trans = 1;
  var easein = 'cubic-bezier(0.310,2.5, 0.170, 1.010)'
  var easeout = 'cubic-bezier(.75,.19,.13,.84)'
  var trans2 = 1;
  var go = function(el){
     if(!el._intui_loader) return;
     $(el._intui_loader.querySelectorAll('._intui_loader_tick')).each(function(i){
      if(this == el) return;
       //just fuck around with this for hours....
       if(i%2){
           var x = Math.sin(i*1.5)*d;
           var y = Math.cos(-el._intui_loader_start + Date.now()/700+i/2.5)*d*1.5;
           this.style.transform ='translate('+x+'px,'+y+'px) scale('+(2-Math.abs(Math.sin(Date.now()/2800+i)))+')';
       }else{
           var x = Math.sin(el._intui_loader_start + Date.now()/700+i/1.3)*d;
           var y = -Math.cos(el._intui_loader_start + Date.now()/700+i/1.5)*d/1.2;
           this.style.transform ='translate('+x+'px,'+y+'px) scale('+(1.7-Math.abs(Math.sin(Date.now()/2800+i)))+')';
       }
       //-----------------------
    });
    window.requestAnimationFrame(el._intui_lo);
  }
  var slide = function(el,nub,ldr,split){

    //console.log(split)
    switch(split){
      default:
        var t = 'translate(0px,0px)';
        break;
      case 'left':
        var t = 'translate('+(-el.clientWidth)+'px,'+0+'px)';
        break;
      case 'right':
        var t = 'translate('+(el.clientWidth)+'px,'+0+'px)';
        break;
      case 'down':
        var t = 'translate(0px,'+(el.clientHeight)+'px)';
        break;
      case 'up':
        var t = 'translate(0px,'+(-el.clientHeight)+'px)';  
    }
    nub.style.webkitTransform = ldr.style.webkitTransform = t
  }


  
  var neighbors = function(el,split,time){
		
    var el = el,split = split,time = time;
    
    $(el).children().each(function(i){
     		
      console.log(this.nodeType)
      if(this.nodeType != 1) return;
      
      
      if(this == el._intui_loader) return

     
      
      if(split == null && time == 0){
        console.log('NO')
        $(neigh).css('-webkit-transition',null)
        return;
      }else if(split != null){
        console.log('YES')
         console.log(this.style)
        this._transv = this.style.webkitTransition
        this._transf = this.style.webkitTransform 
      }
      this.style.webkitTransition = 'transform '+time+'s '+easeout+' 0s';
      slide(el,this,this,split);
      
    });
    
    for(var i =0;i< el.childNodes.length;i++){
      var neigh = el.childNodes[i];
      console.log('child:',neigh)

    }
  }

  //spread the other ticks around
  var spreadaround = function(el){
    var ticks = el.querySelectorAll('._intui_loader_tick2');
   $(ticks).each(function(i){
      var a_off = 0
      var angle = -0.2+Math.PI/2.5*i+a_off;
      var dd = d;
      var s = 1.5
      if(i>4){
        dd = d*2
        angle = 2+Math.PI/2.5*i+a_off;
        s = 2;
      }
      this.style.webkitTransform = 'translate('+(Math.cos(angle)*dd*3)+'px,'+(Math.sin(angle)*dd*3)+'px) scale('+(s+Math.random()*0.5)+')';
   })
  }

  return{
    delaystart: function(el,split,d){
      setTimeout(function() {this.start(el,split)}.bind(this),d);
    },
    start: function(el,split){
      var q = $(el);
      var el = $(el)[0];
      if(el._intui_loader != null) return false
      q.append(templ);
      spreadaround(el);
      var nub = el.querySelector('._intui_loader_nub')
      el._intui_loader = el.querySelector('._intui_loader');
      el._intui_loader_start = Date.now();
      nub.style.webkitTransform = 'scale(0)';
      nub.style.webkitTransition = 'transform '+trans+'s '+easein+' 0s';
      el._intui_loader.style.opacity = 1;
      nub.style.webkitTransform = 'scale(1)';
 
      el._intui_lo = function(){
        go(this);
      }.bind(el);
      
			console.log(el);
      //set position for neighbors
      neighbors(el,split,0);

      el._intui_lo();
    },
    
    end: function(el,split){
      var el = $(el)[0],q = $(el),nub = el.querySelector('._intui_loader_nub')
      if(el._intui_loader == null) return;
      nub.style.webkitTransition = 'transform '+trans2+'s '+easeout+' 0s';
      el._intui_loader.style.webkitTransition = 'all '+trans2+'s '+easeout+' 0s';

      neighbors(el,null,trans2);
      setTimeout(function(){
        neighbors(el,null,0);

      }, trans2*1000);
      //el.querySelector('._intui_loader').style.opacity = 0.6
      
      slide(el,nub,el.querySelector('._intui_loader'),split);
     
      el._intui_loader = null;
      el._intui_lo = null;  
      setTimeout(function(){
         this.removeChild( el.querySelector('._intui_loader'));

      }.bind(el),trans2*1000+100);
    }
  }
})();



intui.loader.start('#test1','down');
//intui.loader.start('#test1','down');
//intui.loader.start('#test2');
//intui.loader.start('#test3');
//intui.loader.start('#test4');
var i = 0,j=0,k=0,l=0;

var b = setInterval(function(){
  j++;
  if(j%2){
    intui.loader.start('#test1','down');
  }else{
    intui.loader.end('#test1','up');
  }
	

},1600)



/*setInterval(function(){
  l++;
  if(l%2){
    intui.loader.start('#test2','up');
  }else{
    intui.loader.end('#test2','down');
  }
},1600)*/
