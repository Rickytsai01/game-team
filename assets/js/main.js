(function(){
var $=function(i){return document.getElementById(i)};
var S={m:1,k:40,A:0.3,c:0,x:0.3,v:0,t:0,run:true,drag:false,hist:[]};
var sim=$('sim'),gr=$('gr'),sc=sim.getContext('2d'),gc=gr.getContext('2d');
function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function fit(c){var d=window.devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;c.getContext('2d').setTransform(d,0,0,d,0,0)}
function fitAll(){fit(sim);fit(gr)}
window.addEventListener('resize',fitAll);fitAll();

function reset(){S.x=S.A;S.v=0;S.t=0;S.hist=[]}
function sync(){
 S.m=+$('m').value;S.k=+$('k').value;S.A=+$('a').value;S.c=+$('c').value;
 XMAX=Math.max(0.5,S.A*1.15);$('mN').value=S.m;$('kN').value=S.k;$('aN').value=S.A;$('cN').value=S.c;
 var w=Math.sqrt(S.k/S.m),T=2*Math.PI/w;
 $('rT').textContent=T.toFixed(2)+' s';$('rf').textContent=(1/T).toFixed(2)+' Hz';$('rw').textContent=w.toFixed(2)+' rad/s';
 var crit=2*Math.sqrt(S.k*S.m);
 $('note').textContent=S.c===0?'無阻尼：總能量守恆，動能與位能互相轉換。':(S.c<crit?'欠阻尼：振幅逐漸衰減（臨界阻尼約 '+crit.toFixed(2)+'）。':'過阻尼／臨界阻尼：物體不會來回振盪，直接回到平衡位置。');
}
['m','k','a'].forEach(function(id){$(id).addEventListener('input',function(){sync();reset()})});
$('c').addEventListener('input',sync);
['m','k','a','c'].forEach(function(id){var n=$(id+'N'),r=$(id);n.addEventListener('change',function(){
 var v=parseFloat(n.value);if(isNaN(v))v=+r.value;v=Math.max(+n.min,v);r.step='any';if(v>+r.max)r.max=v;if(v<+r.min)r.min=v;r.value=v;sync();if(id!=='c')reset()})});
$('rs').onclick=function(){reset()};
$('pp').onclick=function(){S.run=!S.run;this.textContent=S.run?'暫停':'繼續'};

/* 拖曳物塊 */
var XMAX=0.5;
function pxPerM(){return sim.clientWidth*0.36/XMAX}
function ptrX(e){var r=sim.getBoundingClientRect();return((e.clientX-r.left)-sim.clientWidth*0.55)/pxPerM()}
sim.addEventListener('pointerdown',function(e){S.drag=true;sim.setPointerCapture(e.pointerId);sim.style.cursor='grabbing';mv(e)});
function mv(e){if(!S.drag)return;var x=Math.max(-XMAX,Math.min(XMAX,ptrX(e)));S.x=x;S.v=0}
sim.addEventListener('pointermove',mv);
function up(){if(!S.drag)return;S.drag=false;sim.style.cursor='grab';
 S.A=Math.max(0.05,Math.abs(S.x));$('a').value=S.A.toFixed(2);sync();S.t=0;S.hist=[]}
sim.addEventListener('pointerup',up);sim.addEventListener('pointercancel',up);

function step(dt){
 var a=(-S.k*S.x-S.c*S.v)/S.m;S.v+=a*dt;S.x+=S.v*dt;S.t+=dt;
}
function drawSim(){
 var W=sim.clientWidth,H=sim.clientHeight,g=sc;g.clearRect(0,0,W,H);
 var cx=W*0.55,ppm=pxPerM(),cy=H*0.52,side=Math.min(110,34+S.m*7),mx=cx+S.x*ppm,wall=14;
 g.strokeStyle=css('--line');g.lineWidth=2;g.beginPath();g.moveTo(0,cy+side/2+2);g.lineTo(W,cy+side/2+2);g.stroke();
 g.fillStyle=css('--mute');g.fillRect(0,cy-50,wall,100);
 g.setLineDash([4,4]);g.lineWidth=1;g.strokeStyle=css('--mute');
 [[0,'0'],[S.A,'+A'],[-S.A,'−A']].forEach(function(p){var X=cx+p[0]*ppm;g.beginPath();g.moveTo(X,cy-side/2-26);g.lineTo(X,cy+side/2+16);g.stroke();
  g.setLineDash([]);g.fillStyle=css('--mute');g.font='12px sans-serif';g.textAlign='center';g.fillText(p[1],X,cy+side/2+32);g.setLineDash([4,4])});
 g.setLineDash([]);
 var x0=wall,x1=mx-side/2,n=14,amp=9+Math.min(8,S.m*0);
 g.strokeStyle=css('--spring');g.lineWidth=2.5;g.lineJoin='round';g.beginPath();g.moveTo(x0,cy);
 var seg=(x1-x0-20)/n;g.lineTo(x0+10,cy);
 for(var i=0;i<n;i++){g.lineTo(x0+10+seg*(i+0.5),cy+(i%2?amp:-amp))}
 g.lineTo(x1,cy);g.stroke();
 g.fillStyle=css('--mass');g.beginPath();g.roundRect?g.roundRect(mx-side/2,cy-side/2,side,side,6):g.rect(mx-side/2,cy-side/2,side,side);g.fill();
 g.fillStyle='#fff';g.font='600 13px sans-serif';g.textAlign='center';g.fillText(S.m.toFixed(1)+' kg',mx,cy+5);
 function arrow(len,col,y){if(Math.abs(len)<2)return;g.strokeStyle=col;g.fillStyle=col;g.lineWidth=3;var s=Math.sign(len);
  g.beginPath();g.moveTo(mx,y);g.lineTo(mx+len,y);g.stroke();g.beginPath();g.moveTo(mx+len,y);g.lineTo(mx+len-s*8,y-5);g.lineTo(mx+len-s*8,y+5);g.fill()}
 arrow(Math.max(-110,Math.min(110,S.v*Math.sqrt(S.m/S.k)/Math.max(S.A,.05)*60)),css('--vel'),cy-side/2-12);
 arrow(Math.max(-110,Math.min(110,-S.x/Math.max(S.A,.05)*60)),css('--force'),cy+side/2+10-24+24);
}
var WIN=6;
function drawGraph(){
 var W=gr.clientWidth,H=gr.clientHeight,g=gc;g.clearRect(0,0,W,H);
 var L=34,R=W-8,T=10,B=H-52,mid=(T+B)/2,h=(B-T)/2;
 g.strokeStyle=css('--line');g.lineWidth=1;g.beginPath();g.moveTo(L,mid);g.lineTo(R,mid);g.moveTo(L,T);g.lineTo(L,B);g.stroke();
 g.fillStyle=css('--mute');g.font='11px sans-serif';g.textAlign='right';g.fillText('+1',L-4,T+8);g.fillText('0',L-4,mid+4);g.fillText('−1',L-4,B);
 var t1=Math.max(WIN,S.t),t0=t1-WIN,w=Math.sqrt(S.k/S.m),va=S.A*w;
 function plot(key,norm,col){g.strokeStyle=col;g.lineWidth=2.2;g.beginPath();var f=true;
  for(var i=0;i<S.hist.length;i++){var p=S.hist[i];if(p.t<t0)continue;var X=L+(p.t-t0)/WIN*(R-L),Y=mid-p[key]/norm*h;if(f){g.moveTo(X,Y);f=false}else g.lineTo(X,Y)}g.stroke()}
 plot('x',S.A,css('--mass'));plot('v',va,css('--vel'));
 var X=L+(S.t-t0)/WIN*(R-L);g.fillStyle=css('--mass');g.beginPath();g.arc(X,mid-S.x/S.A*h,4,0,7);g.fill();
 g.fillStyle=css('--mute');g.textAlign='center';g.fillText('時間 t（s）',(L+R)/2,B+14);
 /* 能量長條 */
 var E0=0.5*S.k*S.A*S.A,KE=0.5*S.m*S.v*S.v,PE=0.5*S.k*S.x*S.x,bw=R-L,by=B+24;
 function bar(y,v,col,lab){g.fillStyle=css('--line');g.fillRect(L,y,bw,7);g.fillStyle=col;g.fillRect(L,y,Math.min(1,v/E0)*bw,7);g.fillStyle=css('--mute');g.textAlign='right';g.fillText(lab,L-4,y+7)}
 bar(by,KE,css('--vel'),'KE');bar(by+13,PE,css('--force'),'PE');
 $('rx').textContent=S.x.toFixed(3)+' m';$('rv').textContent=S.v.toFixed(2)+' m/s';
 $('re').textContent=KE.toFixed(2)+' / '+PE.toFixed(2)+' J';
}
var last=performance.now(),acc=0;
function loop(now){
 var el=Math.min(0.05,(now-last)/1000);last=now;
 if(S.run&&!S.drag){acc+=el;var rate=Math.max(Math.sqrt(S.k/S.m),S.c/S.m),dt=Math.min(1/480,0.2/rate),it=0;while(acc>=dt&&it++<20000){step(dt);acc-=dt}if(acc>=dt)acc=0;
  var h=S.hist;if(!h.length||S.t-h[h.length-1].t>0.012){h.push({t:S.t,x:S.x,v:S.v});if(h.length>1200)h.shift()}}
 drawSim();drawGraph();requestAnimationFrame(loop);
}
sync();reset();requestAnimationFrame(loop);
})();

(function(){
var $=function(i){return document.getElementById(i)};
$('aiBtn').onclick=function(){$('aiWin').classList.toggle('open');if($('aiWin').classList.contains('open'))$('aiIn').focus()};
$('aiX').onclick=function(){$('aiWin').classList.remove('open')};
function add(c,t){var d=document.createElement('div');d.className='mg '+c;d.textContent=t;$('aiMsgs').appendChild(d);$('aiMsgs').scrollTop=1e9}
function compose(q){var m=+$('m').value,k=+$('k').value,A=+$('a').value,c=+$('c').value;
return '我在用簡諧運動（SHM）彈簧振子模擬學習，目前參數：質量 m='+m+' kg，彈力常數 k='+k+' N/m，振幅 A='+A+' m，阻尼 c='+c+' N·s/m，週期 T='+(2*Math.PI*Math.sqrt(m/k)).toFixed(3)+' s。請用繁體中文簡潔回答：'+q}
function copy(t){var ok=false;try{var x=document.createElement('textarea');x.value=t;x.style.position='fixed';x.style.opacity='0';document.body.appendChild(x);x.select();ok=document.execCommand('copy');document.body.removeChild(x)}catch(e){}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).catch(function(){})}return ok||!!navigator.clipboard}
function run(open){var q=$('aiIn').value.trim();if(!q){add('a','請先輸入問題。');return}
 var t=compose(q);var ok=copy(t);
 if(open)window.open('https://chatgpt.com/?q='+encodeURIComponent(t),'_blank','noopener');
 add('u',t);add('a',ok?'已複製到剪貼簿。'+(open?'若 ChatGPT 頁面沒有自動帶入問題，請直接貼上。':'請到 ChatGPT 貼上。'):'複製失敗，請手動選取上方文字複製。');
 $('aiIn').value=''}
$('aiGo').onclick=function(){run(true)};$('aiCopy').onclick=function(){run(false)};
$('aiIn').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();run(true)}});
})();