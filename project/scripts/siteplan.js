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
                var headerNav = document.querySelector('header > nav');
                var hamburger = document.querySelector('.hamburger');
                if(headerNav && hamburger){ headerNav.classList.remove('open'); hamburger.textContent = '☰'; }
            });
        }
    });

    var ticking = false;
    function onScroll(){
        if(ticking) return; ticking = true;
        window.requestAnimationFrame(function(){
            var fromTop = window.scrollY + 80;
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
    onScroll();
})();

// Trading Plan Generator Logic with localStorage
document.addEventListener('DOMContentLoaded', function() {
    let userData = {};
    let selectedPlan = null;
    let selectedPlatform = null;

    loadFromLocalStorage();

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

    function saveToLocalStorage() {
        try {
            localStorage.setItem('tradesmartUserData', JSON.stringify(userData));
            localStorage.setItem('tradesmartSelectedPlan', JSON.stringify(selectedPlan));
            localStorage.setItem('tradesmartSelectedPlatform', JSON.stringify(selectedPlatform));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    function loadFromLocalStorage() {
        try {
            const savedUserData = localStorage.getItem('tradesmartUserData');
            const savedPlan = localStorage.getItem('tradesmartSelectedPlan');
            const savedPlatform = localStorage.getItem('tradesmartSelectedPlatform');

            if (savedUserData) {
                userData = JSON.parse(savedUserData);
                restoreFormValues();
            }

            if (savedPlan) {
                selectedPlan = JSON.parse(savedPlan);
            }

            if (savedPlatform) {
                selectedPlatform = JSON.parse(savedPlatform);
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
    }

    function restoreFormValues() {
        if (userData.amount) document.getElementById('investAmount').value = userData.amount;
        if (userData.timeline) document.getElementById('timeline').value = userData.timeline;
        if (userData.expectedGrowth) document.getElementById('expectedGrowth').value = userData.expectedGrowth;
        if (userData.risk) document.getElementById('riskTolerance').value = userData.risk;
        if (userData.experience) document.getElementById('experience').value = userData.experience;
    }

    function clearLocalStorage() {
        try {
            localStorage.removeItem('tradesmartUserData');
            localStorage.removeItem('tradesmartSelectedPlan');
            localStorage.removeItem('tradesmartSelectedPlatform');
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }

    const goalsForm = document.getElementById('goalsForm');
    if (goalsForm) {
        goalsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            userData = {
                amount: parseFloat(document.getElementById('investAmount').value),
                timeline: parseInt(document.getElementById('timeline').value),
                expectedGrowth: parseFloat(document.getElementById('expectedGrowth').value),
                risk: document.getElementById('riskTolerance').value,
                experience: document.getElementById('experience').value
            };

            saveToLocalStorage();
            generatePortfolioOptions();
            
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('step2').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

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

        document.querySelectorAll('.select-plan-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectPlan(options[index]);
            });
        });
    }

    function calculateProjectedValue(principal, years, annualRate) {
        return Math.round(principal * Math.pow(1 + (annualRate / 100), years));
    }

    function selectPlan(plan) {
        selectedPlan = plan;
        saveToLocalStorage();
        
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        document.getElementById('step3').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            selectedPlatform = {
                name: this.querySelector('h4').textContent,
                url: this.getAttribute('data-url')
            };

            saveToLocalStorage();
            showPlatformEmbed();
        });
    });

    function generateStockRecommendations(amount, stocksPct, bondsPct, altsPct) {
        const recommendations = [];
        
        const stockAmount = amount * (stocksPct / 100);
        const bondAmount = amount * (bondsPct / 100);
        const altAmount = amount * (altsPct / 100);
        
        if (stockAmount > 0) {
            recommendations.push({
                ticker: 'VTI',
                name: 'Vanguard Total Stock Market ETF',
                amount: stockAmount * 0.6,
                percentage: stocksPct * 0.6
            });
            
            recommendations.push({
                ticker: 'VXUS',
                name: 'Vanguard Total International Stock ETF',
                amount: stockAmount * 0.4,
                percentage: stocksPct * 0.4
            });
        }
        
        if (bondAmount > 0) {
            recommendations.push({
                ticker: 'BND',
                name: 'Vanguard Total Bond Market ETF',
                amount: bondAmount,
                percentage: bondsPct
            });
        }
        
        if (altAmount > 0) {
            recommendations.push({
                ticker: 'VNQ',
                name: 'Vanguard Real Estate ETF',
                amount: altAmount,
                percentage: altsPct
            });
        }
        
        return recommendations;
    }

    function showPlatformEmbed() {
        const embedDiv = document.getElementById('platformEmbed');
        const platformName = document.getElementById('selectedPlatformName');
        const platformBtnName = document.getElementById('platformBtnName');
        const platformNameInstructions = document.getElementById('platformNameInstructions');
        const portfolioSummary = document.getElementById('portfolioSummary');
        
        platformName.textContent = `Your Trading Plan for ${selectedPlatform.name}`;
        platformBtnName.textContent = selectedPlatform.name;
        platformNameInstructions.textContent = selectedPlatform.name;
        
        portfolioSummary.innerHTML = `
            <strong>${selectedPlan.name}</strong><br>
            Allocation: ${selectedPlan.stocks}% Stocks, ${selectedPlan.bonds}% Bonds, ${selectedPlan.alternatives}% Alternatives<br>
            <span style="font-size:0.9rem;color:#666">${selectedPlan.details}</span>
        `;
        
        document.getElementById('planInvestAmount').textContent = userData.amount.toLocaleString();
        document.getElementById('planStrategy').textContent = selectedPlan.name;
        
        const recommendations = generateStockRecommendations(
            userData.amount,
            selectedPlan.stocks,
            selectedPlan.bonds,
            selectedPlan.alternatives
        );
        
        const stocksList = document.getElementById('stocksList');
        stocksList.innerHTML = recommendations.map((stock, index) => {
            const shares = Math.floor(stock.amount / 100);
            const sharesToBuy = shares > 0 ? shares : (stock.amount / 100).toFixed(2);
            
            return `
                <div style="background:#f8f9fa;padding:1rem;border-radius:6px;margin-bottom:0.75rem;border-left:4px solid var(--secondary)">
                    <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.5rem">
                        <div style="flex:1;min-width:200px">
                            <strong style="color:var(--primary);font-size:1.1rem">${stock.ticker}</strong>
                            <span style="color:#666;font-size:0.85rem;margin-left:0.5rem">${stock.name}</span>
                            <br>
                            <span style="color:var(--secondary);font-size:0.9rem">
                                ${stock.percentage.toFixed(1)}% of portfolio
                            </span>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:1.2rem;color:var(--accent);font-weight:600">
                                $${stock.amount.toFixed(2)}
                            </div>
                            <div style="font-size:0.85rem;color:#666">
                                ~${sharesToBuy} shares
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        embedDiv.style.display = 'block';
        
        setTimeout(() => {
            embedDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    document.addEventListener('click', function(e) {
        if (e.target.id === 'openPlatformBtn' || e.target.closest('#openPlatformBtn')) {
            if (selectedPlatform) {
                window.open(selectedPlatform.url, '_blank', 'noopener,noreferrer');
            }
        }
        
        if (e.target.id === 'downloadPlanBtn' || e.target.closest('#downloadPlanBtn')) {
            downloadTradingPlan();
        }
        
        if (e.target.id === 'markCompleteBtn' || e.target.closest('#markCompleteBtn')) {
            completeSetup();
        }
    });

    function downloadTradingPlan() {
        const recommendations = generateStockRecommendations(
            userData.amount,
            selectedPlan.stocks,
            selectedPlan.bonds,
            selectedPlan.alternatives
        );
        
        const projectedValue = calculateProjectedValue(userData.amount, userData.timeline, userData.expectedGrowth);
        
        let planText = `TRADESMART GUIDE - PERSONALIZED TRADING PLAN\n`;
        planText += `Generated: ${new Date().toLocaleDateString()}\n`;
        planText += `${'='.repeat(60)}\n\n`;
        
        planText += `PORTFOLIO DETAILS\n`;
        planText += `${'-'.repeat(60)}\n`;
        planText += `Strategy: ${selectedPlan.name}\n`;
        planText += `Investment Amount: $${userData.amount.toLocaleString()}\n`;
        planText += `Timeline: ${userData.timeline} years\n`;
        planText += `Expected Annual Return: ${userData.expectedGrowth}%\n`;
        planText += `Risk Level: ${userData.risk.charAt(0).toUpperCase() + userData.risk.slice(1)}\n`;
        planText += `Selected Platform: ${selectedPlatform.name}\n\n`;
        
        planText += `ALLOCATION\n`;
        planText += `${'-'.repeat(60)}\n`;
        planText += `Stocks: ${selectedPlan.stocks}%\n`;
        planText += `Bonds: ${selectedPlan.bonds}%\n`;
        planText += `Alternatives: ${selectedPlan.alternatives}%\n\n`;
        
        planText += `RECOMMENDED TRADES\n`;
        planText += `${'-'.repeat(60)}\n`;
        recommendations.forEach((stock, index) => {
            const shares = Math.floor(stock.amount / 100);
            const sharesToBuy = shares > 0 ? shares : (stock.amount / 100).toFixed(2);
            planText += `\n${index + 1}. ${stock.ticker} - ${stock.name}\n`;
            planText += `   Amount: $${stock.amount.toFixed(2)} (${stock.percentage.toFixed(1)}% of portfolio)\n`;
            planText += `   Approximate Shares: ${sharesToBuy}\n`;
            planText += `   Order Type: Market Order\n`;
        });
        
        planText += `\n\nSTEP-BY-STEP INSTRUCTIONS\n`;
        planText += `${'-'.repeat(60)}\n`;
        planText += `1. Log into ${selectedPlatform.name}\n`;
        planText += `2. Navigate to the Trade/Buy page\n`;
        planText += `3. For each ticker listed above:\n`;
        planText += `   a. Search for the ticker symbol\n`;
        planText += `   b. Select "Buy" or "Trade"\n`;
        planText += `   c. Enter the number of shares shown\n`;
        planText += `   d. Choose "Market Order" for order type\n`;
        planText += `   e. Review and confirm the trade\n`;
        planText += `4. Verify all orders are executed successfully\n\n`;
        
        planText += `PROJECTED RETURNS\n`;
        planText += `${'-'.repeat(60)}\n`;
        planText += `Projected Value (${userData.timeline} years): $${projectedValue.toLocaleString()}\n`;
        planText += `Total Gain: $${(projectedValue - userData.amount).toLocaleString()}\n\n`;
        
        planText += `RISK DISCLOSURE\n`;
        planText += `${'-'.repeat(60)}\n`;
        planText += `Investing in securities involves risk, including possible loss of\n`;
        planText += `principal. Past performance does not guarantee future results. This\n`;
        planText += `is educational information only and not personalized investment advice.\n`;
        planText += `TradeSmart Guide is not a registered investment advisor. You are\n`;
        planText += `responsible for your own investment decisions. Always consult with a\n`;
        planText += `qualified financial advisor before making investment decisions.\n\n`;
        
        planText += `${'='.repeat(60)}\n`;
        planText += `End of Trading Plan\n`;
        
        const blob = new Blob([planText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TradeSmart_Plan_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    function completeSetup() {
        const projectedValue = calculateProjectedValue(userData.amount, userData.timeline, userData.expectedGrowth);
        const totalGain = projectedValue - userData.amount;
        const annualReturn = userData.expectedGrowth;

        const recommendations = generateStockRecommendations(
            userData.amount,
            selectedPlan.stocks,
            selectedPlan.bonds,
            selectedPlan.alternatives
        );

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
            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #ddd">
                <h5 style="color:var(--primary);margin-bottom:0.5rem">Your Holdings:</h5>
                ${recommendations.map(stock => {
                    const shares = Math.floor(stock.amount / 100);
                    const sharesToBuy = shares > 0 ? shares : (stock.amount / 100).toFixed(2);
                    return `<div style="font-size:0.9rem;margin-bottom:0.25rem">
                        <strong>${stock.ticker}</strong>: ~${sharesToBuy} shares ($${stock.amount.toFixed(2)})
                    </div>`;
                }).join('')}
            </div>
        `;

        document.getElementById('step3').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('a[href="#home"]').forEach(link => {
        link.addEventListener('click', function() {
            clearLocalStorage();
            
            const form = document.getElementById('goalsForm');
            if (form) form.reset();
            
            const step1 = document.getElementById('step1');
            const step2 = document.getElementById('step2');
            const step3 = document.getElementById('step3');
            const results = document.getElementById('results');
            const platformEmbed = document.getElementById('platformEmbed');
            
            if (step1) step1.style.display = 'block';
            if (step2) step2.style.display = 'none';
            if (step3) step3.style.display = 'none';
            if (results) results.style.display = 'none';
            if (platformEmbed) platformEmbed.style.display = 'none';
            
            userData = {};
            selectedPlan = null;
            selectedPlatform = null;
            
            document.querySelectorAll('.platform-card').forEach(card => {
                card.classList.remove('active');
            });
        });
    });
});