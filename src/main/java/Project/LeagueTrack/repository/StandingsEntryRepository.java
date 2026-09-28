package Project.LeagueTrack.repository;

import Project.LeagueTrack.entity.StandingsEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StandingsEntryRepository
        extends JpaRepository<StandingsEntry, Long> {

    Optional<StandingsEntry> findByTeamId(Long teamId);
}