(function(){
'use strict';
const G=window.GameWire,byId=new Map(G.screens.map(s=>[s.id,s])),q=id=>document.getElementById(id),E=G.esc;
const storageKey='idol-v2-modules-session-1';let current='home',activeFlow='daily',frames=[],timer,auto=true,overviewBuilt=false;
const flow=()=>G.flows.find(f=>f.id===activeFlow);
function save(){try{localStorage.setItem(storageKey,JSON.stringify({current,activeFlow,state:G.runtime.get()}));}catch(_){}}
function render(){
  clearTimeout(timer);const s=byId.get(current),f=flow(),module=G.modules.find(m=>m.id===G.moduleOf(current));
  q('phone').innerHTML=G.svg(G.runtime.view(s),true);q('screen-title').textContent=s.title;q('note').textContent=s.note;
  q('zone').textContent=(s.zone==='inside'?'公会内部 · 长期经营':'公会外部 · 占点 Battle')+(s.proposal?' · 荣誉方案':'');
  q('path').textContent=module.id+' / '+module.title;q('proposal').hidden=!s.proposal;q('flow').value=activeFlow;
  q('steps').innerHTML=f.steps.map((step,i)=>`<button data-preview="${step.id}" class="${step.id===current?'active':''}"><b>${String(i+1).padStart(2,'0')}</b>${E(step.label)}</button>`).join('');
  const ids=[...new Set([...f.steps.map(x=>x.id),...f.branches,current])];
  q('state').innerHTML=ids.map(id=>`<option value="${id}">${E(byId.get(id).title)}</option>`).join('');q('state').value=current;
  q('current-count').textContent=f.title+' · '+(f.steps.some(x=>x.id===current)?'步骤 '+(f.steps.findIndex(x=>x.id===current)+1)+' / '+f.steps.length:'分支 / 跨线状态');
  q('back').disabled=!frames.length;q('advance').hidden=!s.auto;q('advance').textContent=auto?'跳过等待':'继续演示';
  document.querySelectorAll('#modules [data-flow]').forEach(b=>b.classList.toggle('active',b.dataset.flow===activeFlow));
  const details=q('module-'+f.module);if(details)details.open=true;
  document.title=s.title+' · V2 分模块';history.replaceState(null,'','#'+activeFlow+'/'+current);save();
  if(s.auto&&auto&&!q('main').classList.contains('overview-mode'))timer=setTimeout(()=>go(s.auto.to),s.auto.ms);
}
function go(id,options={}){
  if(!byId.has(id))throw new Error('Missing screen '+id);
  if(options.push!==false)frames.push({current,state:G.runtime.get()});
  if(options.transition!==false)id=G.runtime.enter(id,current,options.action);
  if(!byId.has(id))throw new Error('Missing resolved screen '+id);
  current=id;render();
}
function startFlow(id,screen){activeFlow=id;const f=flow();frames=[];G.runtime.reset(screen||f.steps[0].id);current=screen||f.steps[0].id;setOverview(false);render();}
function preview(id){frames=[];G.runtime.reset(id);current=id;setOverview(false);render();}
function setOverview(on){q('main').classList.toggle('overview-mode',on);q('overview-button').classList.toggle('gold',on);q('play-button').classList.toggle('gold',!on);if(on){clearTimeout(timer);buildOverview();}else if(byId.has(current))render();}
function buildOverview(){
  if(overviewBuilt)return;overviewBuilt=true;
  q('overview').innerHTML=`<div class="overview-intro"><h1>先经营粉丝团，再代表 MCN 登台占点</h1><p>玩家是 CEO，公会是所属 MCN；IDOL 担任领队，粉丝参与应援。</p><div class="system-flow"><div><strong>① 公会内部 · 常驻</strong><p>招募粉丝 / 保存编队<br>库存、偶像与配置跨季保留</p></div><div><strong>② 公会外部 · Battle</strong><p>选择已存小队 / 占点驻守<br>消耗粉丝，获得公会积分</p></div><div><strong>③ 赛季与盛典荣誉</strong><p>MCN 赛季成绩 / IDOL 上榜<br>单推、群推成就与长期收藏</p></div></div><div class="mini-legend"><span>粉丝 = 行动资源</span><span>公会积分 = 机构赛季排名</span><span>贡献分 = 商店兑换</span><span>IDOL 热度 = 荣誉记录（方案）</span></div><p class="muted">点击任一画面可进入对应状态；“从此线开始”载入完整独立示例。</p></div>`+
  G.modules.map(m=>`<article class="module-board" id="overview-${m.id}"><header><div><h3>${m.id} · ${E(m.title)}</h3><p>${E(m.summary)}${m.id==='F'?' · 新增方案':''}</p></div><button data-start-module="${m.id}">从此线开始</button></header>${G.flows.filter(f=>f.module===m.id).map(f=>`<div class="flow-row"><h4>${E(f.title)}</h4><div class="flow-track">${f.steps.map((st,i)=>`<div class="flow-node"><button data-overview-flow="${f.id}" data-overview-screen="${st.id}" aria-label="${E(f.title+'：'+st.label)}">${G.svg(byId.get(st.id))}<div>${i+1}. ${E(st.label)}</div></button>${i<f.steps.length-1?'<span>→</span>':''}</div>`).join('')}</div>${f.branches.length?`<p class="branch-list">分支：${f.branches.slice(0,6).map(id=>E(byId.get(id).title)).join(' / ')}</p>`:''}</div>`).join('')}</article>`).join('');
}
q('modules').innerHTML=G.modules.map(m=>`<details id="module-${m.id}"><summary>${m.id} · ${E(m.title)}<em>${E(m.zone)}</em></summary>${G.flows.filter(f=>f.module===m.id).map(f=>`<button data-flow="${f.id}">${E(f.title)}</button>`).join('')}</details>`).join('');
q('flow').innerHTML=G.modules.map(m=>`<optgroup label="${m.id} · ${E(m.title)}">${G.flows.filter(f=>f.module===m.id).map(f=>`<option value="${f.id}">${E(f.title)}</option>`).join('')}</optgroup>`).join('');
q('modules').onclick=e=>{const b=e.target.closest('[data-flow]');if(b)startFlow(b.dataset.flow);};
q('flow').onchange=e=>startFlow(e.target.value);q('state').onchange=e=>preview(e.target.value);
q('steps').onclick=e=>{const b=e.target.closest('[data-preview]');if(b)preview(b.dataset.preview);};
q('phone').onclick=e=>{const a=e.target.closest('[data-go]');if(a){e.preventDefault();go(a.dataset.go,{action:JSON.parse(a.dataset.action||'null')});}};
q('phone').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){const a=e.target.closest('[data-go]');if(a){e.preventDefault();go(a.dataset.go,{action:JSON.parse(a.dataset.action||'null')});}}};
q('back').onclick=()=>{const f=frames.pop();if(f){current=f.current;G.runtime.restore(f.state);render();}};
q('restart').onclick=()=>startFlow(activeFlow);q('advance').onclick=()=>{const s=byId.get(current);if(s.auto)go(s.auto.to);};
q('season-event').onclick=()=>{activeFlow='season';go('season');};
q('score-event').onclick=()=>{activeFlow='occupation';go('score-tick');};
q('hotspots').onchange=e=>q('phone').classList.toggle('hotspots',e.target.checked);
q('auto').onchange=e=>{auto=e.target.checked;render();};q('overview-button').onclick=()=>setOverview(true);q('play-button').onclick=()=>setOverview(false);
q('overview').onclick=e=>{const step=e.target.closest('[data-overview-screen]'),start=e.target.closest('[data-start-module]');if(step)startFlow(step.dataset.overviewFlow,step.dataset.overviewScreen);if(start)startFlow(G.flows.find(f=>f.module===start.dataset.startModule).id);};
function download(groups,name){const url=URL.createObjectURL(new Blob([G.atlas(groups)],{type:'image/svg+xml'}));const a=Object.assign(document.createElement('a'),{href:url,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
q('export-module').onclick=()=>download(G.coreGroups.filter(g=>g.title[0]===flow().module),'IDOL-V2-模块'+flow().module+'.svg');
q('export-all').onclick=()=>download(G.coreGroups,'IDOL-V2-分模块总览.svg');
q('copy').onclick=async()=>{try{await navigator.clipboard.writeText(G.atlas());q('status').textContent='已复制，可粘贴到 Figma。';}catch(_){q('status').textContent='当前浏览器不支持复制，请导出 SVG。';}};
q('share-step').onclick=async()=>{const url=new URL(location.href);url.hash=activeFlow+'/'+current;try{await navigator.clipboard.writeText(url.href);q('share-status').textContent='已复制此步骤链接；对方打开后进入独立演示。';}catch(_){q('share-status').textContent='请复制浏览器地址栏，即可分享当前步骤。';}};
function openHash(){const hash=decodeURIComponent(location.hash.slice(1));const parts=hash.split('/');const id=parts.length>1?parts[1]:parts[0];if(byId.has(id)){activeFlow=G.flows.some(f=>f.id===parts[0])?parts[0]:(G.flows.find(f=>f.steps.some(st=>st.id===id))||G.flows[0]).id;G.runtime.reset(id);current=id;return true;}return false;}
let restored=false;try{const stored=JSON.parse(localStorage.getItem(storageKey)||'null');if(stored&&byId.has(stored.current)&&G.flows.some(f=>f.id===stored.activeFlow)&&(!location.hash||location.hash==='#'+stored.activeFlow+'/'+stored.current)){current=stored.current;activeFlow=stored.activeFlow;G.runtime.restore(stored.state);restored=true;}}catch(_){}
if(!restored&&!openHash())G.runtime.reset('home');render();
window.addEventListener('hashchange',()=>{if(openHash()){frames=[];setOverview(false);render();}});
window.IDOLReview={getState:()=>({current,activeFlow,...G.runtime.get()})};
})();
