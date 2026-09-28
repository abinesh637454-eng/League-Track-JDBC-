package Project.LeagueTrack.controller;

import Project.LeagueTrack.dto.TeamRequest;
import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<Team> registerTeam(
            @Valid @RequestBody TeamRequest request) {

        Team team = new Team(request.getName());

        Team savedTeam = teamService.registerTeam(team);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedTeam);
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {

        List<Team> teams = teamService.getAllTeams();

        return ResponseEntity.ok(teams);
    }
}
