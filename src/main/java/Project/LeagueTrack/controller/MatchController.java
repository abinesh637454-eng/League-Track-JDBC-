package Project.LeagueTrack.controller;

import Project.LeagueTrack.dto.MatchResultRequest;
import Project.LeagueTrack.entity.Match;
import Project.LeagueTrack.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PutMapping("/{matchId}/result")
    public ResponseEntity<Match> recordResult(
            @PathVariable Long matchId,
            @Valid @RequestBody MatchResultRequest request) {

        Match updatedMatch =
                matchService.recordResult(matchId, request);

        return ResponseEntity.ok(updatedMatch);
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<Match> getMatch(
            @PathVariable Long matchId) {

        Match match = matchService.getMatchById(matchId);

        return ResponseEntity.ok(match);
    }
}
