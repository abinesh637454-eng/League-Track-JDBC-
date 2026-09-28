package Project.LeagueTrack.service;

import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final StandingsService standingsService;

    public TeamService(
            TeamRepository teamRepository,
            StandingsService standingsService) {
        this.teamRepository = teamRepository;
        this.standingsService = standingsService;
    }

    @Transactional
    public Team registerTeam(Team team) {

        Team savedTeam = teamRepository.save(team);

        standingsService.createInitialStandings(savedTeam);

        return savedTeam;
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
}