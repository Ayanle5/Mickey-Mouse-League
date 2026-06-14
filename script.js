const playerStats = [
    { name: "Ayanle", appearances: 1, goals: 2, assists: 4, ga: 6, saves: 0 },
    { name: "Enzo", appearances: 0, goals: 0, assists: 0, ga: 0, saves: 0 },
    { name: "Faizaan", appearances: 1, goals: 10, assists: 2, ga: 12, saves: 0 },
    { name: "Filip", appearances: 0, goals: 0, assists: 0, ga: 0, saves: 0 },
    { name: "Jelani", appearances: 1, goals: 4, assists: 2, ga: 6, saves: 0 },
    { name: "Josh", appearances: 1, goals: 10, assists: 1, ga: 11, saves: 0 },
    { name: "Juel", appearances: 1, goals: 0, assists: 4, ga: 4, saves: 5 },
    { name: "Mikel", appearances: 0, goals: 0, assists: 0, ga: 0, saves: 0 },
    { name: "Mo", appearances: 1, goals: 5, assists: 2, ga: 7, saves: 7 },
    { name: "Nahi", appearances: 1, goals: 8, assists: 4, ga: 12, saves: 2 },
    { name: "Saqib", appearances: 1, goals: 0, assists: 3, ga: 3, saves: 12 },
    { name: "Samuel", appearances: 0, goals: 3, assists: "*", ga: "*", saves: 0 },
    { name: "Shafin", appearances: 0, goals: 3, assists: "*", ga: "*", saves: 0 }
];

const players = playerStats.map((player) => player.name);

const matches = [
    {
        date: "2026-06-13",
        teamA: "Team A",
        teamB: "Team B",
        scoreA: 8,
        scoreB: 6,
        winner: "Team A",
        manOfTheMatch: "Ayanle",
        players: {
            Ayanle: { team: "Team A", goals: 3, assists: 2, ownGoals: 0 },
            Josh: { team: "Team A", goals: 2, assists: 1, ownGoals: 0 },
            Mo: { team: "Team A", goals: 1, assists: 2, ownGoals: 0 },
            Enzo: { team: "Team A", goals: 2, assists: 0, ownGoals: 0 },
            Nahi: { team: "Team B", goals: 2, assists: 1, ownGoals: 0 },
            Samuel: { team: "Team B", goals: 1, assists: 2, ownGoals: 0 },
            Jelani: { team: "Team B", goals: 2, assists: 0, ownGoals: 0 },
            Faizaan: { team: "Team B", goals: 1, assists: 0, ownGoals: 1 }
        }
    },
    {
        date: "2026-06-06",
        teamA: "Team Red",
        teamB: "Team White",
        scoreA: 5,
        scoreB: 7,
        winner: "Team White",
        manOfTheMatch: "Jelani",
        players: {
            Ayanle: { team: "Team Red", goals: 1, assists: 1, ownGoals: 0 },
            Nahi: { team: "Team Red", goals: 2, assists: 0, ownGoals: 0 },
            Josh: { team: "Team Red", goals: 1, assists: 2, ownGoals: 0 },
            Filip: { team: "Team Red", goals: 1, assists: 0, ownGoals: 0 },
            Jelani: { team: "Team White", goals: 4, assists: 1, ownGoals: 0 },
            Mo: { team: "Team White", goals: 1, assists: 3, ownGoals: 0 },
            Juel: { team: "Team White", goals: 1, assists: 0, ownGoals: 0 },
            Saqib: { team: "Team White", goals: 1, assists: 1, ownGoals: 0 }
        }
    }
];

const statLabels = {
    goals: "Goals",
    assists: "Assists",
    ga: "G+A",
    saves: "Saves",
    appearances: "Appearances"
};

let activeSort = "goals";

function getNumber(value) {
    return typeof value === "number" ? value : 0;
}

function showStat(value) {
    return value === "*" ? "*" : getNumber(value);
}

function createPlayerStats() {
    return playerStats.map((player) => ({ ...player }));
}

function renderSummaryCards(stats) {
    const cards = [
        { label: "Players", value: stats.length },
        { label: "Top Goals", value: Math.max(...stats.map((player) => getNumber(player.goals))) },
        { label: "Top Assists", value: Math.max(...stats.map((player) => getNumber(player.assists))) },
        { label: "Total Saves", value: stats.reduce((sum, player) => sum + getNumber(player.saves), 0) }
    ];

    document.getElementById("summaryCards").innerHTML = cards.map((card) => `
        <article class="stat-card">
            <span>${card.label}</span>
            <strong>${card.value}</strong>
        </article>
    `).join("");
}

function renderTabs(stats) {
    document.getElementById("statMenu").innerHTML = Object.keys(statLabels).map((key) => {
        const leader = [...stats].sort((a, b) => getNumber(b[key]) - getNumber(a[key]) || getNumber(b.ga) - getNumber(a.ga) || getNumber(b.goals) - getNumber(a.goals))[0];

        return `
            <button class="stat-menu-item ${key === activeSort ? "active" : ""}" data-sort="${key}">
                <span>${statLabels[key]}</span>
                <strong>${leader ? showStat(leader[key]) : 0}</strong>
            </button>
        `;
    }).join("");

    document.querySelectorAll(".stat-menu-item").forEach((button) => {
        button.addEventListener("click", () => {
            activeSort = button.dataset.sort;
            renderApp();
        });
    });
}

function renderFeaturedPlayer(sortedStats) {
    const leader = sortedStats[0];
    const activeLabel = statLabels[activeSort];

    document.getElementById("activeStatTitle").textContent = activeLabel;
    document.getElementById("activeStatCount").textContent = `${sortedStats.length} players`;
    document.getElementById("selectedStatHeader").textContent = activeLabel;

    if (!leader) {
        document.getElementById("featuredPlayer").innerHTML = "";
        return;
    }

    document.getElementById("featuredPlayer").innerHTML = `
        <div class="featured-rank">1</div>
        <div class="featured-details">
            <span>Current leader</span>
            <strong>${leader.name}</strong>
            <p>Leading the ${activeLabel.toLowerCase()} chart</p>
        </div>
        <div class="featured-total">
            <span>${activeLabel}</span>
            <strong>${showStat(leader[activeSort])}</strong>
        </div>
    `;
}

function renderLeaderboard(stats) {
    const activeLabel = statLabels[activeSort];
    const sortedStats = [...stats].sort((a, b) => getNumber(b[activeSort]) - getNumber(a[activeSort]) || getNumber(b.ga) - getNumber(a.ga) || getNumber(b.goals) - getNumber(a.goals));

    renderFeaturedPlayer(sortedStats);

    document.getElementById("leaderboardBody").innerHTML = sortedStats.map((player, index) => `
        <tr class="${index < 3 ? "top-rank" : ""}">
            <td data-label="Rank"><span class="rank-badge">${index + 1}</span></td>
            <td data-label="Player" class="player-name"><span>${player.name}</span></td>
            <td data-label="${activeLabel}" class="selected-stat-cell">
                <strong>${showStat(player[activeSort])}</strong>
                <small>${activeLabel}</small>
            </td>
        </tr>
    `).join("");
}

function createLineup(match, teamName) {
    return Object.entries(match.players)
        .filter(([, stats]) => stats.team === teamName)
        .map(([name, stats]) => `
            <div class="lineup-player">
                <strong>${name}</strong>
                <div class="lineup-stats">
                    <span>${stats.goals || 0} G</span>
                    <span>${stats.assists || 0} A</span>
                    <span>${(stats.goals || 0) + (stats.assists || 0)} G+A</span>
                    <span>${stats.saves || 0} Saves</span>
                </div>
            </div>
        `).join("");
}

function renderMatches() {
    document.getElementById("matchList").innerHTML = matches.map((match) => `
        <article class="match-card">
            <div class="match-top">
                <span class="date">${formatDate(match.date)}</span>
                <span class="badge">MOTM: ${match.manOfTheMatch}</span>
            </div>

            <div class="match-scoreboard">
                <div>
                    <span>${match.teamA}</span>
                    <strong>${match.scoreA}</strong>
                </div>
                <span class="versus">VS</span>
                <div>
                    <span>${match.teamB}</span>
                    <strong>${match.scoreB}</strong>
                </div>
            </div>

            <div class="lineups">
                <section class="lineup-card">
                    <h3>${match.teamA} Lineup</h3>
                    ${createLineup(match, match.teamA)}
                </section>

                <section class="lineup-card">
                    <h3>${match.teamB} Lineup</h3>
                    ${createLineup(match, match.teamB)}
                </section>
            </div>
        </article>
    `).join("");
}

function renderMotm() {
    document.getElementById("motmList").innerHTML = matches.map((match) => `
        <article class="motm-card">
            <strong>${match.manOfTheMatch}</strong>
            <span>${formatDate(match.date)}</span>
            <p>${match.teamA} ${match.scoreA}-${match.scoreB} ${match.teamB}</p>
        </article>
    `).join("");
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function renderApp() {
    const stats = createPlayerStats();

    renderSummaryCards(stats);
    renderTabs(stats);
    renderLeaderboard(stats);
    renderMatches();
    renderMotm();
}

renderApp();
