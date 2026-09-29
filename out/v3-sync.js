(function(){
'use strict';
const D=window.IDOLData,S=D.screens,H=(x,y,w,h,to,label,action)=>({x,y,w,h,to,label,action});
const A=name=>'assets/v3-'+name+'.webp';
const screen=(id,module,title,asset,hits=[],extra={})=>S[id]={id,module,title,asset:A(asset),hits,locked:true,synced:true,...extra};
const panel=(id,module,title,body,to,label,extra={})=>S[id]={id,module,title,asset:A('C-map'),body,buttons:[{to,label}],compact:true,synced:true,...extra};
const setFlow=(id,steps,branches=[])=>{const f=D.flows.find(f=>f.id===id);f.steps=steps.map(id=>({id,label:S[id].title}));f.branches=branches;};
const note=t=>`<p class="phone-note">${t}</p>`;
const row=(a,b)=>`<div class="stat-row"><span>${a}</span><b>${b}</b></div>`;
const detail=(a,b)=>`<details class="inline-detail"><summary>${a}</summary>${b}</details>`;
const day=(day,x=76,y=32,w=63)=>({x,y,w,h:20,text:`Day ${day}/6`,className:'day-label'});
D.revision='V3 · 2026-09-28';
D.modules.forEach(m=>{if('ABCDEF'.includes(m.id))m.zone='V3 · 9月28日同步'});
D.modules.find(m=>m.id==='A').summary='粉丝自然恢复；加速立即生效，补给购买后直接入池。';
D.modules.find(m=>m.id==='B').summary='沿用已保存队伍，在同页调配人数、查看胜率与预计损耗，点击 Battle 出战。';
D.modules.find(m=>m.id==='C').summary='地图 → 目标 → 默认编队 → Battle；已删去原稿划掉的中间页。';
D.modules.find(m=>m.id==='D').summary='按本次新稿：驻守底部召回，面板内求援；收到增援后接回驻守。';
D.modules.find(m=>m.id==='E').summary='第6天盛典舞台开启，直接 Battle；三倍积分突出展示。';
D.modules.find(m=>m.id==='F').title='积分 · 排名与赛季奖励';
D.modules.find(m=>m.id==='F').summary='积分详情、每日与赛季排名、奖励预览、赛季最终报告与领取。';
screen('home','A','MCN 主城','A-home',[H(293,550,85,59,'support','Fans · 粉丝招募中心'),H(156,475,127,42,'map','Crew Clash · 进入地图')],{figmaNode:'226:220',note:'主城不提供编队入口；从公会战地图点击目标的占领或挑战流程进入编队。'});
const inRecruit=(x,y,w,h,to,label,action)=>H(8+x*386/425,125+y*619/681,w*386/425,h*619/681,to,label,action);
screen('support','A','Fans Club · 粉丝池','A-support',[
 inRecruit(103,563,222,42,'map','前往出战','leaveRecruit'),inRecruit(261,217,89,36,'a-boost','自然增长加速'),inRecruit(373,67,25,28,'a-rules','查看恢复说明'),
 inRecruit(322,341,77,39,'support','补给 S · +600 · 模拟购买 $2.99','buyFans600'),inRecruit(322,407,77,39,'support','补给 M · +1,000 · 模拟购买 $5.99','buyFans1000'),inRecruit(322,473,77,39,'support','补给 L · +2,000 · 模拟购买 $9.99','buyFans2000'),inRecruit(195,626,39,36,'home','关闭粉丝中心','leaveRecruit')
],{figmaNode:'368:13',note:'按最新稿：取消直播、等待、加速确认与领奖串行弹窗。自然恢复常驻显示；购买补给立即到账，加速购买后立即生效。本网页购买均为演示，无支付请求。',overlays:[{x:70,y:258,w:92,h:31,text:'{{reserve}}',className:'pool-value'},{x:234,y:247,w:107,h:29,text:'+{{fanRate}}',className:'rate-value'},{x:244,y:296,w:91,h:15,text:'≈ {{fanPercent}}% / 小时',className:'rate-detail'},{x:244,y:356,w:92,h:18,text:'{{fanWait}}',className:'pool-wait'}]});
const inBoost=(x,y,w,h,to,label,action)=>H(12+x*378/432,210+y*375/429,w*378/432,h*375/429,to,label,action);
screen('a-boost','A','自然增长加速','A-boost',[
 inBoost(43,292,155,40,'support','宣传单 · 模拟购买 $0.99','boost10'),inBoost(231,292,158,40,'support','应援棒 · 模拟购买 $2.99','boost100'),inBoost(96,148,91,71,'a-flyer-tip','宣传单详情'),inBoost(281,148,87,71,'a-stick-tip','应援棒详情'),inBoost(194,389,42,37,'support','返回粉丝池')
],{figmaNode:'368:30',note:'价格按钮立即完成演示购买并回到粉丝池；图标及问号只打开标准说明浮层。'});
panel('a-rules','A','恢复说明',row('自然上限','2,000 Fans')+note('24 小时恢复上限的 100%，每小时约 +83.3 Fans；离线也会恢复，达到自然上限后暂停。')+detail('两种补粉方式',note('自然增长加速：购买后立即提高恢复速度。黑市补给：一次性增加 Fans，无需等待、无需领取。增产道具不暂存，购买后自动使用。')),'support','知道了',{tip:true,figmaNode:'368:35'});
panel('a-flyer-tip','A','应援宣传单',row('总恢复速度','10% / 小时 · +200 Fans')+row('持续时间','4 小时')+note('一种可以快速增长应援粉丝的招募道具。购买成功立即使用，不进入背包。这里显示总恢复速度，不叠加基础速度；满额停止增粉，效果持续计时。'),'a-boost','知道了',{tip:true,figmaNode:'368:41'});
panel('a-stick-tip','A','粉丝应援棒',row('总恢复速度','100% / 小时 · +2,000 Fans')+row('持续时间','1 小时')+note('一种可以快速增长应援粉丝的招募道具。购买成功立即使用，不进入背包。满额停止增粉，效果持续计时。'),'a-boost','知道了',{tip:true,figmaNode:'368:51'});
for(const id of ['support-detail','recruit-live','recruit-speed','recruit-reward','a-ad']){delete S[id];D.aliases[id]=id==='recruit-speed'?'a-boost':'support';}
setFlow('daily',['home','support','map'],['a-boost','a-rules','a-flyer-tip','a-stick-tip']);
screen('teams','B','Team · 编队与粉丝分配','B-team',[
 H(99,730,206,43,'map','Battle','teamBattle'),H(307,265,63,73,'team-edit','选择 IDOL'),H(132,343,141,32,'teams','自动分配 IDOL','autoTeam'),H(327,343,40,31,'teams','重置分配','resetTeam'),H(69,516,27,25,'teams','减少编入粉丝','teamMinus'),H(315,516,27,25,'teams','增加编入粉丝','teamPlus'),H(184,786,37,38,'home','关闭编队','closeTeam')
],{figmaNode:'226:982',note:'保留新稿的粉丝加减、滑块、胜率及预计消耗。在目标详情进入本页时，Battle 直接开战；从公会首页进入时，Battle 进入地图选点。',overlays:[{x:173,y:516,w:63,h:29,text:'{{teamFans}}',className:'team-count'}],inputs:[{key:'teamFans',x:55,y:550,w:300,h:33,min:1000,max:2000,step:100}]});
screen('team-edit','B','编队 · 选择 IDOL','B-edit',[H(129,757,150,49,'teams','保存并返回当前编队','saveTeam'),H(29,760,62,49,'teams','返回当前编队'),H(324,760,60,49,'team-edit','重置选择','resetTeam'),H(40,575,331,162,'team-edit','选择 IDOL 卡牌','selectIdol')],{figmaNode:'226:1113',note:'保存后直接回编队，不再出现“编队已保存”确认页。'});
screen('team-fans','B','编队 · 驻守中','B-busy',[H(184,788,37,38,'guard','查看当前驻守')],{figmaNode:'226:1217'});
screen('war-teams','B','查看已有队伍','B-list',[H(45,278,305,80,'teams','查看编队1'),H(45,369,305,80,'teams','查看编队2'),H(45,460,305,80,'team-fans','定位驻守队伍'),H(184,615,34,34,'map','返回地图')],{figmaNode:'226:1518',note:'队伍数量增加后的管理入口，保留为按需分支，不插入第一次出战主链。'});
for(const id of ['war-entry','war-roster']){delete S[id];D.aliases[id]='map';}
setFlow('formation',['teams','team-edit','teams','map'],['war-teams','team-fans']);
screen('map','C','地图 · 选择领地','C-map',[
 H(224,420,95,127,'territory','N-1 · 查看敌方领地'),H(149,697,103,99,'guard','N-12 · 查看我方驻守'),H(6,217,205,198,'e-locked','中心舞台'),H(319,23,82,117,'points','公会积分详情'),H(3,824,55,47,'home','返回公会'),H(176,821,44,50,'allies','Support · 公会协作'),H(222,821,44,50,'f-daily-rank','排名与奖励'),H(268,821,44,50,'war-teams','查看队伍')
],{figmaNode:'226:1907',overlays:[day(2)],note:'公会积分榜接入新增详情页；目标挑战后进入默认编队，再由底部 Battle 连续开战。'});
screen('territory','C','目标 · N-9 敌方驻守','C-target',[H(120,608,165,67,'teams','挑战 · 使用默认编队','targetTeam'),H(184,730,42,43,'map','返回地图')],{figmaNode:'226:2035',overlays:[day(2,142,48,66)]});
// The crossed-out empty-territory page is removed from the main and branch lists.
delete S.empty;D.aliases.empty='territory';
for(const [id,title,asset]of [['battle','PK · 舞台对决','C-battle'],['battle-event','PK · 我方回合事件','C-event'],['battle-rival','PK · 对方回合事件','C-rival']])screen(id,'C',title,asset,[],{figmaNode:({battle:'226:2304','battle-event':'226:2474','battle-rival':'226:2566'})[id]});
S.battle.hits=[H(340,155,55,64,'battle-event','加速演出')];S.battle.auto='battle-event';S['battle-event'].auto='battle-rival';S['battle-rival'].auto='win';
screen('win','C','占领成功','C-win',[H(129,690,142,50,'guard','继续驻守'),H(282,691,46,45,'battle-report','查看战报')],{figmaNode:'226:2660',overlays:[day(3,139,58,66)]});
screen('lose','C','本次对决失利','C-lose',[H(129,782,142,50,'map','继续'),H(282,782,46,46,'battle-report','查看战报'),H(28,642,117,96,'support','补充应援粉丝','recruitForNormal'),H(154,642,112,96,'teams','调整当前编队','targetTeam')],{figmaNode:'226:2662',overlays:[day(3,139,58,66)]});
screen('battle-report','C','对决 · 战报','C-report',[H(184,767,36,37,'win','返回战斗结果')],{figmaNode:'226:7517'});
setFlow('occupation',['map','territory','teams','battle','battle-event','battle-rival','win','guard'],['lose','battle-report']);
screen('map-low','D','驻守 · 首次缺员','C-map',[H(222,419,103,117,'guard','查看驻守'),H(174,816,49,53,'aid-edit','发起求援')],{figmaNode:'226:6',overlays:[day(2),{x:30,y:646,w:342,h:115,text:'驻守的应援粉丝不足了。\n点击 Support，向盟友请求支援。',className:'source-hint'}],note:'保留新稿的首次缺员提示含义；流程箭头和编号仅用于稿件评审，不带入玩家画面。'});
screen('aid-edit','D','求援 · 设置人数','D-request',[H(107,552,189,48,'aid','发到公会聊天','requestAid'),H(184,650,34,32,'guard','取消并返回驻守'),H(64,429,26,26,'aid-edit','减少求援人数','aidMinus'),H(305,429,26,26,'aid-edit','增加求援人数','aidPlus')],{figmaNode:'226:3415',overlays:[{x:152,y:384,w:103,h:38,text:'{{aidAmount}}',className:'aid-count'}],inputs:[{key:'aidAmount',x:43,y:455,w:312,h:34,min:1000,max:2000,step:100}]});
screen('aid','D','公会求援 · 我的请求','D-list',[H(205,137,170,47,'allies','增援盟友'),H(312,337,53,30,'guard','定位驻守'),H(184,807,37,36,'guard','返回驻守')],{figmaNode:'226:3084',auto:'aid-received',autoMs:3500,note:'首次求援设置人数；后续通过协作入口复用。请求收到增援后直接展示反馈。'});
screen('aid-received','D','多人增援反馈','D-received',[H(180,815,42,38,'guard','返回当前驻守')],{figmaNode:'226:3147',auto:'guard',autoMs:4000,note:'按新稿合并显示各盟友增援和粉丝去向，播报结束自动返回驻守；关闭也回到同一驻守。'});
screen('guard','D','N-12 · 我方驻守','D-guard',[H(123,649,156,53,'map','召回','recallTerritory'),H(181,556,60,25,'aid-edit','求援'),H(181,771,34,34,'map','返回地图')],{figmaNode:'226:6942',note:'本次 Figma 新稿将底部文案更新为“召回”，阵容区保留“求援”。直接召回后回地图，队伍恢复可派遣。'});
screen('allies','D','公会求援 · 增援盟友','D-allies',[H(30,142,171,45,'aid','发送求援'),H(256,378,103,37,'allies','增援 Luna 100','aid100-luna'),H(256,494,103,37,'allies','增援 Mika 100','aid100-mika'),H(256,610,103,37,'allies','增援 Jason 100','aid100-jason'),H(30,692,342,45,'allies','一键增援','aid400'),H(182,766,38,36,'map','返回地图')],{figmaNode:'226:3302',note:'增援后在列表内反馈，不额外弹出成功确认页。同一条请求不会重复扣粉丝。'});
setFlow('defense',['map-low','aid-edit','aid','aid-received','guard','map'],['allies']);setFlow('reinforce',['allies','map']);
screen('e-map','E','中心舞台 · 3倍积分开启','E-intro',[H(36,744,330,48,'e-battle','go · 直接 Battle','dispatch')],{figmaNode:'230:8',note:'按新稿：盛典舞台开启 → 直接 Battle。中间两张已划掉的目标确认画面不进入主链。第6天积分为普通节点的3倍。'});
S['e-battle'].asset=A('C-battle');S['e-event'].asset=A('C-event');
S['e-battle'].note='复用普通节点的 Battle 演出，自动推进回合；中心舞台奖励使用3倍积分。';
screen('e-win','E','中心舞台 · 获胜 ×3','E-win',[H(129,690,142,50,'e-owned','继续驻守'),H(282,691,46,45,'e-report','查看战报')],{figmaNode:'279:551',overlays:[day(6,139,58,66),{x:85,y:562,w:239,h:85,text:'中心舞台积分 ×3\n+1,500',className:'triple-score'}],note:'沿用获胜画面，积分区突出3倍：演示基础500 → 1,500。底部继续直接进入驻守。'});
screen('e-lose','E','中心舞台 · 挑战结束','E-lose',[H(129,782,142,50,'e-map','准备再战'),H(282,782,46,46,'e-report','查看战报')],{figmaNode:'279:553',overlays:[day(6,139,58,66),{x:85,y:530,w:239,h:83,text:'中心舞台积分 ×3\n+450',className:'triple-score'}],note:'失利积分也突出3倍：演示基础150 → 450；结果页继续可回到最终赛入口。'});
panel('e-report','E','中心舞台 · 本场战报',row('赛程','第6天 / 6天')+row('对决结果','3 : 2')+row('本场积分','500 × 3 = 1,500')+row('驻守收益','180 / 小时 · 6,000 / 每日')+note('计分数量按画面样例演示。'),'e-win','返回结果');
S['e-owned'].body=S['e-owned'].body.replace('正在积累舞台表现','第6天 · 3倍积分').replace('累计表现','累计积分');
S['e-owned'].body=row('驻守积分','180 / 小时 · 6,000 / 每日')+S['e-owned'].body;
setFlow('central',['e-map','e-battle','e-win','e-owned'],['e-locked','e-event','e-lose','e-report','e-recalled','e-busy','e-short','e-changed','e-network']);
const rankIds=['f-daily-rank','f-personal-rank','f-guild-rank','f-daily-reward','f-personal-reward','f-guild-reward'];
const rankNames=['每日排名','赛季排名 · 个人','赛季排名 · 公会','每日奖励预览','赛季奖励 · 个人','赛季奖励 · 公会'];
const rankAssets=['F-daily-rank','F-personal-rank','F-guild-rank','F-daily-reward','F-personal-reward','F-guild-reward'];
rankIds.forEach((id,i)=>{const tabY=719;const hits=[H(17,tabY,87,48,'f-daily-rank','每日排名'),H(108,tabY,87,48,'f-personal-rank','赛季排名'),H(201,tabY,87,48,'f-daily-reward','每日奖励'),H(292,tabY,87,48,'f-personal-reward','赛季奖励'),H(182,774,36,39,'map','返回地图')];if([1,2,4,5].includes(i))hits.push(H(59,110,140,30,i<3?'f-personal-rank':'f-personal-reward','个人'),H(204,110,140,30,i<3?'f-guild-rank':'f-guild-reward','公会'));screen(id,'F',rankNames[i],rankAssets[i],hits,{figmaNode:['286:631','286:634','288:642','288:644','288:645','288:646'][i],note:'每日/赛季与个人/公会在原页面切换。奖励页是排名奖励预览，不插入领奖的必经链。'});});
D.flows.push({id:'rankings',module:'F',title:'排名与奖励预览',steps:['f-daily-rank','f-personal-rank','f-guild-rank'].map(id=>({id,label:S[id].title})),branches:['f-daily-reward','f-personal-reward','f-guild-reward']});
screen('f-result','F','公会战最终报告','F-report',[H(35,183,331,511,'f-report-details','继续查看个人表现与公会奖励')],{figmaNode:'288:647',footer:{label:'查看我的赛季奖励',to:'f-report-details'},note:'新稿的最终报告包含战区地图、四盟排名、队伍详情与个人表现。底部主操作继续到奖励领取。'});
screen('f-report-details','F','最终报告 · 我的奖励','F-report-details',[],{figmaNode:'301:649',footer:{label:'领取赛季奖励',to:'f-claimed',action:'claim'},overlays:[{x:80,y:728,w:251,h:43,text:'6 天赛程已结束 · 奖励待领取',className:'report-caption'}],note:'沿用最终报告奖励页，底部仅一个领取按钮；重复领取不会重复到账。'});
S['f-claimed'].note='奖励领取后直接回公会。排行、明细、荣誉仍可按需查看，不强制继续多层弹窗。';
setFlow('season',['f-result','f-report-details','f-claimed','home'],['e-close','f-claim-error','f-ineligible','f-next']);
screen('points','F','公会积分 · 实时详情','F-points',[H(337,433,47,51,'points-guild','查看公会积分构成'),H(312,635,77,29,'points-history','战斗积分详情'),H(220,635,81,29,'points-replay','回放本场 Battle'),H(224,667,76,30,'points-guild','驻守积分明细'),H(309,667,78,30,'points-history','查看计分记录')],{figmaNode:'439:13',footer:{label:'返回地图',to:'map'},note:'新增积分仪表盘接入地图右上角积分榜。保留四盟实时积分、每分钟增长、下一分钟预测、公会贡献者和积分流水。'});
panel('points-guild','F','公会积分 · 组成明细',row('TIGER · 当前积分','40,240.25')+row('驻守节点','9 个')+row('每分钟增长','+18.50')+row('下一分钟预测','40,258.75')+row('今日 Battle','18 场 · 12胜 / 6负')+row('今日 Battle 积分','+270')+note('预测以领地保持当前归属为前提，实时积分以已结算记录为准。'),'points','返回积分详情',{figmaNode:'439:13'});
panel('points-history','F','积分记录',row('10:52:41 · 节点战胜利','+20')+row('10:52:00 · 9处驻守结算','+18.50')+row('10:51:32 · 节点战失利','+2')+note('点击地图积分榜可查看最新总分；第6天中心舞台战突出3倍积分。'),'points','返回积分详情',{figmaNode:'439:13'});
for(const [id,src,next]of [['points-replay','battle','points-replay-event'],['points-replay-event','battle-event','points-replay-rival'],['points-replay-rival','battle-rival','points']]){S[id]={...S[src],id,module:'F',title:'积分流水 · Battle 回放',hits:[],auto:next,autoMs:2000,footer:{label:'返回积分详情',to:'points'},note:'只回放计分记录中的演出，结束返回积分页；不会再次结算或派遣队伍。'};}
screen('legacy-idol-detail','H','盛典 · IDOL 应援详情','H-idol',[H(184,748,34,32,'legacy-idol-rank','返回领队榜'),H(76,635,250,44,'legacy-content-intent','想看 TA 的专属内容')],{figmaNode:'385:2',note:'沿用本次 V3 领队详情，仅保留原稿现有的专属内容入口。'});
D.flows.push({id:'points',module:'F',title:'公会积分仪表盘',steps:['map','points','points-guild','points'].map(id=>({id,label:S[id].title})),branches:['points-history','points-replay','points-replay-event','points-replay-rival']});
// Refresh contextual teaching with the same source screens and skip the deleted recruitment sequence.
const coach=(id,src,title,text,target,to,action)=>{S[id]={...S[src],id,module:'G',title,locked:false,coach:text,target,hits:[H(...target,to,'点击高亮区域',action)]};delete S[id].footer;delete S[id].auto;};
coach('g-s0','home','S0 · 认识粉丝','从 Fans 进入粉丝池。粉丝用于 Battle 与驻守。',[293,550,85,59],'g-recruit');
coach('g-recruit','support','粉丝会自然恢复','离线也会恢复。加速和补给按需使用，现在先进入出战编队。',[99,636,204,40],'g-team');
coach('g-team','teams','S1 · 默认编队已就绪','可调整粉丝人数，先用默认编队练习一场。模拟练习不消耗真实粉丝。',[99,730,206,43],'g-sim','simStart');
coach('g-map','map','S2 · 正式占点','现在选择一个目标，开始真实的节点 Battle。',[224,420,95,127],'g-target');
coach('g-target','territory','查看目标','确认对方阵容与奖励，挑战后进入默认编队。',[120,608,165,67],'g-real-team');
coach('g-real-team','teams','准备正式 Battle','这次是正式参战。查看胜率与预计损耗，点击 Battle。',[99,730,206,43],'g-battle');
for(const [id,src]of [['g-sim','battle'],['g-sim-event','battle-event'],['g-battle','battle'],['g-win','win']])S[id].asset=S[src].asset;
S['g-win'].hits=[H(129,690,142,50,'g-held','继续驻守','tutorialComplete')];S['g-win'].target=[129,690,142,50];
coach('g-held','map','占领后持续获得积分','拿下领地后，队伍会持续驻守并获得公会积分。其他队伍挑战时，粉丝会消耗，缺员时可向盟友求援。',[149,697,103,99],'guard');
coach('g-aid','aid-edit','首次缺员 · 求援','调整期望人数，发到公会聊天。',[107,552,189,48],'g-aid-wait');
coach('g-aid-wait','aid','等待盟友增援','请求已发出，支援将合并反馈。',[75,266,280,323],'g-aid-done');S['g-aid-wait'].auto='g-aid-done';S['g-aid-wait'].autoMs=3500;
coach('g-aid-done','aid-received','收到盟友增援','增援已补入驻守。接着返回当前队伍。',[180,815,42,38],'guard','aidGuideDone');S['g-aid-done'].auto='guard';S['g-aid-done'].autoAction='aidGuideDone';
coach('g-reinforce','allies','首次增援 · 帮助伙伴','点击增援，使用待命粉丝帮助盟友。',[256,378,103,37],'allies','aid100-luna');
for(const id of ['g-live','g-claim']){delete S[id];D.aliases[id]='g-recruit';}
setFlow('onboarding',['g-s0','g-recruit','g-team','g-sim','g-sim-result','g-map','g-target','g-real-team','g-battle','g-win','g-held','guard'],['g-sim-event','g-paused']);
setFlow('context-aid',['g-aid','g-aid-wait','g-aid-done','guard']);setFlow('context-reinforce',['g-reinforce','allies']);
// Compatibility links always resolve to the current V3 route.
for(const s of Object.values(S)){for(const h of [...(s.hits||[]),...(s.buttons||[])])if(D.aliases[h.to])h.to=D.aliases[h.to];if(s.body)s.body=s.body.replace(/data-go="([^"]+)"/g,(all,id)=>`data-go="${D.aliases[id]||id}"`);if(s.exitTo&&D.aliases[s.exitTo])s.exitTo=D.aliases[s.exitTo];}
for(const f of D.flows)for(const step of f.steps)step.label=S[step.id].title;
D.sourceMap=Object.fromEntries(Object.values(S).filter(s=>s.figmaNode).map(s=>[s.id,{nodeId:s.figmaNode,asset:s.asset,url:'https://www.figma.com/design/3UrD3ReEc65mSIGWeAatof/IDOL?node-id='+s.figmaNode.replace(':','-')} ]));
})();
