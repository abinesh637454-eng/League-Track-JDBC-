/* =========================================================
   LEAGUETRACK
========================================================= */


/* =========================================================
   API
========================================================= */

const API_ENDPOINTS = {

    teams:
        "/api/teams",

    fixtures:
        "/api/fixtures",

    generateFixtures:
        "/api/fixtures/generate",

    clearFixtures:
        "/api/fixtures/clear",

    matches:
        "/api/matches",

    standings:
        "/api/standings"

};


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {

    auth:
        "leaguetrack_auth",

    roundDetailsPrefix:
        "leaguetrack_round_details_"

};


/* =========================================================
   STATE
========================================================= */

const state = {

    teams: [],

    fixtures: [],

    matches: [],

    standings: [],

    matchFilter:
        "all",

    currentMatch:
        null,

    currentRoundData:
        []

};


/* =========================================================
   DOM
========================================================= */

const $ = (id) =>
    document.getElementById(id);

const $$ = (selector) =>
    document.querySelectorAll(selector);


/* =========================================================
   ELEMENTS
========================================================= */

const loginPage =
    $("loginPage");

const appShell =
    $("appShell");

const loginForm =
    $("loginForm");

const logoutButton =
    $("logoutButton");

const pageTitle =
    $("pageTitle");

const refreshButton =
    $("refreshButton");

const mobileMenuButton =
    $("mobileMenuButton");

const sidebar =
    $("sidebar");

const teamModal =
    $("teamModal");

const teamForm =
    $("teamForm");

const teamIdInput =
    $("teamId");

const teamNameInput =
    $("teamName");

const teamModalTitle =
    $("teamModalTitle");

const resultModal =
    $("resultModal");

const roundsEditor =
    $("roundsEditor");

const roundCountSelect =
    $("roundCount");

const pointsPerRoundSelect =
    $("pointsPerRound");

const saveResultButton =
    $("saveResultButton");


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupButtons();

        setupMatchFilters();

        setupModals();

        setupResultScorer();

        restoreSession();

    }
);


/* =========================================================
   SESSION
========================================================= */

function restoreSession() {

    const loggedIn =
        localStorage.getItem(
            STORAGE_KEYS.auth
        ) === "true";


    if (loggedIn) {

        showApp();

    } else {

        showLogin();

    }

}


function showLogin() {

    loginPage.classList.remove(
        "hidden"
    );

    appShell.classList.add(
        "hidden"
    );

}


function showApp() {

    loginPage.classList.add(
        "hidden"
    );

    appShell.classList.remove(
        "hidden"
    );

    navigateTo(
        "dashboardPage"
    );

    refreshAllData();

}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        const username =
            $("loginUsername")
                .value
                .trim();


        const password =
            $("loginPassword")
                .value;


        if (
            username === "admin" &&
            password === "leaguetrack"
        ) {

            localStorage.setItem(
                STORAGE_KEYS.auth,
                "true"
            );


            showToast(
                "Login successful.",
                "success"
            );


            showApp();

        } else {

            showToast(
                "Invalid credentials. Use admin / leaguetrack.",
                "error"
            );

        }

    }
);


logoutButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            STORAGE_KEYS.auth
        );


        showToast(
            "Logged out successfully.",
            "success"
        );


        showLogin();

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $$(".nav-item")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        navigateTo(
                            button.dataset.page
                        );


                        sidebar.classList.remove(
                            "mobile-open"
                        );

                    }
                );

            }
        );


    $$("[data-page-target]")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        navigateTo(
                            button.dataset.pageTarget
                        );

                    }
                );

            }
        );

}


function navigateTo(
    pageId
) {

    $$(".page-section")
        .forEach(
            (page) => {

                page.classList.remove(
                    "active-page"
                );

            }
        );


    const target =
        $(pageId);


    if (!target) {
        return;
    }


    target.classList.add(
        "active-page"
    );


    $$(".nav-item")
        .forEach(
            (button) => {

                button.classList.toggle(
                    "active",
                    button.dataset.page === pageId
                );

            }
        );


    const titles = {

        dashboardPage:
            "Dashboard",

        teamsPage:
            "Teams",

        fixturesPage:
            "Fixtures",

        matchesPage:
            "Matches",

        standingsPage:
            "Standings",

        aboutPage:
            "About"

    };


    pageTitle.textContent =
        titles[pageId] ||
        "LeagueTrack";

}


/* =========================================================
   MOBILE
========================================================= */

mobileMenuButton.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "mobile-open"
        );

    }
);


/* =========================================================
   BUTTONS
========================================================= */

function setupButtons() {

    $("registerTeamButton")
        .addEventListener(
            "click",
            () =>
                openTeamModal()
        );


    $("generateFixtureButton")
        .addEventListener(
            "click",
            generateFixtures
        );


    $("clearFixtureButton")
        .addEventListener(
            "click",
            clearFixtures
        );


    $("rebuildFixtureButton")
        .addEventListener(
            "click",
            rebuildFixtures
        );


    refreshButton
        .addEventListener(
            "click",
            refreshAllData
        );

}


/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {

                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})

                }

            }
        );


    const text =
        await response.text();


    let data =
        null;


    if (text) {

        try {

            data =
                JSON.parse(text);

        } catch {

            data =
                text;

        }

    }


    if (!response.ok) {

        let message =
            `Request failed (${response.status})`;


        if (
            typeof data ===
            "string" &&
            data.trim()
        ) {

            message =
                data;

        } else if (
            data?.message
        ) {

            message =
                data.message;

        } else if (
            data?.error
        ) {

            message =
                data.error;

        }


        throw new Error(
            message
        );

    }


    return data;

}


/* =========================================================
   REFRESH EVERYTHING
========================================================= */

async function refreshAllData() {

    try {

        await Promise.all(
            [
                loadTeams(),
                loadFixtures(),
                loadMatches(),
                loadStandings()
            ]
        );


        renderDashboard();


        updateFixtureRebuildNotice();

    } catch (error) {

        showToast(
            error.message ||
            "Unable to refresh data.",
            "error"
        );

    }

}


/* =========================================================
   TEAMS
========================================================= */

async function loadTeams() {

    const data =
        await apiRequest(
            API_ENDPOINTS.teams
        );


    state.teams =
        Array.isArray(data)
            ? data
            : (
                data?.teams ||
                data?.content ||
                []
            );


    renderTeams();

    updateTeamCount();

    updateFixtureRebuildNotice();

}


function renderTeams() {

    const tbody =
        $("teamsTableBody");


    if (
        !state.teams.length
    ) {

        tbody.innerHTML =
            emptyTableRow(
                3,
                "No teams registered yet."
            );

        return;

    }


    tbody.innerHTML =
        state.teams
            .map(
                (
                    team,
                    index
                ) => {

                    /*
                     * REAL DATABASE ID
                     * Used only internally for Edit/Delete.
                     */

                    const id =
                        team.id ??
                        team.teamId ??
                        "—";


                    const name =
                        team.name ??
                        team.teamName ??
                        "Unnamed Team";


                    /*
                     * DISPLAY NUMBER
                     * Starts from 1 regardless of
                     * the MySQL AUTO_INCREMENT value.
                     */

                    const displayNumber =
                        index + 1;


                    return `
                        <tr>

                            <td class="id-cell">
                                #${escapeHtml(
                        String(
                            displayNumber
                        )
                    )}
                            </td>


                            <td class="team-name-cell">
                                ${escapeHtml(
                        String(name)
                    )}
                            </td>


                            <td>

                                <div class="action-group">

                                    <button
                                        class="table-action"
                                        data-team-action="edit"
                                        data-team-id="${escapeAttribute(id)}"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        class="table-action delete"
                                        data-team-action="delete"
                                        data-team-id="${escapeAttribute(id)}"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");


    tbody
        .querySelectorAll(
            "[data-team-action]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.teamAction;


                        const teamId =
                            button.dataset.teamId;


                        if (
                            action ===
                            "edit"
                        ) {

                            openTeamModal(
                                teamId
                            );

                        }


                        if (
                            action ===
                            "delete"
                        ) {

                            deleteTeam(
                                teamId
                            );

                        }

                    }
                );

            }
        );

}


function updateTeamCount() {

    const count =
        state.teams.length;


    $("teamCountLabel")
        .textContent =
        `${count} ${
            count === 1
                ? "team"
                : "teams"
        }`;

}


/* =========================================================
   TEAM MODAL
========================================================= */

function openTeamModal(
    teamId = null
) {

    teamForm.reset();

    teamIdInput.value =
        teamId || "";


    if (teamId) {

        const team =
            state.teams.find(
                (item) =>
                    String(
                        item.id ??
                        item.teamId
                    ) ===
                    String(teamId)
            );


        if (!team) {

            showToast(
                "Team not found.",
                "error"
            );

            return;

        }


        teamNameInput.value =
            team.name ??
            team.teamName ??
            "";


        teamModalTitle.textContent =
            "Edit Team";

    } else {

        teamModalTitle.textContent =
            "Register Team";

    }


    teamModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () =>
            teamNameInput.focus(),
        40
    );

}


teamForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            teamNameInput
                .value
                .trim();


        const id =
            teamIdInput
                .value
                .trim();


        if (!name) {

            showToast(
                "Enter a team name.",
                "error"
            );

            return;

        }


        try {

            if (id) {

                await apiRequest(
                    `${API_ENDPOINTS.teams}/${encodeURIComponent(id)}`,
                    {
                        method:
                            "PUT",

                        body:
                            JSON.stringify({
                                name
                            })

                    }
                );


                showToast(
                    "Team updated successfully.",
                    "success"
                );

            } else {

                await apiRequest(
                    API_ENDPOINTS.teams,
                    {
                        method:
                            "POST",

                        body:
                            JSON.stringify({
                                name
                            })

                    }
                );


                showToast(
                    "Team registered successfully.",
                    "success"
                );

            }


            closeModal(
                "teamModal"
            );


            await loadTeams();


            await loadStandings();


            renderDashboard();


            updateFixtureRebuildNotice();


        } catch (error) {

            showToast(
                error.message ||
                "Unable to save team.",
                "error"
            );

        }

    }
);


/* =========================================================
   DELETE TEAM
========================================================= */

async function deleteTeam(
    teamId
) {

    const team =
        state.teams.find(
            (item) =>
                String(
                    item.id ??
                    item.teamId
                ) ===
                String(teamId)
        );


    const name =
        team?.name ??
        team?.teamName ??
        "this team";


    if (
        !window.confirm(
            `Delete ${name}?`
        )
    ) {

        return;

    }


    try {

        await apiRequest(
            `${API_ENDPOINTS.teams}/${encodeURIComponent(teamId)}`,
            {
                method:
                    "DELETE"
            }
        );


        showToast(
            "Team deleted successfully.",
            "success"
        );


        await loadTeams();

        await loadStandings();

        renderDashboard();


    } catch (error) {

        showToast(
            error.message ||
            "Unable to delete team.",
            "error"
        );

    }

}


/* =========================================================
   FIXTURES
========================================================= */

async function loadFixtures() {

    const data =
        await apiRequest(
            API_ENDPOINTS.fixtures
        );


    state.fixtures =
        Array.isArray(data)
            ? data
            : (
                data?.fixtures ||
                data?.rounds ||
                data?.content ||
                []
            );


    renderFixtures();

    updateFixtureStatus();

    updateFixtureRebuildNotice();

}


/* =========================================================
   GENERATE
========================================================= */

async function generateFixtures() {

    if (
        state.teams.length < 2
    ) {

        showToast(
            "Register at least 2 teams before generating fixtures.",
            "error"
        );

        navigateTo(
            "teamsPage"
        );

        return;

    }


    if (
        state.fixtures.length
    ) {

        showToast(
            "A fixture already exists. Use Rebuild Fixture after adding new teams.",
            "error"
        );

        return;

    }


    if (
        !window.confirm(
            "Generate the round-robin fixture using the current registered teams?"
        )
    ) {

        return;

    }


    try {

        await apiRequest(
            API_ENDPOINTS.generateFixtures,
            {
                method:
                    "POST"
            }
        );


        showToast(
            "Fixtures generated successfully.",
            "success"
        );


        await Promise.all(
            [
                loadFixtures(),
                loadMatches(),
                loadStandings()
            ]
        );


        renderDashboard();


    } catch (error) {

        showToast(
            error.message ||
            "Unable to generate fixtures.",
            "error"
        );

    }

}


/* =========================================================
   CLEAR
========================================================= */

async function clearFixtures() {

    if (
        !state.fixtures.length &&
        !state.matches.length
    ) {

        showToast(
            "There is no active fixture to clear.",
            "error"
        );

        return;

    }


    if (
        !window.confirm(
            "Clear the current fixture and its generated matches?"
        )
    ) {

        return;

    }


    try {

        await apiRequest(
            API_ENDPOINTS.clearFixtures,
            {
                method:
                    "DELETE"
            }
        );


        clearLocalRoundDetails();


        state.fixtures =
            [];

        state.matches =
            [];


        await Promise.all(
            [
                loadTeams(),
                loadFixtures(),
                loadMatches(),
                loadStandings()
            ]
        );


        renderDashboard();


        updateFixtureStatus();


        showToast(
            "Fixture cleared successfully.",
            "success"
        );


    } catch (error) {

        showToast(
            error.message ||
            "Unable to clear fixture.",
            "error"
        );

    }

}


/* =========================================================
   REBUILD
========================================================= */

async function rebuildFixtures() {

    if (
        state.teams.length < 2
    ) {

        showToast(
            "Register at least 2 teams before rebuilding the fixture.",
            "error"
        );

        navigateTo(
            "teamsPage"
        );

        return;

    }


    const message =
        state.fixtures.length
            ? "This will clear the existing fixture and generate a new fixture using all currently registered teams. Continue?"
            : "Generate a fixture using all currently registered teams?";


    if (
        !window.confirm(
            message
        )
    ) {

        return;

    }


    try {

        /*
         * Clear old fixture first.
         */

        if (
            state.fixtures.length
        ) {

            await apiRequest(
                API_ENDPOINTS.clearFixtures,
                {
                    method:
                        "DELETE"
                }
            );


            clearLocalRoundDetails();

        }


        /*
         * Generate fresh fixture.
         */

        await apiRequest(
            API_ENDPOINTS.generateFixtures,
            {
                method:
                    "POST"
            }
        );


        showToast(
            "Fixture rebuilt successfully.",
            "success"
        );


        await Promise.all(
            [
                loadFixtures(),
                loadMatches(),
                loadStandings()
            ]
        );


        renderDashboard();


        updateFixtureRebuildNotice();


    } catch (error) {

        showToast(
            error.message ||
            "Unable to rebuild fixture.",
            "error"
        );

    }

}


/* =========================================================
   FIXTURE STATUS
========================================================= */

function updateFixtureStatus() {

    const banner =
        $("fixtureStatusBanner");


    if (
        !state.fixtures.length
    ) {

        banner.className =
            "fixture-status-banner empty";


        banner.textContent =
            "No fixture is currently generated. Register your teams and generate a round-robin schedule.";

        return;

    }


    const rounds =
        normalizeFixtureRounds(
            state.fixtures
        );


    const matchCount =
        rounds.reduce(
            (
                total,
                round
            ) =>
                total +
                round.matches.length,
            0
        );


    if (
        fixtureNeedsRebuild()
    ) {

        banner.className =
            "fixture-status-banner warning";


        banner.textContent =
            `Fixture is outdated: ${state.teams.length} teams are registered, but the current schedule was generated for ${getFixtureTeamNames().size} teams. Use "Rebuild Fixture".`;


        return;

    }


    banner.className =
        "fixture-status-banner success";


    banner.textContent =
        `Fixture active: ${rounds.length} round(s) • ${matchCount} match(es) • ${state.teams.length} registered team(s).`;

}


/* =========================================================
   FIXTURE / TEAM SYNC DETECTION
========================================================= */

function updateFixtureRebuildNotice() {

    const notice =
        $("teamFixtureNotice");


    if (
        !notice
    ) {

        return;

    }


    if (
        fixtureNeedsRebuild()
    ) {

        notice.classList.remove(
            "hidden"
        );

    } else {

        notice.classList.add(
            "hidden"
        );

    }

}


function fixtureNeedsRebuild() {

    if (
        !state.fixtures.length
    ) {

        return false;

    }


    const fixtureTeams =
        getFixtureTeamNames();


    return (
        fixtureTeams.size !==
        state.teams.length
    );

}


function getFixtureTeamNames() {

    const rounds =
        normalizeFixtureRounds(
            state.fixtures
        );


    const names =
        new Set();


    rounds.forEach(
        (round) => {

            round.matches.forEach(
                (match) => {

                    names.add(
                        normalizeName(
                            getHomeTeamName(
                                match
                            )
                        )
                    );


                    names.add(
                        normalizeName(
                            getAwayTeamName(
                                match
                            )
                        )
                    );

                }
            );

        }
    );


    names.delete(
        "home team"
    );

    names.delete(
        "away team"
    );


    return names;

}


function normalizeName(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase();

}


/* =========================================================
   NORMALIZE FIXTURE DATA
========================================================= */

function normalizeFixtureRounds(
    fixtures
) {

    if (
        !Array.isArray(fixtures)
    ) {

        return [];

    }


    /*
     * Nested round format
     */

    if (
        fixtures.length &&
        fixtures.every(
            (item) =>
                Array.isArray(
                    item.matches
                )
        )
    ) {

        return fixtures
            .map(
                (
                    round,
                    index
                ) => ({

                    round:
                        round.round ??
                        round.roundNumber ??
                        index + 1,

                    matches:
                        Array.isArray(
                            round.matches
                        )
                            ? round.matches
                            : []

                })
            )

            /*
             * IMPORTANT:
             * Remove empty rounds completely.
             */

            .filter(
                (round) =>
                    round.matches.length > 0
            );

    }


    /*
     * Flat fixture format
     */

    const groups =
        new Map();


    fixtures.forEach(
        (item) => {

            const round =
                item.roundNumber ??
                item.round ??
                item.roundNo ??
                1;


            if (
                !groups.has(round)
            ) {

                groups.set(
                    round,
                    []
                );

            }


            groups
                .get(round)
                .push(item);

        }
    );


    return Array.from(
        groups.entries()
    )

        .sort(
            (
                a,
                b
            ) =>
                Number(a[0]) -
                Number(b[0])
        )

        .map(
            (
                [round, matches]
            ) => ({

                round,

                matches

            })
        )

        /*
         * IMPORTANT:
         * Remove any empty round group.
         */

        .filter(
            (round) =>
                round.matches.length > 0
        );

}


/* =========================================================
   RENDER FIXTURES
========================================================= */

function renderFixtures() {

    const container =
        $("fixturesContainer");


    if (
        !container
    ) {

        return;

    }


    const rounds =
        normalizeFixtureRounds(
            state.fixtures
        );


    if (
        !rounds.length
    ) {

        container.innerHTML = `

            <div class="panel-card">

                <div class="empty-state">

                    <strong>
                        No fixture generated
                    </strong>

                    <p>
                        Generate or rebuild a fixture
                        after registering your teams.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    /*
     * Only non-empty rounds reach this point.
     * Therefore "No matches in this round"
     * will never be rendered.
     */

    container.innerHTML =
        rounds
            .map(
                (
                    round
                ) => {

                    const matches =
                        Array.isArray(
                            round.matches
                        )
                            ? round.matches
                            : [];


                    /*
                     * Safety check:
                     * Never render an empty round.
                     */

                    if (
                        matches.length === 0
                    ) {

                        return "";

                    }


                    return `

                        <article
                            class="fixture-round-card"
                        >

                            <div
                                class="fixture-round-header"
                            >

                                <div
                                    class="fixture-round-title"
                                >

                                    <div
                                        class="round-number"
                                    >
                                        ${escapeHtml(
                        String(
                            round.round
                        )
                    )}
                                    </div>


                                    <div>

                                        <strong>
                                            Round ${
                        escapeHtml(
                            String(
                                round.round
                            )
                        )
                    }
                                        </strong>

                                        <span>
                                            ${
                        matches.length
                    }
                                            ${
                        matches.length === 1
                            ? "match"
                            : "matches"
                    }
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div
                                class="fixture-match-list"
                            >

                                ${
                        matches
                            .map(
                                (
                                    match
                                ) =>
                                    renderFixtureMatch(
                                        match
                                    )
                            )
                            .join("")
                    }

                            </div>

                        </article>
                    `;

                }
            )
            .join("");


    /*
     * Enter Result buttons
     */

    container
        .querySelectorAll(
            "[data-fixture-match]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        openResultModal(
                            button.dataset.fixtureMatch
                        );

                    }
                );

            }
        );

}


function renderFixtureMatch(
    match
) {

    const id =
        match.id ??
        match.matchId;


    const home =
        getHomeTeamName(
            match
        );


    const away =
        getAwayTeamName(
            match
        );


    const completed =
        isMatchCompleted(
            match
        );


    const homeScore =
        getHomeScore(
            match
        );


    const awayScore =
        getAwayScore(
            match
        );


    return `

        <div class="fixture-match">

            <div class="fixture-team">

                ${escapeHtml(home)}

            </div>


            <div class="fixture-score">

                ${
        completed

            ? `${homeScore} : ${awayScore}`

            : "VS"
    }

            </div>


            <div class="fixture-team away">

                ${escapeHtml(away)}

            </div>


            <div class="fixture-action-cell">

                ${
        completed

            ? `
                            <span
                                class="status-pill status-completed"
                            >
                                Completed
                            </span>
                          `

            : `
                            <button
                                class="fixture-match-button"
                                data-fixture-match="${escapeAttribute(id)}"
                            >
                                Enter Result
                            </button>
                          `
    }

            </div>

        </div>

    `;

}


/* =========================================================
   MATCHES
========================================================= */

async function loadMatches() {

    const data =
        await apiRequest(
            API_ENDPOINTS.matches
        );


    state.matches =
        Array.isArray(data)
            ? data
            : (
                data?.matches ||
                data?.content ||
                []
            );


    renderMatches();

}


/* =========================================================
   FILTERS
========================================================= */

function setupMatchFilters() {

    $$(".filter-btn")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        state.matchFilter =
                            button.dataset.matchFilter;


                        $$(".filter-btn")
                            .forEach(
                                (item) =>
                                    item.classList.toggle(
                                        "active",
                                        item === button
                                    )
                            );


                        renderMatches();

                    }
                );

            }
        );

}


/* =========================================================
   MATCH TABLE
========================================================= */

function renderMatches() {

    const tbody =
        $("matchesTableBody");


    if (
        !tbody
    ) {

        return;

    }


    let matches =
        [...state.matches];


    if (
        state.matchFilter ===
        "pending"
    ) {

        matches =
            matches.filter(
                (match) =>
                    !isMatchCompleted(
                        match
                    )
            );

    }


    if (
        state.matchFilter ===
        "completed"
    ) {

        matches =
            matches.filter(
                (match) =>
                    isMatchCompleted(
                        match
                    )
            );

    }


    if (
        !matches.length
    ) {

        tbody.innerHTML =
            emptyTableRow(
                7,
                "No matches found."
            );

        return;

    }


    tbody.innerHTML =
        matches
            .map(
                (match) => {

                    const id =
                        match.id ??
                        match.matchId ??
                        "—";


                    const round =
                        match.roundNumber ??
                        match.round ??
                        match.roundNo ??
                        "—";


                    const home =
                        getHomeTeamName(
                            match
                        );


                    const away =
                        getAwayTeamName(
                            match
                        );


                    const completed =
                        isMatchCompleted(
                            match
                        );


                    const homeScore =
                        getHomeScore(
                            match
                        );


                    const awayScore =
                        getAwayScore(
                            match
                        );


                    return `

                        <tr>

                            <td class="id-cell">
                                #${escapeHtml(
                        String(id)
                    )}
                            </td>


                            <td>
                                Round ${escapeHtml(
                        String(round)
                    )}
                            </td>


                            <td class="team-name-cell">
                                ${escapeHtml(home)}
                            </td>


                            <td class="score-cell">

                                ${
                        completed
                            ? `${homeScore} : ${awayScore}`
                            : "—"
                    }

                            </td>


                            <td class="team-name-cell">
                                ${escapeHtml(away)}
                            </td>


                            <td>

                                <span
                                    class="status-pill ${
                        completed
                            ? "status-completed"
                            : "status-pending"
                    }"
                                >

                                    ${
                        completed
                            ? "Completed"
                            : "Pending"
                    }

                                </span>

                            </td>


                            <td>

                                ${
                        completed

                            ? `
                                            <span
                                                class="status-pill status-completed"
                                            >
                                                Recorded
                                            </span>
                                          `

                            : `
                                            <button
                                                class="table-action"
                                                data-match-result="${escapeAttribute(id)}"
                                            >
                                                Enter Result
                                            </button>
                                          `
                    }

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    tbody
        .querySelectorAll(
            "[data-match-result]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        openResultModal(
                            button.dataset.matchResult
                        );

                    }
                );

            }
        );

}


/* =========================================================
   RESULT SCORER
========================================================= */

function setupResultScorer() {

    roundCountSelect.addEventListener(
        "change",
        rebuildRoundEditor
    );


    pointsPerRoundSelect.addEventListener(
        "change",
        rebuildRoundEditor
    );


    saveResultButton.addEventListener(
        "click",
        saveMatchResult
    );

}


/* =========================================================
   OPEN RESULT MODAL
========================================================= */

function openResultModal(
    matchId
) {

    const match =
        state.matches.find(
            (item) =>
                String(
                    item.id ??
                    item.matchId
                ) ===
                String(matchId)
        );


    if (!match) {

        showToast(
            "Match details could not be loaded. Refresh and try again.",
            "error"
        );

        loadMatches();

        return;

    }


    state.currentMatch =
        match;


    $("resultHomeTeam")
        .textContent =
        getHomeTeamName(
            match
        );


    $("resultAwayTeam")
        .textContent =
        getAwayTeamName(
            match
        );


    roundCountSelect.value =
        "3";


    pointsPerRoundSelect.value =
        "5";


    loadLocalRoundDetails(
        matchId
    );


    resultModal.classList.remove(
        "hidden"
    );


    rebuildRoundEditor();

}


/* =========================================================
   ROUND EDITOR
========================================================= */

function rebuildRoundEditor() {

    if (
        !state.currentMatch
    ) {

        return;

    }


    const roundCount =
        Number(
            roundCountSelect.value
        );


    const pointsPerRound =
        Number(
            pointsPerRoundSelect.value
        );


    const oldData =
        state.currentRoundData ||
        [];


    state.currentRoundData =
        Array.from(
            {
                length:
                roundCount
            },
            (_, roundIndex) => {

                const oldRound =
                    oldData[
                        roundIndex
                        ];


                const winners =
                    Array.from(
                        {
                            length:
                            pointsPerRound
                        },
                        (_, pointIndex) =>
                            oldRound
                                ?.winners
                                ?.[pointIndex] ||
                            null
                    );


                return {

                    round:
                        roundIndex + 1,

                    winners

                };

            }
        );


    roundsEditor.innerHTML =
        state.currentRoundData
            .map(
                (
                    round,
                    roundIndex
                ) => {

                    const homeScore =
                        round.winners
                            .filter(
                                (
                                    winner
                                ) =>
                                    winner ===
                                    "home"
                            )
                            .length;


                    const awayScore =
                        round.winners
                            .filter(
                                (
                                    winner
                                ) =>
                                    winner ===
                                    "away"
                            )
                            .length;


                    const roundWinner =
                        getRoundWinnerText(
                            homeScore,
                            awayScore
                        );


                    return `

                        <div
                            class="round-editor-card"
                        >


                            <div
                                class="round-editor-header"
                            >

                                <strong>
                                    Round ${
                        roundIndex + 1
                    }
                                </strong>


                                <span
                                    class="round-score"
                                    id="roundScore-${roundIndex}"
                                >

                                    ${
                        homeScore
                    }
                                    :
                                    ${
                        awayScore
                    }

                                    ${
                        roundWinner
                            ? ` · ${roundWinner}`
                            : ""
                    }

                                </span>

                            </div>


                            <div
                                class="point-list"
                            >

                                ${
                        round.winners
                            .map(
                                (
                                    winner,
                                    pointIndex
                                ) => `

                                                <div
                                                    class="point-row"
                                                >

                                                    <span
                                                        class="point-number"
                                                    >
                                                        Point ${
                                    pointIndex + 1
                                }
                                                    </span>


                                                    <button
                                                        type="button"
                                                        class="point-choice ${
                                    winner === "home"
                                        ? "selected-home"
                                        : ""
                                }"
                                                        data-round-index="${roundIndex}"
                                                        data-point-index="${pointIndex}"
                                                        data-point-winner="home"
                                                    >

                                                        ${escapeHtml(
                                    getHomeTeamName(
                                        state.currentMatch
                                    )
                                )}

                                                    </button>


                                                    <button
                                                        type="button"
                                                        class="point-choice ${
                                    winner === "away"
                                        ? "selected-away"
                                        : ""
                                }"
                                                        data-round-index="${roundIndex}"
                                                        data-point-index="${pointIndex}"
                                                        data-point-winner="away"
                                                    >

                                                        ${escapeHtml(
                                    getAwayTeamName(
                                        state.currentMatch
                                    )
                                )}

                                                    </button>

                                                </div>
                                            `
                            )
                            .join("")
                    }

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    roundsEditor
        .querySelectorAll(
            "[data-point-winner]"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const roundIndex =
                            Number(
                                button.dataset.roundIndex
                            );


                        const pointIndex =
                            Number(
                                button.dataset.pointIndex
                            );


                        const winner =
                            button.dataset.pointWinner;


                        state.currentRoundData[
                            roundIndex
                            ]
                            .winners[
                            pointIndex
                            ] =
                            winner;


                        saveLocalRoundDetails(
                            state.currentMatch.id ??
                            state.currentMatch.matchId,
                            state.currentRoundData
                        );


                        rebuildRoundEditor();

                    }
                );

            }
        );


    updateTotalScorePreview();

}


/* =========================================================
   ROUND WINNER
========================================================= */

function getRoundWinnerText(
    homeScore,
    awayScore
) {

    if (
        homeScore === 0 &&
        awayScore === 0
    ) {

        return "";

    }


    if (
        homeScore === awayScore
    ) {

        return "Draw";

    }


    if (
        homeScore >
        awayScore
    ) {

        return "Home wins";

    }


    return "Away wins";

}


/* =========================================================
   SCORE PREVIEW
========================================================= */

function updateTotalScorePreview() {

    const totals =
        calculateTotalScores();


    $("resultHomeScore")
        .textContent =
        totals.home;


    $("resultAwayScore")
        .textContent =
        totals.away;


    $("finalScoreText")
        .textContent =
        `${totals.home} : ${totals.away}`;


    const validation =
        $("resultValidationMessage");


    const unfinished =
        state.currentRoundData
            .some(
                (round) =>
                    round.winners
                        .some(
                            (winner) =>
                                !winner
                        )
            );


    if (unfinished) {

        validation.className =
            "validation-message error";


        validation.textContent =
            "Assign every point to either team.";

    } else {

        validation.className =
            "validation-message";


        validation.textContent =
            "All points entered. The final score is ready to record.";

    }

}


/* =========================================================
   CALCULATE SCORE
========================================================= */

function calculateTotalScores() {

    let home =
        0;


    let away =
        0;


    state.currentRoundData
        .forEach(
            (round) => {

                round.winners
                    .forEach(
                        (winner) => {

                            if (
                                winner ===
                                "home"
                            ) {

                                home++;

                            }


                            if (
                                winner ===
                                "away"
                            ) {

                                away++;

                            }

                        }
                    );

            }
        );


    return {

        home,

        away

    };

}


/* =========================================================
   SAVE RESULT
========================================================= */

async function saveMatchResult() {

    if (
        !state.currentMatch
    ) {

        return;

    }


    const unfinished =
        state.currentRoundData
            .some(
                (round) =>
                    round.winners
                        .some(
                            (winner) =>
                                !winner
                        )
            );


    if (
        unfinished
    ) {

        showToast(
            "Assign every point before recording the result.",
            "error"
        );

        return;

    }


    const totals =
        calculateTotalScores();


    const matchId =
        state.currentMatch.id ??
        state.currentMatch.matchId;


    try {

        /*
         * Preserve detailed point results
         * locally for this browser.
         */

        saveLocalRoundDetails(
            matchId,
            state.currentRoundData
        );


        /*
         * Backend receives final score.
         */

        await apiRequest(
            `${API_ENDPOINTS.matches}/${encodeURIComponent(matchId)}/result`,
            {
                method:
                    "PUT",

                body:
                    JSON.stringify({

                        homeScore:
                        totals.home,

                        awayScore:
                        totals.away

                    })

            }
        );


        showToast(
            `Result recorded: ${totals.home} : ${totals.away}`,
            "success"
        );


        closeModal(
            "resultModal"
        );


        /*
         * Refresh all affected pages immediately.
         */

        await Promise.all(
            [
                loadMatches(),
                loadFixtures(),
                loadStandings()
            ]
        );


        renderDashboard();


        updateFixtureStatus();


        updateFixtureRebuildNotice();


    } catch (error) {

        showToast(
            error.message ||
            "Unable to record match result.",
            "error"
        );

    }

}


/* =========================================================
   LOCAL ROUND DETAILS
========================================================= */

function roundStorageKey(
    matchId
) {

    return (
        STORAGE_KEYS.roundDetailsPrefix +
        String(matchId)
    );

}


function saveLocalRoundDetails(
    matchId,
    data
) {

    localStorage.setItem(
        roundStorageKey(
            matchId
        ),

        JSON.stringify(
            data
        )
    );

}


function loadLocalRoundDetails(
    matchId
) {

    const raw =
        localStorage.getItem(
            roundStorageKey(
                matchId
            )
        );


    if (
        !raw
    ) {

        state.currentRoundData =
            [];

        return;

    }


    try {

        const parsed =
            JSON.parse(
                raw
            );


        state.currentRoundData =
            Array.isArray(parsed)
                ? parsed
                : [];

    } catch {

        state.currentRoundData =
            [];

    }

}


function clearLocalRoundDetails() {

    Object.keys(
        localStorage
    )
        .filter(
            (key) =>
                key.startsWith(
                    STORAGE_KEYS.roundDetailsPrefix
                )
        )
        .forEach(
            (key) =>
                localStorage.removeItem(
                    key
                )
        );

}


/* =========================================================
   STANDINGS
========================================================= */

async function loadStandings() {

    const data =
        await apiRequest(
            API_ENDPOINTS.standings
        );


    state.standings =
        Array.isArray(data)
            ? data
            : (
                data?.standings ||
                data?.content ||
                []
            );


    renderStandings();

}


function renderStandings() {

    const tbody =
        $("standingsTableBody");


    if (
        !tbody
    ) {

        return;

    }


    if (
        !state.standings.length
    ) {

        tbody.innerHTML =
            emptyTableRow(
                7,
                "No standings available yet."
            );

        return;

    }


    tbody.innerHTML =
        state.standings
            .map(
                (
                    row,
                    index
                ) => {

                    const teamName =
                        row.teamName ??
                        row.name ??
                        row.team?.name ??
                        "Unnamed Team";


                    const played =
                        row.played ??
                        row.matchesPlayed ??
                        row.p ??
                        0;


                    const won =
                        row.wins ??
                        row.won ??
                        row.w ??
                        0;


                    const drawn =
                        row.draws ??
                        row.drawn ??
                        row.d ??
                        0;


                    const lost =
                        row.losses ??
                        row.lost ??
                        row.l ??
                        0;


                    const points =
                        row.points ??
                        row.pts ??
                        0;


                    const rank =
                        index + 1;


                    /*
                     * CSS classes for Top 3.
                     */

                    let rankClass =
                        "";


                    if (
                        rank === 1
                    ) {

                        rankClass =
                            "rank-1";

                    } else if (
                        rank === 2
                    ) {

                        rankClass =
                            "rank-2";

                    } else if (
                        rank === 3
                    ) {

                        rankClass =
                            "rank-3";

                    }


                    /*
                     * Medal display.
                     */

                    const positionDisplay =
                        rank === 1
                            ? "🥇 1"
                            : rank === 2
                                ? "🥈 2"
                                : rank === 3
                                    ? "🥉 3"
                                    : rank;


                    return `

                        <tr
                            class="standings-row ${rankClass}"
                        >

                            <td>
                                ${positionDisplay}
                            </td>


                            <td class="team-name-cell">
                                ${escapeHtml(
                        String(
                            teamName
                        )
                    )}
                            </td>


                            <td>
                                ${escapeHtml(
                        String(
                            played
                        )
                    )}
                            </td>


                            <td>
                                ${escapeHtml(
                        String(
                            won
                        )
                    )}
                            </td>


                            <td>
                                ${escapeHtml(
                        String(
                            drawn
                        )
                    )}
                            </td>


                            <td>
                                ${escapeHtml(
                        String(
                            lost
                        )
                    )}
                            </td>


                            <td class="score-cell">
                                ${escapeHtml(
                        String(
                            points
                        )
                    )}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    $("totalTeamsStat")
        .textContent =
        state.teams.length;


    $("totalMatchesStat")
        .textContent =
        state.matches.length;


    $("completedMatchesStat")
        .textContent =
        state.matches
            .filter(
                (match) =>
                    isMatchCompleted(
                        match
                    )
            )
            .length;


    $("totalRoundsStat")
        .textContent =
        normalizeFixtureRounds(
            state.fixtures
        ).length;


    renderRecentMatches();

    renderDashboardStandings();

}


function renderRecentMatches() {

    const tbody =
        $("dashboardRecentMatches");


    const recent =
        [...state.matches]
            .reverse()
            .slice(
                0,
                5
            );


    if (
        !recent.length
    ) {

        tbody.innerHTML =
            emptyTableRow(
                3,
                "No matches available."
            );

        return;

    }


    tbody.innerHTML =
        recent
            .map(
                (match) => {

                    const completed =
                        isMatchCompleted(
                            match
                        );


                    return `

                        <tr>

                            <td>

                                ${escapeHtml(
                        getHomeTeamName(
                            match
                        )
                    )}

                                <span
                                    style="color:#756f63;"
                                >
                                    vs
                                </span>

                                ${escapeHtml(
                        getAwayTeamName(
                            match
                        )
                    )}

                            </td>


                            <td class="score-cell">

                                ${
                        completed
                            ? `${getHomeScore(match)} : ${getAwayScore(match)}`
                            : "—"
                    }

                            </td>


                            <td>

                                <span
                                    class="status-pill ${
                        completed
                            ? "status-completed"
                            : "status-pending"
                    }"
                                >

                                    ${
                        completed
                            ? "Completed"
                            : "Pending"
                    }

                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


function renderDashboardStandings() {

    const tbody =
        $("dashboardStandings");


    const rows =
        state.standings
            .slice(
                0,
                5
            );


    if (
        !rows.length
    ) {

        tbody.innerHTML =
            emptyTableRow(
                3,
                "No standings available."
            );

        return;

    }


    tbody.innerHTML =
        rows
            .map(
                (
                    row,
                    index
                ) => {

                    const name =
                        row.teamName ??
                        row.name ??
                        row.team?.name ??
                        "Unnamed";


                    const points =
                        row.points ??
                        row.pts ??
                        0;


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>


                            <td class="team-name-cell">
                                ${escapeHtml(
                        String(name)
                    )}
                            </td>


                            <td class="score-cell">
                                ${escapeHtml(
                        String(points)
                    )}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   MATCH HELPERS
========================================================= */

function getHomeTeamName(
    match
) {

    return (
        match?.homeTeam?.name ??
        match?.homeTeamName ??
        match?.teamA?.name ??
        match?.teamAName ??
        match?.home ??
        "Home Team"
    );

}


function getAwayTeamName(
    match
) {

    return (
        match?.awayTeam?.name ??
        match?.awayTeamName ??
        match?.teamB?.name ??
        match?.teamBName ??
        match?.away ??
        "Away Team"
    );

}


function getHomeScore(
    match
) {

    return (
        match?.homeScore ??
        match?.teamAScore ??
        match?.scoreA ??
        match?.homePoints ??
        0
    );

}


function getAwayScore(
    match
) {

    return (
        match?.awayScore ??
        match?.teamBScore ??
        match?.scoreB ??
        match?.awayPoints ??
        0
    );

}


function isMatchCompleted(
    match
) {

    if (
        String(
            match?.status ??
            ""
        ).toUpperCase() ===
        "COMPLETED"
    ) {

        return true;

    }


    return (
        match?.resultRecorded === true ||
        match?.completed === true ||
        match?.hasResult === true ||
        (
            match?.homeScore != null &&
            match?.awayScore != null
        )
    );

}


/* =========================================================
   MODALS
========================================================= */

function setupModals() {

    $$("[data-close-modal]")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        closeModal(
                            button.dataset.closeModal
                        );

                    }
                );

            }
        );


    [
        teamModal,
        resultModal
    ]
        .forEach(
            (modal) => {

                if (!modal) {
                    return;
                }


                modal.addEventListener(
                    "click",
                    (event) => {

                        if (
                            event.target ===
                            modal
                        ) {

                            modal.classList.add(
                                "hidden"
                            );

                        }

                    }
                );

            }
        );

}


function closeModal(
    modalId
) {

    const modal =
        $(modalId);


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const container =
        $("toastContainer");


    if (!container) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast ${type}`;


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        4000
    );

}


/* =========================================================
   TABLE
========================================================= */

function emptyTableRow(
    colspan,
    message
) {

    return `

        <tr>

            <td
                colspan="${colspan}"
                style="text-align:center;"
            >

                <div class="empty-state">

                    <strong>
                        ${escapeHtml(
        message
    )}
                    </strong>

                </div>

            </td>

        </tr>

    `;

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHtml(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}