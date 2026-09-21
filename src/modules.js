(function(root){
'use strict';
const G=root.GameWire,{P,Screen,screens}=G;
const get=id=>screens.find(s=>s.id===id);
const text=(s,a,b)=>s.ops.forEach(o=>{if(o.t==='text')o.text=o.text.split(a).join(b)});
const route=(s,a,b)=>s.ops.forEach(o=>{if(o.t==='hit'&&o.to===a)o.to=b});
function make(id,title,note,draw){const i=screens.findIndex(s=>s.id===id);if(i>=0)screens.splice(i,1);const s=new Screen(id,title,note);draw(s);return s;}
function tx(s,key,value,...args){s.txt(value,...args);s.ops[s.ops.length-1].bind=key;return s;}
function action(s,value){const hit=[...s.ops].reverse().find(o=>o.t==='hit');if(hit)hit.action=value;}
function panel(s,title,back='home',y=160,h=565){return s.hub().modal(title,y,h,back);}
function tabs(s,active){[['单推应援','single-honor'],['群推应援','multi-honor']].forEach(([t,id],i)=>s.btn(t,44+i*161,187,152,40,id,id===active?'gold':'blue'));}

get('home').title='公会内部 · MCN 主城';
get('home').note='CEO 在公会内招募、编队；库存与配置跨赛季保留。';
for(const s of screens){
  const inside=s.ops.some(o=>o.t==='text'&&o.text==='公会内部 · CEO 运营');
  s.zone=inside?'inside':'outside';
  if(s.id.startsWith('support')){
    s.note='招募发生在公会内部；关闭回公会，可返回原 Battle。';
    text(s,'约可支持 '+(s.id==='support-full'?6:2)+' 场标准区域对决','粉丝跨赛季保留 · 正式出战会消耗');
    text(s,'前往公会战','前往 Battle');
    for(const o of s.ops)if(o.t==='hit'&&o.label==='×')o.to='home';
  }
  if(s.id.startsWith('map')||s.id==='day6-map'){
    s.note='公会外部占点地图；胜利后驻守，为 MCN 累积积分。';
    text(s,'公会舞台','盛典舞台');
  }
}
get('support-map').title='回公会 · 补充粉丝';
get('support-map').note='从 Battle 回到公会内招募；补充后返回原出战流程。';
text(get('support-s0'),'公司Lv8开放','完成教学后开放');
text(get('s0-done'),'公司 Lv8 开放公会战','粉丝已保存 · 随时回公会经营');
get('s0-done').note='首批粉丝留在公会内；完成后可继续模拟教学。';
get('s0-done').btn('开始占点教学',103,718,196,47,'train-map1');
text(get('s0-entry'),'你的 Battle 赢了，\n观众想继续支持你。','你是偶像的 CEO，\n先在 MCN 招募粉丝。');
text(get('s0-story'),'Battle 赢来的观众，\n会成为你的应援粉丝。','招募到的应援粉丝，\n会长期留在你的粉丝团。');
for(const id of ['teams','teams25','teams100','teams2','team-luna']){
  const s=get(id);s.title='公会内部 · '+(id==='teams2'?'支援队编队':'主力队编队');
  s.note='在公会内保存领队和带队规模；保存不消耗粉丝。';
  for(const o of s.ops)if(o.t==='hit'&&o.label==='×')o.to='home';
}
make('leader-team','公会内部 · 选择领队','选择已有偶像卡，保存后供 Battle 调用。',s=>{
  panel(s,'选择领队','teams',157,564);s.txt('我的偶像 · 每队 1 位领队',47,185,308,17,P.dim,'center');
  ['Echo','Luna','Mia','Nova','Yuki','Rin'].forEach((name,i)=>{const x=49+i%3*108,y=237+Math.floor(i/3)*179;s.avatar(name,x,y,88,113,i===5?P.dim:P.friend);s.txt(i===5?'驻守中':['Pop','EDM','R&B'][i%3],x,y+137,90,12,P.dim,'center');if(i!==5){s.hit(x,y,88,156,'teams','选择 '+name);action(s,{type:'leader',name,style:['Pop','EDM','R&B'][i%3]});}});
  s.txt('驻守中的偶像暂不可重复编队',45,673,311,13,P.gold,'center');
});
make('team-saved','公会内部 · 编队已保存','配置长期保留；进入 Battle 只调用已保存小队。',s=>{
  panel(s,'小队已保存','home',247,364);
  tx(s,'saved-name','主力队 · Echo',44,298,314,25,P.gold,'center',true);
  tx(s,'saved-size','计划带队 5,000 位',44,357,314,22,P.fan,'center',true);
  s.txt('保存不扣粉丝 · 赛季结束不清空',44,414,314,14,P.dim,'center');
  s.btn('留在公会',44,518,144,48,'home','blue');s.btn('继续 Battle',211,518,147,48,'resume-war');
});
make('resume-war','返回 Battle','按进入公会前的位置返回。',s=>s.hub());
make('war-entry','公会内 → Battle','带上已保存小队，到公会外占点；可随时回公会经营。',s=>{
  panel(s,'占点大战 · Battle','home',192,485);
  s.node('盛典舞台',201,273,P.gold,null);s.txt('代表星光 MCN 登台应援',43,355,315,24,P.gold,'center',true);
  s.txt('公会内：招募粉丝、保存编队\n公会外：消耗粉丝、占点得分',49,414,303,19,P.ink);
  s.txt('未消耗的粉丝与编队跨赛季保留',43,508,315,14,P.fan,'center');
  s.btn('进入占点地图',105,582,192,49,'map');
});
function squadPicker(id='war-teams'){
  make(id,'Battle · 选择已存小队','此处仅选择小队；编辑领队与配置需回公会。',s=>{
    s.map().modal('选择已保存小队',168,535,'deploy');
    [['主力队','Echo','Pop',5000],['支援队','Luna','EDM',3000]].forEach((a,i)=>{
      const y=229+i*142;s.avatar(a[1],46,y,65,80);tx(s,'picker-'+i,a[0]+' · '+a[1],132,y+4,215,19,P.ink,'left',true);tx(s,'picker-size-'+i,'计划带队 '+G.fmt(a[3]),132,y+39,215,14,P.fan);
      s.btn('选择',239,y+78,110,35,'deploy');action(s,{type:'squad',index:i});
    });
    s.txt('粉丝与偶像状态在出战时再次校验',44,558,314,13,P.dim,'center');
    s.btn('回公会调整',111,615,180,46,'teams','blue');
  });
}
squadPicker();squadPicker('leader');
for(const id of ['deploy','deploy-safe','deploy-all','deploy-luna','deploy8','central-deploy','novice-deploy']){
  const novice=id==='novice-deploy';const place=id==='deploy8'?'标准区域 8 号':id==='central-deploy'?'中心舞台':'标准区域 7 号';
  const target=id==='deploy8'?'battle8':id==='central-deploy'?'central-battle':novice?'novice-battle':'battle';
  const back=id==='deploy8'?'territory8':id==='central-deploy'?'central':novice?'novice-map':'territory';
  make(id,'Battle · 出战确认','调用公会内已存编队；确认前显示粉丝代价。',s=>{
    s.map({total:novice?1500:12400}).modal('出战确认',139,631,back,364);
    s.txt(place+' · '+(novice?'新手保护':'占点挑战'),38,160,326,17,P.ink,'center',true);
    s.r(37,201,328,108,P.panel2,0,P.gold);s.txt(novice?'保护生效 · 本场不消耗':'预计消耗应援粉丝',47,215,308,16,P.gold,'center');
    tx(s,'loss-range',novice?'0':'1,100 ~ 1,600',49,248,304,28,P.fan,'center',true);
    tx(s,'owned-after',novice?'库存 1,500 → 1,500':'库存 12,400 → 10,800~11,300',39,329,324,16,P.fan,'center',true);
    s.avatar('Echo',49,388,73,91);tx(s,'deploy-leader','主力队 · Echo / Pop',143,391,208,18,P.ink,'left',true);
    tx(s,'deploy-size',novice?'带队 1,500 位':'带队 5,000 位',143,430,208,18,P.fan,'left',true);
    if(!novice)s.btn('换小队',235,476,116,38,'war-teams','blue');
    s.txt('配置来自公会内编队室',43,548,316,16,P.dim,'center');
    tx(s,'loss-failed',novice?'胜负均不消耗 · 保护剩余 3 场':'若战败：预计消耗 2,400 位',43,586,316,15,P.gold,'center');
    if(!novice)s.btn('回公会调整',45,640,144,38,'teams','blue');
    s.btn('确认出战',116,706,170,48,target);
  });
}

make('honor','公会内部 · 盛典荣誉','新增方案：MCN 团队成绩与领队 IDOL 荣誉分别展示。',s=>{
  panel(s,'盛典荣誉','home',157,580);s.ellipse(201,242,46,40,P.panel2,P.gold);s.txt('★',167,211,68,45,P.gold,'center');
  s.txt('星光 MCN',45,307,312,27,P.ink,'center',true);tx(s,'guild-score','本期公会积分 1,248',45,354,312,21,P.gold,'center',true);
  s.txt('CEO 运作粉丝团 · IDOL 领队登台',45,401,312,15,P.dim,'center');
  s.btn('MCN 赛季成绩',58,454,286,47,'mcn-rank','blue');
  s.btn('本期领队 IDOL 榜',58,518,286,47,'idol-rank');
  s.btn('我的单推 / 群推应援',58,582,286,47,'single-honor','blue');
  s.btn('历届荣誉收藏',108,658,186,37,'honor-collection','blue');
});
make('mcn-rank','盛典 · MCN 赛季成绩','赛季进行中查看积分；结束后才可领奖。',s=>{
  panel(s,'MCN 赛季成绩','honor',171,540);
  s.txt('所属机构 · 星光 MCN',44,215,314,25,P.gold,'center',true);
  tx(s,'guild-score','本期公会积分 1,248',44,273,314,23,P.fan,'center',true);
  s.txt('第 12 名',44,335,314,32,P.gold,'center',true);
  s.txt('占领舞台区域，持续为机构赢得积分',44,400,314,16,P.ink,'center');
  tx(s,'season-status','赛季进行中 · 结束后结算奖励',44,459,314,16,P.dim,'center');
  s.btn('查看赛季结算',104,537,194,47,'season');
  s.btn('返回 Battle',104,606,194,43,'resume-war','blue');
});
make('idol-rank','盛典 · 领队 IDOL 榜','新增方案：按本期有效带队贡献聚合到 IDOL；切换领队不转移历史记录。',s=>{
  panel(s,'本期领队 IDOL 榜','honor',151,607);s.txt('S1 · 盛典应援热度',44,184,314,19,P.gold,'center',true);
  [['Echo','Pop','12,840'],['Luna','EDM','11,600'],['Mia','R&B','10,360']].forEach((a,i)=>{const y=245+i*113;s.txt(String(i+1),44,y+18,28,25,P.gold,'center',true);s.avatar(a[0],83,y,56,66);s.txt(a[0]+' · '+a[1],160,y+2,185,20,P.ink,'left',true);s.txt('应援热度 '+a[2],160,y+41,185,16,P.fan);s.hit(43,y-5,313,95,'idol-detail','查看 '+a[0]);action(s,{type:'idol',name:a[0],rank:i+1,heat:a[2]});});
  s.txt('热度来自正式带队贡献',44,598,314,17,P.gold,'center');
  s.txt('招募、模拟和切换配置不会直接加热度',44,634,314,13,P.dim,'center');
  s.btn('我的应援目标',105,692,192,43,'single-honor');
});
make('idol-detail','盛典 · IDOL 应援详情','新增方案：个人运作贡献归属本场领队，关联荣誉和内容偏好。',s=>{
  panel(s,'领队 IDOL','idol-rank',159,580);s.avatar('Echo',153,210,96,114,P.fan);
  tx(s,'idol-name','Echo · 本期第 1 名',43,348,316,25,P.gold,'center',true);
  tx(s,'idol-heat','应援热度 12,840',43,399,316,21,P.fan,'center');
  tx(s,'idol-mine','我的有效应援 320',43,442,316,16,P.ink,'center');
  s.txt('让 TA 带队，为 MCN 争取舞台',43,487,316,16,P.dim,'center');
  s.btn('去公会编队',45,549,147,47,'teams');s.btn('应援奖励',212,549,145,47,'single-honor','blue');
  s.btn('想看 TA 的专属内容',76,635,250,44,'content-intent','blue');
});
for(const kind of ['single','multi']){
  const single=kind==='single';
  make(kind+'-honor',single?'应援目标 · 单推':'应援目标 · 群推','新增方案：单推、群推可同时达成；门槛与奖励仅作展示。',s=>{
    panel(s,'我的应援目标','honor',156,604);tabs(s,kind+'-honor');
    if(single){s.avatar('Echo',155,251,91,106,P.fan);tx(s,'single-idol','Echo · 本期持续应援',44,382,314,22,P.gold,'center',true);}else{
      ['Echo','Luna','Mia'].forEach((name,i)=>s.avatar(name,62+i*102,264, 74,91,P.fan));
      s.txt('一起登台 · 多位 IDOL 都有贡献',44,382,314,19,P.gold,'center',true);
    }
    s.txt(single?'✓ 持续支持同一位 IDOL\n✓ 由 TA 领队完成正式应援':'✓ 多位 IDOL 完成有效带队\n✓ 达成本期公会战参与目标',48,438,306,17,P.ink);
    s.r(45,534,311,92,P.panel2,0,P.edge);s.txt('本期应援成就奖励',52,546,297,14,P.dim,'center');
    tx(s,kind+'-reward',single?'Echo 应援徽章 · 展示称号':'同台应援徽章 · 展示称号',52,579,297,19,P.gold,'center',true);
    s.btn('领取荣誉',109,662,184,47,kind+'-claimed');
    s.txt('两条目标可同时完成，均不要求排名',44,723,314,12,P.dim,'center');
  });
  make(kind+'-claimed','荣誉 · 已收藏','新增方案：荣誉跨赛季收藏，同一成就不可重复领取。',s=>{
    panel(s,'应援荣誉已收藏','honor',239,367);s.ellipse(201,334,45,43,P.panel2,P.gold);s.txt('★',171,307,60,42,P.gold,'center');
    tx(s,'claim-name',single?'Echo 应援徽章':'同台应援徽章',45,406,312,26,P.gold,'center',true);
    s.txt('下期仍可展示，本期进度保留',45,462,312,15,P.dim,'center');s.btn('查看荣誉收藏',105,529,192,47,'honor-collection');
  });
}
make('honor-collection','公会内部 · 荣誉收藏','新增方案：已得徽章长期展示；本期目标进度按赛季更新。',s=>{
  panel(s,'我的荣誉收藏','honor',167,558);s.txt('本期与历届 · S1',44,197,314,20,P.gold,'center',true);
  [['本命应援','Echo 应援徽章','single-honor'],['同台应援','群推应援徽章','multi-honor']].forEach((a,i)=>{const y=264+i*176;s.ellipse(82,y+42,29,29,P.panel2,P.gold);s.txt('★',61,y+20,42,32,P.gold,'center');s.txt(a[0],135,y+4,205,22,P.ink,'left',true);tx(s,'collection-'+i,'尚未领取 · 去查看',135,y+49,210,15,P.dim);s.btn('查看目标',216,y+92,130,37,a[2],'blue');});
  s.txt('已得荣誉跨赛季保留',44,664,314,16,P.fan,'center');
});
make('content-intent','IDOL · 专属内容偏好','新增方案：热度与偏好用于内容规划；同时保留 IDOL 轮换覆盖。',s=>{
  panel(s,'你期待 TA 的什么内容？','idol-detail',193,490);s.avatar('Echo',153,237,96,112,P.fan);tx(s,'content-idol','Echo',44,374,314,26,P.gold,'center',true);
  s.btn('专属剧情',53,445,141,54,'content-recorded');action(s,{type:'content',choice:'专属剧情'});
  s.btn('专属服装',208,445,141,54,'content-recorded');action(s,{type:'content',choice:'专属服装'});
  s.txt('记录期待，不消耗粉丝',44,539,314,17,P.fan,'center');s.txt('内容需另行公布，不代表已排期',44,587,314,14,P.dim,'center');
});
make('content-recorded','IDOL · 期待已记录','新增方案：本地演示，仅表现记录与更改偏好的操作。',s=>{
  panel(s,'期待已记录','idol-detail',253,340);tx(s,'content-choice','Echo · 专属剧情',44,322,314,26,P.gold,'center',true);
  s.txt('后续内容请留意游戏公告',44,396,314,18,P.ink,'center');s.btn('更改期待',45,492,146,46,'content-intent','blue');s.btn('返回荣誉',211,492,147,46,'honor');
});

// The season panel joins the guild and IDOL reward paths without changing their currencies.
get('season').btn('领队 IDOL 榜',45,580,148,39,'idol-rank','blue');get('season').btn('我的应援奖励',210,580,148,39,'single-honor','blue');
get('season').note='赛季领奖、商店与 IDOL 荣誉分线；积分、贡献币和热度分别展示。';
get('season-claimed').btn('查看 IDOL 荣誉',100,481,202,37,'honor','blue');
for(const id of ['shop','shop-done'])route(get(id),'rest','home');
make('rest','赛季休战 · 回公会经营','休战关闭外部占点；内部库存与编队保留。',s=>{
  panel(s,'本期结束 · 休战中','home',166,579);s.txt('星光 MCN · 下期再登台',43,210,316,24,P.gold,'center',true);
  tx(s,'retained-fans','应援粉丝 12,400 · 保留',43,280,316,21,P.fan,'center',true);
  s.txt('已有偶像与已保存小队 · 保留\n已获应援荣誉 · 保留',48,340,306,18,P.ink);
  s.txt('下期更新：公会积分与当期榜单',44,428,314,16,P.dim,'center');
  s.btn('继续招募',45,491,146,45,'support');s.btn('调整编队',211,491,147,45,'teams','blue');
  s.btn('公会商店',45,553,146,43,'shop','blue');s.btn('历届荣誉',211,553,147,43,'honor-collection','blue');
  s.btn('查看下期开启',101,656,200,43,'next-season','blue');
});
make('next-season','下期开启 · 长期资产承接','演示跨季：仅更新本期记录；粉丝、偶像、编队和收藏仍在。',s=>{
  panel(s,'S2 · 新一期盛典','home',207,465);s.txt('继续运营你的应援粉丝团',43,258,316,24,P.gold,'center',true);
  tx(s,'retained-fans','应援粉丝 12,400 · 已承接',43,322,316,22,P.fan,'center',true);
  tx(s,'retained-team','主力队 Echo · 5,000 位配置',43,376,316,17,P.ink,'center');
  s.txt('本期公会积分 0 · 当期热度重新累计',43,430,316,15,P.dim,'center');
  s.btn('回公会经营',44,552,148,48,'home','blue');s.btn('进入 Battle',210,552,148,48,'map');
});
make('rules','Battle · 规则','招募与配置长期留存；正式占点消耗粉丝。',s=>{
  s.map().modal('占点大战 · 规则',190,515,'map');
  s.txt('公会内：招募、编队，跨赛季保留。\n公会外：带队占点，消耗应援粉丝。\n\n占领区域，定时获得公会积分。\n贡献分用于商店；热度用于 IDOL 荣誉。\n\n出战前看预计消耗；结算看实际账本。\n已有偶像与编队不会因消耗而丢失。\n\n保护、回归比例沿用待评审示例。',43,229,316,16,P.ink);
  s.btn('知道了',123,631,156,45,'map');
});
make('score-tick','Battle · 驻守积分结算','定时结算事件；驻守中的区域为 MCN 增加积分。',s=>{
  s.map().modal('驻守积分已结算',238,371,'map-guard');
  tx(s,'tick-gain','公会积分 +12',44,293,314,30,P.gold,'center',true);
  tx(s,'tick-total','星光 MCN · 1,260 分',44,362,314,23,P.fan,'center',true);
  s.txt('来自当前驻守区域 · 本次结算不扣粉丝',44,428,314,15,P.dim,'center');
  s.btn('继续守住舞台',108,522,186,47,'map-guard');
});
for(const s of screens){
  if(s.id==='resume-war')continue;
  // Never expose an editable squad panel while still showing the external map.
  if(s.id.startsWith('support'))for(const o of s.ops)if(o.t==='hit'&&o.to==='teams')o.to='teams';
  if(s.zone===undefined)s.zone=s.ops.some(o=>o.t==='text'&&o.text==='公会内部 · CEO 运营')?'inside':'outside';
  if(/^honor|^idol|^single-|^multi-|^content-/.test(s.id))s.proposal=true;
}
G.moduleHelpers={get,text,route,tx};
})(typeof module==='object'?require('./game.js'):window);
