class Platform{constructor(t,s,l,i,e="#8B4513"){this.x=t,this.y=s,this.width=l,this.height=i,this.color=e}draw(t,s=0){t.fillStyle=this.color,t.fillRect(this.x-s,this.y,this.width,this.height),t.fillStyle="rgba(0, 0, 0, 0.2)";for(let l=0;l<this.width;l+=30)t.fillRect(this.x-s+l,this.y,15,5)}}const LevelGenerator={generateLevel:function(t,s){const l=800,i=[],e=Math.ceil(5);for(let t=0;t<e;t++)if(t>0&&t<e-1&&Math.random()<.3){const s=l-Utils.randomInt(100,200);i.push(new Platform(t*l,560,s,40,"#8B4513"))}else i.push(new Platform(t*l,560,l,40,"#8B4513"));const o=4e3/15;for(let t=0;t<15;t++){const s=Utils.randomInt(1,3);for(let l=0;l<s;l++){const s=Utils.randomInt(100,200),l=t*o,e=(t+1)*o-l-s,h=l+Utils.randomInt(s/2,e-s/2),r=180,n=480,a=Utils.randomInt(r,n);let f=!0;for(let t of i)if(Math.abs(t.y-a)<100&&Math.abs(t.x+t.width/2-(h+s/2))<o){f=!1;break}f&&i.push(new Platform(h,a,s,20))}}return i.push(new Platform(3700,450,250,30,"#FF0000")),i}};