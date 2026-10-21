/* ===== 共享逻辑：导航 / 页脚 / 雷达图 / 弹窗 / 关注 ===== */
const NAV=[
 {href:'index.html',label:'首页',key:'home'},
 {href:'owners.html',label:'业主',key:'owners'},
 {href:'contractors.html',label:'承包商',key:'contractors'},
 {href:'countries.html',label:'国别',key:'countries'},
 {href:'reports.html',label:'出海必备报告',key:'library',hot:true},
 {href:'news.html',label:'News',key:'news'}
];
function renderHeader(active){
  const el=document.getElementById('topnav');
  el.className='topnav';
  el.innerHTML=`<div class="wrap">
    <div class="brand">
      <a href="index.html" style="display:flex;flex-shrink:0"><img class="logo" src="assets/img/logo-gold.png" alt="国复数据"></a>
      <span><a href="index.html" style="text-decoration:none"><b>国复数据</b></a><span class="brand-sub">GUOFU DATA · 海外工程情报</span></span>
    </div>
    <nav class="navlinks">${NAV.map(n=>`<a href="${n.href}" class="${n.key===active?'on':''}">${n.label}${n.hot?'<i class="nav-hot">HOT</i>':''}</a>`).join('')}</nav>
    <a class="nav-workbench" href="javascript:void(0)" onclick="goWorkbench()">我的工作台 →</a>
    <div class="nav-service">
      <span class="ns-tel">+86 10 8435 1696</span>
      <span class="ns-qr"><img src="assets/img/qr_wechat.png" alt="客服二维码">
        <span class="ns-pop"><img src="assets/img/qr_wechat.png" alt="客服微信二维码"><i>扫码添加客服微信</i></span>
      </span>
    </div>
    <a href="about.html" class="nav-about ${active==='about'?'on':''}">关于国复数据</a>
  </div>`;
}
function renderFooter(){
  const el=document.getElementById('footer');
  el.className='footer';
  el.innerHTML=`<div class="wrap">
    <div class="f-top">
      <a class="f-brand" href="index.html" style="display:block;flex-shrink:0">
        <b>国复数据</b>
        <span style="display:block;font-size:10px;letter-spacing:.14em;color:rgba(255,255,255,.4);margin-top:6px;text-transform:uppercase">GUOFU DATA · 海外工程情报平台</span>
        <span style="display:block;font-size:10.5px;color:rgba(255,255,255,.3);margin-top:10px">国复咨询旗下 · 全球工程数据服务</span>
      </a>
      <div class="f-links">${NAV.map(n=>`<a href="${n.href}">${n.label}</a>`).join('')}<a href="about.html">关于国复数据</a></div>
      <div class="f-contact">
        <div class="f-c-tel"><span>联系我们</span><b>+86 10 8435 1696</b></div>
        <div class="f-c-qr"><img src="assets/img/qr_wechat.png" alt="客服微信二维码"><span>客服微信</span></div>
      </div>
    </div>
    <div class="f-bottom">
      <div>业主 · 承包商 · 国别 · 项目库 · 彩虹系列报告 · 出海知识库　｜　64 国别 · 54 承包商 · 39 业主 · 120 项目 · 分值范围 1–10 分 · 六维模型加权计算　｜　PC 网页版 v1.1 · 数据更新于 2026-07-27 · 演示数据，仅供产品评估</div>
    </div>
  </div>`;
}
/* ---------- 通用弹窗 ---------- */
function showModal(title,text){
  let m=document.getElementById('gmodal');
  if(!m){
    m=document.createElement('div');m.id='gmodal';m.className='modal-mask';
    m.innerHTML=`<div class="modal"><h3 id="gm-t"></h3><p id="gm-p"></p><div class="m-close"><button class="btn" onclick="document.getElementById('gmodal').classList.remove('show')">关闭</button></div></div>`;
    document.body.appendChild(m);
    m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')});
  }
  document.getElementById('gm-t').textContent=title;
  document.getElementById('gm-p').textContent=text;
  m.classList.add('show');
}
function showModalHTML(title,html){
  let m=document.getElementById('gmodal');
  if(!m){showModal('','');m=document.getElementById('gmodal');m.classList.remove('show')}
  document.getElementById('gm-t').textContent=title;
  document.getElementById('gm-p').innerHTML=html;
  m.classList.add('show');
}

/* ---------- 表头小 i ---------- */
function infoIcon(dim,explainMap){
  return `<i class="info-i" onclick="event.stopPropagation();showModal('${dim} · 指标解释','${explainMap[dim]}')">i</i>`;
}

/* ---------- SVG 雷达图（支持多主体对比） ---------- */
const RADAR_COLORS=['#16324F','#A8894F','#3C6E5B','#6C8399'];
function radarSVG(container,labels,series){ // series:[{name,values}]
  const size=340,cx=size/2,cy=size/2,R=size/2-56,n=labels.length;
  const pt=(i,v)=>{const ang=-Math.PI/2+i*2*Math.PI/n;const r=R*v/10;return[cx+r*Math.cos(ang),cy+r*Math.sin(ang)]};
  let s=`<svg viewBox="0 0 ${size} ${size}" style="width:100%;max-width:400px;display:block;margin:0 auto">`;
  for(let ring=2;ring<=10;ring+=2){
    s+=`<polygon points="${labels.map((_,i)=>pt(i,ring).join(',')).join(' ')}" fill="none" stroke="#E3E1DB"/>`;
  }
  labels.forEach((l,i)=>{
    const [x,y]=pt(i,10);s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#F0EFEA"/>`;
    const [lx,ly]=pt(i,12.4);
    s+=`<text x="${lx}" y="${ly}" font-size="12" fill="#46505C" text-anchor="middle" dominant-baseline="middle">${l}</text>`;
  });
  series.forEach((se,si)=>{
    const c=RADAR_COLORS[si%RADAR_COLORS.length];
    const pts=se.values.map((v,i)=>pt(i,v).join(',')).join(' ');
    s+=`<polygon points="${pts}" fill="${c}22" stroke="${c}" stroke-width="2"/>`;
    se.values.forEach((v,i)=>{const[x,y]=pt(i,v);s+=`<circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`});
  });
  s+='</svg>';
  container.innerHTML=s+`<div class="legend" style="justify-content:center">${series.map((se,si)=>`<span><i style="background:${RADAR_COLORS[si%RADAR_COLORS.length]}"></i>${se.name}</span>`).join('')}</div>`;
}

/* ---------- 关注（localStorage） ---------- */
const FAV_KEY='ggi_favs';
function getFavs(){
  try{const v=JSON.parse(localStorage.getItem(FAV_KEY));if(v&&v.seeded)return v}catch(e){}
  // 首次进入：预置演示关注
  const seed={seeded:true,countries:['sa','ae','ng'],contractors:['crbc','powerchina-grp'],owners:['acwa','edf']};
  localStorage.setItem(FAV_KEY,JSON.stringify(seed));return seed;
}
function saveFavs(f){f.seeded=true;localStorage.setItem(FAV_KEY,JSON.stringify(f))}
function toggleFav(kind,id){
  const f=getFavs();const arr=f[kind];
  const i=arr.indexOf(id);
  if(i>=0)arr.splice(i,1);else arr.push(id);
  saveFavs(f);return i<0;
}
function isFav(kind,id){return getFavs()[kind].includes(id)}
function bindFavBtn(btn,kind,id){
  const paint=()=>{const on=isFav(kind,id);btn.classList.toggle('faved',on);btn.textContent=on?'✓ 已关注':'＋ 关注'};
  paint();
  btn.onclick=()=>{toggleFav(kind,id);paint();};
}

/* ---------- 筛选项分组（折叠下拉） ---------- */
function filterGroup(name,options,onPick){
  const g=document.createElement('div');g.className='fgroup';
  let cur='全部'+name;
  const btn=document.createElement('button');btn.innerHTML=`${name}：<b>${cur==='全部'+name?'不限':cur}</b> ▾`;
  const drop=document.createElement('div');drop.className='fdrop';
  const render=()=>{
    drop.innerHTML='';
    options.forEach(op=>{
      const c=document.createElement('button');c.className='chip'+(op===cur?' on':'');
      c.textContent=op;
      c.onclick=e=>{e.stopPropagation();cur=op;btn.innerHTML=`${name}：<b>${op.startsWith('全部')?'不限':op}</b> ▾`;btn.classList.toggle('active',!op.startsWith('全部'));g.classList.remove('open');render();onPick(op.startsWith('全部')?'':op);};
      drop.appendChild(c);
    });
  };
  render();
  btn.onclick=e=>{e.stopPropagation();document.querySelectorAll('.fgroup.open').forEach(x=>{if(x!==g)x.classList.remove('open')});g.classList.toggle('open')};
  g.appendChild(btn);g.appendChild(drop);
  document.addEventListener('click',()=>g.classList.remove('open'));
  return g;
}

/* ---------- 分页 ---------- */
function renderPager(container,total,page,pageSize,onGo){
  const pages=Math.ceil(total/pageSize);
  container.innerHTML='';
  if(total<=pageSize)return;
  const mk=(label,p,dis,on)=>{
    const b=document.createElement('button');b.innerHTML=label;b.disabled=!!dis;if(on)b.classList.add('on');
    b.onclick=()=>onGo(p);container.appendChild(b);
  };
  mk('上一页',page-1,page<=1);
  let list=[];
  for(let i=1;i<=pages;i++){if(i===1||i===pages||Math.abs(i-page)<=2)list.push(i)}
  let prev=0;
  list.forEach(i=>{if(i-prev>1){const s=document.createElement('span');s.className='pinfo';s.textContent='…';container.appendChild(s)}mk(i,i,false,i===page);prev=i});
  mk('下一页',page+1,page>=pages);
  const info=document.createElement('span');info.className='pinfo';info.textContent=`共 ${total} 条 · 第 ${page}/${pages} 页`;container.appendChild(info);
}

/* ---------- 实体名 → 链接（文章正文用） ---------- */
function linkifyEntities(text){
  const ents=[];
  COUNTRIES.forEach(c=>ents.push({name:c.zh,href:`country.html?id=${c.id}`}));
  CONTRACTORS.forEach(c=>ents.push({name:c.name,href:`contractor.html?id=${c.id}`}));
  OWNERS.forEach(o=>ents.push({name:o.name,href:`owner.html?id=${o.id}`}));
  ents.sort((a,b)=>b.name.length-a.name.length);
  const seen=new Set();
  ents.forEach(e=>{
    if(seen.has(e.name))return;
    if(text.includes(e.name)){text=text.split(e.name).join(`<a href="${e.href}">${e.name}</a>`);seen.add(e.name)}
  });
  return text;
}
function download(name){
  let ses=null;try{ses=JSON.parse(localStorage.getItem('gf_session')||'null')}catch(e){}
  if(!ses){
    showModalHTML('请先登录','下载报告前需要先登录账号。<div style="margin-top:18px;text-align:center"><a href="login.html" style="display:inline-block;background:linear-gradient(90deg,var(--blue),#2F5876);color:#fff;font-weight:700;border-radius:8px;padding:10px 34px;text-decoration:none">去登录 / 注册 →</a></div>');
    return;
  }
  if(!ses.member){location.href='pay.html?report='+encodeURIComponent(name);return}
  showModal('报告下载（演示）',`「${name}」已开始下载。本站点为演示环境，文件为示例数据。`);
}

/* ---------- 相关报告卡片（资讯/文章详情页底部，左→右缓慢滚动） ---------- */
function relatedReports(mount,texts){
  const text=(texts||[]).join('。');
  const cards=[];
  COUNTRIES.forEach(c=>{if(text.includes(c.zh))cards.push({series:'白皮书',color:'#16324F',name:`《${c.zh}国别工程全景白皮书》`})});
  OWNERS.forEach(o=>{if(text.includes(o.name))cards.push({series:'金皮书',color:'#A8894F',name:`《${o.name}·业主画像金皮书》`})});
  CONTRACTORS.forEach(c=>{if(text.includes(c.name))cards.push({series:'银皮书',color:'#8A939E',name:`《${c.name}·承包商海外竞争力分析银皮书》`})});
  IND20.forEach(d=>{if(text.includes(d))cards.push({series:'蓝皮书',color:'#2F5876',name:`《${d}行业蓝皮书》`})});
  if(!cards.length)return;
  const top=cards.slice(0,14);
  top.forEach(r=>{r.pages=60+([...r.name].reduce((a,c)=>a+c.charCodeAt(0),0))%61});
  const cardHtml=r=>`<div class="rr-card" style="--rc:${r.color}"><span class="rr-series">${r.series}</span><div class="rr-info"><b class="rr-name">${r.name}</b><span class="rr-meta">${r.pages} 页 · PDF 全文</span></div><button class="rr-dl" data-n="${r.name}">下载</button></div>`;
  const half=Math.ceil(top.length/2);
  const rows=[top.slice(0,half),top.slice(half)].filter(r=>r.length);
  mount.innerHTML=`<div class="rel-reps">
    <div class="rr-head"><b>相关报告下载</b><span>与本文划线的国别、业主、承包商、行业一一对应，点击即可下载</span></div>
    ${rows.map(row=>`<div class="rr-wrap"><div class="rr-track">${row.map(cardHtml).join('')}</div></div>`).join('')}
  </div>`;
  /* 内容超出容器才复制一份并滚动；不足一屏则静态展示，避免重复卡片与空白 */
  mount.querySelectorAll('.rr-wrap').forEach(w=>{const t=w.querySelector('.rr-track');if(t.scrollWidth>w.clientWidth+1){t.innerHTML+=t.innerHTML}else{t.style.animation='none'}});
  mount.querySelectorAll('.rr-dl').forEach(b=>b.onclick=()=>download(b.dataset.n));
}

/* ---------- 分享 / 复制链接（演示） ---------- */
function copyPageLink(){
  const url=location.href;
  const done=()=>showModal('复制链接',`链接已复制：${url}`);
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done).catch(done)}
  else{const t=document.createElement('textarea');t.value=url;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove();done()}
}
function shareWx(type){
  const label=type==='moments'?'分享到朋友圈':'分享给微信好友';
  showModal(label,'');
  document.getElementById('gm-t').textContent=label+'（演示）';
  document.getElementById('gm-p').innerHTML=`<div style="text-align:left;line-height:2;font-size:13px;color:#46505C">在微信中打开本页，点击右上角「···」即可${type==='moments'?'分享到朋友圈':'发送给好友'}；或复制本页链接手动分享：<br><span style="word-break:break-all;color:#16324F">${location.href}</span></div><div style="margin-top:12px;text-align:center"><button class="btn" onclick="copyPageLink()">复制链接</button></div>`;
}

/* ---------- 列表弹窗（大纲等） ---------- */
function showListModal(title,items){
  showModal(title,'');
  const m=document.getElementById('gmodal');
  document.getElementById('gm-t').textContent=title;
  document.getElementById('gm-p').innerHTML='<ol style="margin:0;padding-left:20px;line-height:2;font-size:13px;color:#46505C;text-align:left">'+items.map(i=>`<li>${i}</li>`).join('')+'</ol>';
  m.classList.add('show');
}

/* ---------- 迷你柱状图 ---------- */
function barChartSVG(labels,values,color,w,h){
  w=w||520;h=h||180;
  const max=Math.max(...values,1),gap=(w-40)/labels.length,bw=Math.min(34,gap-8);
  let s=`<svg viewBox="0 0 ${w} ${h}" style="width:100%;display:block">`;
  values.forEach((v,i)=>{
    const bh=(h-44)*v/max,x=20+i*gap+(gap-bw)/2,y=h-26-bh;
    s+=`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="2" fill="${color}"/>`;
    s+=`<text x="${x+bw/2}" y="${y-4}" font-size="10" fill="#46505C" text-anchor="middle">${v}</text>`;
    s+=`<text x="${x+bw/2}" y="${h-10}" font-size="10" fill="#8A939E" text-anchor="middle">${labels[i]}</text>`;
  });
  s+=`<line x1="20" y1="${h-26}" x2="${w-20}" y2="${h-26}" stroke="#E3E1DB"/>`;
  return s+'</svg>';
}
/* ---------- 迷你折线图（国别宏观） ---------- */
function lineChartSVG(labels,values,color,suffix,w,h){
  w=w||420;h=h||170;
  const min=Math.min(...values),max=Math.max(...values),rg=(max-min)||1;
  const px=i=>30+i*(w-50)/(labels.length-1),py=v=>14+(h-46)*(1-(v-min)/rg);
  let s=`<svg viewBox="0 0 ${w} ${h}" style="width:100%;display:block">`;
  for(let g=0;g<4;g++){const y=14+(h-46)*g/3;s+=`<line x1="30" y1="${y}" x2="${w-20}" y2="${y}" stroke="#F0EFEA"/>`}
  s+=`<polyline points="${values.map((v,i)=>px(i)+','+py(v)).join(' ')}" fill="none" stroke="${color}" stroke-width="2"/>`;
  values.forEach((v,i)=>{s+=`<circle cx="${px(i)}" cy="${py(v)}" r="3" fill="${color}"/>`;
    if(i%2===0||i===values.length-1)s+=`<text x="${px(i)}" y="${h-6}" font-size="9.5" fill="#8A939E" text-anchor="middle">${labels[i]}</text>`;});
  s+=`<text x="${px(values.length-1)}" y="${py(values[values.length-1])-8}" font-size="10.5" font-weight="700" fill="${color}" text-anchor="end">${values[values.length-1]}${suffix||''}</text>`;
  return s+'</svg>';
}

/* ---------- 饼图（只显示比例） ---------- */
function pieChartHTML(labels,values,colors){
  const total=values.reduce((a,b)=>a+b,0);
  const cx=90,cy=90,r=76,ir=42;
  let a0=-Math.PI/2,s=`<svg viewBox="0 0 180 180" style="width:150px;flex-shrink:0;display:block">`;
  const nz=values.filter(v=>v>0);
  if(!nz.length){
    s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#F0EFEA"/><circle cx="${cx}" cy="${cy}" r="${ir}" fill="#fff"/>`;
  }else values.forEach((v,i)=>{
    if(!v)return;
    if(v===total){
      s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors[i]}"/><circle cx="${cx}" cy="${cy}" r="${ir}" fill="#fff"/>`;
      return;
    }
    const a1=a0+v/total*Math.PI*2,large=(a1-a0)>Math.PI?1:0;
    const p=(a,rr)=>(cx+rr*Math.cos(a)).toFixed(1)+','+(cy+rr*Math.sin(a)).toFixed(1);
    s+=`<path d="M${p(a0,r)} A${r},${r} 0 ${large} 1 ${p(a1,r)} L${p(a1,ir)} A${ir},${ir} 0 ${large} 0 ${p(a0,ir)} Z" fill="${colors[i]}"/>`;
    a0=a1;
  });
  s+='</svg>';
  const legend=labels.map((lb,i)=>`<div style="display:flex;align-items:center;gap:7px;font-size:12px;color:#46505C;padding:2.5px 0"><span style="width:9px;height:9px;border-radius:2px;background:${colors[i]};flex-shrink:0"></span>${lb}<b style="color:#16324F;margin-left:auto">${total?Math.round(values[i]/total*100):0}%</b></div>`).join('');
  return `<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">${s}<div style="flex:1;min-width:110px">${legend}</div></div>`;
}

/* ---------- 面积图（折线 + 下方填充） ---------- */
function areaChartSVG(labels,values,color,suffix,w,h){
  w=w||420;h=h||170;
  const min=Math.min(...values),max=Math.max(...values),rg=(max-min)||1;
  const px=i=>30+i*(w-50)/(labels.length-1),py=v=>14+(h-46)*(1-(v-min)/rg);
  const gid='ag'+(color||'').replace(/[^0-9a-z]/gi,'');
  let s=`<svg viewBox="0 0 ${w} ${h}" style="width:100%;display:block">`;
  s+=`<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity=".02"/></linearGradient></defs>`;
  for(let g=0;g<4;g++){const y=14+(h-46)*g/3;s+=`<line x1="30" y1="${y}" x2="${w-20}" y2="${y}" stroke="#F0EFEA"/>`}
  const pts=values.map((v,i)=>px(i)+','+py(v)).join(' ');
  s+=`<polygon points="30,${h-32} ${pts} ${px(values.length-1)},${h-32}" fill="url(#${gid})"/>`;
  s+=`<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2"/>`;
  values.forEach((v,i)=>{
    if(i%2===0||i===values.length-1)s+=`<text x="${px(i)}" y="${h-6}" font-size="9.5" fill="#8A939E" text-anchor="middle">${labels[i]}</text>`;});
  s+=`<circle cx="${px(values.length-1)}" cy="${py(values[values.length-1])}" r="3.5" fill="${color}"/>`;
  s+=`<text x="${px(values.length-1)}" y="${py(values[values.length-1])-8}" font-size="10.5" font-weight="700" fill="${color}" text-anchor="end">${values[values.length-1]}${suffix||''}</text>`;
  return s+'</svg>';
}

/* ---------- 横向条形图 ---------- */
function hBarChartSVG(labels,values,color,suffix,w,h){
  w=w||420;
  const n=labels.length,rowH=26,h0=h||n*rowH+18;
  const max=Math.max(...values)||1;
  let s=`<svg viewBox="0 0 ${w} ${h0}" style="width:100%;display:block">`;
  labels.forEach((lb,i)=>{
    const y=8+i*rowH,bw=(w-130)*values[i]/max;
    s+=`<text x="46" y="${y+13}" font-size="10" fill="#46505C" text-anchor="end">${lb}</text>`;
    s+=`<rect x="52" y="${y+2}" width="${Math.max(2,bw)}" height="${rowH-10}" rx="3.5" fill="${color}"/>`;
    s+=`<text x="${52+Math.max(2,bw)+6}" y="${y+13}" font-size="10" font-weight="700" fill="${color}">${values[i]}${suffix||''}</text>`;
  });
  return s+'</svg>';
}

/* ---------- 项目二级行业 / 更新时间（确定性生成，多页共用） ---------- */
const SUB_IND={'电力':['光伏','风电','输变电','水电','核电'],'交通':['道桥','轨道交通','港口航道'],'房建':['住宅','商业建筑','公共建筑'],'能矿':['油气','矿产','冶金','化工'],'其他':['水务','生态环保','通讯','水泥建材']};
function subInd(p){const arr=SUB_IND[p.industry]||SUB_IND['其他'];return arr[gfH(p.id)%arr.length]}
function updTime(p){const h=gfH(p.id+'u');const y=2025+h%2;const m=y===2026?h%9+1:h%12+1;return `${y}-${String(m).padStart(2,'0')}-${String(h%28+1).padStart(2,'0')}`}

/* 榜单页横幅轮播图 */
function bannerCarousel(id,ms){
  const el=document.getElementById(id);if(!el)return;
  const track=el.querySelector('.bcar-track');if(!track)return;
  const n=track.children.length;if(n<2)return;
  const dots=el.querySelector('.bcar-dots');
  let i=0,timer=null;
  dots.innerHTML=Array.from({length:n},(_,k)=>`<i data-k="${k}"${k?'':' class="on"'}></i>`).join('');
  const go=k=>{i=(k%n+n)%n;track.style.transform=`translateX(-${i*100}%)`;dots.querySelectorAll('i').forEach((d,j)=>d.classList.toggle('on',j===i))};
  const reset=()=>{clearInterval(timer);timer=setInterval(()=>go(i+1),ms||5000)};
  dots.querySelectorAll('i').forEach(d=>d.onclick=e=>{e.stopPropagation();e.preventDefault();go(+d.dataset.k);reset()});
  el.addEventListener('mouseenter',()=>clearInterval(timer));
  el.addEventListener('mouseleave',reset);
  reset();
}

/* 工作台入口：注册/登录判定 */
function goWorkbench(){
  let ses=null;try{ses=JSON.parse(localStorage.getItem('gf_session')||'null')}catch(e){}
  location.href=(ses&&ses.member)?'workbench.html':'login.html';
}

/* 除顶部/底部菜单栏外，所有链接一律在新标签页打开 */
document.addEventListener('click',function(e){
  var a=e.target&&e.target.closest?e.target.closest('a'):null;
  if(!a)return;
  if(a.closest('.topnav')||a.closest('.footer'))return;
  var href=a.getAttribute('href')||'';
  if(!href||href.indexOf('javascript:')===0||href.indexOf('#')===0||href.indexOf('mailto:')===0||href.indexOf('tel:')===0)return;
  e.preventDefault();
  window.open(a.href,'_blank');
},true);
