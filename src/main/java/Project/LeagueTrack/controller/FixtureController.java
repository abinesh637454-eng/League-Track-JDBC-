package Project.LeagueTrack.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import Project.LeagueTrack.dto.MatchResponse;
import Project.LeagueTrack.dto.FixtureResponse;
import Project.LeagueTrack.entity.Match;
import Project.LeagueTrack.service.FixtureService;
import Project.LeagueTrack.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;


import java.util.List;

@RestController
@RequestMapping("/api/fixtures")
@Tag(
        name = "Fixtures",
        description = "APIs for generating and viewing tournament fixtures"
)
public class FixtureController {
    @PersistenceContext
    private EntityManager entityManager;

    private final FixtureService fixtureService;
    private final MatchService matchService;

    public FixtureController(
            FixtureService fixtureService,
            MatchService matchService) {

        this.fixtureService = fixtureService;
        this.matchService = matchService;
    }

    @PostMapping("/generate")
    @Operation(
            summary = "Generate tournament fixture",
            description = "Generates a round-robin fixture for the registered teams. Fixture generation is allowed only once."
    )
    public ResponseEntity<List<MatchResponse>> generateFixture() {

        List<Match> matches =
                fixtureService.generateRoundRobinFixture();

        List<MatchResponse> responses =
                matches.stream()
                        .map(matchService::toResponse)
                        .toList();

        return ResponseEntity.ok(responses);
    }
    @DeleteMapping("/clear")
    @Transactional
    public ResponseEntity<Map<String, Object>> clearFixtures() {

        int deletedMatches =
                entityManager
                        .createQuery("delete from Match")
                        .executeUpdate();

        entityManager.clear();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Fixture cleared successfully",
                        "deletedMatches",
                        deletedMatches
                )
        );
    }
    @GetMapping
    @Operation(
            summary = "Get all fixtures",
            description = "Returns all tournament fixtures grouped by round, including match details and result status."
    )
    public ResponseEntity<List<FixtureResponse>> getAllFixtures() {

        List<FixtureResponse> fixtures =
                fixtureService.getAllFixtures();

        return ResponseEntity.ok(fixtures);
    }
}
