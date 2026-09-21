(function(root){
'use strict';
const seed=()=>({owned:12400,reserve:12400,locked:0,guard:0,tired:0,tickets:9640,controller:'red',day:6,season:'S1',phase:'open',dispatchId:null,battleSettled:false,claim:false,coins:20000,vouchers:0,lastAid:0,aidUsed:[],partnerGuard:0,aidPosted:false,guide:'g-s0',guideDone:false,aidGuide:false,reinforceGuide:false,sim:false,simCount:0,recruited:false,tutorialRecruited:false});
const clone=x=>JSON.parse(JSON.stringify(x));
class Engine{
 constructor(state){this.state=state?clone(state):seed()}
 reset(id){this.state=seed();const s=this.state;if(/^g-/.test(id)&&id!=='g-paused')s.guide=id;if(/^e-(win|owned|ledger|aid)/.test(id)){s.reserve-=800;s.guard=560;s.tired=160;s.owned-=80;s.tickets+=400;s.controller='blue';s.battleSettled=true;s.dispatchId='demo-1'}if(['e-march','e-battle','e-event','e-changed','e-network'].includes(id)){s.locked=800;s.reserve-=800;s.dispatchId='demo-1'}if(id==='e-lose'){s.reserve-=400;s.tired=240;s.owned-=160;s.battleSettled=true;s.dispatchId='demo-1'}if(/^e-(close|last|pending)/.test(id)){s.phase='closing';s.locked=800;s.reserve-=800;s.dispatchId='demo-1'}if(id==='e-champion'||/^f-/.test(id)){s.phase='settled';s.tickets=10440;s.controller='blue'}if(id==='e-changed')s.controller='blue';if(id==='f-claimed'||id==='f-history'){s.claim=true;s.coins+=20000;s.vouchers=3}if(id==='e-locked')s.day=2;if(id==='e-short')s.reserve=700,s.guard=s.owned-700;if(id==='e-busy')s.guard=800,s.reserve-=800;if(id==='e-aid-post')s.aidPosted=true;if(id==='e-aid-arrived')s.aidPosted=false,s.partnerGuard=400;this.check();return clone(s)}
 check(){const s=this.state;for(const k of ['owned','reserve','locked','guard','tired'])if(!Number.isFinite(s[k])||s[k]<0)throw new Error('invalid resource '+k);if(s.owned!==s.reserve+s.locked+s.guard+s.tired)throw new Error('fan conservation violated');return true}
 get(){return clone(this.state)} restore(s){this.state={...seed(),...clone(s)};this.check()}
 transition(to,action,from){const s=this.state;
  if(from?.startsWith('g-')&&from!=='g-paused')s.guide=from;
  if(action==='skipGuide'){s.guide=from;return 'g-paused'}
  if(action==='resumeGuide')return s.guide||'g-s0';
  if(action==='day6'){s.day=6;s.phase='open'}
  if(action==='dispatch'){
   if(s.dispatchId&&!s.battleSettled){return 'e-march'}
   if(s.phase!=='open')return 'e-close';
   if(s.guard>0)return 'e-busy';
   if(s.reserve<800)return 'e-short';
   s.reserve-=800;s.locked+=800;s.dispatchId='order-'+Date.now();s.battleSettled=false;
  }
  if(action==='win'||action==='lose'){
   if(s.battleSettled)return to;
   if(s.locked<800)return 'e-select';
   s.locked-=800;s.battleSettled=true;
   if(action==='win'){s.guard+=560;s.tired+=160;s.owned-=80;s.tickets+=400;s.controller='blue'}
   else{s.reserve+=400;s.tired+=240;s.owned-=160;s.tickets+=100}
  }
  if(action==='convert'){s.guard+=s.locked;s.locked=0;s.controller='blue';s.battleSettled=true}
  if(action==='recall'){s.reserve+=s.locked;s.locked=0;s.dispatchId=null;s.battleSettled=false}
  if(action==='reinforce'){if(s.phase!=='open')return 'e-close';if(s.controller!=='blue')return 'e-changed';if(s.reserve<100)return 'e-short';s.reserve-=100;s.guard+=100}
  if(action==='postAid'){if(s.phase!=='open')return 'e-close';if(s.controller!=='blue')return 'e-changed';s.aidPosted=true}
  if(action==='receiveAid'){if(s.phase!=='open')return 'e-close';if(s.aidPosted){s.partnerGuard+=400;s.aidPosted=false}}
  if(action==='closing'){s.phase='closing';s.aidPosted=false}
  if(action==='closeFinish'){
   if(s.locked){s.reserve+=s.locked;s.locked=0;s.tickets+=400;s.battleSettled=true}
   s.reserve+=s.guard;s.guard=0;s.partnerGuard=0;s.phase='settled';s.controller='blue';s.aidPosted=false;
  }
  if(action==='claim'){if(s.phase!=='settled')return 'e-pending';if(!s.claim){s.claim=true;s.coins+=20000;s.vouchers+=3}}
  if(to==='f-claimed'&&!s.claim)return 'f-reward';
  if(action==='nextSeason'){s.season='S2';s.day=1;s.tickets=0;s.phase='open';s.reserve+=s.guard+s.locked;s.guard=0;s.locked=0;s.controller=null;s.dispatchId=null;s.battleSettled=false;s.partnerGuard=0;s.claim=false}
  if(action==='recruit'&&!s.recruited){s.owned+=1500;s.reserve+=1500;s.recruited=true}
  if(action==='tutorialRecruit'&&!s.tutorialRecruited){s.owned+=1500;s.reserve+=1500;s.tutorialRecruited=true}
  if(action?.startsWith('aid100-')||action==='aid400'){const targets=action==='aid400'?['luna','mika','jason','fourth']:[action.slice(7)],fresh=targets.filter(t=>!s.aidUsed.includes(t)),amount=fresh.length*100;if(s.reserve<amount)return 'e-short';s.reserve-=amount;s.guard+=amount;s.lastAid=amount;s.aidUsed.push(...fresh)}
  if(action==='simStart'){s.sim=true;s.simCount=1}
  if(action==='simFinish')s.sim=false;
  if(action==='tutorialComplete')s.guideDone=true,s.sim=false;
  if(action==='aidGuideDone')s.aidGuide=true;
  if(action==='reinforceGuideDone')s.reinforceGuide=true;
  if(to.startsWith('g-')&&to!=='g-paused')s.guide=to;
  this.check();return to;
 }
 values(){const s=this.state,f=n=>n.toLocaleString('en-US');return {...Object.fromEntries(Object.entries(s).map(([k,v])=>[k,typeof v==='number'?f(v):v])),afterDispatch:f(Math.max(0,s.reserve-800)),combinedGuard:f(s.guard+s.partnerGuard),controller:s.controller==='blue'?'蓝 · 星光联盟':s.controller==='red'?'红 · 炽焰联盟':'暂无控制方',blueControl:s.controller==='blue'?'驻守中':'—',redControl:s.controller==='red'?'驻守中':'—',claimLabel:s.claim?'已领取':'待领取'};}
}
root.IDOLEngine=Engine;if(typeof module==='object')module.exports=Engine;
})(typeof window==='object'?window:globalThis);
