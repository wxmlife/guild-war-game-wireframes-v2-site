const fs=require('fs'),path=require('path'),sharp=require('sharp');
const base=__dirname,root=path.join(base,'figma-v3-sync/20260928'),dest=path.join(base,'out/assets');
const specs=[
 ['A-home','226-220',[0,0,402,852]],['A-support','368-13',null,[8,125,386,619]],['A-boost','368-30',null,[12,210,378,375]],
 ['B-team','226-982',[0,0,402,874]],['B-edit','226-1113',[0,0,408,888]],['B-busy','226-1217',[1,0,402,874]],['B-list','226-1518'],
 ['C-target','226-2035',[3,0,408,899]],['C-battle','226-2304',[0,40,402,874]],['C-event','226-2474',[0,40,402,874]],['C-rival','226-2566',[0,40,402,874]],['C-win','226-2660'],['C-lose','226-2662'],['C-report','226-7517'],
 ['D-request','226-3415'],['D-list','226-3084'],['D-received','226-3147'],['D-allies','226-3302',[0,40,408,874]],['D-guard','226-6942'],
 ['E-intro','230-8'],['E-win','279-551'],['E-lose','279-553'],
 ['F-daily-rank','286-631'],['F-personal-rank','286-634'],['F-guild-rank','288-642'],['F-daily-reward','288-644'],['F-personal-reward','288-645'],['F-guild-reward','288-646'],['F-report','288-647'],['F-report-details','301-649'],['F-points','439-13',null,[0,0,402,725]],['H-idol','385-2']
];
(async()=>{const manifest=[];for(const [name,id,crop,place]of specs){let p=sharp(path.join(root,id+'.png'));if(crop)p=p.extract({left:crop[0],top:crop[1],width:crop[2],height:crop[3]});if(place){const input=await p.resize(place[2],place[3],{fit:'fill'}).png().toBuffer();p=sharp({create:{width:402,height:874,channels:4,background:'#172c46'}}).composite([{input,left:place[0],top:place[1]}])}else p=p.resize(402,874,{fit:'fill'}).flatten({background:'#344258'});await p.webp({quality:95}).toFile(path.join(dest,'v3-'+name+'.webp'));manifest.push({asset:'assets/v3-'+name+'.webp',figmaNode:id.replace('-',':'),crop:crop||null,placement:place||null});}
// The user added the map HUD to the existing map. Reuse the original unannotated map below it.
let bg=await sharp(path.join(dest,'C-0.webp')).resize(402,874).png().toBuffer();let hud=await sharp(path.join(root,'226-1837.png')).extract({left:0,top:244,width:402,height:178}).png().toBuffer();await sharp(bg).composite([{input:hud,left:0,top:0}]).webp({quality:95}).toFile(path.join(dest,'v3-C-map.webp'));
// Exclude the editor's external flow arrow at the lower-right corner of the team screen.
const patch=await sharp(path.join(dest,'B-0.webp')).resize(402,874).extract({left:355,top:762,width:47,height:112}).png().toBuffer();const team=await fs.promises.readFile(path.join(dest,'v3-B-team.webp'));await sharp(team).composite([{input:patch,left:355,top:762}]).webp({quality:95}).toFile(path.join(dest,'v3-B-team.webp'));
manifest.push({asset:'assets/v3-C-map.webp',figmaNode:'226:1907',composition:'Updated V3 HUD + inherited unannotated map'});
fs.writeFileSync(path.join(base,'source-reference/v3-20260928-assets.json'),JSON.stringify({date:'2026-09-28',fileKey:'3UrD3ReEc65mSIGWeAatof',pageId:'226:2',assets:manifest},null,2));console.log(manifest.length+' V3 assets built');})();
