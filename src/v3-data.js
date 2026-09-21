(function(root){
'use strict';
const screens={},flows=[],modules=[
{id:'A',title:'公会内 · 粉丝招募',zone:'已确定 · 原稿',summary:'保留 Figma 已确定的 MCN、应援中心与招募画面。'},
{id:'B',title:'公会内 · 编队',zone:'已确定 · 原稿',summary:'保留现有多 IDOL 编队、派遣粉丝与出战入口。'},
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
raw('home','A','MCN 主城',img('A',0),[hit(225,235,150,175,'support','进入应援中心'),hit(225,205,150,60,'teams','进入编队'),hit(280,560,115,180,'war-entry','进入 Battle')],'Figma 已确定的 MCN 主城原画；按钮热区与原稿入口对应。');
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
panel('aid-helped','D','增援已送出',banner('支援已送达','本次使用的待命粉丝已转入伙伴驻守')+row('本次增援','{{lastAid}} 位')+row('待命粉丝','{{reserve}} 位')+note('同一请求不能重复领取支援贡献。返回求援列表可查看其他仍缺员的伙伴。'),[b('返回伙伴求援','allies'),b('回到地图','map',null,'blue')],{note:'增援成功反馈为交互补充分支；保留原稿伙伴求援列表。'});
flow('defense','D','驻守求援',['map-low','aid-edit','aid','aid-received','guard','map'],['allies','aid-helped']);
flow('reinforce','D','支援伙伴',['allies','aid-helped','map']);
const table=`<div class="ranking"><div><b>阵营</b><b>累计表现</b><b>当前控制</b></div><div><span>蓝 · 星光联盟</span><strong>{{tickets}}</strong><span>{{blueControl}}</span></div><div><span>红 · 炽焰联盟</span><strong>9,280</strong><span>{{redControl}}</span></div><div><span>绿 · 森语联盟</span><strong>8,460</strong><span>—</span></div><div><span>紫 · 极光联盟</span><strong>7,920</strong><span>—</span></div></div>`;
panel('e-locked','E','中心舞台 · 尚未开放',banner('第 6 天开启','本赛季共 6 天')+`<div class="days">${[1,2,3,4,5,6].map(d=>`<span class="${d===6?'final-day':''}">D${d}</span>`).join('')}</div>`+note('前 5 天占点、驻守、招募与编队，为终日舞台争夺做准备。')+row('当前赛程','Day 2 / 6')+row('开放时间','第 6 天 00:00')+note('中心舞台开放后，四个阵营持续争夺同一舞台。'),[b('返回地图','map'),b('演示第 6 天','e-map','day6','blue')],{note:'六天周期已定稿。具体时刻使用演示配置，均以服务器时间为准。',day:2});
panel('e-map','E','第 6 天 · 中心舞台开放',banner('终日舞台争夺已开启','今天决定本战区冠军')+row('剩余时间','08:32:00')+row('当前控制','{{controller}}')+row('我方累计表现','{{tickets}}')+note('累计表现不会因失去舞台而清零。先查看四方战况，再选择已有小队。'),[b('查看中心舞台','e-stage'),b('普通领地','map',null,'blue')],{note:'地图入口延伸自原稿中心舞台，不改变普通领地操作。'});
panel('e-stage','E','中心舞台 · 四方战况',banner('{{controller}}','当前控制方')+table+note('当前控制表示谁正在驻守；累计表现用于最终冠军判定。夺回舞台后，既有表现继续保留。'),[b('派队挑战','e-select'),b('查看规则','e-rules',null,'blue'),b('查看我方驻守','e-owned',null,'blue')],{note:'控制权与累计表现分开显示。分值、权重和奖励数量均是演示参数。'});
panel('e-rules','E','终日争夺规则',`<ol class="rules"><li>赛季第 6 天开放中心舞台，四阵营持续争夺。</li><li>沿用已保存的小队、粉丝派遣和舞台 PK。</li><li>当前控制方获得驻守表现；参与有效攻防也计入表现。</li><li>失去控制不扣除已累计表现。</li><li>到点停止新出战和新增援；已确认派出的行动完成后统一结算。</li><li>累计表现最高的阵营获冠军。相同则比较有效控制时长、前 5 天积分、达到当前表现的先后。</li></ol>`,[b('我知道了','e-stage')],{note:'表现计算权重和同分优先级为本次建议口径；数值可配置。'});
panel('e-select','E','挑战 · 选择已有小队',banner('从已保存的小队派遣','沿用公会内编队')+`<div class="squad selected"><b>小队 1 · 已就绪</b><span>IDOL 编组沿用已保存配置</span><strong>应援粉丝 800 位</strong></div><div class="squad disabled"><b>小队 2 · 驻守中</b><span>需先结束驻守才能再次派遣</span></div>`+row('当前待命','{{reserve}} 位')+note('本次派出 800 位。派遣会暂时锁定粉丝，整场结束后才结算真实损耗。'),[b('选择小队 1','e-confirm'),b('查看编队原稿','teams',null,'blue'),b('返回战况','e-stage',null,'blue')],{note:'多 IDOL 编队结构原样继承。800 位为本条流程的演示队伍。'});
panel('e-confirm','E','确认挑战中心舞台',banner('目标：红 · 炽焰联盟','请确认本次投入')+row('小队','小队 1')+row('派遣粉丝','800 位')+row('待命变化','{{reserve}} → {{afterDispatch}}')+note('派出后，本队粉丝不可同时参与其他行动。回合应援规模的涨跌不直接扣减真实粉丝。')+note('对决结束后，结算面板会列出驻守、归队、疲劳和流失。'),[b('确认出战','e-march','dispatch'),b('返回选择','e-select',null,'blue')]);
panel('e-march','E','小队前往中心舞台',banner('出战指令已确认','派遣中的 800 位粉丝已锁定')+row('小队状态','前往中心舞台')+row('待命粉丝','{{reserve}} 位')+note('到达时再次核对控制方。若目标已由我方控制，会先提示调整行动。'),[b('到达舞台','e-battle'),b('返回战况','e-stage',null,'blue')],{note:'重复提交不会再次扣减粉丝；离开战况页面不会取消已确认出战。'});
panel('e-battle','E','中心舞台 · PK 演出',banner('ROUND 1 / 5','小队 1 对阵炽焰驻守队')+`<div class="versus"><span>我方<br><b>0</b></span><strong>VS</strong><span>对方<br><b>0</b></span></div>`+row('本场派出','800 位真实粉丝')+row('我方应援规模','5,000')+row('对方应援规模','5,000')+note('应援规模用于当前舞台演出判定。真实粉丝将在整场结束后统一结算。'),[b('继续演出','e-event'),b('跳过演出','e-win','win','blue')],{asset:img('C',3),note:'沿用已确定 PK 的 5 回合、事件和胜负结构；中心舞台只增加归属与累计表现反馈。'});
panel('e-event','E','中心舞台 · 回合事件',banner('舞台爆发','我方应援规模 +300')+`<div class="versus"><span>我方<br><b>2</b></span><strong>3 / 5</strong><span>对方<br><b>1</b></span></div>`+row('我方应援规模','5,300')+row('真实派出粉丝','800 位 · 尚未结算')+note('每个回合只更新演出数据，不在这里反复扣减真实粉丝。'),[b('完成对决','e-win','win')],{asset:img('C',4)});
panel('e-win','E','夺下中心舞台',banner('挑战成功 · 控制权转移','蓝 · 星光联盟开始驻守')+row('本场胜负','3 : 2')+row('本次派出','800')+row('继续驻守','560')+row('疲劳休息','160')+row('永久流失','80')+row('我方累计表现','{{tickets}}')+note('800 = 560 驻守 + 160 疲劳 + 80 流失。本场只结算一次。'),[b('查看我方驻守','e-owned'),b('查看粉丝去向','e-ledger',null,'blue')],{note:'粉丝分配与表现加分是演示数据，确认后不重复结算。'});
panel('e-lose','E','中心舞台 · 挑战失利',banner('舞台仍由对方控制','已累计的表现保留')+row('本次派出','800')+row('归队待命','400')+row('疲劳休息','240')+row('永久流失','160')+note('可重新调整小队后再挑战。请留意剩余时间和可派遣粉丝。'),[b('重新选择小队','e-select'),b('查看四方战况','e-stage',null,'blue')]);
panel('e-owned','E','中心舞台 · 我方驻守',banner('{{controller}}','当前控制方')+row('本队驻守','{{guard}} 位')+row('我方累计表现','{{tickets}}')+note('继续驻守积累表现；敌方挑战成功会改变控制权，但我方累计表现保留。'),[b('增援本队','e-aid-confirm'),b('发起公会求援','e-aid'),b('查看四方战况','e-stage',null,'blue')]);
panel('e-aid','E','中心舞台 · 发起求援',banner('请伙伴来帮忙','沿用已确定的公会求援方式')+row('求援目标','中心舞台 · 小队 1')+row('期望补充','400 位')+note('确认后生成带舞台坐标和缺员数的公会求援卡。伙伴从卡片进入增援。'),[b('发布求援','e-aid-post','postAid'),b('返回驻守','e-owned',null,'blue')],{note:'此处只扩展求援目标类型，列表、求援卡和多人反馈沿用 D 模块。'});
panel('e-aid-post','E','中心舞台 · 等待伙伴',banner('求援已发布','中心舞台 · 仍缺 400 位')+note('请求关联当前驻守。补满、失去控制或赛季收官后，请求会结束，旧卡片不可继续增援。'),[b('模拟伙伴到达','e-aid-arrived','receiveAid'),b('返回驻守','e-owned',null,'blue')]);
panel('e-aid-arrived','E','中心舞台 · 增援到达',banner('收到伙伴增援 +400','驻守已补充')+row('本队与伙伴驻守合计','{{combinedGuard}} 位')+note('伙伴粉丝仍归伙伴所有，仅在此共同驻守。本人的粉丝库存不因此增加。'),[b('返回舞台','e-owned')]);
panel('e-aid-confirm','E','增援中心舞台',row('来自待命','100 位')+row('当前待命','{{reserve}} 位')+row('当前驻守','{{guard}} 位')+note('确认后将 100 位待命粉丝转入本队驻守。收官或失去控制时停止接收新增援。'),[b('确认增援','e-owned','reinforce'),b('取消','e-owned',null,'blue')]);
panel('e-ledger','E','本场粉丝去向',row('当前拥有','{{owned}}')+row('待命可派遣','{{reserve}}')+row('派遣锁定','{{locked}}')+row('本队驻守','{{guard}}')+row('疲劳休息','{{tired}}')+note('当前拥有 = 待命 + 锁定 + 驻守 + 疲劳。永久流失已从当前拥有中扣除。'),[b('返回驻守','e-owned')]);
panel('e-busy','E','当前没有可派遣小队',banner('小队均在执行任务','先处理已有派遣或驻守')+note('返回战况查看进行中的行动；也可以回编队查看其他已保存的小队。'),[b('查看战况','e-stage'),b('查看编队','teams',null,'blue')]);
panel('e-short','E','待命粉丝不足',banner('本次需要 800 位','当前可用不足')+note('已锁定、驻守和疲劳中的粉丝不能重复派遣。可以回公会招募，或等待已有行动结束。'),[b('前往招募','support'),b('返回战况','e-stage',null,'blue')]);
panel('e-changed','E','到达前控制权已变化',banner('舞台已由我方控制','本次挑战不会强行开战')+note('可将已派出的本队粉丝转为驻守增援，或全部归队。两种选择都不会额外扣除粉丝。'),[b('转为增援','e-owned','convert'),b('归队待命','e-stage','recall','blue')]);
panel('e-network','E','出战状态确认中',banner('连接暂时中断','正在查询已提交的出战指令')+note('恢复连接后先核对指令状态。不会因为再次点击而重复锁定粉丝。'),[b('恢复连接并查询','e-march','dispatch'),b('返回战况','e-stage',null,'blue')]);
panel('e-close','E','终日收官 · 停止新行动',banner('第 6 天已结束','新的出战与增援已关闭')+row('待完成行动','1 场已确认对决')+note('截止前已经确认派出的行动继续完成。结果统一入账后公布冠军。'),[b('查看收官对决','e-last-battle'),b('查看待结算战况','e-pending',null,'blue')],{note:'收官不截断正在进行的 PK；此时不再接受新派遣、求援和增援。'});
panel('e-last-battle','E','收官对决 · 等待结果',banner('最后一场对决正在完成','本场已在截止前确认派出')+note('结算完成后，先更新控制结果和有效表现，再锁定本战区最终榜单。'),[b('完成收官对决','e-champion','closeFinish')]);
panel('e-pending','E','成绩核对中',banner('最终结果尚未公布','最后一场对决仍在结算')+table+note('当前榜单是暂存成绩，不能提前领取冠军奖励。'),[b('查看待完成对决','e-last-battle')]);
panel('e-champion','E','中心舞台 · 最终冠军',banner('星光联盟 · 本战区冠军','按收官后的累计表现判定')+table+note('冠军不取决于最后一刻的控制方。最终结果锁定后进入赛季结算。'),[b('查看赛季结算','f-result')],{note:'榜单、分数与阵营名称均为独立演示样例。'});
flow('central','E','第 6 天 · 争夺中心舞台',['e-map','e-stage','e-select','e-confirm','e-march','e-battle','e-event','e-win','e-owned'],['e-locked','e-rules','e-lose','e-ledger','e-busy','e-short','e-changed','e-network']);
flow('central-aid','E','中心舞台 · 求援与增援',['e-owned','e-aid','e-aid-post','e-aid-arrived','e-owned'],['e-aid-confirm']);
flow('finale','E','收官 · 冻结与决出冠军',['e-close','e-last-battle','e-champion','f-result'],['e-pending']);
const resultTable=`<div class="ranking final-rank"><div><b>名次</b><b>本战区联盟</b><b>赛季积分</b></div><div><strong>01</strong><span>星光联盟 · 冠军</span><b>38,420</b></div><div><strong>02</strong><span>炽焰联盟</span><b>36,180</b></div><div><strong>03</strong><span>森语联盟</span><b>32,640</b></div><div><strong>04</strong><span>极光联盟</span><b>29,870</b></div></div>`;
panel('f-result','F','S1 · 赛季结算',banner('6 天赛程已完成','星光联盟夺得中心舞台冠军')+resultTable+note('榜单范围：本战区 4 个联盟。冠军固定第 1，其余联盟按赛季积分排序。'),[b('查看我的贡献','f-personal'),b('查看冠军依据','e-champion',null,'blue')],{note:'不展示跨服总榜。最终成绩在所有截止前行动结算后锁定。',day:6});
panel('f-personal','F','赛季结算 · 我的贡献',metric('赛季个人贡献','2,680')+row('占领与进攻','1,420')+row('有效驻守','860')+row('伙伴增援','400')+note('个人贡献展示你在本赛季的参与记录，用于说明对应的奖励档位。'),[b('查看我的奖励','f-reward'),b('回到战区榜单','f-result',null,'blue')]);
panel('f-reward','F','赛季奖励 · 待领取',banner('奖励已就绪','奖励以结算时资格为准')+row('联盟成绩奖励','金币 ×20,000')+row('个人贡献奖励','应援券 ×3')+row('冠军纪念','S1 冠军纪念章')+row('领取状态','{{claimLabel}}')+note('奖励只能领取一次。断线或重复点击时，以同一赛季的领取记录为准。'),[b('一键领取','f-claimed','claim'),b('查看跨季保留','f-carry',null,'blue')],{note:'金币、应援券、贡献门槛和称号期限是演示配置；本次定稿的是流程与展示口径。'});
panel('f-claimed','F','赛季奖励 · 已领取',banner('奖励领取成功','S1 奖励已发放')+row('金币','+20,000')+row('应援券','+3')+row('纪念章','已收录至赛季档案')+note('再次进入将显示已领取，不会重复发放。'),[b('查看赛季档案','f-history'),b('查看跨季保留','f-carry',null,'blue')]);
panel('f-claim-error','F','领取状态待确认',banner('连接暂时中断','正在核对本赛季领取记录')+note('如果已到账，会直接显示已领取；如果尚未到账，再完成发放。不会重复扣除资格或重复发奖。'),[b('重新核对并领取','f-claimed','claim'),b('返回奖励页','f-reward',null,'blue')]);
panel('f-ineligible','F','本赛季暂无可领奖励',banner('未满足本次奖励资格','本赛季无有效参战记录')+note('可以查看战区结算。已拥有的粉丝、IDOL 和编队仍保留，下赛季继续参加。'),[b('查看赛季结算','f-result'),b('返回公会','home',null,'blue')]);
panel('f-history','F','赛季档案 · S1',banner('冠军纪念章已收录','星光联盟 · 6 天赛季')+row('联盟名次','1 / 4')+row('个人贡献','2,680')+row('冠军记录','S1 · 中心舞台冠军')+note('赛季纪念作为历史荣誉保留。若配置限时称号，单独显示到期时间，不删除历史战绩。'),[b('查看跨季保留','f-carry'),b('回到奖励','f-reward',null,'blue')]);
panel('f-carry','F','下一赛季 · 什么会保留',`<div class="carry"><h3>持续保留</h3><p>已拥有的应援粉丝、IDOL、保存的小队配置、已领取奖励、历史赛季荣誉。</p><h3>新赛季重新开始</h3><p>联盟赛季积分、地图领地归属、中心舞台累计表现与本赛季个人贡献。</p></div>`+note('所有已派遣行动先完成结算，再解除赛季驻守。疲劳粉丝按原有恢复规则归队。'),[b('返回休战期公会','f-rest'),b('回看结算','f-result',null,'blue')]);
panel('f-rest','F','休战期 · 准备下一赛季',banner('S1 已收官','招募与编队仍可使用')+row('当前拥有粉丝','{{owned}}')+note('继续经营公会，保存的小队可以带入下一赛季。新的地图、积分和中心舞台表现将在开季时重置。'),[b('招募粉丝','support'),b('调整编队','teams',null,'blue'),b('演示下一赛季','f-next','nextSeason','blue')]);
panel('f-next','F','S2 · 新赛季开启',banner('新赛季 · Day 1 / 6','公会经营成果已保留')+row('拥有粉丝','{{owned}}')+row('赛季积分','0')+row('中心舞台表现','0')+note('从普通领地开始新的占点征程。中心舞台仍在本赛季第 6 天开放。'),[b('进入地图','map'),b('回到公会','home',null,'blue')],{day:1});
flow('season','F','赛季结算与奖励',['f-result','f-personal','f-reward','f-claimed','f-history','f-carry','f-rest'],['e-pending','f-claim-error','f-ineligible','f-next']);
function coach(id,title,asset,text,target,next,extra={}){raw(id,'G',title,asset,[hit(...target,next,'点击高亮区域',extra.action)],text); Object.assign(screens[id],{coach:text,target,next,...extra,locked:false});}
coach('g-s0','S0 · 认识应援粉丝',img('A',0),'先招募应援粉丝，再带他们登台。点击 Fans 进入应援中心。',[244,330,144,120],'g-recruit');
coach('g-recruit','S0 · 第一次招募',img('A',1),'这里是你长期拥有的应援粉丝。点击招募，完成第一次积累。',[104,704,205,58],'g-live');
coach('g-live','S0 · 等待招募完成',img('A',3),'招募完成后领取粉丝。之后就可以在已有编队中配置派遣人数。',[123,624,165,53],'g-claim');
coach('g-claim','S0 · 领取粉丝',img('A',5),'粉丝已经招募完成。收下这份应援，一起去查看编队。',[106,558,197,62],'g-team',{action:'tutorialRecruit'});
coach('g-team','S0 · 保存编队',img('B',0),'使用这套已保存的 IDOL 编队。正式出战时，从已保存的小队中派遣。',[78,742,249,65],'g-sim-ready');
panel('g-sim-ready','G','S1 · 只练习一场',banner('模拟舞台对决','不消耗真实粉丝，不影响赛季')+note('用一场练习认识回合、应援规模变化和整场结算。练习结束后直接进入正式参战教学。'),[b('开始唯一一场练习','g-sim','simStart'),b('跳过练习','g-real',null,'blue')],{note:'模拟数据与正式粉丝账本隔离。S1 不串联第二场强制模拟。'});
coach('g-sim','S1 · 认识舞台回合',img('C',3),'一场对决有 5 个回合。这里的应援规模只服务演出判定，不是你的真实粉丝库存。',[12,490,376,75],'g-sim-event',{simulation:true});
coach('g-sim-event','S1 · 认识回合事件',img('C',4),'回合事件会影响应援规模。整场结束后，才统一查看真实粉丝去向。',[47,325,313,330],'g-sim-result',{simulation:true});
panel('g-sim-result','G','S1 · 练习完成',banner('你已经完成一场练习','可以开始正式参战了')+row('模拟胜负','3 : 2')+row('真实粉丝消耗','0')+row('正式库存','{{owned}} · 未受练习影响')+note('正式对决会锁定派出的粉丝，并在整场结束后结算疲劳与流失。'),[b('进入正式参战教学','g-real','simFinish')]);
panel('g-real','G','S2 · 第一次正式参战',banner('接下来使用真实粉丝','请先确认派遣和结算方式')+note('派出时：粉丝暂时锁定，不能重复使用。')+note('对决结束：查看驻守、归队、疲劳、流失的完整去向。')+note('如果当前活动提供新手保护，以出战确认页实际显示为准。'),[b('我知道了，查看地图','g-map')],{note:'不擅自写死“3 场零流失”等尚未确定的保护数值。'});
coach('g-map','S2 · 选择一块领地',img('C',0),'点击推荐领地，先查看归属与占领收益。',[44,186,173,206],'g-target');
coach('g-target','S2 · 确认挑战',img('C',1),'这里显示领地和对手信息。确认使用已保存小队后，开始正式对决。',[114,648,190,76],'g-battle');
coach('g-battle','S2 · 完成正式对决',img('C',3),'战斗沿用刚刚认识的回合结构。完成整场后，查看最终结算。',[2,499,397,325],'g-win');
coach('g-win','S2 · 阅读最终结算',img('C',6),'先确认真实粉丝的结算结果，再决定继续驻守。驻守缺员时，再学习求援。',[78,724,245,78],'g-complete');
panel('g-complete','G','基础引导已完成',banner('招募 → 编队 → 正式参战','现在可以自行占点与驻守')+note('无需连续学习所有协作功能。第一次缺员时提示求援；第一次看到伙伴求援时提示增援。'),[b('返回地图自由操作','map','tutorialComplete'),b('演示首次求援教学','g-aid',null,'blue'),b('演示首次增援教学','g-reinforce',null,'blue')]);
coach('g-aid','首次缺员 · 学会求援',img('D',1),'待命粉丝不足时，可以请伙伴帮忙。确认数量后发布求援。',[97,585,211,83],'g-aid-wait');
coach('g-aid-wait','首次求援 · 查看帮助',img('D',2),'在“我的求援”查看进度。多人支援会合并展示，补满后请求结束。',[76,245,267,338],'g-aid-done');
coach('g-aid-done','首次求援 · 收到支援',img('D',3),'伙伴送来的粉丝进入驻守，额外部分按原规则补充。确认后继续守点。',[94,737,220,82],'guard',{action:'aidGuideDone'});
coach('g-reinforce','首次增援 · 帮助伙伴',img('D',5),'选择仍缺员的伙伴，使用自己的待命粉丝增援。已经完成的请求不能再增援。',[267,327,80,44],'g-reinforce-done');
panel('g-reinforce-done','G','增援教学已完成',banner('你已了解如何帮助伙伴','正式增援使用待命粉丝')+note('在公会求援中查看伙伴需求，确认数量后增援。本次教学展示不额外扣减粉丝。'),[b('查看伙伴求援','allies','reinforceGuideDone')]);
panel('g-paused','G','引导已暂存',banner('可以先自由操作','学习进度会在本设备保留')+note('随时从新手模块继续上次的步骤。已完成的招募或奖励不会因继续引导而重复发放。'),[b('继续上次引导','g-s0','resumeGuide'),b('返回公会','home',null,'blue')]);
flow('onboarding','G','S0 → S2 · 渐进教学',['g-s0','g-recruit','g-live','g-claim','g-team','g-sim-ready','g-sim','g-sim-event','g-sim-result','g-real','g-map','g-target','g-battle','g-win','g-complete'],['g-paused']);
flow('context-aid','G','首次需要时 · 求援教学',['g-aid','g-aid-wait','g-aid-done','guard']);
flow('context-reinforce','G','首次需要时 · 增援教学',['g-reinforce','g-reinforce-done','allies']);
for(const f of flows)for(const step of f.steps)if(step.label===step.id&&screens[step.id])step.label=screens[step.id].title;
root.IDOLData={screens,flows,modules,seasonDays:6};
if(typeof module==='object')module.exports=root.IDOLData;
})(typeof window==='object'?window:globalThis);
