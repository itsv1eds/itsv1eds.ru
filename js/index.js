// TxtRotate класс (вынесено из $(function(){ ... }))
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
  // Loader animation
  // Loader animation (запускаем сразу после готовности DOM)
  console.log('DOM ready - запускаем анимацию loader');
  gsap.to('#loader',1,{y:"-100%"});
  gsap.to('#loader',1,{opacity:0});
  gsap.to('#loader',0,{display:"none",delay:1});
  gsap.to('#header',0,{display:"block",delay:1});
  gsap.to('#navigation-content',0,{display:"none"});
  gsap.to('#navigation-content',0,{display:"flex",delay:1});

  // TxtRotate
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

  // Цветовая панель
  $('.color-panel').on("click",function(e) {
    e.preventDefault();
    $('.color-changer').toggleClass('color-changer-active');
  });
  $('.colors a').on("click",function(e) {
    e.preventDefault();
    var attr = $(this).attr("title");
    $('head').append('<link rel="stylesheet" href="css/'+attr+'.css">');
  });

  // Меню-бургер
  $('.menubar').on('click',function(){
    gsap.to('#navigation-content',.6,{y:0});
  });
  $('.navigation-close').on('click',function(){
    gsap.to('#navigation-content',.6,{y:"-100%"});
  });

  // Универсальное переключение секций
  function showSection(id){
    var all=['header','about','portfolio','blog','contact'];
    all.forEach(function(s){$('#'+s).hide();});
    if(id) $('#'+id).show();
  }
  $('#home-link').on('click',function(e){e.preventDefault();showSection('header');});
  $('#portfolio-link').on('click',function(e){e.preventDefault();showSection('portfolio');});
  $('#about-link').on('click',function(e){e.preventDefault();showSection('about');});
  $('#blog-link').on('click',function(e){e.preventDefault();showSection('blog');});
  $('#contact-link').on('click',function(e){e.preventDefault();showSection('contact');});

  // Кастомный курсор
  var $cursor = $('.cursor');
  $(window).on('mousemove',function(e){
    gsap.to($cursor,{x:e.clientX,y:e.clientY,stagger:.002});
  });
  $('.menubar, a, .navigation-close').hover(
    function(){gsap.to($cursor,{scale:1.4,opacity:1});},
    function(){gsap.to($cursor,{scale:1,opacity:.6});}
  );

  // Универсальное переключение секций
  function showSection(id){
    var all=['header','about','portfolio','blog','contact'];
    all.forEach(function(s){$('#'+s).hide();});
    if(id) $('#'+id).show();
  }
  $('#home-link').on('click',function(e){e.preventDefault();showSection('header');});
  $('#portfolio-link').on('click',function(e){e.preventDefault();showSection('portfolio');});
  $('#about-link').on('click',function(e){e.preventDefault();showSection('about');});
  $('#blog-link').on('click',function(e){e.preventDefault();showSection('blog');});
  $('#contact-link').on('click',function(e){e.preventDefault();showSection('contact');});

  // Кастомный курсор
  var $cursor = $('.cursor');
  $(window).on('mousemove',function(e){
    gsap.to($cursor,{x:e.clientX,y:e.clientY,stagger:.002});
  });
  $('.menubar, a, .navigation-close').hover(
    function(){gsap.to($cursor,{scale:1.4,opacity:1});},
    function(){gsap.to($cursor,{scale:1,opacity:.6});}
  );

});