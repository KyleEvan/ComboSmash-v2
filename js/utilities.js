	
		function getMouse(e){
			var mouse = {} // make an object
			mouse.x = e.pageX - e.target.offsetLeft;
			mouse.y = e.pageY - e.target.offsetTop;
			return mouse;
		}
		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
			  x: evt.clientX - rect.left,
			  y: evt.clientY - rect.top
			};
		}
		function findDirection(x,y,vx,vy){
			var enemyDirection;
			if(x >= y){
				if(vx <= 0) enemyDirection = "left";
				if(vx >= 0) enemyDirection = "right";
			}else{
				if(vy <= 0) enemyDirection = "up";
				if(vy > 0) enemyDirection = "down";
			}
			return enemyDirection;
		}
		
		
		function distance( p1, p2, enemy )
		{
		  var xs = 0;
		  var ys = 0;
		 
		  xs = enemy.location.x - p1;
		  xs = xs * xs;
		 
		  ys = enemy.location.y - p2;
		  ys = ys * ys;
		 
		  return Math.sqrt( xs + ys );
		}
		function pointInsideCircle(x,y,I){
			var dx = x - I.location.x;
			var dy = y - I.location.y;
			return dx * dx + dy * dy <= I.radius * I.radius; 
		
		}
		function dotProduct(a,b){
			// get the magnitudes
			// magnitude = sqrt(ux^2 + uy^2)
			var mag1 = Math.round(Math.sqrt((Math.pow(a.x,2)+Math.pow(a.y,2))));
			var mag2 = Math.round(Math.sqrt((Math.pow(b.x,2)+Math.pow(b.y,2))));
			// dot product to find start angle in radians
			// dot product = cos-1((ux*vx + uy*vy)/(|u|*|v|))
			var angle = Math.acos((a.x*b.x)/(mag1*mag2));
			return angle;
		}
		function circlesIntersect(c1,c2){
			var dx = c2.location.x - c1.location.x;
			var dy = c2.location.y - c1.location.y;
			var distance = Math.sqrt(dx*dx + dy*dy);
			return distance < c1.radius + c2.radius;
			
		}
		function circlesIntersect2(c1,c2){
			var dx = c2.x - c1.location.x;
			var dy = c2.y - c1.location.y;
			var distance = Math.sqrt(dx*dx + dy*dy);
			var radius = c2.radius;
			return distance < c1.radius + radius;
			
		}
		function getRandom(min,max){
			return Math.floor(Math.random() * (max - min) + min);
		
		}
		//very specific function to return a value that is either 0 or 640
		function getNum(min,max){
			var num = Math.floor(Math.random() * (max - min) + min);
			
			if( num <= max/2){
				return min;
			}
			else{
			return max;
			}

		}
		
		function getRandomDecimal(min,max){
			return (Math.random() * (max - min) + min);		
		}
		
		function clamp(val, min, max){
			return Math.max(min, Math.min(max, val));
		}
		
		
		/*
			Function Name: clamp(cal, min, max)
			Author: Web - various sources 
			Return Value: the contrained value
			Description: returns a value that is contstrained between min and max (inclusive)
		*/