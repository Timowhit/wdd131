// Minimal script: populate current year, last modified, add nav toggle
document.addEventListener('DOMContentLoaded', function(){
    var y = document.getElementById('currentyear');
    if(y) y.textContent = new Date().getFullYear();

    var lm = document.getElementById('lastModified');
    if(lm){
        try{ lm.textContent = 'Last modified: ' + document.lastModified; }catch(e){}
    }

    // Support filtered-temples style hamburger: .hamburger + <nav>
    var hamburger = document.querySelector('.hamburger');
    var headerNav = document.querySelector('header > nav');
    if(hamburger && headerNav){
        hamburger.addEventListener('click', function(){
            headerNav.classList.toggle('open');
            // Toggle icon between ☰ and ✖
            hamburger.textContent = headerNav.classList.contains('open') ? '✖' : '☰';
        });
    }
});
// Close nav when clicking a link or clicking outside
document.addEventListener('click', function(e){
    var headerNav = document.querySelector('header > nav');
    var hamburger = document.querySelector('.hamburger');
    if(!headerNav || !hamburger) return;
    var isClickInside = headerNav.contains(e.target) || hamburger.contains(e.target);
    if(!isClickInside && headerNav.classList.contains('open')){
        headerNav.classList.remove('open');
        hamburger.textContent = '☰';
    }
    // close when a nav link is clicked (useful on mobile)
    if(e.target.closest && e.target.closest('header nav a')){
        headerNav.classList.remove('open');
        hamburger.textContent = '☰';
    }
});

// Smooth scroll for internal anchor links and scrollspy
(function(){
    var links = Array.from(document.querySelectorAll('header nav a'));
    var sections = links.map(function(l){
        var href = l.getAttribute('href')||'';
        if(href.charAt(0) === '#') return document.getElementById(href.slice(1)) || null;
        return null;
    });

    // smooth scroll on click
    links.forEach(function(link){
        var href = link.getAttribute('href')||'';
        if(href.charAt(0) === '#'){
            link.addEventListener('click', function(ev){
                ev.preventDefault();
                var id = href.slice(1);
                var el = document.getElementById(id);
                if(el){
                    el.scrollIntoView({behavior:'smooth',block:'start'});
                }
                // close mobile nav after click
                var headerNav = document.querySelector('header > nav');
                var hamburger = document.querySelector('.hamburger');
                if(headerNav && hamburger){ headerNav.classList.remove('open'); hamburger.textContent = '☰'; }
            });
        }
    });

    // scrollspy: highlight active nav link
    var ticking = false;
    function onScroll(){
        if(ticking) return; ticking = true;
        window.requestAnimationFrame(function(){
            var fromTop = window.scrollY + 80; // offset for header
            var currentIndex = -1;
            for(var i=0;i<sections.length;i++){
                var s = sections[i];
                if(!s) continue;
                if(s.offsetTop <= fromTop) currentIndex = i;
            }
            links.forEach(function(a){ a.classList.remove('active'); });
            if(currentIndex >= 0 && links[currentIndex]) links[currentIndex].classList.add('active');
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    // run once on load
    onScroll();
})();
