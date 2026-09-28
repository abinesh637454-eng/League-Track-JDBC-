package Project.LeagueTrack.service;

import Project.LeagueTrack.exception.InsufficientTeamsException;
import Project.LeagueTrack.exception.FixtureAlreadyGeneratedException;
import Project.LeagueTrack.dto.FixtureResponse;
import Project.LeagueTrack.dto.MatchResponse;
import Project.LeagueTrack.entity.Fixture;
import Project.LeagueTrack.entity.Match;
import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.repository.FixtureRepository;
import Project.LeagueTrack.repository.MatchRepository;
import Project.LeagueTrack.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FixtureService {

    private final TeamRepository teamRepository;
    private final FixtureRepository fixtureRepository;
    private final MatchRepository matchRepository;

    public FixtureService(
            TeamRepository teamRepository,
            FixtureRepository fixtureRepository,
            MatchRepository matchRepository) {

        this.teamRepository = teamRepository;
        this.fixtureRepository = fixtureRepository;
        this.matchRepository = matchRepository;
    }

    @Transactional
    public List<Match> generateRoundRobinFixture() {

        List<Team> teams = new ArrayList<>(teamRepository.findAll());

        if (matchRepository.count() > 0) {
            throw new FixtureAlreadyGeneratedException(
                    "Fixture has already been generated"
            );
        }

        if (teams.size() < 2) {
            throw new InsufficientTeamsException(
                    "At least 2 teams are required to generate a fixture"
            );
        }

        if (teams.size() % 2 != 0) {
            teams.add(null);
        }

        int totalRounds = teams.size() - 1;
        int matchesPerRound = teams.size() / 2;

        List<Match> generatedMatches = new ArrayList<>();

        for (int roundNumber = 1; roundNumber <= totalRounds; roundNumber++) {

            Fixture fixture = new Fixture(roundNumber);
            Fixture savedFixture = fixtureRepository.save(fixture);

            List<Match> roundMatches = new ArrayList<>();

            for (int i = 0; i < matchesPerRound; i++) {

                Team team1 = teams.get(i);
                Team team2 = teams.get(teams.size() - 1 - i);

                if (team1 == null || team2 == null) {
                    continue;
                }

                Match match = new Match(
                        savedFixture,
                        team1,
                        team2
                );

                roundMatches.add(match);
            }

            matchRepository.saveAll(roundMatches);
            generatedMatches.addAll(roundMatches);

            Team lastTeam = teams.remove(teams.size() - 1);
            teams.add(1, lastTeam);
        }

        return generatedMatches;
    }

    @Transactional(readOnly = true)
    public List<FixtureResponse> getAllFixtures() {

        return fixtureRepository.findAll()
                .stream()
                .map(fixture -> {

                    List<MatchResponse> matches =
                            matchRepository.findByFixtureId(fixture.getId())
                                    .stream()
                                    .map(match -> new MatchResponse(
                                            match.getId(),
                                            fixture.getId(),
                                            fixture.getRoundNumber(),

                                            match.getHomeTeam().getId(),
                                            match.getHomeTeam().getName(),

                                            match.getAwayTeam().getId(),
                                            match.getAwayTeam().getName(),

                                            match.getHomeScore(),
                                            match.getAwayScore(),

                                            match.isResultRecorded()
                                    ))
                                    .toList();

                    return new FixtureResponse(
                            fixture.getId(),
                            fixture.getRoundNumber(),
                            matches
                    );
                })
                .toList();
    }
}