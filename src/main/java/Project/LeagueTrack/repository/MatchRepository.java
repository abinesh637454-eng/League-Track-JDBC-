package Project.LeagueTrack.repository;

import Project.LeagueTrack.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
}