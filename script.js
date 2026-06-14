const players = [
    "Ayanle",
    "Nahi",
    "Josh",
    "Samuel",
    "Jelani",
    "Mo",
    "Enzo",
    "Faizaan",
    "Filip",
    "Juel",
    "Saqib"
];

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
    ownGoals: "Own Goals",
    wins: "Wins",
    losses: "Losses"
};

let activeSort = "ga";

function createPlayerStats() {
    const stats = players.map((name) => ({
        name,
        goals: 0,
        assists: 0,
        ga: 0,
        ownGoals: 0,
        wins: 0,
        losses: 0
    }));

    matches.forEach((match) => {
        stats.forEach((player) => {
            const data = match.players[player.name];

            if (!data) return;

            player.goals += data.goals || 0;
            player.assists += data.assists || 0;
            player.ownGoals += data.ownGoals || 0;

            if (data.team === match.winner) {
                player.wins += 1;
            } else {
                player.losses += 1;
            }
        });
    });

    stats.forEach((player) => {
        player.ga = player.goals + player.assists;
    });

    return stats;
}

function renderSummaryCards(stats) {
    const cards = [
        { label: "Players", value: players.length },
        { label: "Matches", value: matches.length },
        { label: "Total Goals", value: stats.reduce((sum, player) => sum + player.goals, 0) },
        { label: "Own Goals", value: stats.reduce((sum, player) => sum + player.ownGoals, 0) }
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
        const leader = [...stats].sort((a, b) => b[key] - a[key] || b.ga - a.ga || b.goals - a.goals)[0];

        return `
            <button class="stat-menu-item ${key === activeSort ? "active" : ""}" data-sort="${key}">
                <span>${statLabels[key]}</span>
                <strong>${leader ? leader[key] : 0}</strong>
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

    document.getElementById("activeStatTitle").textContent = statLabels[activeSort];
    document.getElementById("activeStatCount").textContent = `${sortedStats.length} players`;

    if (!leader) {
        document.getElementById("featuredPlayer").innerHTML = "";
        return;
    }

    document.getElementById("featuredPlayer").innerHTML = `
        <div class="featured-rank">1</div>
        <div class="featured-details">
            <span>Current leader</span>
            <strong>${leader.name}</strong>
            <p>${leader.goals} goals · ${leader.assists} assists · ${leader.ga} G+A</p>
        </div>
        <div class="featured-total">
            <span>${statLabels[activeSort]}</span>
            <strong>${leader[activeSort]}</strong>
        </div>
    `;
}

function renderLeaderboard(stats) {
    const sortedStats = [...stats].sort((a, b) => b[activeSort] - a[activeSort] || b.ga - a.ga || b.goals - a.goals);

    renderFeaturedPlayer(sortedStats);

    document.getElementById("leaderboardBody").innerHTML = sortedStats.map((player, index) => `
        <tr class="${index < 3 ? "top-rank" : ""}">
            <td data-label="Rank"><span class="rank-badge">${index + 1}</span></td>
            <td data-label="Player" class="player-name"><span>${player.name}</span></td>
            <td data-label="Goals">${player.goals}</td>
            <td data-label="Assists">${player.assists}</td>
            <td data-label="G+A"><strong>${player.ga}</strong></td>
            <td data-label="Own Goals">${player.ownGoals}</td>
            <td data-label="Wins">${player.wins}</td>
            <td data-label="Losses">${player.losses}</td>
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
                    <span>${stats.ownGoals || 0} OG</span>
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
