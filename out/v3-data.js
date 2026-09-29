(function(root){
'use strict';
const screens={},flows=[],modules=[
{id:'A',title:'公会内 · 粉丝招募',zone:'已确定 · 原稿',summary:'保留 Figma 已确定的 MCN、应援中心与招募画面。'},
{id:'B',title:'公会战 · 编队',zone:'已确定 · 原稿',summary:'保留现有多 IDOL 编队、派遣粉丝与出战入口。'},
{id:'C',title:'地图 · 占领与 PK',zone:'已确定 · 原稿',summary:'保留地图、领地选择、舞台对决和胜负反馈。'},
{id:'D',title:'驻守 · 求援与增援',zone:'已确定 · 原稿',summary:'保留求援、多人支援反馈与伙伴增援画面。'},
{id:'E',title:'中心舞台 · 第 6 天',zone:'本次延伸',summary:'四阵营同场争夺；控制归属、累计表现、最终冠军分别展示。'},
{id:'F',title:'赛季 · 结算与领奖',zone:'本次修订',summary:'仅结算本战区四盟；个人贡献、奖励领取、历史和跨季保留闭环。'},
{id:'G',title:'新手 · S0 → S2',zone:'本次修订',summary:'招募编队 → 一场模拟 → 正式参战；求援与增援在首次需要时教学。'}];
const img=(group,col)=>`assets/${group}-${col}.webp`;
const hit=(x,y,w,h,to,label,action)=>({x,y,w,h,to,label,action});
function raw(id,module,title,asset,hits=[],note=''){screens[id]={id,module,title,asset,hits,note,locked:'ABCD'.includes(module)};return screens[id]}
function panel(id,module,title,body,buttons=[],extra={}){screens[id]={id,module,title,body,buttons,asset:img('C',0),note:'',...extra};return screens[id]}
function flow(id,module,title,steps,branches=[]){flows.push({id,module,title,steps:steps.map(a=>typeof a==='string'?{id:a,label:screens[a]?.title||a}: {id:a[0],label:a[1]}),branches});}
const row=(a,b)=>`<div class="stat-row"><span>${a}</span><b>${b}</b></div>`;
const note=t=>`<p class="phone-note">${t}</p>`;
const banner=(a,b)=>`<div class="callout"><b>${a}</b><span>${b}</span></div>`;
const metric=(a,b)=>`<div class="metric"><small>${a}</small><strong>${b}</strong></div>`;
const b=(label,to,action,kind='gold')=>({label,to,action,kind});
raw('home','A','MCN 主城',img('A',0),[hit(225,235,150,175,'support','进入应援中心'),hit(280,560,115,180,'war-entry','进入 Battle')],'主城仅保留应援中心和公会战入口；编队从公会战地图的目标操作进入。');
raw('support','A','应援中心',img('A',1),[hit(116,194,224,126,'support-detail','查看应援站'),hit(94,704,216,57,'recruit-live','开始招募'),hit(258,326,86,41,'recruit-live','招募粉丝'),hit(183,768,40,41,'home','关闭')]);
raw('support-detail','A','应援中心 · 招募方式',img('A',2),[hit(96,704,210,60,'recruit-live','招募粉丝'),hit(183,768,40,41,'support','关闭')]);
raw('recruit-live','A','招募进行中',img('A',3),[hit(125,623,160,57,'recruit-speed','加速招募'),hit(184,710,40,50,'support','返回')]);
raw('recruit-speed','A','招募加速',img('A',4),[hit(108,552,190,62,'recruit-reward','确认加速'),hit(183,678,40,45,'recruit-live','关闭')]);
raw('recruit-reward','A','获得应援粉丝',img('A',5),[hit(104,558,198,68,'support','领取并返回','recruit')]);
flow('daily','A','招募应援粉丝',['home','support','support-detail','recruit-live','recruit-speed','recruit-reward']);
raw('teams','B','编队 · 已保存小队',img('B',0),[hit(280,220,95,108,'team-edit','编辑 IDOL 编队'),hit(70,355,260,265,'team-fans','配置应援粉丝'),hit(75,746,247,63,'war-entry','进入 Battle')]);
raw('team-edit','B','编队 · 选择 IDOL',img('B',1),[hit(84,600,238,134,'team-edit','选择 IDOL'),hit(134,749,153,64,'team-fans','保存编队')],'保留原稿多 IDOL 槽位与已有编队，不改为单领队结构。');
raw('team-fans','B','编队 · 配置粉丝',img('B',2),[hit(52,567,300,65,'teams','保存配置'),hit(83,744,235,66,'war-entry','进入 Battle')]);
raw('war-teams','B','查看出战小队',img('B',4),[hit(102,258,240,250,'war-entry','选择已有小队'),hit(182,728,43,47,'teams','返回编队')]);
raw('war-entry','B','占点大战 · Battle',img('B',6),[hit(108,587,193,65,'war-roster','进入战区'),hit(182,707,40,48,'home','返回公会')]);
raw('war-roster','B','选择已保存小队',img('B',7),[hit(216,384,115,61,'map','派遣已保存小队'),hit(211,514,121,58,'map','派遣另一支小队'),hit(123,649,170,55,'teams','前往编队')]);
flow('formation','B','编队与派遣',['teams','team-edit','team-fans','war-teams','war-entry','war-roster']);
raw('map','C','地图 · 选择领地',img('C',0),[hit(40,161,183,245,'territory','查看敌方领地'),hit(280,440,102,177,'empty','查看空闲领地'),hit(6,70,110,92,'e-locked','查看中心舞台'),hit(12,751,68,90,'home','回公会'),hit(313,751,82,90,'aid','公会求援')]);
raw('territory','C','领地 · 选中敌方',img('C',1),[hit(105,648,195,74,'battle','挑战'),hit(183,754,38,47,'map','关闭')]);
raw('empty','C','领地 · 无人驻守',img('C',2),[hit(112,644,187,77,'guard','占领并驻守'),hit(184,754,40,49,'map','关闭')]);
raw('battle','C','PK · 舞台对决',img('C',3),[hit(341,153,57,61,'battle-event','加速演出'),hit(0,500,402,373,'battle-event','继续舞台对决')],'保留原版 PK 画面。回合中的应援规模用于演出胜负；真实粉丝损耗在整场结束后统一结算。');
raw('battle-event','C','PK · 我方回合事件',img('C',4),[hit(0,0,402,874,'battle-rival','继续演出')]);
raw('battle-rival','C','PK · 对方回合事件',img('C',5),[hit(0,0,402,874,'win','查看结果')]);
raw('win','C','占领成功',img('C',6),[hit(75,724,249,78,'guard','确认并驻守'),hit(30,636,343,75,'battle-report','查看战报')]);
raw('lose','C','对决失利',img('C',7),[hit(75,724,249,78,'map','返回地图'),hit(30,636,343,75,'battle-report','查看战报')]);
// 战报只作独立补充查看，不覆盖已确定的胜负原画。
panel('battle-report','C','战报 · 本场回顾',banner('整场结算一次','回合应援规模 ≠ 真实库存')+row('胜负','我方获胜')+row('回合','3 : 2')+note('打开完整战报可查看各回合应援规模、事件与整场粉丝结算。此页补充交互去向，原稿胜负画面保持不变。'),[b('返回地图','map')],{locked:false,note:'补充战报入口的可点击去向；不重画已确定的 PK。'});
flow('occupation','C','占领与舞台对决',['map','territory','battle','battle-event','battle-rival','win'],['empty','lose','battle-report']);
raw('map-low','D','地图 · 待命不足',img('D',0),[hit(85,120,160,420,'aid-edit','打开驻守求援'),hit(278,759,110,100,'aid','打开公会求援')]);
raw('aid-edit','D','求援 · 编辑',img('D',1),[hit(101,585,202,81,'aid','发布求援'),hit(182,741,40,53,'map-low','取消')]);
raw('aid','D','公会求援 · 我的请求',img('D',2),[hit(84,190,117,48,'aid','我的求援'),hit(207,190,132,48,'allies','伙伴求援'),hit(80,243,264,344,'aid-received','查看收到的支援'),hit(182,798,44,50,'map-low','返回地图')]);
raw('aid-received','D','多人增援反馈',img('D',3),[hit(97,736,218,83,'guard','确认收到支援')]);
raw('guard','D','领地 · 我方驻守',img('D',4),[hit(106,637,194,73,'aid-edit','发起求援'),hit(181,756,42,50,'map','返回地图')]);
raw('allies','D','公会求援 · 支援伙伴',img('D',5),[hit(268,327,77,40,'aid-helped','增援 100','aid100'),hit(268,409,77,40,'aid-helped','增援 100','aid100'),hit(88,744,232,48,'aid-helped','一键增援','aid400'),hit(81,190,112,47,'aid','我的求援'),hit(182,801,40,44,'map','关闭')]);
panel('aid-helped','D','增援已送出',banner('支援已送达','本次使用的待命粉丝已转入伙伴驻守')+row('本次增援','{{lastAid}} 位')+row('待命粉丝','{{reserve}} 位')+note('同一请求不能重复领取支援贡献。返回求援列表可查看其他仍缺员的伙伴。'),[b('继续查看伙伴求援','allies')],{compact:true,exitTo:'map',note:'新增的增援成功反馈收为一个底部主按钮；已确定的伙伴求援原画与列表保持。'});
flow('defense','D','驻守求援',['map-low','aid-edit','aid','aid-received','guard','map'],['allies','aid-helped']);
flow('reinforce','D','支援伙伴',['allies','aid-helped','map']);
const detail=(title,body)=>`<details class="inline-detail"><summary>${title}</summary><div>${body}</div></details>`;
const link=(label,to,action='')=>`<button class="inline-link" data-go="${to}" data-action="${action}">${label} ›</button>`;
const table=`<div class="ranking"><div><b>阵营</b><b>累计表现</b><b>当前控制</b></div><div><span>蓝 · 星光联盟</span><strong>{{tickets}}</strong><span>{{blueControl}}</span></div><div><span>红 · 炽焰联盟</span><strong>9,280</strong><span>{{redControl}}</span></div><div><span>绿 · 森语联盟</span><strong>8,460</strong><span>—</span></div><div><span>紫 · 极光联盟</span><strong>7,920</strong><span>—</span></div></div>`;
const rules=note('第 6 天，四个阵营持续争夺中心舞台。控制方通过驻守积累表现；失去控制后，已累计的表现保留。')+note('赛季结束后，先完成已派出的对决，再按累计表现确定冠军。同分时依次比较有效控制时长、前 5 天积分、达到当前表现的先后。');
const squad=`<div class="squad selected"><span class="small-tag">默认编队 · 已保存</span><b data-team-name>{{teamName}}</b><strong>派出应援粉丝 800 位</strong></div>`+detail('调整编队',`<label class="team-option"><input type="radio" name="saved-team" data-team="1" value="1">小队 1 · 已就绪</label><label class="team-option"><input type="radio" name="saved-team" data-team="2" value="2">小队 2 · 已就绪</label><p class="phone-note">沿用公会内保存的 IDOL 与粉丝配置。</p>`);
panel('e-locked','E','中心舞台',banner('第 6 天开启','前 5 天先占点、积累实力')+`<div class="days">${[1,2,3,4,5,6].map(d=>`<span class="${d===6?'final-day':''}">D${d}</span>`).join('')}</div>`+row('当前赛程','Day 2 / 6')+note('舞台开启后，直接使用已保存的编队参战。'),[b('继续占点','map')],{day:2,exitTo:'map',note:'开放前仅保留一个行动出口；第 6 天样例由评审侧切换。'});
panel('e-map','E','中心舞台 · 最终赛',banner('第 6 天 · 最终赛开启','今天决出本战区冠军')+row('当前控制','{{controller}}')+row('争夺剩余','08:32:00')+squad+note('派出后暂时占用 800 位粉丝；整场结束后结算疲劳与流失。')+detail('四方战况与规则',table+rules),[b('Battle','e-battle','dispatch')],{exitTo:'map',note:'介绍、默认编队与投入预告合为一页。点击底部 Battle 直接开战，取消选队、二次确认和行军的必经弹窗。'});
panel('e-battle','E','中心舞台 · Battle','', [b('跳过演出','e-win','win')],{asset:img('C',3),battle:true,auto:'e-event',autoMs:3000,autoAlways:true,note:'进入原有舞台演出，回合自动推进；底部仅保留跳过演出。'});
panel('e-event','E','中心舞台 · Battle','',[b('跳过演出','e-win','win')],{asset:img('C',4),battle:true,event:true,auto:'e-win',autoAction:'win',autoMs:2600,autoAlways:true,note:'回合事件直接出现在舞台中，不再用说明弹窗要求玩家点“继续”。'});
const winLedger=row('本次派出','800')+row('继续驻守','560')+row('疲劳休息','160')+row('永久流失','80')+note('800 = 560 驻守 + 160 疲劳 + 80 流失。');
panel('e-win','E','夺下中心舞台',banner('挑战成功 · 3 : 2','星光联盟开始驻守')+metric('继续驻守','560 位')+row('本场表现','+400')+row('累计表现','{{tickets}}')+detail('查看粉丝去向',winLedger),[b('继续驻守','e-owned')],{exitTo:'map',note:'结果页只保留“继续驻守”。资源去向在本页展开，避免两个底部按钮争夺注意力。'});
panel('e-lose','E','本次挑战失利',banner('舞台仍由对方控制','已累计的表现保留')+row('归队待命','400 位')+row('本场表现','+100')+detail('查看粉丝去向',row('派出','800')+row('归队','400')+row('疲劳','240')+row('流失','160'))+note('已保留原编队，可查看战况后再次出战。'),[b('准备再战','e-map')],{exitTo:'map'});
panel('e-owned','E','中心舞台 · 驻守中',banner('{{controller}}','正在积累舞台表现')+row('本队驻守','{{guard}} 位')+row('伙伴增援','{{partnerGuard}} 位')+row('累计表现','{{tickets}}')+detail('需要补充驻守',note('请公会伙伴帮忙，或从自己的待命粉丝中补充。')+link('向公会求援','e-aid')+link('补充本队 · 100 位','e-aid-confirm'))+detail('查看四方战况',table),[b('召回','e-recalled','recallStage')],{exitTo:'map',note:'驻守页底部主按钮为“召回”。一次点击撤回本队，不再增加确认弹窗；求援与自补按需展开。'});
panel('e-recalled','E','中心舞台 · 已召回',banner('队伍已召回','编队已恢复待命')+row('归队粉丝','{{lastRecall}} 位')+row('当前待命','{{reserve}} 位')+note('已结束本队驻守，可以再次派遣。')+detail('查看归队说明',note('只归还本队仍在驻守的粉丝，疲劳与已流失人数不重复返还。关联求援结束，伙伴增援各自归队。')),[b('返回地图','map')],{exitTo:'map',note:'召回立即生效；保留战后疲劳与损耗，伙伴粉丝不进入本人库存。召回不直接改写联盟控制权。'});
panel('e-aid','E','中心舞台 · 求援',banner('请伙伴来帮忙','中心舞台 · {{teamName}}')+row('期望补充','400 位')+note('求援会发送到公会聊天，伙伴可以直接增援这里。'),[b('发到公会聊天','e-aid-post','postAid')],{exitTo:'e-owned'});
panel('e-aid-post','E','中心舞台 · 求援中',banner('求援已发出','仍缺 400 位')+row('求援位置','中心舞台')+note('伙伴到达后，会合并显示增援结果。'),[b('查看驻守','e-owned')],{exitTo:'e-owned',auto:'e-aid-arrived',autoAction:'receiveAid',autoMs:4000,autoAlways:true,note:'等待状态在当前页更新。原型用自动到达演示服务器反馈，手机内不出现“模拟伙伴到达”按钮。'});
panel('e-aid-arrived','E','中心舞台 · 增援到达',banner('收到伙伴增援 +400','驻守已补充')+row('驻守合计','{{combinedGuard}} 位')+note('伙伴粉丝仍归伙伴所有。'),[b('继续驻守','e-owned')],{exitTo:'e-owned'});
panel('e-aid-confirm','E','中心舞台 · 补充驻守',row('本次补充','100 位')+row('当前待命','{{reserve}} 位')+row('补充后驻守','{{afterReinforce}} 位'),[b('增援 · 100 位','e-owned','reinforce')],{exitTo:'e-owned',note:'按需进入的增援操作。底部只保留明确标出数量的确认按钮，取消使用标题关闭键。'});
panel('e-busy','E','编队正在驻守',banner('当前编队已在执行任务','可继续查看驻守情况'),[b('查看驻守','e-owned')],{exitTo:'e-map'});
panel('e-short','E','待命粉丝不足',row('本次需要','800 位')+row('当前可用','{{reserve}} 位')+note('完成招募后，会直接回到这场最终赛，保留已选编队。'),[b('前往招募','support','recruitForBattle')],{exitTo:'e-map',note:'沿用 A 模块原稿。此补充路径在领取奖励后返回原挑战，不要求回公会重新找入口。'});
panel('e-changed','E','舞台已由我方控制',banner('伙伴已拿下舞台','本队可直接加入驻守')+row('已派出','800 位')+note('加入驻守不会额外派出粉丝。'),[b('加入驻守','e-owned','convert')],{exitTo:'e-map',exitAction:'recall'});
panel('e-network','E','正在确认出战',banner('连接暂时中断','已保留编队和本次出战记录')+note('恢复后接着完成这场对决。'),[b('继续 Battle','e-battle','dispatch')],{exitTo:'e-map',note:'重试复用同一出战指令，避免重复扣减。'});
panel('e-close','E','赛季结算中',banner('6 天赛程结束','正在完成已派出的最后一场对决')+note('最终成绩确认后，将自动显示赛季结果。'),[b('结算中…','f-result')],{waiting:true,exitTo:'map',auto:'f-result',autoAction:'closeFinish',autoMs:3500,autoAlways:true,note:'等待和成绩核对合并为一个自动状态，不再要求玩家手动“完成收官对决”或重复查看冠军。'});
flow('central','E','最终赛 · 直接 Battle',['e-map','e-battle','e-win','e-owned'],['e-locked','e-event','e-lose','e-recalled','e-busy','e-short','e-changed','e-network']);
flow('central-aid','E','中心舞台 · 求援与增援',['e-aid','e-aid-post','e-aid-arrived','e-owned'],['e-aid-confirm']);
flow('finale','E','收官 · 自动结算',['e-close','f-result'],[]);
const resultTable=`<div class="ranking final-rank"><div><b>名次</b><b>本战区联盟</b><b>赛季积分</b></div><div><strong>01</strong><span>星光联盟 · 冠军</span><b>38,420</b></div><div><strong>02</strong><span>炽焰联盟</span><b>36,180</b></div><div><strong>03</strong><span>森语联盟</span><b>32,640</b></div><div><strong>04</strong><span>极光联盟</span><b>29,870</b></div></div>`;
const rewards=`<div class="reward-grid"><div><span>金币</span><b>20,000</b></div><div><span>应援券</span><b>3 张</b></div></div>`;
const carry=note('保留：已拥有的粉丝、IDOL、保存的编队、已领取奖励和历史荣誉。')+note('新赛季重新计算积分、领地归属、中心舞台表现和个人贡献。疲劳粉丝按原规则恢复。');
panel('f-result','F','S1 · 赛季结算',banner('星光联盟 · 本战区冠军','6 天赛程完成 · 联盟排名 1 / 4')+row('我的贡献','2,680')+rewards+row('冠军纪念','S1 冠军纪念章')+detail('战区排名与贡献明细',resultTable+row('占领与进攻','1,420')+row('有效驻守','860')+row('伙伴增援','400'))+detail('冠军判定',note('中心舞台累计表现决定冠军；冠军固定第 1，其余联盟按赛季积分排序。榜单仅包含本战区 4 个联盟。')+table),[b('领取奖励','f-claimed','claim')],{exitTo:'home',day:6,note:'成绩、个人贡献与奖励合并展示，底部仅“领取奖励”。冠军依据和贡献明细原位展开。奖励数量为演示配置。'});
panel('f-claimed','F','赛季奖励已领取',banner('奖励已到账','S1 冠军纪念章已收录')+rewards+note('本赛季已完成，回公会继续招募和编队。')+detail('赛季档案',row('赛季','S1 · 6 天')+row('联盟名次','1 / 4')+row('个人贡献','2,680'))+detail('下赛季保留什么',carry),[b('返回公会','home')],{exitTo:'home',note:'领取成功即完成结算循环。档案、跨季说明按需展开，不再连续弹出多页。'});
panel('f-claim-error','F','奖励领取待确认',banner('连接暂时中断','已保留本赛季奖励')+note('重试后会核对到账记录，已领取的奖励不会重复发放。'),[b('重试领取','f-claimed','claim')],{exitTo:'f-result'});
panel('f-ineligible','F','本赛季结算',banner('暂无可领奖励','本赛季没有有效参战记录')+detail('查看战区排名',resultTable)+note('已拥有的粉丝、IDOL 和编队保留，下赛季可以继续参战。'),[b('返回公会','home')],{exitTo:'home'});
panel('f-next','F','S2 · 新赛季开启',banner('Day 1 / 6','你的 IDOL、粉丝和编队已保留')+row('拥有粉丝','{{owned}}')+note('从普通领地开始占点，第 6 天开启中心舞台。')+detail('跨季保留说明',carry),[b('进入地图','map')],{day:1,exitTo:'home'});
flow('season','F','赛季结算 · 领取完成',['f-result','f-claimed','home'],['e-close','f-claim-error','f-ineligible','f-next']);
function coach(id,title,asset,text,target,next,extra={}){raw(id,'G',title,asset,[hit(...target,next,'点击高亮区域',extra.action)],text); Object.assign(screens[id],{coach:text,target,next,...extra,locked:false});}
coach('g-s0','S0 · 认识应援粉丝',img('A',0),'点击 Fans，招募你的应援粉丝。',[244,330,144,120],'g-recruit');
coach('g-recruit','S0 · 第一次招募',img('A',1),'点击招募，完成第一次积累。',[104,704,205,58],'g-live');
coach('g-live','S0 · 完成招募',img('A',3),'完成招募后，领取粉丝去编队。',[123,624,165,53],'g-claim');
coach('g-claim','S0 · 领取粉丝',img('A',5),'领取粉丝，接着查看已保存的编队。',[106,558,197,62],'g-team',{action:'tutorialRecruit'});
coach('g-team','S0 · 默认编队',img('B',0),'编队已准备好。点击 Crew Battle，练习一场，不消耗真实粉丝。',[78,742,249,65],'g-sim',{action:'simStart'});
coach('g-sim','S1 · 模拟 Battle',img('C',3),'一场对决有 5 个回合，演出会自动推进。',[12,490,376,75],'g-sim-event',{simulation:true,auto:'g-sim-event',autoAlways:true,autoMs:3000});
coach('g-sim-event','S1 · 回合事件',img('C',4),'事件改变本场应援规模；真实粉丝在整场结束后才结算。',[47,325,313,330],'g-sim-result',{simulation:true,auto:'g-sim-result',autoAction:'simFinish',autoAlways:true,autoMs:3000});
panel('g-sim-result','G','练习完成',banner('模拟获胜 · 3 : 2','真实粉丝消耗 0')+note('已经会了！接着用刚才的编队，完成第一次正式占点。'),[b('开始正式参战','g-map','simFinish')],{exitTo:'g-paused',exitAction:'skipGuide'});
coach('g-map','S2 · 选择领地',img('C',0),'点击推荐领地，查看对手和占领收益。',[44,186,173,206],'g-target');
coach('g-target','S2 · 正式挑战',img('C',1),'沿用已保存编队。正式出战会占用粉丝，战后可能疲劳或流失。准备好就点击挑战。',[123,649,156,53],'g-battle');
coach('g-battle','S2 · 正式 Battle',img('C',3),'完成整场对决后，查看最终结果。',[2,499,397,325],'g-win',{auto:'g-win',autoAlways:true,autoMs:3500});
coach('g-win','S2 · 占领成功',img('C',6),'点击继续进入驻守。以后缺员时，再学习求援。',[78,724,245,78],'guard',{action:'tutorialComplete'});
coach('g-aid','首次缺员 · 求援',img('D',1),'确认数量，发到公会聊天请伙伴帮忙。',[97,585,211,83],'g-aid-wait');
coach('g-aid-wait','求援中',img('D',2),'请求已发出，伙伴的增援会合并反馈。',[76,245,267,338],'g-aid-done',{auto:'g-aid-done',autoAlways:true,autoMs:4000});
coach('g-aid-done','收到增援',img('D',3),'点击查看驻守，继续守点。',[94,737,220,82],'guard',{action:'aidGuideDone'});
coach('g-reinforce','首次增援 · 帮助伙伴',img('D',5),'点击增援，使用自己的待命粉丝帮助伙伴。',[267,327,80,44],'g-reinforce-done');
panel('g-reinforce-done','G','增援完成',banner('已了解增援方式','从公会求援中继续帮助伙伴')+note('这次教学不额外扣减粉丝，正式增援会使用待命粉丝。'),[b('继续查看伙伴求援','allies','reinforceGuideDone')],{exitTo:'map'});
panel('g-paused','G','引导进度已保存',note('接着上次的步骤继续，已领取的粉丝和奖励不会重复发放。'),[b('继续体验','g-s0','resumeGuide')],{exitTo:'home'});
flow('onboarding','G','招募 → 一场模拟 → 正式参战',['g-s0','g-recruit','g-live','g-claim','g-team','g-sim','g-sim-result','g-map','g-target','g-battle','g-win','guard'],['g-sim-event','g-paused']);
flow('context-aid','G','首次需要时 · 求援教学',['g-aid','g-aid-wait','g-aid-done','guard']);
flow('context-reinforce','G','首次需要时 · 增援教学',['g-reinforce','g-reinforce-done','allies']);
for(const s of Object.values(screens))if('EFG'.includes(s.module)&&s.body)s.compact=true;
for(const f of flows)for(const step of f.steps)if(step.label===step.id&&screens[step.id])step.label=screens[step.id].title;
const aliases={'e-stage':'e-map','e-select':'e-map','e-confirm':'e-map','e-march':'e-battle','e-rules':'e-map','e-ledger':'e-win','e-last-battle':'e-close','e-pending':'e-close','e-champion':'f-result','f-personal':'f-result','f-reward':'f-result','f-history':'f-claimed','f-carry':'f-claimed','f-rest':'home','g-sim-ready':'g-sim','g-real':'g-map','g-complete':'guard'};
root.IDOLData={screens,flows,modules,seasonDays:6,aliases};
if(typeof module==='object')module.exports=root.IDOLData;
})(typeof window==='object'?window:globalThis);
