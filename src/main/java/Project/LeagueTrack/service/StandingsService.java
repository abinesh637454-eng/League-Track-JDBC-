package Project.LeagueTrack.service;

import Project.LeagueTrack.entity.StandingsEntry;
import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.repository.StandingsEntryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class StandingsService {

    private final StandingsEntryRepository standingsEntryRepository;

    @Value("${league.points.win:3}")
    private int winPoints;

    @Value("${league.points.draw:1}")
    private int drawPoints;

    @Value("${league.points.loss:0}")
    private int lossPoints;

    public StandingsService(StandingsEntryRepository standingsEntryRepository) {
        this.standingsEntryRepository = standingsEntryRepository;
    }

    @Transactional
    public StandingsEntry createInitialStandings(Team team) {

        StandingsEntry entry = new StandingsEntry(team);

        return standingsEntryRepository.save(entry);
    }

    @Transactional
    public void recordWin(Long winnerTeamId, Long loserTeamId) {

        StandingsEntry winner = findByTeamId(winnerTeamId);
        StandingsEntry loser = findByTeamId(loserTeamId);

        winner.setPlayed(winner.getPlayed() + 1);
        winner.setWon(winner.getWon() + 1);
        winner.setPoints(winner.getPoints() + winPoints);

        loser.setPlayed(loser.getPlayed() + 1);
        loser.setLost(loser.getLost() + 1);
        loser.setPoints(loser.getPoints() + lossPoints);

        standingsEntryRepository.save(winner);
        standingsEntryRepository.save(loser);
    }

    @Transactional
    public void recordDraw(Long homeTeamId, Long awayTeamId) {

        StandingsEntry homeTeam = findByTeamId(homeTeamId);
        StandingsEntry awayTeam = findByTeamId(awayTeamId);

        homeTeam.setPlayed(homeTeam.getPlayed() + 1);
        homeTeam.setDrawn(homeTeam.getDrawn() + 1);
        homeTeam.setPoints(homeTeam.getPoints() + drawPoints);

        awayTeam.setPlayed(awayTeam.getPlayed() + 1);
        awayTeam.setDrawn(awayTeam.getDrawn() + 1);
        awayTeam.setPoints(awayTeam.getPoints() + drawPoints);

        standingsEntryRepository.save(homeTeam);
        standingsEntryRepository.save(awayTeam);
    }

    public List<StandingsEntry> getAllStandings() {

        return standingsEntryRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparingInt(
                                StandingsEntry::getPoints
                        ).reversed()
                )
                .toList();
    }

    private StandingsEntry findByTeamId(Long teamId) {

        return standingsEntryRepository.findByTeamId(teamId)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Standings entry not found for team ID: " + teamId
                        )
                );
    }
}