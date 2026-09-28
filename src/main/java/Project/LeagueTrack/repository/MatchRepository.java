package Project.LeagueTrack.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import Project.LeagueTrack.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByFixtureId(Long fixtureId);
    @Query("""
        SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END
        FROM Match m
        WHERE m.homeTeam.id = :teamId
           OR m.awayTeam.id = :teamId
        """)
    boolean existsMatchesForTeam(@Param("teamId") Long teamId);
}