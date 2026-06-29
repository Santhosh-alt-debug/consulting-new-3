(function(){
'use strict';

/* ── SPLASH ── */
function initSplash(){
  var s=document.getElementById('splash');if(!s)return;
  var nav=performance.getEntriesByType('navigation')[0];
  if(nav&&nav.type==='back_forward'){s.classList.add('hidden');return}
  setTimeout(function(){s.classList.add('hidden')},1900);
}

/* ── LOGO CLICK ── */
function initLogoClick(){
  document.querySelectorAll('[data-logo-click]').forEach(function(el){
    el.addEventListener('click',function(){window.location.href='index.html'});
  });
}

/* ── NAVBAR ── */
function initNavbar(){
  var nav=document.getElementById('navbar');if(!nav)return;
  function upd(){nav.classList.toggle('solid',window.scrollY>40)}
  window.addEventListener('scroll',upd,{passive:true});upd();
}

/* ── HAMBURGER ── */
function initHamburger(){
  var btn=document.getElementById('hamburger');
  var menu=document.getElementById('mobile-menu');
  if(!btn||!menu)return;
  btn.addEventListener('click',function(){
    btn.classList.toggle('open');menu.classList.toggle('open');
  });
  document.addEventListener('click',function(e){
    if(!btn.contains(e.target)&&!menu.contains(e.target)){
      btn.classList.remove('open');menu.classList.remove('open');
    }
  });
}

/* ── ROLE TOGGLE ── */
function initRoleToggle(){
  document.querySelectorAll('.role-toggle').forEach(function(wrap){
    var btns=wrap.querySelectorAll('.role-btn');
    btns.forEach(function(btn){
      btn.addEventListener('click',function(){
        btns.forEach(function(b){b.classList.remove('active')});
        btn.classList.add('active');
        var role=btn.getAttribute('data-role');
        wrap.setAttribute('data-role',role);
        var em=document.getElementById('auth-email');
        var pw=document.getElementById('auth-pass');
        if(em&&pw){
          em.value=role==='admin'?'admin@stackly.com':'user@stackly.com';
          pw.value=role==='admin'?'admin123':'user123';
        }
      });
    });
  });
}

/* ── FIELD VALIDATORS ── */
function validateEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
function validateName(n){return n.length>=2&&/^[a-zA-Z\s'-]+$/.test(n)}
function validatePhone(p){return/^\d{10}$/.test(p)}

function markError(id){
  var el=document.getElementById(id);
  if(el){el.classList.add('error');el.focus()}
}
function clearErrors(form){
  form.querySelectorAll('.form-input').forEach(function(el){el.classList.remove('error')});
}

/* ── NAME-ONLY FIELDS ── */
function initNameFields(){
  document.querySelectorAll('input[data-name-only]').forEach(function(inp){
    inp.addEventListener('keypress',function(e){
      if(!/[a-zA-Z\s'-]/.test(e.key)){
        e.preventDefault();
        showPopup('⚠️','Letters Only','This field accepts only alphabets (A–Z), spaces, hyphens and apostrophes. Numbers are not allowed.');
      }
    });
    inp.addEventListener('input',function(){
      var cleaned=this.value.replace(/[^a-zA-Z\s'-]/g,'');
      if(this.value!==cleaned)this.value=cleaned;
    });
  });
}

/* ── PHONE-ONLY FIELDS ── */
function initPhoneFields(){
  document.querySelectorAll('input[data-phone]').forEach(function(inp){
    inp.addEventListener('keypress',function(e){
      if(!/\d/.test(e.key)){
        e.preventDefault();
        showPopup('⚠️','Numbers Only','Phone number field accepts only digits (0–9). Letters and special characters are not allowed.');
        return;
      }
      if(this.value.length>=10){
        e.preventDefault();
        showPopup('⚠️','Max 10 Digits','Phone number must be exactly 10 digits.');
      }
    });
    inp.addEventListener('input',function(){
      var digits=this.value.replace(/\D/g,'').slice(0,10);
      this.value=digits;
    });
  });
}

/* ── LOGIN ── */
function initLogin(){
  var form=document.getElementById('login-form');if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    clearErrors(form);
    var email=document.getElementById('auth-email').value.trim();
    var pass=document.getElementById('auth-pass').value.trim();
    var rem=document.getElementById('remember-me');
    var roleWrap=document.querySelector('.role-toggle');
    var role=roleWrap?roleWrap.getAttribute('data-role'):'user';
    if(!email){markError('auth-email');showPopup('⚠️','Email Required','Please enter your email address to continue.');return}
    if(!validateEmail(email)){markError('auth-email');showPopup('⚠️','Invalid Email','Please enter a valid email address (e.g. name@company.com).');return}
    if(!pass){markError('auth-pass');showPopup('⚠️','Password Required','Please enter your password.');return}
    if(pass.length<6){markError('auth-pass');showPopup('⚠️','Password Too Short','Password must be at least 6 characters long.');return}
    if(!rem||!rem.checked){showPopup('⚠️','Remember Me Required','Please tick "Remember me" to keep your session active.');return}
    var isAdmin=role==='admin'&&email==='admin@stackly.com'&&pass==='admin123';
    var isUser=role==='user'&&email==='user@stackly.com'&&pass==='user123';
    if(!isAdmin&&!isUser){showPopup('❌','Login Failed','The email or password is incorrect for the selected role. Please check your credentials.');return}
    var ud={name:isAdmin?'Admin User':'Santhosh Kumar',role:isAdmin?'Administrator':'Member'};
    sessionStorage.setItem('stackly_user',JSON.stringify(ud));
    window.location.href=isAdmin?'dashboard-admin.html':'dashboard-user.html';
  });
}

/* ── SIGNUP ── */
function initSignup(){
  var form=document.getElementById('signup-form');if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    clearErrors(form);
    var name=document.getElementById('su-name').value.trim();
    var email=document.getElementById('su-email').value.trim();
    var phone=document.getElementById('su-phone')?document.getElementById('su-phone').value.trim():'';
    var pass=document.getElementById('su-pass').value.trim();
    var conf=document.getElementById('su-confirm').value.trim();
    var terms=document.getElementById('terms');
    var roleWrap=document.querySelector('.role-toggle');
    var role=roleWrap?roleWrap.getAttribute('data-role'):'user';
    if(!name){markError('su-name');showPopup('⚠️','Name Required','Please enter your full name.');return}
    if(!validateName(name)){markError('su-name');showPopup('⚠️','Invalid Name','Full name must contain only letters (A–Z), spaces, hyphens or apostrophes. Numbers are not allowed.');return}
    if(name.replace(/\s/g,'').length>24){markError('su-name');showPopup('⚠️','Name Too Long','Full name cannot exceed 24 characters.');return}
    if(!email){markError('su-email');showPopup('⚠️','Email Required','Please enter your email address.');return}
    if(!validateEmail(email)){markError('su-email');showPopup('⚠️','Invalid Email','Please enter a valid email address (e.g. you@company.com).');return}
    if(phone&&!validatePhone(phone)){markError('su-phone');showPopup('⚠️','Invalid Phone Number','Phone number must be exactly 10 digits. No letters or spaces allowed.');return}
    if(!pass){markError('su-pass');showPopup('⚠️','Password Required','Please create a password for your account.');return}
    if(pass.length<6){markError('su-pass');showPopup('⚠️','Password Too Short','Your password must be at least 6 characters long.');return}
    if(!conf){markError('su-confirm');showPopup('⚠️','Confirm Password','Please re-enter your password to confirm.');return}
    if(pass!==conf){markError('su-confirm');showPopup('⚠️','Passwords Do Not Match','The passwords you entered do not match. Please try again.');return}
    if(!terms||!terms.checked){showPopup('⚠️','Terms & Conditions','You must agree to the Terms of Service and Privacy Policy to create an account.');return}
    var ud={name:name,role:role==='admin'?'Administrator':'Member'};
    sessionStorage.setItem('stackly_user',JSON.stringify(ud));
    window.location.href=role==='admin'?'dashboard-admin.html':'dashboard-user.html';
  });
}

/* ── DATA-404 ── */
function initData404(){
  document.querySelectorAll('[data-404]').forEach(function(el){
    el.addEventListener('click',function(e){e.preventDefault();window.location.href='404.html'});
  });
}

/* ── NEWSLETTER ── */
function initNewsletter(){
  document.querySelectorAll('.newsletter-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var inp=f.querySelector('input[type="email"]');
      if(!inp||!inp.value.trim()){showPopup('⚠️','Email Required','Please enter your email address to subscribe.');return}
      if(!validateEmail(inp.value.trim())){showPopup('⚠️','Invalid Email','Please enter a valid email address to join the newsletter.');return}
      window.location.href='404.html';
    });
  });
}

/* ── LOGOUT ── */
function initLogout(){
  document.querySelectorAll('[data-logout]').forEach(function(el){
    el.addEventListener('click',function(){
      sessionStorage.removeItem('stackly_user');
      window.location.href='login.html';
    });
  });
}

/* ── COUNT UP ── */
function initCountUp(){
  var els=document.querySelectorAll('[data-count]');if(!els.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){animateCount(en.target);obs.unobserve(en.target)}});
  },{threshold:.5});
  els.forEach(function(el){obs.observe(el)});
}
function animateCount(el){
  var target=parseFloat(el.getAttribute('data-count'));
  var suf=el.getAttribute('data-suffix')||'';
  var pre=el.getAttribute('data-prefix')||'';
  var dur=1800,steps=60,cur=0,inc=target/steps;
  var t=setInterval(function(){
    cur+=inc;if(cur>=target){cur=target;clearInterval(t)}
    var d=target%1===0?Math.floor(cur):cur.toFixed(1);
    el.textContent=pre+d+suf;
  },dur/steps);
}

/* ── PW TOGGLE ── */
function initPwToggle(){
  document.querySelectorAll('[data-pw-toggle]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var inp=btn.previousElementSibling;if(!inp)return;
      inp.type=inp.type==='text'?'password':'text';
      btn.textContent=inp.type==='text'?'🙈':'👁';
    });
  });
}

/* ── FADE UP ── */
function initFadeUp(){
  var els=document.querySelectorAll('.fade-up');if(!els.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('visible');obs.unobserve(en.target)}});
  },{threshold:.08});
  els.forEach(function(el){obs.observe(el)});
}

/* ── ACCORDION ── */
function initAccordion(){
  document.querySelectorAll('.accordion-item').forEach(function(item){
    var head=item.querySelector('.accordion-head');
    if(!head)return;
    head.addEventListener('click',function(){
      var wasOpen=item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(function(i){i.classList.remove('open')});
      if(!wasOpen)item.classList.add('open');
    });
  });
}

/* ── DASHBOARD SESSION ── */
function initDashboard(){
  if(!document.querySelector('.dash-layout'))return;
  var u=JSON.parse(sessionStorage.getItem('stackly_user')||'null');
  if(!u){window.location.href='login.html';return}
  document.querySelectorAll('[data-user-name]').forEach(function(el){el.textContent=u.name});
  document.querySelectorAll('[data-user-role]').forEach(function(el){el.textContent=u.role});
  document.querySelectorAll('[data-user-initial]').forEach(function(el){el.textContent=u.name.charAt(0).toUpperCase()});
}

/* ── ACTIVE NAV ── */
function initActiveNav(){
  var page=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a,.mobile-menu a').forEach(function(a){
    if(a.getAttribute('href')===page||(page===''&&a.getAttribute('href')==='index.html'))
      a.classList.add('active');
  });
}

/* ── POPUP ── */
function showPopup(icon,title,msg){
  var ov=document.getElementById('global-popup');
  if(!ov){
    ov=document.createElement('div');ov.id='global-popup';ov.className='popup-overlay';
    ov.innerHTML='<div class="popup-box"><div class="popup-icon" id="p-icon"></div><div class="popup-title" id="p-title"></div><div class="popup-msg" id="p-msg"></div><button class="popup-btn" id="p-btn">Got It</button></div>';
    document.body.appendChild(ov);
    document.getElementById('p-btn').addEventListener('click',function(){ov.classList.remove('show')});
    ov.addEventListener('click',function(e){if(e.target===ov)ov.classList.remove('show')});
  }
  document.getElementById('p-icon').textContent=icon;
  document.getElementById('p-title').textContent=title;
  document.getElementById('p-msg').textContent=msg;
  ov.classList.add('show');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',function(){
  initSplash();initLogoClick();initNavbar();initHamburger();
  initRoleToggle();initLogin();initSignup();initData404();
  initNewsletter();initLogout();initCountUp();initPwToggle();
  initFadeUp();initDashboard();initActiveNav();
  initAccordion();initNameFields();initPhoneFields();
});
})();
