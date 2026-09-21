(function(root){const G=root.GameWire,{P,screens}=G;const get=id=>screens.find(s=>s.id===id);const txt=(s,a,b)=>s.ops.forEach(o=>{if(o.t==='text')o.text=o.text.split(a).join(b)});const link=(s,a,b)=>s.ops.forEach(o=>{if(o.t==='hit'&&o.to===a)o.to=b});
// Lock overlay consumes all input beneath it.
let s=get('teams-locked');s.ops=s.ops.filter(o=>o.t!=='hit'||o.label==='继续出战');txt(s,'○○ 12,400','○○ 1,500');txt(s,'5,000','1,500');
s=get('teams3');s.ops=s.ops.filter(o=>o.t!=='hit');s.modal('第3小队尚未开放',295,260,'teams');s.txt('公会 Lv5 解锁第3小队',44,365,314,22,P.gold,'center',true);s.btn('知道了',123,471,156,46,'teams');
// Chat request receives one demonstration response so the aid loop can be completed.
get('aid-posted').auto={to:'aid-received',ms:4000};
// Two-sided relative comparison; no enemy absolute power disclosure.
for(const id of ['territory','territory8']){s=get(id);s.bar(48,468,306,.62,1,P.friend);s.r(48+306*.62,469,306*.38-1,7,P.enemy,1)}
// Fan counts in battle label the temporary cheering momentum explicitly.
for(const sc of screens){if(sc.id.includes('battle')||sc.id==='battle3'||sc.id==='battle5')for(const o of sc.ops){if(o.t==='text'&&o.y===681)o.text=o.text.replace('○○','声势')}}
// Back navigation carries the just-completed result into the map.
G.clone('map','map-after',s=>txt(s,'12,400','11,000'));
for(const id of ['win','win-detail','support-after','guard-setup','guard-active','guard-off'])link(get(id),'map','map-after');
G.clone('map','map-aided',s=>txt(s,'12,400','5,400'));link(get('guard-aided'),'map-guard','map-aided');link(get('guard-aided'),'map','map-aided');link(get('map-aided'),'guard-active','guard-aided');
G.clone('map','map-empty',s=>txt(s,'12,400','12,400'));link(get('guard-empty'),'map-guard','map-empty');
// S0 return does not expose a war route before Lv8.
get('s0-done').ops=get('s0-done').ops.filter(o=>o.t!=='hit');
get('s0-done').hit(134,470,114,136,'support-s0','应援中心');G.clone('support-recruited-low','support-s0',s=>{txt(s,'2,300','1,500');s.ops=s.ops.filter(o=>o.t!=='hit'||o.to==='home');txt(s,'前往公会战','完成教学后开放');txt(s,'○○ 2,300','○○ 1,500');link(s,'home','s0-done')});
// Varying amount and outcome details stay local; charts are illustrative examples.
for(const id of ['win-safe','win-all','central-win','win8']){s=get(id);s.ops=s.ops.filter(o=>!(o.t==='hit'&&o.to===id));txt(s,'流失详情 ▾','账本如上')}
})(typeof module==='object'?require('./game.js'):window);
