(function(root){
'use strict';
const seed=()=>({owned:12400,reserve:12400,locked:0,guard:0,territoryGuard:0,tired:0,tickets:9640,controller:'red',day:6,season:'S1',phase:'open',dispatchId:null,battleSettled:false,claim:false,coins:20000,vouchers:0,lastAid:0,aidUsed:[],partnerGuard:0,aidPosted:false,guide:'g-s0',guideDone:false,aidGuide:false,reinforceGuide:false,sim:false,simCount:0,selectedTeam:1,lastRecall:0,aidReturnTo:null,notice:'',returnAfterRecruit:null,recruited:false,tutorialRecruited:false,fanRate:83.3,teamFans:1200,aidAmount:2000,teamTarget:false,teamReturn:'home'});
const clone=x=>JSON.parse(JSON.stringify(x));
class Engine{
 constructor(state){this.state=state?clone(state):seed()}
 reset(id){
  id=root.IDOLData?.aliases?.[id]||id;
  this.state=seed();const s=this.state;
  if(['home','support','a-boost','a-rules','a-flyer-tip','a-stick-tip'].includes(id)){s.reserve=800;s.tired=s.owned-800}
  if(/^g-/.test(id)&&id!=='g-paused')s.guide=id;
  if(/^e-(win|owned|aid|recalled)/.test(id)){s.reserve-=800;s.guard=560;s.tired=160;s.owned-=80;s.tickets+=1500;s.controller='blue';s.battleSettled=true;s.dispatchId='demo-1'}
  if(['e-battle','e-event','e-changed','e-network'].includes(id)){s.locked=800;s.reserve-=800;s.dispatchId='demo-1'}
  if(id==='e-lose'){s.reserve-=400;s.tired=240;s.owned-=160;s.tickets+=450;s.battleSettled=true;s.dispatchId='demo-1'}
  if(id==='e-close'){s.phase='closing';s.locked=800;s.reserve-=800;s.dispatchId='demo-1'}
  if(/^f-/.test(id)){s.phase='settled';s.tickets=10440;s.controller='blue'}
  if(id==='f-claimed'){s.claim=true;s.coins+=20000;s.vouchers=3}
  if(id==='f-next'){s.season='S2';s.day=1;s.phase='open';s.tickets=0;s.controller=null}
  if(id==='e-changed')s.controller='blue';
  if(id==='guard'){s.territoryGuard=5000;s.reserve-=5000}
  if(id==='e-locked')s.day=2;
  if(id==='e-short'){s.reserve=700;s.tired=s.owned-700}
  if(id==='e-busy'){s.guard=800;s.reserve-=800;s.controller='blue';s.battleSettled=true}
  if(id==='e-recalled'){s.lastRecall=s.guard;s.reserve+=s.guard;s.guard=0;s.dispatchId=null;s.battleSettled=false}
  if(id==='e-aid-post')s.aidPosted=true;
  if(id==='e-aid-arrived'){s.aidPosted=false;s.partnerGuard=400}
  if(['g-sim','g-sim-event'].includes(id)){s.sim=true;s.simCount=1}
  if(id==='g-sim-result')s.simCount=1;
  this.check();return clone(s)
 }
 check(){const s=this.state;for(const k of ['owned','reserve','locked','guard','territoryGuard','tired'])if(!Number.isFinite(s[k])||s[k]<0)throw new Error('invalid resource '+k);if(s.owned!==s.reserve+s.locked+s.guard+s.territoryGuard+s.tired)throw new Error('fan conservation violated');return true}
 get(){return clone(this.state)} restore(s){this.state={...seed(),...clone(s)};this.check()}
 transition(to,action,from){to=root.IDOLData?.aliases?.[to]||to;const s=this.state;s.notice='';
  if(to==='aid-edit'&&from==='guard')s.aidReturnTo='guard';
  if(s.aidReturnTo&&to==='map-low'&&['aid-edit','aid'].includes(from))to=s.aidReturnTo;
  if(to==='guard')s.aidReturnTo=null;
  if(from?.startsWith('g-')&&from!=='g-paused')s.guide=from;
  if(action==='skipGuide'){s.guide=from;return 'g-paused'}
  if(action==='resumeGuide')return s.guide||'g-s0';
  if(action==='targetTeam'){s.teamTarget=true;s.teamReturn='territory'}
  if(action==='teamBattle'){to=s.teamTarget?'battle':'map';s.teamTarget=false}
  if(action==='closeTeam')to=s.teamReturn||'home';
  if(action==='teamMinus')s.teamFans=Math.max(1000,s.teamFans-100);
  if(action==='teamPlus')s.teamFans=Math.min(2000,s.teamFans+100);
  if(action==='aidMinus')s.aidAmount=Math.max(1000,s.aidAmount-100);
  if(action==='aidPlus')s.aidAmount=Math.min(2000,s.aidAmount+100);
  if(action==='autoTeam')s.notice='已自动分配现有 IDOL，编队已保存。';
  if(action==='saveTeam')s.notice='编队已保存，继续当前出战。';
  if(action==='selectIdol')s.notice='已选择 IDOL，点击下方保存。';
  if(action==='resetTeam')s.notice='已恢复默认编队。';
  if(action?.startsWith('buyFans')){const amount=Number(action.slice(7));if([600,1000,2000].includes(amount)){s.owned+=amount;s.reserve+=amount;s.notice='演示补给 +'+amount+' 粉丝，已直接入池。'}}
  if(action==='boost10'||action==='boost100'){s.fanRate=action==='boost10'?200:2000;s.notice='自然增长加速已生效。'}
  if(action==='requestAid')s.notice='已请求 '+s.aidAmount+' 位应援粉丝。';
  if(action==='recruitForNormal')s.returnAfterRecruit='territory';
  if(action==='leaveRecruit'&&s.returnAfterRecruit){to=s.returnAfterRecruit;s.returnAfterRecruit=null;}
  if(action==='day6'){s.day=6;s.phase='open'}
  if(action==='dispatch'){
   if(s.dispatchId&&!s.battleSettled){return s.controller==='blue'?'e-changed':'e-battle'}
   if(s.phase!=='open')return 'e-close';
   if(s.guard>0)return 'e-busy';
   if(s.reserve<800)return 'e-short';
   s.reserve-=800;s.locked+=800;s.dispatchId='order-'+Date.now();s.battleSettled=false;
  }
  if(action==='win'||action==='lose'){
   if(s.battleSettled)return to;
   if(s.locked<800)return 'e-map';
   s.locked-=800;s.battleSettled=true;
   if(action==='win'){s.guard+=560;s.tired+=160;s.owned-=80;s.tickets+=1500;s.controller='blue'}
   else{s.reserve+=400;s.tired+=240;s.owned-=160;s.tickets+=450}
  }
  if(action==='recallTerritory'){s.lastRecall=s.territoryGuard;s.reserve+=s.territoryGuard;s.territoryGuard=0;s.notice='编队 1 已召回，可再次派遣。'}
  if(action==='recallStage'){
   if(s.phase!=='open')return s.phase==='settled'?'f-result':'e-close';
   if(s.guard>0){s.lastRecall=s.guard;s.reserve+=s.guard;s.guard=0}
   s.partnerGuard=0;s.aidPosted=false;s.dispatchId=null;s.battleSettled=false;
  }
  if(action==='station'){
   if(s.phase!=='open')return s.phase==='settled'?'f-result':'e-close';
   if(s.controller!=='blue')return 'e-map';
   if(s.guard>0)return 'e-owned';
   if(s.reserve<800)return 'e-short';
   s.reserve-=800;s.guard=800;s.battleSettled=true;s.dispatchId='station-'+Date.now();
  }
  if(action==='convert'){s.guard+=s.locked;s.locked=0;s.controller='blue';s.battleSettled=true}
  if(action==='recall'){s.reserve+=s.locked;s.locked=0;s.dispatchId=null;s.battleSettled=false}
  if(action==='reinforce'){if(s.phase!=='open')return 'e-close';if(s.controller!=='blue')return 'e-changed';if(s.reserve<100)return 'e-short';s.reserve-=100;s.guard+=100}
  if(action==='postAid'){if(s.phase!=='open')return 'e-close';if(s.controller!=='blue')return 'e-changed';s.aidPosted=true}
  if(action==='receiveAid'){if(s.phase!=='open')return 'e-close';if(s.aidPosted){s.partnerGuard+=400;s.aidPosted=false}}
  if(action==='closing'){s.phase='closing';s.aidPosted=false}
  if(action==='closeFinish'){
   if(s.locked){s.reserve+=s.locked;s.locked=0;s.tickets+=1500;s.battleSettled=true}
   s.reserve+=s.guard+s.territoryGuard;s.guard=0;s.territoryGuard=0;s.partnerGuard=0;s.phase='settled';s.controller='blue';s.aidPosted=false;
  }
  if(action==='claim'){if(s.phase!=='settled')return 'e-close';if(!s.claim){s.claim=true;s.coins+=20000;s.vouchers+=3}}
  if(to==='f-claimed'&&!s.claim)return 'f-result';
  if(action==='nextSeason'){s.season='S2';s.day=1;s.tickets=0;s.phase='open';s.reserve+=s.guard+s.territoryGuard+s.locked;s.guard=0;s.territoryGuard=0;s.locked=0;s.controller=null;s.dispatchId=null;s.battleSettled=false;s.partnerGuard=0;s.claim=false}
  if(action==='recruitForBattle'){s.returnAfterRecruit='e-map';s.recruited=false}
  if(action==='recruit'&&!s.recruited){s.owned+=1500;s.reserve+=1500;s.recruited=true}
  if(s.returnAfterRecruit&&(action==='recruit'||to==='home')){to=s.returnAfterRecruit;s.returnAfterRecruit=null}
  if(action==='tutorialRecruit'&&!s.tutorialRecruited){s.owned+=1500;s.reserve+=1500;s.tutorialRecruited=true}
  if(action?.startsWith('aid100-')||action==='aid400'){const targets=action==='aid400'?['luna','mika','jason','fourth']:[action.slice(7)],fresh=targets.filter(t=>!s.aidUsed.includes(t)),amount=fresh.length*100;if(s.reserve<amount)return 'e-short';s.reserve-=amount;s.guard+=amount;s.lastAid=amount;s.aidUsed.push(...fresh);s.notice=amount?'已增援 '+amount+' 位粉丝。':'这条请求已增援，未重复扣除粉丝。'}
  if(action==='simStart'){s.sim=true;s.simCount=1}
  if(action==='simFinish')s.sim=false;
  if(action==='tutorialComplete')s.guideDone=true,s.sim=false;
  if(action==='aidGuideDone')s.aidGuide=true;
  if(action==='reinforceGuideDone')s.reinforceGuide=true;
  if(to.startsWith('g-')&&to!=='g-paused')s.guide=to;
  if(to==='guard'&&!s.territoryGuard){s.territoryGuard=Math.min(5000,s.reserve);s.reserve-=s.territoryGuard}
  if((action==='win'||action==='lose')&&s.phase==='closing'){return this.transition('f-result','closeFinish',from)}
  this.check();return to;
 }
 values(){const s=this.state,f=n=>n.toLocaleString('en-US');return {...Object.fromEntries(Object.entries(s).map(([k,v])=>[k,typeof v==='number'?f(v):v])),fanPercent:(s.fanRate/20).toFixed(2),fanWait:s.reserve>=2000?'粉丝池已满':'补满 '+new Date(Math.round((2000-s.reserve)/(s.fanRate===83.3?2000/24:s.fanRate)*3600)*1000).toISOString().slice(11,19),allGuard:f(s.guard+s.territoryGuard),teamName:'小队 '+s.selectedTeam,afterReinforce:f(s.guard+100),afterDispatch:f(Math.max(0,s.reserve-800)),combinedGuard:f(s.guard+s.partnerGuard),controller:s.controller==='blue'?'蓝 · 星光联盟':s.controller==='red'?'红 · 炽焰联盟':'暂无控制方',blueControl:s.controller==='blue'?'驻守中':'—',redControl:s.controller==='red'?'驻守中':'—',claimLabel:s.claim?'已领取':'待领取'};}
}
root.IDOLEngine=Engine;if(typeof module==='object')module.exports=Engine;
})(typeof window==='object'?window:globalThis);
