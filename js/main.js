/* Cana Agro Tech - scripts do site */
(function(){
  /* fotos opcionais */
  var faixa=document.getElementById('fotos');
  faixa.querySelectorAll('img[data-src]').forEach(function(im){
    var t=new Image();
    t.onload=function(){im.src=im.getAttribute('data-src');im.hidden=false;faixa.hidden=false;};
    t.src=im.getAttribute('data-src');
  });

  /* ano no rodapé */
  document.getElementById('ano').textContent=new Date().getFullYear();

  /* menu no celular */
  var btn=document.getElementById('menu-btn'),menu=document.getElementById('menu');
  function fechar(){menu.classList.remove('aberto');btn.setAttribute('aria-expanded','false');}
  btn.addEventListener('click',function(){
    var aberto=menu.classList.toggle('aberto');
    btn.setAttribute('aria-expanded',aberto?'true':'false');
  });
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',fechar);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')fechar();});

  /* formulário: monta a mensagem e abre o WhatsApp */
  document.getElementById('form-contato').addEventListener('submit',function(e){
    e.preventDefault();
    var f=e.target,nome=f.nome.value.trim();
    if(!nome){f.nome.focus();f.nome.style.borderColor='#ef4444';return;}
    f.nome.style.borderColor='';
    var linhas=['Olá! Meu nome é '+nome+'.'];
    if(f.empresa.value.trim())linhas.push('Empresa/fazenda: '+f.empresa.value.trim());
    linhas.push('Atuo como: '+f.perfil.value);
    if(f.msg.value.trim())linhas.push('',f.msg.value.trim());
    window.open('https://wa.me/5517991890393?text='+encodeURIComponent(linhas.join('\n')),'_blank','noopener');
  });
})();
