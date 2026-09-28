package Project.LeagueTrack.service;

import Project.LeagueTrack.repository.StandingsEntryRepository;
import Project.LeagueTrack.repository.MatchRepository;
import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final StandingsService standingsService;
    private final MatchRepository matchRepository;
    private final StandingsEntryRepository standingsEntryRepository;

    public TeamService(
            TeamRepository teamRepository,
            StandingsService standingsService,
            MatchRepository matchRepository,
            StandingsEntryRepository standingsEntryRepository) {

        this.teamRepository = teamRepository;
        this.standingsService = standingsService;
        this.matchRepository = matchRepository;
        this.standingsEntryRepository = standingsEntryRepository;
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
    @Transactional
    public Team updateTeam(Long teamId, Team updatedTeam) {

        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new Project.LeagueTrack.exception.ResourceNotFoundException(
                                "Team not found with ID: " + teamId
                        )
                );

        existingTeam.setName(updatedTeam.getName());

        return teamRepository.save(existingTeam);
    }

    @Transactional
    public void deleteTeam(Long teamId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new Project.LeagueTrack.exception.ResourceNotFoundException(
                                "Team not found with ID: " + teamId
                        )
                );

        if (matchRepository.existsMatchesForTeam(teamId)) {
            throw new Project.LeagueTrack.exception.TeamDeletionNotAllowedException(
                    "Team cannot be deleted because it is already part of a tournament fixture"
            );
        }

        standingsEntryRepository.findByTeamId(teamId)
                .ifPresent(standingsEntryRepository::delete);

        teamRepository.delete(team);
    }


}