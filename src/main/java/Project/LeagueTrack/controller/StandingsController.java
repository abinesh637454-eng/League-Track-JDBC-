package Project.LeagueTrack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import Project.LeagueTrack.service.StandingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import Project.LeagueTrack.dto.StandingsResponse;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
@Tag(
        name = "Standings",
        description = "APIs for viewing tournament standings and team points"
)
public class StandingsController {

    private final StandingsService standingsService;

    public StandingsController(StandingsService standingsService) {
        this.standingsService = standingsService;
    }

    @GetMapping
    @Operation(
            summary = "Get tournament standings",
            description = "Returns the current tournament standings with matches played, wins, draws, losses, and points."
    )
    public ResponseEntity<List<StandingsResponse>> getStandings() {

        List<StandingsResponse> standings =
                standingsService.getAllStandings();

        return ResponseEntity.ok(standings);
    }
}