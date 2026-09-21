(function(root){
'use strict';const G=root.GameWire;
const modules=[
 {id:'A',title:'公会内 · 粉丝招募',zone:'长期经营',summary:'直播招募 → 粉丝入库 → 持续经营'},
 {id:'B',title:'公会内 · 编队',zone:'长期经营',summary:'选领队 → 定规模 → 保存小队'},
 {id:'C',title:'公会外 · 占点 Battle',zone:'赛季行动',summary:'选点 → 调用小队 → 消耗粉丝 → 占点'},
 {id:'D',title:'公会外 · 驻守协作',zone:'赛季行动',summary:'驻守 → 补充 → 求援 → 支援入账'},
 {id:'E',title:'赛季 · 积分与领奖',zone:'赛季回报',summary:'占点得分 → MCN 排名 → 领奖 / 兑换'},
 {id:'F',title:'盛典 · IDOL 应援荣誉',zone:'新增方案',summary:'领队上榜 → 单推 / 群推成就 → 荣誉收藏'},
 {id:'G',title:'新手 · S0 → S2',zone:'渐进教学',summary:'公会内认识粉丝 → 模拟 → 正式占点'},
 {id:'H',title:'回流 · 休战与跨季',zone:'长期承接',summary:'回流体验 → 休战经营 → 下期继续使用'}
];
const flow=(id,module,title,steps,branches=[])=>({id,module,title,steps:steps.map(([id,label])=>({id,label})),branches});
const flows=[
 flow('daily','A','日常招募',[['home','MCN 主城'],['support','粉丝团'],['recruit','开播准备'],['live-running','直播中'],['live-ready','领取粉丝'],['support-recruited','库存增加']],['ad','pack','support-full','reserve','reserve-ready','support-returned']),
 flow('formation','B','长期编队',[['home','MCN 主城'],['teams','编队室'],['leader-team','选领队'],['teams100','调带队规模'],['team-saved','保存成功'],['war-entry','进入 Battle']],['teams2','team-list','teams25','team-auto','teams3','teams-locked']),
 flow('occupation','C','正式占点',[['map','外部地图'],['territory','选中区域'],['deploy','出战确认'],['battle','舞台对决'],['win','消耗结算'],['guard-setup','确认驻守'],['map-guard','守住舞台'],['score-tick','定时获得积分']],['win-detail','war-teams','teams','team-saved','low-fans','target-changed','offline','lose','lose-detail','territory8','deploy8','empty']),
 flow('defense','D','驻守求援',[['map-low','待命不足'],['guard-low','查看驻守'],['aid-compose','发起求援'],['aid-posted','等待支援'],['aid-received','伙伴支援'],['guard-aided','驻守补充'],['map-aided','返回地图']],['guard-active','guard-off','donate-fulfilled']),
 flow('donation','D','支援伙伴',[['aid','伙伴求援帖'],['donate-confirm','扣除预告'],['donate-done','支援成功'],['aid-partial','请求更新']],['donate-low','donate-fulfilled','aid-fulfilled']),
 flow('finale','E','盛典舞台争夺',[['day6','舞台开放'],['day6-map','盛典地图'],['central','舞台选点'],['central-deploy','出战预告'],['central-battle','应援对决'],['central-win','占领舞台']],['major-win']),
 flow('season','E','赛季领奖与兑换',[['season','MCN 成绩'],['season-claimed','领取奖励'],['shop','公会商店'],['shop-confirm','兑换确认'],['shop-done','获得道具'],['rest','回公会休战']],['mcn-rank','honor','idol-rank','single-honor']),
 flow('idol','F','领队上榜与单推荣誉',[['honor','盛典荣誉'],['idol-rank','领队 IDOL 榜'],['idol-detail','我的应援贡献'],['single-honor','单推目标'],['single-claimed','领取荣誉'],['honor-collection','长期收藏']],['multi-honor','content-intent']),
 flow('multi','F','群推荣誉',[['honor','盛典荣誉'],['multi-honor','多 IDOL 带队'],['multi-claimed','领取荣誉'],['honor-collection','长期收藏']],['single-honor','idol-detail']),
 flow('content','F','专属内容期待',[['idol-rank','领队热度'],['idol-detail','IDOL 详情'],['content-intent','选剧情 / 服装'],['content-recorded','记录期待']],['honor']),
 flow('s0','G','新手 S0 · 先认识粉丝',[['s0-entry','公会内入口'],['s0-story','认识观众'],['s0-free','免费直播'],['s0-topic','选话题'],['s0-live','观众加入'],['s0-gift','粉丝入账'],['s0-done','资产留存']],['support-s0']),
 flow('s1','G','新手 S1 · 三场模拟',[['train-map1','模拟入口'],['train-deploy1','练习专用粉丝'],['train-battle1','熟悉 Battle'],['train-win1','理解占点'],['train-deploy2','风格克制'],['train-deploy3','势均力敌'],['train-win3','模拟结束'],['s1-complete','学习完成']],['train-map2','train-map3','train-win2','train-battle2','train-battle3']),
 flow('s2','G','新手 S2 · 正式占点',[['s2-warning','消耗预告'],['novice-map','正式地图'],['novice-deploy','实际资产'],['novice-battle','首次正式对决'],['novice-win','保护结算'],['guard-novice','开始驻守']],['teams-locked']),
 flow('return','H','老玩家回归',[['return1','认识粉丝'],['return2','长期编队'],['return3','占点消耗'],['return4','团队回报'],['return-gift','体验礼'],['return-training','自选模拟'],['return-finish','回归完成']],['home','map']),
 flow('continuity','H','休战经营与跨季',[['rest','赛季休战'],['support','继续招募'],['teams','继续编队'],['honor-collection','荣誉保留'],['next-season','下期承接'],['home','公会经营']],['shop','war-entry'])
];
function moduleOf(id){
 if(/^s0|^support-s0|^train|^s1-|^s2-|^novice|^guard-novice|^teams-locked/.test(id))return 'G';
 if(/^return|^rest$|^next-season/.test(id))return 'H';
 if(/^honor|^idol|^single-|^multi-|^content-/.test(id))return 'F';
 if(/^season|^shop|^day6|^central|^major-win|^mcn-rank/.test(id))return 'E';
 if(/^guard|^aid|^donate|^map-low|^map-aided/.test(id))return 'D';
 if(/^team|^leader-team|^resume-war/.test(id))return 'B';
 if(/^home|^support|^recruit|^live|^ad$|^pack|^reserve/.test(id))return 'A';
 return 'C';
}
G.modules=modules;G.flows=flows;G.moduleOf=moduleOf;
G.coreGroups=[
 {title:'A · 公会内部 / 粉丝招募',note:'长期库存：招募 → 入库 → 跨赛季保留',ids:['home','support','recruit','live-running','live-ready','support-recruited','reserve','reserve-ready']},
 {title:'B · 公会内部 / 长期编队',note:'编辑在公会内；保存不扣粉丝；外部仅调用',ids:['teams','leader-team','teams100','teams2','team-list','team-saved','war-entry','war-teams']},
 {title:'C · 公会外部 / 占点 Battle',note:'选点 → 调用已存小队 → 消耗粉丝 → 驻守 → 定时获得公会积分',ids:['map','territory','deploy','battle','win','guard-setup','map-guard','score-tick']},
 {title:'D · 公会外部 / 驻守协作',note:'待命不足 → 求援 → 支援到账 → 返回地图',ids:['guard-low','aid-compose','aid-posted','aid-received','guard-aided','aid','donate-confirm','donate-done']},
 {title:'E · 赛季 / 积分与奖励',note:'MCN 公会积分决定赛季成绩；贡献分用于兑换',ids:['day6','day6-map','central','central-win','season','season-claimed','shop','shop-confirm']},
 {title:'F1 · 盛典 / IDOL 荣誉（方案）',note:'单推与群推可同时达成；奖励门槛与热度算法待定',ids:['honor','idol-rank','idol-detail','single-honor','single-claimed','multi-honor','multi-claimed','honor-collection']},
 {title:'F2 · 盛典 / 专属内容期待（方案）',note:'偏好供内容规划参考；热度结合轮换覆盖，不预先承诺上线',ids:['idol-detail','content-intent','content-recorded','honor']},
 {title:'G1 · 新手 / 公会内认识粉丝',note:'CEO → MCN → 招募 → 资产留存；不同时教占点',ids:['s0-entry','s0-story','s0-free','s0-topic','s0-live','s0-gift','s0-done','support-s0']},
 {title:'G2 · 新手 / 模拟到正式占点',note:'练习资源独立；正式前才讲消耗；保护参数沿用演示',ids:['train-map1','train-deploy1','train-win1','train-deploy2','train-win3','s1-complete','s2-warning','novice-deploy']},
 {title:'H · 回归 / 休战 / 跨季',note:'粉丝库存、已有偶像、已存小队与荣誉收藏长期保留',ids:['return1','return2','return3','return4','return-gift','return-finish','rest','next-season']}
];
})(typeof module==='object'?require('./game.js'):window);
