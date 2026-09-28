package Project.LeagueTrack.controller;

import Project.LeagueTrack.entity.StandingsEntry;
import Project.LeagueTrack.service.StandingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
public class StandingsController {

    private final StandingsService standingsService;

    public StandingsController(StandingsService standingsService) {
        this.standingsService = standingsService;
    }

    @GetMapping
    public ResponseEntity<List<StandingsEntry>> getStandings() {

        List<StandingsEntry> standings =
                standingsService.getAllStandings();

        return ResponseEntity.ok(standings);
    }
}