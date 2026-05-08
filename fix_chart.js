const fs = require('fs');
const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace interstitial ad with iklan.png banner
content = content.replace(
    /<div class="ad-slot ad-rect"[^>]*><iframe sandbox="[^"]*" src="\.\/ad-rect\.html"[^>]*><\/iframe><\/div>/,
    `<div style="margin-bottom:20px; border-radius:8px; overflow:hidden; border:1px solid var(--border);"><a href="https://omg10.com/4/10970240" target="_blank"><img src="./iklan.png" style="width:100%; height:auto; display:block; object-fit:cover;" alt="Sponsor"></a></div>`
);

// 2. Remove popunder window.open in showInterstitial
content = content.replace(
    /window\.open\('https:\/\/omg10\.com\/4\/10970240', '_blank', 'noopener,noreferrer'\);/,
    `// Direct redirect removed as per request`
);

// 3. Inject chartDataSets and chart initialization
const chartScript = `
        // --- CHART DATA ---
        window.chartDataSets = {
            bbu: {
                title: "Kurva Berat Badan per Umur (BB/U)",
                btnText: "Ganti Grafik TB/U",
                labelY: "Berat Badan (kg)",
                data: [
                    { label: '+3 SD', data: Array.from({length:61}, (_, i) => 3.3 + (i*0.25)), borderColor: '#000', borderDash: [5, 5], fill: false, pointRadius: 0 },
                    { label: '+2 SD', data: Array.from({length:61}, (_, i) => 3.3 + (i*0.2)), borderColor: '#F9A825', fill: false, pointRadius: 0 },
                    { label: 'Median', data: Array.from({length:61}, (_, i) => 3.3 + (i*0.15)), borderColor: '#3BAD8A', fill: false, pointRadius: 0 },
                    { label: '-2 SD', data: Array.from({length:61}, (_, i) => 3.3 + (i*0.1)), borderColor: '#F9A825', fill: false, pointRadius: 0 },
                    { label: '-3 SD', data: Array.from({length:61}, (_, i) => 3.3 + (i*0.05)), borderColor: '#E53935', fill: false, pointRadius: 0 },
                    { label: 'Anak Anda', data: [], borderColor: '#3b5998', backgroundColor: '#3b5998', fill: false, pointRadius: 5 }
                ]
            },
            tbu: {
                title: "Kurva Tinggi Badan per Umur (TB/U)",
                btnText: "Ganti Grafik BB/U",
                labelY: "Tinggi Badan (cm)",
                data: [
                    { label: '+3 SD', data: Array.from({length:61}, (_, i) => 50 + (i*1.1)), borderColor: '#000', borderDash: [5, 5], fill: false, pointRadius: 0 },
                    { label: '+2 SD', data: Array.from({length:61}, (_, i) => 50 + (i*0.9)), borderColor: '#F9A825', fill: false, pointRadius: 0 },
                    { label: 'Median', data: Array.from({length:61}, (_, i) => 50 + (i*0.8)), borderColor: '#3BAD8A', fill: false, pointRadius: 0 },
                    { label: '-2 SD', data: Array.from({length:61}, (_, i) => 50 + (i*0.7)), borderColor: '#F9A825', fill: false, pointRadius: 0 },
                    { label: '-3 SD', data: Array.from({length:61}, (_, i) => 50 + (i*0.6)), borderColor: '#E53935', fill: false, pointRadius: 0 },
                    { label: 'Anak Anda', data: [], borderColor: '#3b5998', backgroundColor: '#3b5998', fill: false, pointRadius: 5 }
                ]
            }
        };
        window.currentChartMode = 'bbu';

        function initChart() {
            const ctx = document.getElementById('growthChart');
            if (ctx && !window.myGrowthChart) {
                window.myGrowthChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array.from({length:61}, (_, i) => i),
                        datasets: window.chartDataSets.bbu.data
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: { title: { display: true, text: 'Usia (Bulan)' } },
                            y: { title: { display: true, text: 'Berat Badan (kg)' } }
                        }
                    }
                });
            }
        }
`;

// Insert chartScript before `const routes = {`
content = content.replace(/const routes = \{/, chartScript + '\n        const routes = {');

// Inject initChart() inside renderGrafikPertumbuhan
content = content.replace(
    /<\/div>\s*`;\s*}/,
    `</div>
            \`;
            setTimeout(initChart, 100);
        }`
);

fs.writeFileSync(file, content);
console.log('Fixes applied.');
