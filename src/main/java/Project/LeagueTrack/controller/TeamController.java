package Project.LeagueTrack.controller;

import Project.LeagueTrack.dto.TeamRequest;
import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@Tag(
        name = "Teams",
        description = "APIs for registering, viewing, updating, and deleting tournament teams"
)
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    @Operation(
            summary = "Register a team",
            description = "Registers a new team for the tournament."
    )
    public ResponseEntity<Team> registerTeam(
            @Valid @RequestBody TeamRequest request) {

        Team team = new Team(request.getName());

        Team savedTeam = teamService.registerTeam(team);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedTeam);
    }

    @GetMapping
    @Operation(
            summary = "Get all teams",
            description = "Returns all registered teams in the tournament."
    )
    public ResponseEntity<List<Team>> getAllTeams() {

        List<Team> teams = teamService.getAllTeams();

        return ResponseEntity.ok(teams);
    }

    @PutMapping("/{teamId}")
    @Operation(
            summary = "Update a team",
            description = "Updates the details of an existing tournament team."
    )
    public ResponseEntity<Team> updateTeam(
            @PathVariable Long teamId,
            @Valid @RequestBody TeamRequest request) {

        Team updatedTeam = new Team(request.getName());

        Team savedTeam = teamService.updateTeam(teamId, updatedTeam);

        return ResponseEntity.ok(savedTeam);
    }

    @DeleteMapping("/{teamId}")
    @Operation(
            summary = "Delete a team",
            description = "Deletes a team when it has not yet been included in a tournament fixture."
    )
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Long teamId) {

        teamService.deleteTeam(teamId);

        return ResponseEntity.noContent().build();
    }
}