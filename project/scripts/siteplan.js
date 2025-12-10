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
            ],
            expert: [
                {
                    name: "Tactical Conservative",
                    stocks: 55, bonds: 30, alternatives: 15,
                    description: "Dynamic allocation with downside protection strategies",
                    details: "35% Value, 20% Quality Factor, 30% Treasury Ladder, 15% Alternatives"
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
            ],
            expert: [
                {
                    name: "Factor Tilted Moderate",
                    stocks: 75, bonds: 10, alternatives: 15,
                    description: "Factor-based approach with tactical tilts",
                    details: "25% Quality, 25% Value, 25% Momentum, 10% Bonds, 15% Alternatives"
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
            ],
            expert: [
                {
                    name: "Concentrated Alpha",
                    stocks: 95, bonds: 0, alternatives: 5,
                    description: "High-conviction positions with leverage potential",
                    details: "50% Individual Growth Stocks, 25% Thematic ETFs, 20% International, 5% Volatility"
                }
            ]
        }
    };

    // Frequency multipliers for contributions
    const frequencyMultipliers = {
        weekly: 52,
        biweekly: 26,
        monthly: 12,
        quarterly: 4,
        annually: 1
    };

    // Compounding periods per year
    const compoundingPeriods = {
        daily: 365,
        monthly: 12,
        quarterly: 4,
        annually: 1
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
        if (userData.recurringAmount) document.getElementById('recurringAmount').value = userData.recurringAmount;
        if (userData.recurringFrequency) document.getElementById('recurringFrequency').value = userData.recurringFrequency;
        if (userData.contributionIncrease) document.getElementById('contributionIncrease').value = userData.contributionIncrease;
        if (userData.timeline) document.getElementById('timeline').value = userData.timeline;
        if (userData.expectedGrowth) document.getElementById('expectedGrowth').value = userData.expectedGrowth;
        if (userData.inflationRate) document.getElementById('inflationRate').value = userData.inflationRate;
        if (userData.compoundingFreq) document.getElementById('compoundingFreq').value = userData.compoundingFreq;
        if (userData.risk) document.getElementById('riskTolerance').value = userData.risk;
        if (userData.experience) document.getElementById('experience').value = userData.experience;
        if (userData.investmentGoal) document.getElementById('investmentGoal').value = userData.investmentGoal;
        if (userData.targetAmount) document.getElementById('targetAmount').value = userData.targetAmount;
        if (userData.accountType) document.getElementById('accountType').value = userData.accountType;
        if (userData.taxBracket) document.getElementById('taxBracket').value = userData.taxBracket;
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

    // Live projection preview calculation
    function calculateAdvancedProjection(principal, recurringAmount, frequency, years, annualRate, inflationRate, contributionIncrease, compoundFreq) {
        const periodsPerYear = compoundingPeriods[compoundFreq] || 12;
        const contributionsPerYear = frequencyMultipliers[frequency] || 12;
        const ratePerPeriod = (annualRate / 100) / periodsPerYear;
        const inflationRateDecimal = inflationRate / 100;
        const contributionIncreaseDecimal = contributionIncrease / 100;

        let totalValue = principal;
        let totalContributions = principal;
        let currentContribution = recurringAmount;

        // Calculate month by month for accuracy
        for (let year = 0; year < years; year++) {
            // Apply contribution increase at start of each year (except first)
            if (year > 0) {
                currentContribution = currentContribution * (1 + contributionIncreaseDecimal);
            }

            // Monthly calculations within each year
            for (let month = 0; month < 12; month++) {
                // Add contributions for this month based on frequency
                const contributionsThisMonth = (contributionsPerYear / 12) * currentContribution;
                totalContributions += contributionsThisMonth;
                totalValue += contributionsThisMonth;

                // Apply monthly growth (simplified from compound periods)
                const monthlyRate = Math.pow(1 + ratePerPeriod, periodsPerYear / 12) - 1;
                totalValue = totalValue * (1 + monthlyRate);
            }
        }

        // Calculate inflation-adjusted value
        const inflationFactor = Math.pow(1 + inflationRateDecimal, years);
        const realValue = totalValue / inflationFactor;

        return {
            nominalValue: Math.round(totalValue),
            realValue: Math.round(realValue),
            totalContributions: Math.round(totalContributions),
            totalGrowth: Math.round(totalValue - totalContributions)
        };
    }

    function updateProjectionPreview() {
        const principal = parseFloat(document.getElementById('investAmount').value) || 0;
        const recurringAmount = parseFloat(document.getElementById('recurringAmount').value) || 0;
        const frequency = document.getElementById('recurringFrequency').value;
        const years = parseInt(document.getElementById('timeline').value) || 0;
        const annualRate = parseFloat(document.getElementById('expectedGrowth').value) || 0;
        const inflationRate = parseFloat(document.getElementById('inflationRate').value) || 2.5;
        const contributionIncrease = parseFloat(document.getElementById('contributionIncrease').value) || 0;
        const compoundFreq = document.getElementById('compoundingFreq').value;

        if (years > 0 && (principal > 0 || recurringAmount > 0)) {
            const projection = calculateAdvancedProjection(
                principal, recurringAmount, frequency, years, 
                annualRate, inflationRate, contributionIncrease, compoundFreq
            );

            document.getElementById('previewContributions').textContent = '$' + projection.totalContributions.toLocaleString();
            document.getElementById('previewValue').textContent = '$' + projection.nominalValue.toLocaleString();
            document.getElementById('previewGrowth').textContent = '$' + projection.totalGrowth.toLocaleString();
            document.getElementById('previewRealValue').textContent = '$' + projection.realValue.toLocaleString();
        } else {
            document.getElementById('previewContributions').textContent = '$0';
            document.getElementById('previewValue').textContent = '$0';
            document.getElementById('previewGrowth').textContent = '$0';
            document.getElementById('previewRealValue').textContent = '$0';
        }
    }

    // Add event listeners for live preview
    const previewFields = [
        'investAmount', 'recurringAmount', 'recurringFrequency', 
        'contributionIncrease', 'timeline', 'expectedGrowth', 
        'inflationRate', 'compoundingFreq'
    ];

    previewFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateProjectionPreview);
            field.addEventListener('change', updateProjectionPreview);
        }
    });

    // Initial preview calculation
    updateProjectionPreview();

    const goalsForm = document.getElementById('goalsForm');
    if (goalsForm) {
        goalsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            userData = {
                amount: parseFloat(document.getElementById('investAmount').value) || 0,
                recurringAmount: parseFloat(document.getElementById('recurringAmount').value) || 0,
                recurringFrequency: document.getElementById('recurringFrequency').value,
                contributionIncrease: parseFloat(document.getElementById('contributionIncrease').value) || 0,
                timeline: parseInt(document.getElementById('timeline').value),
                expectedGrowth: parseFloat(document.getElementById('expectedGrowth').value),
                inflationRate: parseFloat(document.getElementById('inflationRate').value) || 2.5,
                compoundingFreq: document.getElementById('compoundingFreq').value,
                risk: document.getElementById('riskTolerance').value,
                experience: document.getElementById('experience').value,
                investmentGoal: document.getElementById('investmentGoal').value,
                targetAmount: parseFloat(document.getElementById('targetAmount').value) || 0,
                accountType: document.getElementById('accountType').value,
                taxBracket: parseInt(document.getElementById('taxBracket').value) || 0
            };

            // Calculate total initial investment for portfolio generation
            userData.totalInitialInvestment = userData.amount;

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

        const riskOptions = portfolioTemplates[userData.risk];
        const experienceOptions = riskOptions[userData.experience] || riskOptions['beginner'];
        const options = experienceOptions;
        
        options.forEach((portfolio, index) => {
            const projection = calculateAdvancedProjection(
                userData.amount,
                userData.recurringAmount,
                userData.recurringFrequency,
                userData.timeline,
                userData.expectedGrowth,
                userData.inflationRate,
                userData.contributionIncrease,
                userData.compoundingFreq
            );
            
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
                <div style="background:var(--bg);padding:0.75rem;border-radius:6px;margin:0.5rem 0">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-size:0.85rem">
                        <div>
                            <strong>Total Contributions:</strong><br>
                            <span>$${projection.totalContributions.toLocaleString()}</span>
                        </div>
                        <div>
                            <strong>Projected Value:</strong><br>
                            <span style="font-size:1.2rem;color:var(--accent)">$${projection.nominalValue.toLocaleString()}</span>
                        </div>
                        <div>
                            <strong>Total Growth:</strong><br>
                            <span style="color:var(--secondary)">+$${projection.totalGrowth.toLocaleString()}</span>
                        </div>
                        <div>
                            <strong>Real Value (inflation-adj):</strong><br>
                            <span>$${projection.realValue.toLocaleString()}</span>
                        </div>
                    </div>
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
        
        const freqText = {
            weekly: 'weekly',
            biweekly: 'bi-weekly',
            monthly: 'monthly',
            quarterly: 'quarterly',
            annually: 'annually'
        };
        
        let contributionInfo = '';
        if (userData.recurringAmount > 0) {
            contributionInfo = `<br>Recurring: $${userData.recurringAmount.toLocaleString()} ${freqText[userData.recurringFrequency]}`;
            if (userData.contributionIncrease > 0) {
                contributionInfo += ` (increasing ${userData.contributionIncrease}%/year)`;
            }
        }
        
        portfolioSummary.innerHTML = `
            <strong>${selectedPlan.name}</strong><br>
            Allocation: ${selectedPlan.stocks}% Stocks, ${selectedPlan.bonds}% Bonds, ${selectedPlan.alternatives}% Alternatives<br>
            <span style="font-size:0.9rem;color:#666">${selectedPlan.details}</span>
            ${contributionInfo}
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
        
        const projection = calculateAdvancedProjection(
            userData.amount,
            userData.recurringAmount,
            userData.recurringFrequency,
            userData.timeline,
            userData.expectedGrowth,
            userData.inflationRate,
            userData.contributionIncrease,
            userData.compoundingFreq
        );
        
        const freqText = {
            weekly: 'Weekly',
            biweekly: 'Bi-weekly',
            monthly: 'Monthly',
            quarterly: 'Quarterly',
            annually: 'Annually'
        };
        
        const goalText = {
            retirement: 'Retirement Savings',
            wealth: 'Wealth Building',
            house: 'Home Down Payment',
            education: 'Education Fund',
            emergency: 'Emergency Fund Growth',
            income: 'Passive Income Generation',
            other: 'Other Goal'
        };
        
        const accountText = {
            taxable: 'Taxable Brokerage',
            traditional_ira: 'Traditional IRA / 401(k)',
            roth: 'Roth IRA / Roth 401(k)',
            hsa: 'HSA (Health Savings Account)',
            '529': '529 Education Plan'
        };
        
        let planText = `TRADESMART GUIDE - PERSONALIZED TRADING PLAN\n`;
        planText += `Generated: ${new Date().toLocaleDateString()}\n`;
        planText += `${'='.repeat(70)}\n\n`;
        
        planText += `INVESTMENT PROFILE\n`;
        planText += `${'-'.repeat(70)}\n`;
        planText += `Investment Goal: ${goalText[userData.investmentGoal] || 'Not specified'}\n`;
        planText += `Risk Level: ${userData.risk.charAt(0).toUpperCase() + userData.risk.slice(1)}\n`;
        planText += `Experience Level: ${userData.experience.charAt(0).toUpperCase() + userData.experience.slice(1)}\n`;
        planText += `Account Type: ${accountText[userData.accountType]}\n`;
        if (userData.targetAmount > 0) {
            planText += `Target Amount: $${userData.targetAmount.toLocaleString()}\n`;
        }
        planText += `\n`;
        
        planText += `INVESTMENT DETAILS\n`;
        planText += `${'-'.repeat(70)}\n`;
        planText += `Initial Principal: $${userData.amount.toLocaleString()}\n`;
        if (userData.recurringAmount > 0) {
            planText += `Recurring Contribution: $${userData.recurringAmount.toLocaleString()} ${freqText[userData.recurringFrequency]}\n`;
            if (userData.contributionIncrease > 0) {
                planText += `Annual Contribution Increase: ${userData.contributionIncrease}%\n`;
            }
        }
        planText += `Investment Timeline: ${userData.timeline} years\n`;
        planText += `Expected Annual Return: ${userData.expectedGrowth}%\n`;
        planText += `Expected Inflation Rate: ${userData.inflationRate}%\n`;
        planText += `Compounding Frequency: ${userData.compoundingFreq.charAt(0).toUpperCase() + userData.compoundingFreq.slice(1)}\n`;
        planText += `Selected Platform: ${selectedPlatform.name}\n\n`;
        
        planText += `PORTFOLIO STRATEGY: ${selectedPlan.name}\n`;
        planText += `${'-'.repeat(70)}\n`;
        planText += `Stocks: ${selectedPlan.stocks}%\n`;
        planText += `Bonds: ${selectedPlan.bonds}%\n`;
        planText += `Alternatives: ${selectedPlan.alternatives}%\n`;
        planText += `Details: ${selectedPlan.details}\n\n`;
        
        planText += `RECOMMENDED TRADES (Initial Investment)\n`;
        planText += `${'-'.repeat(70)}\n`;
        recommendations.forEach((stock, index) => {
            const shares = Math.floor(stock.amount / 100);
            const sharesToBuy = shares > 0 ? shares : (stock.amount / 100).toFixed(2);
            planText += `\n${index + 1}. ${stock.ticker} - ${stock.name}\n`;
            planText += `   Amount: $${stock.amount.toFixed(2)} (${stock.percentage.toFixed(1)}% of portfolio)\n`;
            planText += `   Approximate Shares: ${sharesToBuy}\n`;
            planText += `   Order Type: Market Order\n`;
        });
        
        planText += `\n\nPROJECTED RETURNS (${userData.timeline} years)\n`;
        planText += `${'-'.repeat(70)}\n`;
        planText += `Total Contributions: $${projection.totalContributions.toLocaleString()}\n`;
        planText += `Projected Nominal Value: $${projection.nominalValue.toLocaleString()}\n`;
        planText += `Total Growth: $${projection.totalGrowth.toLocaleString()}\n`;
        planText += `Real Value (Inflation-Adjusted): $${projection.realValue.toLocaleString()}\n\n`;
        
        planText += `STEP-BY-STEP INSTRUCTIONS\n`;
        planText += `${'-'.repeat(70)}\n`;
        planText += `1. Log into ${selectedPlatform.name}\n`;
        planText += `2. Navigate to the Trade/Buy page\n`;
        planText += `3. For each ticker listed above:\n`;
        planText += `   a. Search for the ticker symbol\n`;
        planText += `   b. Select "Buy" or "Trade"\n`;
        planText += `   c. Enter the number of shares shown\n`;
        planText += `   d. Choose "Market Order" for order type\n`;
        planText += `   e. Review and confirm the trade\n`;
        planText += `4. Verify all orders are executed successfully\n`;
        if (userData.recurringAmount > 0) {
            planText += `5. Set up automatic ${freqText[userData.recurringFrequency].toLowerCase()} transfers of $${userData.recurringAmount}\n`;
            planText += `6. Consider enabling automatic investing for your recurring contributions\n`;
        }
        planText += `\n`;
        
        planText += `RISK DISCLOSURE\n`;
        planText += `${'-'.repeat(70)}\n`;
        planText += `Investing in securities involves risk, including possible loss of\n`;
        planText += `principal. Past performance does not guarantee future results. This\n`;
        planText += `is educational information only and not personalized investment advice.\n`;
        planText += `TradeSmart Guide is not a registered investment advisor. You are\n`;
        planText += `responsible for your own investment decisions. Always consult with a\n`;
        planText += `qualified financial advisor before making investment decisions.\n\n`;
        
        planText += `${'='.repeat(70)}\n`;
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
        const projection = calculateAdvancedProjection(
            userData.amount,
            userData.recurringAmount,
            userData.recurringFrequency,
            userData.timeline,
            userData.expectedGrowth,
            userData.inflationRate,
            userData.contributionIncrease,
            userData.compoundingFreq
        );

        const recommendations = generateStockRecommendations(
            userData.amount,
            selectedPlan.stocks,
            selectedPlan.bonds,
            selectedPlan.alternatives
        );

        const freqText = {
            weekly: 'weekly',
            biweekly: 'bi-weekly',
            monthly: 'monthly',
            quarterly: 'quarterly',
            annually: 'annually'
        };

        let recurringInfo = '';
        if (userData.recurringAmount > 0) {
            recurringInfo = `
                <div>
                    <strong>Recurring Contribution:</strong><br>$${userData.recurringAmount.toLocaleString()} ${freqText[userData.recurringFrequency]}
                </div>
            `;
        }

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
                ${recurringInfo}
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
                        <strong>Expected Annual Return:</strong><br>${userData.expectedGrowth}%
                    </div>
                    <div>
                        <strong>Total Contributions:</strong><br>
                        $${projection.totalContributions.toLocaleString()}
                    </div>
                    <div>
                        <strong>Projected Value:</strong><br>
                        <span style="color:var(--accent);font-size:1.2rem">$${projection.nominalValue.toLocaleString()}</span>
                    </div>
                    <div>
                        <strong>Total Growth:</strong><br>
                        <span style="color:var(--secondary)">$${projection.totalGrowth.toLocaleString()}</span>
                    </div>
                    <div>
                        <strong>Real Value (inflation-adj):</strong><br>
                        $${projection.realValue.toLocaleString()}
                    </div>
                </div>
            </div>
            <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #ddd">
                <h5 style="color:var(--primary);margin-bottom:0.5rem">Your Initial Holdings:</h5>
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
            
            // Reset preview
            updateProjectionPreview();
        });
    });
});

//Auto Trade Module
// Educational trading bot simulation for TradeSmart Guide

(function() {
    'use strict';

    // State
    let simulationRunning = false;
    let simulationInterval = null;
    let iteration = 0;
    let priceHistory = {};
    let holdings = {};
    let cash = 10000;
    let equity = 10000;
    let startingEquity = 10000;
    let config = {};
    let chartCanvas = null;
    let chartCtx = null;

    // DOM Elements
    const model = document.getElementById('autoTradeModel');
    const autoTradeBtn = document.getElementById('autoTradeBtn');
    const closeModelBtn = document.getElementById('closeAutoTradeModel');
    const autoTradeForm = document.getElementById('autoTradeForm');
    const setupSection = document.getElementById('autoTradeSetup');
    const simulationSection = document.getElementById('autoTradeSimulation');
    const downloadConfigBtn = document.getElementById('downloadConfigBtn');
    const stopSimBtn = document.getElementById('stopSimulation');
    const backToSetupBtn = document.getElementById('backToSetup');
    const exportLogBtn = document.getElementById('exportLog');
    const tradingLog = document.getElementById('tradingLog');

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        if (autoTradeBtn) {
            autoTradeBtn.addEventListener('click', openModel);
        }
        if (closeModelBtn) {
            closeModelBtn.addEventListener('click', closeModel);
        }
        if (model) {
            model.addEventListener('click', function(e) {
                if (e.target === model) closeModel();
            });
        }
        if (autoTradeForm) {
            autoTradeForm.addEventListener('submit', startSimulation);
        }
        if (downloadConfigBtn) {
            downloadConfigBtn.addEventListener('click', downloadConfigFiles);
        }
        if (stopSimBtn) {
            stopSimBtn.addEventListener('click', stopSimulation);
        }
        if (backToSetupBtn) {
            backToSetupBtn.addEventListener('click', backToSetup);
        }
        if (exportLogBtn) {
            exportLogBtn.addEventListener('click', exportTradingLog);
        }
    });

    function openModel() {
        if (model) {
            model.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModel() {
        if (model) {
            model.style.display = 'none';
            document.body.style.overflow = '';
            if (simulationRunning) {
                stopSimulation();
            }
        }
    }

    function getFormConfig() {
        return {
            username: document.getElementById('rhUsername').value,
            password: document.getElementById('rhPassword').value,
            stocks: document.getElementById('stockSymbols').value.split(',').map(s => s.trim().toUpperCase()).filter(s => s),
            tradingBuffer: parseFloat(document.getElementById('tradingBuffer').value) / 100,
            smaWindow: parseInt(document.getElementById('smaWindow').value),
            maxCashPerStock: parseFloat(document.getElementById('maxCashPerStock').value) / 100,
            checkInterval: parseInt(document.getElementById('checkInterval').value)
        };
    }

    function downloadConfigFiles() {
        const cfg = getFormConfig();
        
        // Generate .env file content
        const envContent = `# Robinhood Trading Bot Configuration
# Generated by TradeSmart Guide

ROBINHOOD_USERNAME=${cfg.username || 'your_email@example.com'}
ROBINHOOD_PASSWORD=${cfg.password ? '********' : 'your_password'}
`;

        // Generate config.py content
        const configPyContent = `"""
Configuration file for the trading bot.
Generated by TradeSmart Guide
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Credentials
username = os.getenv('ROBINHOOD_USERNAME')
password = os.getenv('ROBINHOOD_PASSWORD')

if not username or not password:
    raise ValueError(
        "Missing credentials! Create a .env file with:\\n"
        "ROBINHOOD_USERNAME=your_email@example.com\\n"
        "ROBINHOOD_PASSWORD=your_password"
    )

# Stocks to Trade
STOCKS = ${JSON.stringify(cfg.stocks)}

# Trading Parameters
TRADING_BUFFER = ${cfg.tradingBuffer}  # ${(cfg.tradingBuffer * 100).toFixed(1)}%
SMA_WINDOW = ${cfg.smaWindow}
MAX_CASH_PER_STOCK = ${cfg.maxCashPerStock}  # ${(cfg.maxCashPerStock * 100).toFixed(0)}%
MIN_SHARES_TO_BUY = 5

# Market Hours (Eastern Time)
MARKET_OPEN_HOUR = 9
MARKET_OPEN_MINUTE = 30
MARKET_CLOSE_HOUR = 15
MARKET_CLOSE_MINUTE = 59

CHECK_INTERVAL = ${cfg.checkInterval}
SMA_UPDATE_INTERVAL = 5

# Display Settings
SAVE_GRAPHS = True
VERBOSE_LOGGING = True
`;

        // Create zip-like download (download both files)
        downloadFile('.env.example', envContent);
        setTimeout(() => {
            downloadFile('config.py', configPyContent);
        }, 500);

        addLogEntry('info', '📥 Config files downloaded. Place them in your trading bot directory.');
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function startSimulation(e) {
        e.preventDefault();
        
        config = getFormConfig();
        
        if (config.stocks.length === 0) {
            alert('Please enter at least one stock symbol.');
            return;
        }

        // Reset state
        iteration = 0;
        cash = 10000;
        equity = 10000;
        startingEquity = 10000;
        holdings = {};
        priceHistory = {};
        
        config.stocks.forEach(stock => {
            holdings[stock] = { shares: 0, avgPrice: 0 };
            priceHistory[stock] = [];
        });

        // Switch to simulation view
        setupSection.style.display = 'none';
        simulationSection.style.display = 'block';
        
        // Clear log
        tradingLog.innerHTML = '';
        
        // Initialize chart
        initChart();
        
        // Start simulation
        simulationRunning = true;
        document.querySelector('.status-dot').classList.add('active');
        document.getElementById('simStatusText').textContent = 'Running Simulation...';
        
        addLogEntry('info', '🚀 Trading bot initialized');
        addLogEntry('info', `📊 Monitoring stocks: ${config.stocks.join(', ')}`);
        addLogEntry('info', `💰 Starting equity: $${equity.toLocaleString()}`);
        addLogEntry('info', `⚙️ Buffer: ${(config.tradingBuffer * 100).toFixed(1)}%, SMA Window: ${config.smaWindow}`);
        addLogEntry('success', '✓ Login successful (simulated)');
        
        // Run simulation loop
        runIteration();
        simulationInterval = setInterval(runIteration, 2000); // Speed up for demo
    }

    function stopSimulation() {
        simulationRunning = false;
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        document.querySelector('.status-dot').classList.remove('active');
        document.getElementById('simStatusText').textContent = 'Simulation Stopped';
        addLogEntry('warning', '⏹ Simulation stopped by user');
    }

    function backToSetup() {
        stopSimulation();
        setupSection.style.display = 'block';
        simulationSection.style.display = 'none';
    }

    function runIteration() {
        if (!simulationRunning) return;
        
        iteration++;
        const time = new Date().toLocaleTimeString();
        
        addLogEntry('info', `\n--- Iteration ${iteration} at ${time} ---`);
        
        // Simulate price updates for each stock
        config.stocks.forEach(stock => {
            const priceData = simulatePrice(stock);
            const signal = calculateSignal(stock, priceData.price, priceData.sma);
            
            processSignal(stock, signal, priceData.price, priceData.sma, priceData.ratio);
        });
        
        // Update UI
        updateStats();
        updateHoldings();
        updateChart();
    }

    function simulatePrice(stock) {
        // Base prices for common stocks (simulated)
        const basePrices = {
            'QQQ': 520,
            'SPY': 590,
            'VOO': 540,
            'TSLA': 250,
            'AAPL': 195,
            'MSFT': 420,
            'GOOGL': 175,
            'AMZN': 205,
            'NVDA': 140,
            'META': 565
        };
        
        let basePrice = basePrices[stock] || 100 + Math.random() * 200;
        
        // Get last price or use base
        let lastPrice = priceHistory[stock].length > 0 
            ? priceHistory[stock][priceHistory[stock].length - 1].price 
            : basePrice;
        
        // Random walk with slight trend
        const volatility = 0.003;
        const change = (Math.random() - 0.48) * volatility * lastPrice;
        const newPrice = Math.max(lastPrice + change, 1);
        
        // Store price
        priceHistory[stock].push({
            price: newPrice,
            time: new Date()
        });
        
        // Keep only last 50 prices
        if (priceHistory[stock].length > 50) {
            priceHistory[stock].shift();
        }
        
        // Calculate SMA
        const prices = priceHistory[stock].map(p => p.price);
        const smaWindow = Math.min(config.smaWindow, prices.length);
        const sma = prices.slice(-smaWindow).reduce((a, b) => a + b, 0) / smaWindow;
        
        const ratio = newPrice / sma;
        
        return { price: newPrice, sma, ratio };
    }

    function calculateSignal(stock, price, sma) {
        const ratio = price / sma;
        
        if (ratio < (1 - config.tradingBuffer)) {
            return 'BUY';
        } else if (ratio > (1 + config.tradingBuffer)) {
            return 'SELL';
        }
        return 'HOLD';
    }

    function processSignal(stock, signal, price, sma, ratio) {
        const holding = holdings[stock];
        
        addLogEntry('info', `${stock}: $${price.toFixed(2)}`);
        addLogEntry('info', `  Signal: ${signal} | SMA: $${sma.toFixed(2)} | Ratio: ${(price/sma).toFixed(4)}`);
        
        if (signal === 'BUY' && holding.shares === 0) {
            // Calculate shares to buy
            const maxInvestment = cash * config.maxCashPerStock;
            const sharesToBuy = Math.floor(maxInvestment / price);
            
            if (sharesToBuy >= 5) {
                const cost = sharesToBuy * price;
                cash -= cost;
                holding.shares = sharesToBuy;
                holding.avgPrice = price;
                
                addLogEntry('buy', `🟢 BUY: ${stock} - ${sharesToBuy} shares @ $${price.toFixed(2)} (Total: $${cost.toFixed(2)})`);
            } else {
                addLogEntry('info', `  Skipping: Can only afford ${sharesToBuy} shares (min: 5)`);
            }
        } else if (signal === 'SELL' && holding.shares > 0) {
            const revenue = holding.shares * price;
            const profit = revenue - (holding.shares * holding.avgPrice);
            cash += revenue;
            
            addLogEntry('sell', `🔴 SELL: ${stock} - ${holding.shares} shares @ $${price.toFixed(2)} (P/L: $${profit.toFixed(2)})`);
            
            holding.shares = 0;
            holding.avgPrice = 0;
        } else if (holding.shares > 0) {
            addLogEntry('info', `  Holding ${holding.shares} shares (bought @ $${holding.avgPrice.toFixed(2)})`);
        }
    }

    function updateStats() {
        // Calculate total equity
        let holdingsValue = 0;
        config.stocks.forEach(stock => {
            if (holdings[stock].shares > 0 && priceHistory[stock].length > 0) {
                const currentPrice = priceHistory[stock][priceHistory[stock].length - 1].price;
                holdingsValue += holdings[stock].shares * currentPrice;
            }
        });
        
        equity = cash + holdingsValue;
        const pl = equity - startingEquity;
        
        document.getElementById('simEquity').textContent = `$${equity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('simCash').textContent = `$${cash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        const plElement = document.getElementById('simPL');
        plElement.textContent = `${pl >= 0 ? '+' : ''}$${pl.toFixed(2)}`;
        plElement.className = `stat-value ${pl >= 0 ? 'profit' : 'loss'}`;
    }

    function updateHoldings() {
        const container = document.getElementById('holdingsTable');
        
        let html = '<table class="holdings-table"><thead><tr><th>Symbol</th><th>Shares</th><th>Avg Price</th><th>Current</th><th>P/L</th></tr></thead><tbody>';
        
        let hasHoldings = false;
        config.stocks.forEach(stock => {
            const holding = holdings[stock];
            if (holding.shares > 0) {
                hasHoldings = true;
                const currentPrice = priceHistory[stock].length > 0 
                    ? priceHistory[stock][priceHistory[stock].length - 1].price 
                    : holding.avgPrice;
                const pl = (currentPrice - holding.avgPrice) * holding.shares;
                const plClass = pl >= 0 ? 'profit' : 'loss';
                
                html += `<tr>
                    <td><strong>${stock}</strong></td>
                    <td>${holding.shares}</td>
                    <td>$${holding.avgPrice.toFixed(2)}</td>
                    <td>$${currentPrice.toFixed(2)}</td>
                    <td class="${plClass}">${pl >= 0 ? '+' : ''}$${pl.toFixed(2)}</td>
                </tr>`;
            }
        });
        
        if (!hasHoldings) {
            html += '<tr><td colspan="5" style="text-align:center;color:#666;">No current holdings</td></tr>';
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    function initChart() {
        chartCanvas = document.getElementById('priceChart');
        if (!chartCanvas) return;
        
        chartCtx = chartCanvas.getContext('2d');
        
        // Set canvas size
        const container = chartCanvas.parentElement;
        chartCanvas.width = container.offsetWidth - 40;
        chartCanvas.height = 200;
    }

    function updateChart() {
        if (!chartCtx || !chartCanvas) return;
        
        const width = chartCanvas.width;
        const height = chartCanvas.height;
        const padding = 40;
        
        // Clear canvas
        chartCtx.fillStyle = '#1a1a2e';
        chartCtx.fillRect(0, 0, width, height);
        
        // Draw grid
        chartCtx.strokeStyle = '#333';
        chartCtx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height - 2 * padding) * i / 4;
            chartCtx.beginPath();
            chartCtx.moveTo(padding, y);
            chartCtx.lineTo(width - padding, y);
            chartCtx.stroke();
        }
        
        // Colors for different stocks
        const colors = ['#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
        
        // Find min/max across all stocks
        let allPrices = [];
        config.stocks.forEach(stock => {
            if (priceHistory[stock].length > 0) {
                allPrices = allPrices.concat(priceHistory[stock].map(p => p.price));
            }
        });
        
        if (allPrices.length === 0) return;
        
        // Normalize all prices to percentage change
        const drawHeight = height - 2 * padding;
        const drawWidth = width - 2 * padding;
        
        config.stocks.forEach((stock, stockIndex) => {
            const prices = priceHistory[stock];
            if (prices.length < 2) return;
            
            // Normalize to starting price
            const startPrice = prices[0].price;
            const normalizedPrices = prices.map(p => ((p.price / startPrice) - 1) * 100);
            
            // Find range for this session
            const minChange = Math.min(...normalizedPrices, -2);
            const maxChange = Math.max(...normalizedPrices, 2);
            const range = maxChange - minChange || 1;
            
            chartCtx.strokeStyle = colors[stockIndex % colors.length];
            chartCtx.lineWidth = 2;
            chartCtx.beginPath();
            
            normalizedPrices.forEach((change, i) => {
                const x = padding + (i / (normalizedPrices.length - 1)) * drawWidth;
                const y = padding + drawHeight - ((change - minChange) / range) * drawHeight;
                
                if (i === 0) {
                    chartCtx.moveTo(x, y);
                } else {
                    chartCtx.lineTo(x, y);
                }
            });
            
            chartCtx.stroke();
            
            // Draw label
            const lastY = padding + drawHeight - ((normalizedPrices[normalizedPrices.length - 1] - minChange) / range) * drawHeight;
            chartCtx.fillStyle = colors[stockIndex % colors.length];
            chartCtx.font = 'bold 11px sans-serif';
            chartCtx.fillText(stock, width - padding + 5, lastY + 4);
        });
        
        // Draw title
        chartCtx.fillStyle = '#fff';
        chartCtx.font = 'bold 12px sans-serif';
        chartCtx.fillText('Price Performance (% Change)', padding, 20);
    }

    function addLogEntry(type, message) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        tradingLog.appendChild(entry);
        tradingLog.scrollTop = tradingLog.scrollHeight;
    }

    function exportTradingLog() {
        const entries = Array.from(tradingLog.querySelectorAll('.log-entry')).map(e => e.textContent);
        const logContent = `TradeSmart Auto Trade Log
Generated: ${new Date().toLocaleString()}
${'='.repeat(60)}

Configuration:
- Stocks: ${config.stocks.join(', ')}
- Buffer: ${(config.tradingBuffer * 100).toFixed(1)}%
- SMA Window: ${config.smaWindow}
- Max Cash Per Stock: ${(config.maxCashPerStock * 100).toFixed(0)}%

${'='.repeat(60)}
TRADING LOG
${'='.repeat(60)}

${entries.join('\n')}

${'='.repeat(60)}
FINAL SUMMARY
${'='.repeat(60)}
Starting Equity: $${startingEquity.toLocaleString()}
Final Equity: $${equity.toFixed(2)}
Total P/L: $${(equity - startingEquity).toFixed(2)}
Return: ${(((equity / startingEquity) - 1) * 100).toFixed(2)}%
`;
        
        downloadFile(`TradeSmart_Log_${new Date().toISOString().split('T')[0]}.txt`, logContent);
    }
})();