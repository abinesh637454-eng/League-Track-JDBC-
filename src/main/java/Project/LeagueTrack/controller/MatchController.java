package Project.LeagueTrack.controller;

import Project.LeagueTrack.dto.MatchResultRequest;
import Project.LeagueTrack.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Project.LeagueTrack.dto.MatchResponse;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/matches")
@Tag(name = "Matches", description = "APIs for managing tournament matches and match results")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PutMapping("/{matchId}/result")
    @Operation(
            summary = "Record match result",
            description = "Records the result of a match and updates the tournament standings."
    )
    public ResponseEntity<MatchResponse> recordResult(
            @PathVariable Long matchId,
            @Valid @RequestBody MatchResultRequest request) {

        MatchResponse response =
                matchService.recordResult(matchId, request);

        return ResponseEntity.ok(response);
    }
    @GetMapping
    @Operation(
            summary = "Get all matches",
            description = "Returns all matches in the tournament."
    )
    public ResponseEntity<List<MatchResponse>> getAllMatches() {

        List<MatchResponse> matches =
                matchService.getAllMatches();

        return ResponseEntity.ok(matches);
    }

    @GetMapping("/{matchId}")
    @Operation(
            summary = "Get match by ID",
            description = "Returns detailed information about a specific match."
    )
    public ResponseEntity<MatchResponse> getMatch(
            @PathVariable Long matchId) {

        MatchResponse response =
                matchService.getMatchById(matchId);

        return ResponseEntity.ok(response);
    }
}
