(function(){
  var titles={home:"Thales Caldas: Desenvolvedor de Software",projetos:"Projetos | Thales Caldas",habilidades:"Habilidades | Thales Caldas",curriculo:"Currículo | Thales Caldas",contato:"Contato | Thales Caldas"};
  var views=document.querySelectorAll(".view"), links=document.querySelectorAll("header nav a");
  var root=document.documentElement, tbtn=document.getElementById("theme");
  function route(){
    var r=location.hash.replace(/^#\/?/,"")||"home";
    if(!titles[r]) r="home";
    views.forEach(function(v){v.classList.toggle("active",v.id==="view-"+r)});
    links.forEach(function(a){a.dataset.route===r?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")});
    document.title=titles[r];
    window.scrollTo(0,0);
  }
  function applyTheme(t){
    if(t==="dark") root.setAttribute("data-theme","dark"); else root.removeAttribute("data-theme");
    tbtn.setAttribute("aria-label",t==="dark"?"Mudar para o tema claro":"Mudar para o tema preto");
  }
  var saved=null; try{saved=localStorage.getItem("theme")}catch(e){}
  applyTheme(saved==="dark"?"dark":"light");
  tbtn.addEventListener("click",function(){
    var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
    applyTheme(next);
    try{localStorage.setItem("theme",next)}catch(e){}
  });
  window.addEventListener("hashchange",function(){route();revelar()});
  route();

  /* Interação 1: texto digitando na página inicial */
  var typing=document.getElementById("typing");
  var textoTyping=typing.dataset.text, pos=0;
  typing.textContent="";
  function digitar(){
    if(pos<=textoTyping.length){
      typing.textContent=textoTyping.slice(0,pos);
      pos++;
      setTimeout(digitar,90);
    }
  }
  digitar();

  /* Interação 2: animação ao rolar a página (aparece ao entrar na tela) */
  var itens=document.querySelectorAll(".item, .group, .view p, form .field");
  itens.forEach(function(el){el.classList.add("reveal")});
  function revelar(){
    itens.forEach(function(el){
      if(el.offsetParent!==null&&el.getBoundingClientRect().top<window.innerHeight-40) el.classList.add("show");
    });
  }
  window.addEventListener("scroll",revelar);
  window.addEventListener("resize",revelar);
  revelar();

  /* Formulário de contato */
  var form=document.getElementById("form");
  var campoNome=document.getElementById("nome");
  var campoTel=document.getElementById("telefone");
  var campoEmail=document.getElementById("email");
  var campoMsg=document.getElementById("mensagem");
  var contador=document.getElementById("contador");

  // Máscara 1: nome aceita só letras e espaços
  campoNome.addEventListener("input",function(){
    campoNome.value=campoNome.value.replace(/[^A-Za-zÀ-ÿ\s'-]/g,"");
  });

  // Máscara 2: telefone no formato (00) 00000-0000
  campoTel.addEventListener("input",function(){
    var n=campoTel.value.replace(/\D/g,"").slice(0,11);
    var t=n;
    if(n.length>10) t="("+n.slice(0,2)+") "+n.slice(2,7)+"-"+n.slice(7);
    else if(n.length>6) t="("+n.slice(0,2)+") "+n.slice(2,6)+"-"+n.slice(6);
    else if(n.length>2) t="("+n.slice(0,2)+") "+n.slice(2);
    else if(n.length>0) t="("+n;
    campoTel.value=t;
  });

  // Máscara 3: e-mail sem espaços e em minúsculas
  campoEmail.addEventListener("input",function(){
    campoEmail.value=campoEmail.value.replace(/\s/g,"").toLowerCase();
  });

  // Máscara 4: contador de caracteres da mensagem
  campoMsg.addEventListener("input",function(){
    contador.textContent=campoMsg.value.length+"/"+campoMsg.maxLength;
  });

  function erro(campo,msg){
    document.getElementById("erro-"+campo.id).textContent=msg;
    campo.classList.toggle("invalido",msg!=="");
    return msg==="";
  }

  form.addEventListener("submit",function(e){
    e.preventDefault();
    var nome=campoNome.value.trim();
    var tel=campoTel.value.replace(/\D/g,"");
    var okNome=erro(campoNome,nome.split(/\s+/).length<2||nome.length<5?"Digite nome e sobrenome.":"");
    var okTel=erro(campoTel,tel.length<10?"Digite um telefone com DDD.":"");
    var okEmail=erro(campoEmail,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(campoEmail.value)?"":"Digite um e-mail válido.");
    var okMsg=erro(campoMsg,campoMsg.value.trim().length<10?"Escreva pelo menos 10 caracteres.":"");
    if(okNome&&okTel&&okEmail&&okMsg){
      abrirModal("Obrigado, "+nome.split(/\s+/)[0]+"! Recebi sua mensagem e vou responder em breve.");
      form.reset();
      contador.textContent="0/"+campoMsg.maxLength;
    }
  });

  /* Modal */
  var modal=document.getElementById("modal");
  function abrirModal(texto){
    document.getElementById("modal-texto").textContent=texto;
    modal.hidden=false;
    document.getElementById("modal-fechar").focus();
  }
  function fecharModal(){modal.hidden=true}
  document.getElementById("modal-fechar").addEventListener("click",fecharModal);
  modal.addEventListener("click",function(e){if(e.target===modal) fecharModal()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape") fecharModal()});
})();
