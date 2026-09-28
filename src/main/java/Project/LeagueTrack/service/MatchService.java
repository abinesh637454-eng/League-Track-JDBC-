package Project.LeagueTrack.service;

import Project.LeagueTrack.dto.MatchResultRequest;
import Project.LeagueTrack.entity.Match;
import Project.LeagueTrack.exception.DuplicateResultException;
import Project.LeagueTrack.exception.ResourceNotFoundException;
import Project.LeagueTrack.repository.MatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final StandingsService standingsService;

    public MatchService(
            MatchRepository matchRepository,
            StandingsService standingsService) {

        this.matchRepository = matchRepository;
        this.standingsService = standingsService;
    }

    @Transactional
    public Match recordResult(
            Long matchId,
            MatchResultRequest request) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found with ID: " + matchId
                        )
                );

        if (match.isResultRecorded()) {
            throw new DuplicateResultException(
                    "Result has already been recorded for this match"
            );
        }

        Integer homeScore = request.getHomeScore();
        Integer awayScore = request.getAwayScore();

        match.setHomeScore(homeScore);
        match.setAwayScore(awayScore);

        Long homeTeamId = match.getHomeTeam().getId();
        Long awayTeamId = match.getAwayTeam().getId();

        if (homeScore > awayScore) {

            standingsService.recordWin(
                    homeTeamId,
                    awayTeamId
            );

        } else if (homeScore < awayScore) {

            standingsService.recordWin(
                    awayTeamId,
                    homeTeamId
            );

        } else {

            standingsService.recordDraw(
                    homeTeamId,
                    awayTeamId
            );
        }

        match.setResultRecorded(true);

        return matchRepository.save(match);
    }

    public Match getMatchById(Long matchId) {

        return matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Match not found with ID: " + matchId
                        )
                );
    }
}
