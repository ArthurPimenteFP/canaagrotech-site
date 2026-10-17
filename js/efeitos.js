/* Cana Agro Tech - animações (portadas do site Thomazini Sports):
   progresso da rolagem, topo com sombra, menu da seção atual, títulos palavra por palavra,
   entrada em cascata, contadores, inclinação 3D e botões magnéticos. */
(function(){
  var temIO='IntersectionObserver' in window;
  var reduz=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Topo: sombra ao rolar */
  var topo=document.querySelector('header.topo');
  function topoRolou(){if(topo)topo.classList.toggle('rolou',window.scrollY>24);}
  window.addEventListener('scroll',topoRolou,{passive:true});topoRolou();

  /* Menu: destaca a seção atual (página inicial) */
  var menu=document.getElementById('menu');
  if(menu&&temIO&&!document.querySelector('#menu a[aria-current="page"]')){
    var links={};
    [].forEach.call(menu.querySelectorAll('a'),function(a){links[a.getAttribute('href')]=a;});
    var mapa={hero:'#inicio',consultoria:'/consultoria/',empresas:'#empresas',mensagem:'#contato',contato:'#contato'};
    var navIO=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        var id=e.target.classList.contains('hero')?'hero':e.target.id,alvo=links[mapa[id]];
        Object.keys(links).forEach(function(k){links[k].classList.remove('ativo');});
        if(alvo)alvo.classList.add('ativo');
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    [].forEach.call(document.querySelectorAll('main section'),function(s){navIO.observe(s);});
  }

  if(reduz||!temIO)return;

  /* Barra de progresso da rolagem */
  var barra=document.createElement('div');
  barra.className='fx-progress';barra.setAttribute('aria-hidden','true');
  document.body.appendChild(barra);
  var quad=false;
  function progresso(){
    quad=false;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    barra.style.transform='scaleX('+(h>0?Math.min(1,window.scrollY/h):0).toFixed(4)+')';
  }
  window.addEventListener('scroll',function(){if(!quad){quad=true;requestAnimationFrame(progresso);}},{passive:true});
  window.addEventListener('resize',progresso);progresso();

  /* Títulos: revelação palavra por palavra (repete ao sair e voltar) */
  var tituloIO=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.intersectionRatio>=.4)e.target.classList.add('in');
      else if(e.intersectionRatio===0)e.target.classList.remove('in');
    });
  },{threshold:[0,.4]});
  [].forEach.call(document.querySelectorAll('main h2'),function(h){
    var n=0;
    (function dividir(no){
      [].slice.call(no.childNodes).forEach(function(c){
        if(c.nodeType===3){
          var frag=document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(p){
            if(!p)return;
            if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return;}
            var w=document.createElement('span'),i=document.createElement('span');
            w.className='w';i.textContent=p;i.style.setProperty('--i',n++);
            w.appendChild(i);frag.appendChild(w);
          });
          no.replaceChild(frag,c);
        }else if(c.nodeType===1&&c.tagName!=='BR'&&c.tagName!=='SVG'){dividir(c);}
      });
    })(h);
    h.classList.add('fx-split');
    tituloIO.observe(h);
  });

  /* Entrada em cascata (repete ao sair e voltar) */
  var grupoIO=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var g=e.target,itens=g.querySelectorAll(':scope > .rv-item');
      if(e.intersectionRatio>=.15){
        itens.forEach(function(it){it.classList.add('in');});
        clearTimeout(g._t);
        g._t=setTimeout(function(){itens.forEach(function(it){it.classList.add('done');});},1800);
      }else if(e.intersectionRatio===0){
        clearTimeout(g._t);
        itens.forEach(function(it){it.classList.remove('in','done');});
      }
    });
  },{threshold:[0,.15]});
  [].forEach.call(document.querySelectorAll('.cards4,.fatos,.galeria,.emp-grid,.servs,.publico,.col,.passos,.chips,.faq,.tela'),function(g){
    [].forEach.call(g.children,function(c,i){
      if(c.nodeType!==1)return;
      c.classList.add('rv-item');c.style.setProperty('--d',(i*0.13)+'s');
    });
    grupoIO.observe(g);
  });

  /* Contadores (+20%, -30%...) */
  function contar(el){
    var fim=+el.dataset.fim,t0=null,dur=1600;el._on=true;
    function passo(t){
      if(t0===null)t0=t;
      var p=Math.min((t-t0)/dur,1),k=1-Math.pow(1-p,3);
      el.textContent=el.dataset.pre+Math.round(fim*k)+el.dataset.suf;
      if(p<1)el._raf=requestAnimationFrame(passo);
    }
    el._raf=requestAnimationFrame(passo);
  }
  var contIO=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var el=e.target;
      if(e.intersectionRatio>=.6&&!el._on)contar(el);
      else if(e.intersectionRatio===0){
        cancelAnimationFrame(el._raf);el._on=false;el.textContent=el.dataset.pre+'0'+el.dataset.suf;
      }
    });
  },{threshold:[0,.6]});
  [].forEach.call(document.querySelectorAll('.fatos b'),function(el){
    var m=el.textContent.trim().match(/^([+\-−]?)(\d+)(\D*)$/);
    if(!m)return;
    el.dataset.pre=m[1];el.dataset.fim=m[2];el.dataset.suf=m[3];
    el.textContent=m[1]+'0'+m[3];contIO.observe(el);
  });

  /* Efeitos de mouse (somente computador) */
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;

  /* Inclinação 3D */
  [].forEach.call(document.querySelectorAll('.card,.emp-card,.galeria .cel,.tela .cel'),function(el){
    var cel=el.classList.contains('cel'),max=cel?3.5:6,sobe=cel?'':' translateY(-4px)';
    el.classList.add('fx-tilt');
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      el.style.transform='perspective(900px) rotateX('+((0.5-y)*max*2).toFixed(2)+'deg) rotateY('+((x-0.5)*max*2).toFixed(2)+'deg)'+sobe;
    });
    el.addEventListener('pointerleave',function(){el.style.transform='';});
  });

  /* Botões magnéticos */
  var imas=[].slice.call(document.querySelectorAll('.btn,.zap'));
  document.addEventListener('pointermove',function(e){
    imas.forEach(function(b){
      var r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,
          dx=e.clientX-cx,dy=e.clientY-cy,folga=36,
          dentro=Math.abs(dx)<r.width/2+folga&&Math.abs(dy)<r.height/2+folga;
      if(dentro){
        var mx=Math.max(-10,Math.min(10,dx*.22)),my=Math.max(-8,Math.min(8,dy*.3));
        b.style.translate=mx.toFixed(1)+'px '+my.toFixed(1)+'px';
      }else if(b.style.translate){b.style.translate='';}
    });
  },{passive:true});
})();
