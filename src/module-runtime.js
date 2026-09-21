(function(root){
'use strict';
const G=root.GameWire,F=G.fmt;let c;
const copy=v=>JSON.parse(JSON.stringify(v));
const training=id=>/^train|^return-training/.test(id||'');
const battle=id=>/battle/.test(id||'')&&!training(id)&&id!=='resume-war';
const win=id=>/^(win|novice-win|central-win)/.test(id||'');
const result=id=>win(id)||/^lose/.test(id||'');
const editor=id=>/^(teams|teams25|teams100|teams2|team-luna)$/.test(id||'');
const deploy=id=>/deploy/.test(id||'')&&!/^train/.test(id||'');
function reset(id='home'){
  const s=G.screens.find(s=>s.id===id),hud=s?.ops.find(o=>o.t==='text'&&o.y===89);
  let owned=hud?Number((hud.text.match(/[\d,]+/)||['12,400'])[0].replaceAll(',','')):12400;
  if(id.startsWith('s0'))owned=['s0-gift','s0-done'].includes(id)?1500:0;
  if(/^train|^s1-|^s2-|^novice/.test(id))owned=1500;
  c={owned,coins:20000,diamonds:1000,contribution:1800,guildPoints:1248,season:1,seasonClosed:false,
    sent:5000,loss:1400,guard:0,returning:0,reserve:owned,outsideReturn:'map',
    teams:[{name:'主力队',leader:'Echo',style:'Pop',size:5000},{name:'支援队',leader:'Luna',style:'EDM',size:3000}],editIndex:0,selectedTeam:0,draft:null,
    batch:0,battle:null,live:null,liveBatch:0,occupied:{},lastResult:'win',
    giftReceived:false,firstFansGiven:false,seasonClaimed:false,shopBought:false,donations:0,
    selectedIdol:{name:'Echo',rank:1,heat:'12,840'},singleTarget:'Echo',singleClaimed:false,multiClaimed:false,
    badges:[],contentVotes:{},lastChoice:'专属剧情',heatDelta:{},formalCount:0,tickGain:12};
  c.draft=copy(c.teams[0]);
  if(id==='teams2'){c.editIndex=1;c.draft=copy(c.teams[1]);}
  if(id==='team-luna')c.draft={...c.draft,leader:'Luna',style:'EDM'};
  if(id==='teams25')c.draft.size=2500;if(id==='teams100')c.draft.size=10000;
  if(['deploy-safe','battle-safe','win-safe'].includes(id))c.teams[0].size=3000;
  if(['deploy-all','battle-all','win-all'].includes(id))c.teams[0].size=10000;
  if(id==='deploy-luna')c.teams[0]={...c.teams[0],leader:'Luna',style:'EDM'};
  if(/^map-low|^guard-low|^aid-compose|^aid-posted/.test(id)){c.owned=3400;c.guard=3400;}
  if(['aid-received','guard-aided','map-aided'].includes(id)){c.owned=5400;c.guard=5000;c.giftReceived=true;}
  if(/^reserve/.test(id)){c.owned=11000;c.returning=700;}
  if(result(id)||/^guard-setup|^map-guard|^map-after/.test(id)){c.owned=11000;c.guard=3600;c.returning=700;c.occupied['7']=3600;}
  if(/^lose/.test(id)){c.owned=10000;c.loss=2400;c.guard=0;c.returning=1200;c.lastResult='lose';c.occupied={};}
  if(['aid','donate-confirm','donate-done','aid-partial'].includes(id)){c.guard=5000;if(['donate-done','aid-partial'].includes(id)){c.owned=11400;c.donations=1;}}
  if(['guard-active','guard-off'].includes(id)){c.owned=11000;c.guard=5000;c.occupied['7']=5000;}
  if(/^novice/.test(id)){c.owned=1500;c.teams[0].size=1500;c.sent=1500;c.loss=0;c.returning=0;c.guard=id==='novice-win'?1500:0;}
  if(id==='single-claimed'){c.singleClaimed=true;c.badges=['Echo 应援徽章'];}
  if(id==='multi-claimed'){c.multiClaimed=true;c.badges=['同台应援徽章'];}
  if(id==='season-claimed'){c.seasonClaimed=true;c.seasonClosed=true;c.diamonds+=300;}
  if(id==='shop-done'){c.shopBought=true;c.contribution=1500;}
  if(['season','season-claimed','rest'].includes(id)){c.seasonClosed=true;c.guildPoints=26480;}
  if(id==='score-tick'){c.guildPoints=1260;c.occupied['7']=3600;c.guard=3600;c.owned=11000;}
  if(/^live-ready/.test(id))c.live={token:1,status:'ready',claimed:false};
  if(battle(id)){c.batch=1;c.sent=Math.min(c.owned,c.teams[0].size);c.battle={token:1,settled:false,leader:c.teams[0].leader,sent:c.sent,novice:id==='novice-battle',area:id==='battle8'?'8':id==='central-battle'?'C':'7'};}
  sync();return copy(c);
}
function sync(){c.reserve=Math.max(0,c.owned-c.guard);}
function restore(value){c=copy(value);sync();}
function enter(id,from,act){
  if(act?.type==='leader')c.draft={...c.draft,leader:act.name,style:act.style};
  if(act?.type==='squad'){c.selectedTeam=act.index;id=c.outsideReturn.includes('deploy')?c.outsideReturn:'deploy';}
  if(act?.type==='idol')c.selectedIdol={name:act.name,rank:act.rank,heat:act.heat};
  if(act?.type==='content'){c.lastChoice=act.choice;c.contentVotes[c.selectedIdol.name]=act.choice;}
  if(G.screens.find(s=>s.id===from)?.zone==='outside'&&G.screens.find(s=>s.id===id)?.zone==='inside')c.outsideReturn=deploy(from)?from:from==='war-teams'?'deploy':result(from)?'map-after':/^map/.test(from)?from:'map';
  if(id==='resume-war')id=c.seasonClosed?'rest':c.outsideReturn;
  if(id==='map'&&c.seasonClosed)return 'rest';
  if(id==='teams'&&!editor(from)&&from!=='leader-team'&&from!=='team-auto'){c.editIndex=c.selectedTeam;c.draft=copy(c.teams[c.editIndex]);}
  if(id==='teams2'){c.editIndex=1;c.draft=copy(c.teams[1]);}
  if(id==='teams25')c.draft.size=2500;if(id==='teams100')c.draft.size=10000;
  if(id==='teams'&&editor(from)&&!act)c.draft.size=5000;
  if(id==='team-auto')c.draft={name:c.teams[c.editIndex].name,leader:'Echo',style:'Pop',size:Math.min(5000,c.owned)};
  if(id==='team-saved'&&editor(from)){c.teams[c.editIndex]=copy(c.draft);c.selectedTeam=c.editIndex;}
  if(id==='territory'&&c.occupied['7'])return 'guard-active';
  if(id==='territory8'&&c.occupied['8'])return 'guard8';
  if(id==='war-teams'&&deploy(from))c.outsideReturn=from;
  if(deploy(id)){c.sent=Math.min(c.teams[c.selectedTeam].size,c.reserve,10000);if(id==='novice-deploy')c.sent=Math.min(1500,c.reserve);if(c.sent<1000)return 'low-fans';}
  if(battle(id)&&deploy(from)){
    if(c.sent<1000)return 'low-fans';const area=from==='deploy8'?'8':from==='central-deploy'?'C':'7';
    if(c.occupied[area])return 'target-changed';
    c.battle={token:++c.batch,settled:false,sent:c.sent,leader:c.teams[c.selectedTeam].leader,novice:from==='novice-deploy',area};
  }
  if(result(id)&&battle(from)&&c.battle&&!c.battle.settled){
    const b=c.battle;b.settled=true;c.sent=b.sent;
    c.loss=b.novice?0:Math.round(b.sent*(id.startsWith('lose')?.48:b.sent<=3000?1/3:b.sent>=10000?.2:.28));
    c.owned=Math.max(0,c.owned-c.loss);c.returning+=Math.floor(c.loss/2);c.lastResult=id;
    if(!id.startsWith('lose')){c.occupied[b.area]=b.sent-c.loss;c.guard+=b.sent-c.loss;}
    c.formalCount++;c.heatDelta[b.leader]=(c.heatDelta[b.leader]||0)+20;sync();
  }
  if(/^live-running/.test(id)&&/^recruit/.test(from||'')){if(!c.live||c.live.claimed)c.live={token:++c.liveBatch,status:'running',claimed:false};}
  if(/^live-ready/.test(id)&&c.live)c.live.status='ready';
  if(/^live-ready/.test(from||'')&&/^support-recruited/.test(id)&&c.live&&!c.live.claimed){c.owned=Math.min(30000,c.owned+1500);c.live.claimed=true;}
  if(id==='support-ad'&&from==='ad'){if(c.coins<1000)return 'ad';c.coins-=1000;c.owned=Math.min(30000,c.owned+1200);}
  if(id==='support-pack'&&from==='pack'){if(c.diamonds<300)return 'pack';c.diamonds-=300;c.owned=Math.min(30000,c.owned+5000);}
  if(id==='s0-gift'&&!c.firstFansGiven){c.owned+=1500;c.firstFansGiven=true;}
  if(id==='support-returned'&&from==='reserve-ready'){c.owned+=c.returning;c.returning=0;}
  if(id==='aid-received'&&from==='aid-posted'&&!c.giftReceived){c.owned+=2000;c.guard+=Math.min(1600,c.owned-c.guard);c.giftReceived=true;c.occupied['7']=c.guard;}
  if(id==='donate-done'&&from==='donate-confirm'){if(c.donations>=2)return 'donate-fulfilled';if(c.reserve<1000)return 'donate-low';c.owned-=1000;c.donations++;}
  if(id==='aid-partial'&&c.donations>=2)id='aid-fulfilled';
  if(id==='guard-active'&&from==='guard-off'&&c.guard<3500){c.guard+=Math.min(5000-c.guard,c.reserve);c.occupied['7']=c.guard;}
  if(id==='season'){c.seasonClosed=true;c.guildPoints=26480;}
  if(id==='rest')c.seasonClosed=true;
  if(id==='score-tick'){c.tickGain=c.seasonClosed?0:Object.keys(c.occupied).reduce((n,key)=>n+(key==='C'?48:12),0);c.guildPoints+=c.tickGain;}
  if(id==='season-claimed'&&from==='season'&&!c.seasonClaimed){c.diamonds+=300;c.seasonClaimed=true;}
  if(id==='shop-done'&&from==='shop-confirm'&&!c.shopBought){if(c.contribution<300)return 'shop';c.contribution-=300;c.shopBought=true;}
  if(id==='single-claimed'&&from==='single-honor'&&!c.singleClaimed&&c.season===1){c.singleClaimed=true;c.badges.push(c.singleTarget+' 应援徽章');}
  if(id==='multi-claimed'&&from==='multi-honor'&&!c.multiClaimed&&c.season===1){c.multiClaimed=true;c.badges.push('同台应援徽章');}
  if(id==='next-season'&&from==='rest'){c.season++;c.seasonClosed=false;c.guildPoints=0;c.singleClaimed=false;c.multiClaimed=false;c.seasonClaimed=false;c.heatDelta={};c.formalCount=0;c.guard=0;c.occupied={};}
  sync();return id;
}
function view(s){
  const v=copy(s),id=s.id,team=c.teams[c.selectedTeam],left=c.sent-c.loss,novice=id.startsWith('novice'),saved=c.teams[c.editIndex],selected=c.selectedIdol;
  const mn=c.sent<=3000?.267:c.sent>=10000?.16:.22,mx=c.sent<=3000?.367:c.sent>=10000?.22:.32;
  const values={
    'saved-name':saved.name+' · '+saved.leader,'saved-size':'计划带队 '+F(saved.size)+' 位',
    'deploy-leader':team.name+' · '+team.leader+' / '+team.style,'deploy-size':'带队 '+F(c.sent)+' 位',
    'loss-range':novice?'0':F(Math.round(c.sent*mn))+' ~ '+F(Math.round(c.sent*mx)),
    'owned-after':'库存 '+F(c.owned)+' → '+(novice?F(c.owned):F(c.owned-Math.round(c.sent*mx))+'~'+F(c.owned-Math.round(c.sent*mn))),
    'loss-failed':novice?'胜负均不消耗 · 保护剩余 3 场':'若战败：预计消耗 '+F(Math.round(c.sent*.48))+' 位',
    'guild-score':'本期公会积分 '+F(c.guildPoints),'season-status':c.seasonClosed?'本期已结束 · 可查看赛季结算':'赛季进行中 · 结束后结算奖励',
    'idol-name':selected.name+(c.season>1?' · 等待上榜':' · 本期第 '+selected.rank+' 名'),
    'idol-heat':c.season>1?'新赛季 · 热度待累计':'应援热度 '+F(Number(selected.heat.replaceAll(',',''))+(c.heatDelta[selected.name]||0)),
    'idol-mine':'我的有效应援 '+(c.season>1?'0':F(320+(c.heatDelta[selected.name]||0))),
    'single-idol':c.singleTarget+' · 本期持续应援','single-reward':c.singleTarget+' 应援徽章 · 展示称号',
    'claim-name':id==='single-claimed'?c.singleTarget+' 应援徽章':'同台应援徽章',
    'content-idol':selected.name,'content-choice':selected.name+' · '+c.lastChoice,
    'collection-0':c.badges.some(b=>b!=='同台应援徽章')?'已收藏 · 可长期展示':'尚未领取 · 去查看',
    'collection-1':c.badges.includes('同台应援徽章')?'已收藏 · 可长期展示':'尚未领取 · 去查看',
    'retained-fans':'应援粉丝 '+F(c.owned)+' · 已保留',
    'retained-team':c.teams[0].name+' '+c.teams[0].leader+' · '+F(c.teams[0].size)+' 位配置',
    'tick-gain':'公会积分 +'+F(c.tickGain),'tick-total':'星光 MCN · '+F(c.guildPoints)+' 分'
  };
  c.teams.forEach((t,i)=>{values['picker-'+i]=t.name+' · '+t.leader;values['picker-size-'+i]='计划带队 '+F(t.size);});
  for(const o of v.ops){
    if(o.t==='text'){
      if(o.bind&&values[o.bind]!==undefined)o.text=values[o.bind];
      if(deploy(id)&&o.text==='Echo'&&o.y===478)o.text=team.leader;
      if(id==='mcn-rank'&&o.text==='查看赛季结算'&&!c.seasonClosed)o.text='赛季结束后领奖';
      if(id==='idol-rank'){
        if(o.y===184)o.text='S'+c.season+' · 盛典应援热度';
        if(o.text.startsWith('应援热度 ')){const names=['Echo','Luna','Mia'],bases=[12840,11600,10360],i=Math.round((o.y-286)/113);o.text='应援热度 '+F(c.season>1?0:bases[i]+(c.heatDelta[names[i]]||0));}
        if(c.season>1&&o.x===44&&o.w===28)o.text='—';
      }
      if(o.y===89&&o.text.includes('○○'))o.text='○○ '+F(c.owned);
      if(o.y===8&&o.text.includes('金币'))o.text='金币 '+F(c.coins)+'  ◇'+F(c.diamonds);
      if(o.y===51&&s.zone==='outside')o.text='MCN '+F(c.guildPoints)+' 分';
      if(o.y===50&&s.zone==='outside')o.text=c.seasonClosed?'本期已结束':'占点大战 S'+c.season+' · Day 2/6';
      if(id.startsWith('support')){if(o.y===210)o.text='○○ '+F(c.owned)+' / 30,000';if(o.y===318)o.text='粉丝跨赛季保留 · 正式出战会消耗';if(['前往 Battle','前往公会战'].includes(o.text))o.text=c.seasonClosed?'赛季休战中':'返回 Battle';}
      if(editor(id)){if(o.y===213)o.text=c.draft.name+' · 公会内部配置';if(o.y===393)o.text=c.draft.leader+' / '+c.draft.style;if(o.y===485)o.text='计划带队 '+F(c.draft.size)+' · 保存不扣粉丝';if(o.y===512)o.text='我的库存 '+F(c.owned)+' · 赛季不清空';if(o.y===553)o.text=F(c.draft.size);}
      if(id==='team-auto'&&o.y===369)o.text=c.draft.leader+' + '+F(c.draft.size)+' 应援粉丝';
      if((id==='ad'||id==='pack')&&o.y===413)o.text=F(c.owned)+' → '+F(Math.min(30000,c.owned+(id==='ad'?1200:5000)));
      if(battle(id)){if(o.y===65)o.text='○○ '+F(c.sent);if(o.y===125&&o.x<100)o.text=(c.battle?.leader||team.leader)+' / '+team.style;}
      if(result(id)&&!training(id)){if(o.y===393&&o.x===206)o.text=F(c.loss)+' / '+F(left);if(o.y===435&&o.x===206)o.text=F(c.owned);if(o.y===481)o.text=novice?'新手保护生效 · 本场消耗 0':F(c.returning)+' 位待回归 · 不计入库存';if(o.y===532)o.text='本次派出 '+F(c.sent)+' 位\n实际流失 '+F(c.loss)+' 位\n本队剩余 '+F(left)+' 位';}
      if(/^guard/.test(id)){if(o.y===270)o.text='○○ '+F(c.guard||left)+' / '+F(c.sent);if(o.y===370&&o.x===206)o.text=F(c.reserve);if(o.y===524&&!['guard-low','guard-aided'].includes(id))o.text='驻守 '+F(c.guard)+' · 待命 '+F(c.reserve);}
      if(id==='reserve'||id==='reserve-ready'){if(o.y===380)o.text=F(c.returning)+' 位';if(o.y===478&&id==='reserve-ready')o.text=F(c.owned)+' → '+F(c.owned+c.returning);}
      if(id==='donate-confirm'){if(o.y===364&&o.x===206)o.text=F(c.reserve)+' → '+F(c.reserve-1000);if(o.y===416&&o.x===206)o.text=F(c.owned)+' → '+F(c.owned-1000);}
      if(id==='donate-done'&&o.y===393)o.text='请求进度 '+F(c.donations*1000)+' / 2,000';
      if(id==='map-guard'&&o.y===635)o.text='7号 · 我方驻守 ○○'+F(c.guard);
      if(id==='low-fans'&&o.y===348)o.text='待命 '+F(c.reserve)+' 位，至少需要1,000位。';
      if(id.startsWith('shop')&&o.text.startsWith('贡献分 '))o.text='贡献分 '+F(c.contribution);
      if(id==='shop-confirm'&&o.y===395&&o.x===206)o.text=F(c.contribution)+' → '+F(c.contribution-300);
      if(id==='season-claimed'&&o.y===438)o.text='当前贡献分 '+F(c.contribution);
      if(id==='return-finish'&&o.y===359)o.text='应援团仍为 ○○'+F(c.owned);
      if(id==='next-season'&&o.text.startsWith('S2'))o.text='S'+c.season+' · 新一期盛典';
      if(['idol-detail','content-intent'].includes(id)&&o.text==='Echo'&&!o.bind)o.text=selected.name;
      if(['single-honor','multi-honor'].includes(id)){if(o.text==='领取荣誉'&&((id==='single-honor'?c.singleClaimed:c.multiClaimed)||c.season>1))o.text=c.season>1?'本期尚未达成':'已领取 · 查看收藏';if(c.season>1&&o.text.includes('✓'))o.text=o.text.replaceAll('✓','○');}
    }
    if(o.t==='hit'){
      if(id.startsWith('support')&&o.label==='×')o.to='home';
      if(id.startsWith('support')&&o.to==='map')o.to=c.seasonClosed?'rest':'resume-war';
      if(id.startsWith('support')&&/^recruit/.test(o.to)&&c.live&&!c.live.claimed)o.to=c.live.status==='ready'?'live-ready':'live-running';
      if(id==='single-honor'&&o.to==='single-claimed'&&c.singleClaimed)o.to='honor-collection';
      if(id==='multi-honor'&&o.to==='multi-claimed'&&c.multiClaimed)o.to='honor-collection';
      if(['single-honor','multi-honor'].includes(id)&&o.label==='领取荣誉'&&c.season>1)o.disabled=true;
      if(id==='shop'&&o.to==='shop-confirm'&&c.shopBought)o.to='shop-done';
      if(id==='mcn-rank'&&o.to==='season'&&!c.seasonClosed)o.disabled=true;
      if(c.occupied['7']&&o.label==='7号')o.to='guard-active';
    }
    if(c.occupied['7']){
      if(o.t==='ellipse'&&o.cx===103&&[410,433].includes(o.cy)&&o.fill===G.P.enemy)o.fill=G.P.friend;
      if(o.t==='text'&&o.text==='7号')o.text='7号 · 我方';
      if(o.t==='text'&&o.y===374&&o.text==='▼ 推荐')o.text='驻守中';
    }
    if(o.t==='poly'&&((id==='mcn-rank'&&!c.seasonClosed&&o.points[0][1]===537)||(c.season>1&&['single-honor','multi-honor'].includes(id)&&o.points[0][1]===662)))o.fill='#52617A';
    if(o.t==='rect'&&id.startsWith('support')&&o.x===44&&o.y===275)o.w=313*c.owned/30000;
    if(editor(id)&&o.t==='rect'&&o.x===48&&o.y===614)o.w=307*c.draft.size/10000;
    if(editor(id)&&o.t==='ellipse'&&o.cy===617)o.cx=47+309*c.draft.size/10000;
  }
  v.ops=v.ops.filter(o=>!o.disabled);
  if(win(id)&&!training(id))v.ops.push({t:'text',x:43,y:368,w:316,h:18,text:'领队 '+(c.battle?.leader||team.leader)+' 的本期应援已记录',z:12,col:G.P.dim,align:'center'});
  return v;
}
reset();G.runtime={reset,enter,view,restore,get:()=>copy(c)};
})(typeof module==='object'?require('./game.js'):window);
