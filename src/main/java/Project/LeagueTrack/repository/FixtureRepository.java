package Project.LeagueTrack.repository;

import Project.LeagueTrack.entity.Fixture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixtureRepository extends JpaRepository<Fixture, Long> {
}
