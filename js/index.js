function TxtRotate(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.isDeleting = false;
  this.tick();
}
TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];
  this.txt = this.isDeleting ? fullTxt.substring(0, this.txt.length - 1) : fullTxt.substring(0, this.txt.length + 1);
  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  var that = this;
  var delta = 200 - Math.random() * 100;
  if (this.isDeleting) delta /= 2;
  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 100;
  }
  setTimeout(function() { that.tick(); }, delta);
};

console.log('TxtRotate loaded!');

$(function(){
  function getSystemLang() {
    var lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'ru';
    lang = String(lang).toLowerCase();
    return lang.startsWith('en') ? 'en' : 'ru';
  }

  function applyLanguageAutodetect() {
    var path = window.location.pathname || '/';
    if (path.startsWith('/projects/')) return;

    var stored = null;
    try { stored = localStorage.getItem('preferredLang'); } catch (e) {}

    var preferred = stored || getSystemLang();
    var isEnPage = path === '/en' || path === '/en/' || path.startsWith('/en/index.html');
    var isRootPage = path === '/' || path === '/index.html';

    if (isRootPage && preferred === 'en') {
      window.location.replace('/en/');
      return;
    }

    if (isEnPage && preferred === 'ru') {
      window.location.replace('/');
      return;
    }

    $('.lang').on('click', function() {
      var href = ($(this).attr('href') || '').toLowerCase();
      var next = href.includes('/en') ? 'en' : 'ru';
      try { localStorage.setItem('preferredLang', next); } catch (e) {}
    });
  }

  applyLanguageAutodetect();

  function initTxtRotate() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0em solid #666 ; }";
    document.body.appendChild(css);
  }

  function ageWordRu(age) {
    var n = Math.abs(age) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) return 'лет';
    if (n1 > 1 && n1 < 5) return 'года';
    if (n1 === 1) return 'год';
    return 'лет';
  }

  function applyMeta(meta) {
    var yearEl = document.getElementById('current-year');
    if (yearEl && meta && meta.year) {
      yearEl.textContent = String(meta.year);
    }

    if (!meta || typeof meta.age !== 'number') return;

    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotateRaw = elements[i].getAttribute('data-rotate');
      if (!toRotateRaw) continue;
      var arr;
      try {
        arr = JSON.parse(toRotateRaw);
      } catch (e) {
        continue;
      }

      for (var j = 0; j < arr.length; j++) {
        if (typeof arr[j] !== 'string') continue;
        arr[j] = arr[j]
          .replace(/мне\s+\d+\s+(год|года|лет)/i, 'мне ' + meta.age + ' ' + ageWordRu(meta.age))
          .replace(/\b\d+\s*y\.o\./i, meta.age + ' y.o.');
      }
      elements[i].setAttribute('data-rotate', JSON.stringify(arr));
    }
  }

  function initMetaAndTxtRotate() {
    return fetch('/api/meta', { cache: 'no-store' })
      .then(function(r) { return r.json(); })
      .then(function(meta) {
        applyMeta(meta);
        initTxtRotate();
      })
      .catch(function() {
        var yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());
        initTxtRotate();
      });
  }

  gsap.to('#loader',1,{y:"-100%"});
  gsap.to('#loader',1,{opacity:0});
  gsap.to('#loader',0,{display:"none",delay:1});
  gsap.to('#header',0,{display:"block",delay:1});
  gsap.to('#navigation-content',0,{display:"none"});
  gsap.to('#navigation-content',0,{display:"flex",delay:1});

  initMetaAndTxtRotate();

  $('.color-panel').on("click",function(e) {
    e.preventDefault();
    $('.color-changer').toggleClass('color-changer-active');
  });
  $('.colors a').on("click",function(e) {
    e.preventDefault();
    var attr = $(this).attr("title");
    $('head').append('<link rel="stylesheet" href="css/'+attr+'.css">');
  });

  function closeNavigation() {
    gsap.to('#navigation-content', .6, { y: "-100%" });
  }
  $('.menubar').on('click',function(){
    gsap.to('#navigation-content',.6,{y:0});
  });
  $('.navigation-close').on('click',function(){
    closeNavigation();
  });

  function showSection(id){
    var all=['header','about','portfolio','blog','contact'];
    all.forEach(function(s){$('#'+s).hide();});
    if(id) $('#'+id).show();
  }
  $('#home-link').on('click',function(e){e.preventDefault();showSection('header');closeNavigation();});
  $('#portfolio-link').on('click',function(e){e.preventDefault();showSection('portfolio');closeNavigation();});
  $('#about-link').on('click',function(e){e.preventDefault();showSection('about');closeNavigation();});
  $('#blog-link').on('click',function(e){e.preventDefault();showSection('blog');closeNavigation();});
  $('#contact-link').on('click',function(e){e.preventDefault();showSection('contact');closeNavigation();});

  var $cursor = $('.cursor');
  $(window).on('mousemove',function(e){
    gsap.to($cursor,{x:e.clientX,y:e.clientY,stagger:.002});
  });
  $('.menubar, a, .navigation-close').hover(
    function(){gsap.to($cursor,{scale:1.4,opacity:1});},
    function(){gsap.to($cursor,{scale:1,opacity:.6});}
  );
});