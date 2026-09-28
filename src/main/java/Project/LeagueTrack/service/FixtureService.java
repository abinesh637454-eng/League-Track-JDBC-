package Project.LeagueTrack.service;

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

        if (teams.size() < 2) {
            throw new IllegalStateException(
                    "At least 2 teams are required to generate a fixture"
            );
        }

        if (matchRepository.count() > 0) {
            throw new IllegalStateException(
                    "Fixture has already been generated"
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

                generatedMatches.add(match);
            }

            matchRepository.saveAll(
                    generatedMatches.subList(
                            generatedMatches.size() - matchesPerRound,
                            generatedMatches.size()
                    )
            );

            Team lastTeam = teams.remove(teams.size() - 1);
            teams.add(1, lastTeam);
        }

        return generatedMatches;
    }
}
