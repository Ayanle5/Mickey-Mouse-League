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

function renderTabs() {
    document.getElementById("tabs").innerHTML = Object.keys(statLabels).map((key) => `
        <button class="tab ${key === activeSort ? "active" : ""}" data-sort="${key}">${statLabels[key]}</button>
    `).join("");

    document.querySelectorAll(".tab").forEach((button) => {
        button.addEventListener("click", () => {
            activeSort = button.dataset.sort;
            renderApp();
        });
    });
}

function renderLeaderboard(stats) {
    const sortedStats = [...stats].sort((a, b) => b[activeSort] - a[activeSort] || b.ga - a.ga || b.goals - a.goals);

    document.getElementById("leaderboardBody").innerHTML = sortedStats.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td class="player-name">${player.name}</td>
            <td>${player.goals}</td>
            <td>${player.assists}</td>
            <td>${player.ga}</td>
            <td>${player.ownGoals}</td>
            <td>${player.wins}</td>
            <td>${player.losses}</td>
        </tr>
    `).join("");
}

function renderMatches() {
    document.getElementById("matchList").innerHTML = matches.map((match) => {
        const performances = Object.entries(match.players).map(([name, stats]) => `
            <div class="performance">
                <strong>${name}</strong>: ${stats.goals || 0} goals, ${stats.assists || 0} assists, ${stats.ownGoals || 0} own goals
            </div>
        `).join("");

        return `
            <article class="match-card">
                <div class="match-top">
                    <span class="date">${formatDate(match.date)}</span>
                    <span class="badge">MOTM: ${match.manOfTheMatch}</span>
                </div>
                <div class="team-line">${match.teamA} vs ${match.teamB}</div>
                <div class="score">${match.scoreA} - ${match.scoreB}</div>
                <div class="performance-list">${performances}</div>
            </article>
        `;
    }).join("");
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
    renderTabs();
    renderLeaderboard(stats);
    renderMatches();
    renderMotm();
}

renderApp();
