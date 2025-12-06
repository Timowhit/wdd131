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

// Trading Plan Generator Logic
document.addEventListener('DOMContentLoaded', function() {
    let userData = {};
    let selectedPlan = null;
    let selectedPlatform = null;

    // Portfolio templates based on risk tolerance and experience
    const portfolioTemplates = {
        conservative: {
            beginner: [
                {
                    name: "Safety First Portfolio",
                    stocks: 40, bonds: 50, alternatives: 10,
                    description: "Heavy bond allocation for stability with minimal stock exposure",
                    details: "60% Government Bonds, 20% Corporate Bonds, 30% Blue-chip Stocks, 10% REITs"
                },
                {
                    name: "Income Focus Portfolio",
                    stocks: 35, bonds: 55, alternatives: 10,
                    description: "Dividend-focused with strong fixed income foundation",
                    details: "55% Bond Index, 25% Dividend ETFs, 10% Utility Stocks, 10% Money Market"
                }
            ],
            intermediate: [
                {
                    name: "Balanced Conservative",
                    stocks: 45, bonds: 45, alternatives: 10,
                    description: "Equal weight stocks and bonds for steady growth",
                    details: "45% Total Stock Market, 35% Bond Aggregate, 10% International Bonds, 10% Gold"
                },
                {
                    name: "Quality Focus",
                    stocks: 50, bonds: 40, alternatives: 10,
                    description: "High-quality stocks with bond cushion",
                    details: "35% S&P 500, 15% Dividend Aristocrats, 40% Investment Grade Bonds, 10% REITs"
                }
            ],
            advanced: [
                {
                    name: "Strategic Conservative",
                    stocks: 50, bonds: 35, alternatives: 15,
                    description: "Sophisticated allocation with alternative diversification",
                    details: "40% Large Cap Value, 10% International Stocks, 35% Bond Ladder, 15% Commodities/REITs"
                }
            ]
        },
        moderate: {
            beginner: [
                {
                    name: "Classic 60/40",
                    stocks: 60, bonds: 30, alternatives: 10,
                    description: "Traditional balanced portfolio for steady growth",
                    details: "50% S&P 500, 10% International, 30% Bond Index, 10% REITs"
                },
                {
                    name: "Growth & Income",
                    stocks: 65, bonds: 25, alternatives: 10,
                    description: "Growth-oriented with income component",
                    details: "45% Total Market, 20% Dividend Stocks, 25% Bonds, 10% Commodities"
                }
            ],
            intermediate: [
                {
                    name: "Diversified Growth",
                    stocks: 70, bonds: 20, alternatives: 10,
                    description: "Well-diversified across asset classes",
                    details: "40% US Large Cap, 15% Mid/Small Cap, 15% International, 20% Bonds, 10% REITs"
                },
                {
                    name: "Global Balanced",
                    stocks: 65, bonds: 25, alternatives: 10,
                    description: "International diversification with stability",
                    details: "40% US Stocks, 25% International Stocks, 25% Global Bonds, 10% Alternatives"
                }
            ],
            advanced: [
                {
                    name: "Strategic Allocation",
                    stocks: 70, bonds: 15, alternatives: 15,
                    description: "Active allocation across multiple strategies",
                    details: "30% Large Cap Growth, 20% Value, 20% International, 15% Bonds, 15% Alternatives"
                }
            ]
        },
        aggressive: {
            beginner: [
                {
                    name: "Growth Focus",
                    stocks: 80, bonds: 10, alternatives: 10,
                    description: "Stock-heavy portfolio for maximum long-term growth",
                    details: "60% Total Stock Market, 20% Growth ETFs, 10% Bonds, 10% REITs"
                },
                {
                    name: "Tech-Heavy Growth",
                    stocks: 85, bonds: 5, alternatives: 10,
                    description: "Technology and innovation focused",
                    details: "50% S&P 500, 35% Technology Sector, 5% Bonds, 10% Innovation ETFs"
                }
            ],
            intermediate: [
                {
                    name: "Aggressive Growth",
                    stocks: 85, bonds: 5, alternatives: 10,
                    description: "Maximum equity exposure across sectors",
                    details: "50% Large Cap, 20% Mid Cap, 15% Small Cap, 5% Bonds, 10% Commodities"
                },
                {
                    name: "Global Aggressive",
                    stocks: 90, bonds: 0, alternatives: 10,
                    description: "Worldwide equity exposure",
                    details: "50% US Stocks, 30% International, 10% Emerging Markets, 10% Sector Rotation"
                }
            ],
            advanced: [
                {
                    name: "Maximum Growth",
                    stocks: 90, bonds: 0, alternatives: 10,
                    description: "All-in equity with tactical alternatives",
                    details: "40% Large Cap, 20% Mid Cap, 15% Small Cap, 15% International, 10% Sector Funds"
                },
                {
                    name: "Alpha Seeker",
                    stocks: 85, bonds: 0, alternatives: 15,
                    description: "Concentrated positions for outperformance",
                    details: "45% Growth Stocks, 25% Value, 15% International, 15% Alternatives/Commodities"
                }
            ]
        }
    };

    // Step 1: Handle Goals Form Submission
    document.getElementById('goalsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        userData = {
            amount: parseFloat(document.getElementById('investAmount').value),
            timeline: parseInt(document.getElementById('timeline').value),
            expectedGrowth: parseFloat(document.getElementById('expectedGrowth').value),
            risk: document.getElementById('riskTolerance').value,
            experience: document.getElementById('experience').value
        };

        generatePortfolioOptions();
        
        // Show step 2, hide step 1
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        
        // Smooth scroll to step 2
        document.getElementById('step2').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Generate portfolio options based on user data
    function generatePortfolioOptions() {
        const container = document.getElementById('portfolioOptions');
        container.innerHTML = '';

        const options = portfolioTemplates[userData.risk][userData.experience];
        
        options.forEach((portfolio, index) => {
            const projectedValue = calculateProjectedValue(userData.amount, userData.timeline, userData.expectedGrowth);
            
            const card = document.createElement('div');
            card.className = 'card portfolio-option';
            card.innerHTML = `
                <h4>${portfolio.name}</h4>
                <div style="margin:0.5rem 0">
                    <div class="allocation-bar">
                        <div class="allocation-segment" style="width:${portfolio.stocks}%;background:#3498DB" title="Stocks ${portfolio.stocks}%"></div>
                        <div class="allocation-segment" style="width:${portfolio.bonds}%;background:#27AE60" title="Bonds ${portfolio.bonds}%"></div>
                        <div class="allocation-segment" style="width:${portfolio.alternatives}%;background:#E67E22" title="Alternatives ${portfolio.alternatives}%"></div>
                    </div>
                    <div style="font-size:0.85rem;margin-top:0.25rem">
                        <span style="color:#3498DB">◼</span> Stocks ${portfolio.stocks}% 
                        <span style="color:#27AE60">◼</span> Bonds ${portfolio.bonds}% 
                        <span style="color:#E67E22">◼</span> Alt ${portfolio.alternatives}%
                    </div>
                </div>
                <p style="font-size:0.9rem;color:var(--text);margin:0.5rem 0">${portfolio.description}</p>
                <p style="font-size:0.85rem;color:#666;margin:0.5rem 0">${portfolio.details}</p>
                <div style="background:var(--bg);padding:0.5rem;border-radius:6px;margin:0.5rem 0">
                    <strong>Projected Value (${userData.timeline} years):</strong><br>
                    <span style="font-size:1.3rem;color:var(--accent)">$${projectedValue.toLocaleString()}</span>
                </div>
                <button class="btn select-plan-btn" data-index="${index}">Select This Plan</button>
            `;
            
            container.appendChild(card);
        });

        // Add click handlers to plan selection buttons
        document.querySelectorAll('.select-plan-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectPlan(options[index]);
            });
        });
    }

    // Calculate projected portfolio value
    function calculateProjectedValue(principal, years, annualRate) {
        return Math.round(principal * Math.pow(1 + (annualRate / 100), years));
    }

    // Handle plan selection
    function selectPlan(plan) {
        selectedPlan = plan;
        
        // Hide step 2, show step 3
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        
        // Smooth scroll to step 3
        document.getElementById('step3').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Handle platform selection
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('active'));
            
            // Add active class to selected card
            this.classList.add('active');
            
            selectedPlatform = {
                name: this.querySelector('h4').textContent,
                url: this.getAttribute('data-url')
            };

            // Show embedded platform
            showPlatformEmbed();
        });
    });

    // Show platform embed
    function showPlatformEmbed() {
        const embedDiv = document.getElementById('platformEmbed');
        const iframe = document.getElementById('platformFrame');
        const platformName = document.getElementById('selectedPlatformName');
        
        platformName.textContent = `Connect to ${selectedPlatform.name}`;
        iframe.src = selectedPlatform.url;
        embedDiv.style.display = 'block';
        
        // Smooth scroll to embed
        setTimeout(() => {
            embedDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Handle automatic portfolio setup
    document.getElementById('autoSetupBtn').addEventListener('click', function() {
        // Simulate setup process
        this.disabled = true;
        this.textContent = '⏳ Setting up your portfolio...';
        
        setTimeout(() => {
            completeSetup();
        }, 2000);
    });

    // Complete setup and show results
    function completeSetup() {
        const projectedValue = calculateProjectedValue(userData.amount, userData.timeline, userData.expectedGrowth);
        const totalGain = projectedValue - userData.amount;
        const annualReturn = userData.expectedGrowth;

        document.getElementById('finalSummary').innerHTML = `
            <h4 style="color:var(--primary);margin-bottom:0.75rem">Your Investment Plan Summary</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem">
                <div>
                    <strong>Portfolio:</strong><br>${selectedPlan.name}
                </div>
                <div>
                    <strong>Platform:</strong><br>${selectedPlatform.name}
                </div>
                <div>
                    <strong>Initial Investment:</strong><br>$${userData.amount.toLocaleString()}
                </div>
                <div>
                    <strong>Timeline:</strong><br>${userData.timeline} years
                </div>
            </div>
            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #ddd">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem">
                    <div>
                        <strong>Allocation:</strong><br>
                        Stocks: ${selectedPlan.stocks}% | Bonds: ${selectedPlan.bonds}% | Alt: ${selectedPlan.alternatives}%
                    </div>
                    <div>
                        <strong>Expected Annual Return:</strong><br>${annualReturn}%
                    </div>
                    <div>
                        <strong>Projected Value:</strong><br>
                        <span style="color:var(--accent);font-size:1.2rem">$${projectedValue.toLocaleString()}</span>
                    </div>
                    <div>
                        <strong>Total Gain:</strong><br>
                        <span style="color:var(--accent)">$${totalGain.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;

        // Hide step 3, show results
        document.getElementById('step3').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        
        // Smooth scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Reset form when starting over
    document.querySelectorAll('a[href="#home"]').forEach(link => {
        link.addEventListener('click', function() {
            // Reset all forms and visibility
            document.getElementById('goalsForm').reset();
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
            document.getElementById('results').style.display = 'none';
            document.getElementById('platformEmbed').style.display = 'none';
            
            // Reset data
            userData = {};
            selectedPlan = null;
            selectedPlatform = null;
            
            // Re-enable setup button
            const setupBtn = document.getElementById('autoSetupBtn');
            setupBtn.disabled = false;
            setupBtn.textContent = '✨ Set Up My Portfolio Automatically';
        });
    });
});