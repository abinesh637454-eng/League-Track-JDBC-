package Project.LeagueTrack.controller;

import Project.LeagueTrack.entity.Match;
import Project.LeagueTrack.service.FixtureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixtures")
public class FixtureController {

    private final FixtureService fixtureService;

    public FixtureController(FixtureService fixtureService) {
        this.fixtureService = fixtureService;
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Match>> generateFixture() {

        List<Match> matches = fixtureService.generateRoundRobinFixture();

        return ResponseEntity.ok(matches);
    }
}
