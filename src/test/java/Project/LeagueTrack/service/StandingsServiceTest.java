package Project.LeagueTrack.service;

import org.springframework.test.util.ReflectionTestUtils;
import Project.LeagueTrack.entity.StandingsEntry;
import Project.LeagueTrack.repository.StandingsEntryRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class StandingsServiceTest {

    @Test
    void recordWinShouldUpdateBothTeamsCorrectly() {

        StandingsEntryRepository repository =
                mock(StandingsEntryRepository.class);

        StandingsEntry winner = new StandingsEntry();
        StandingsEntry loser = new StandingsEntry();

        when(repository.findByTeamId(1L))
                .thenReturn(Optional.of(winner));

        when(repository.findByTeamId(2L))
                .thenReturn(Optional.of(loser));

        StandingsService service =
                new StandingsService(repository);
        ReflectionTestUtils.setField(service, "winPoints", 3);
        ReflectionTestUtils.setField(service, "drawPoints", 1);
        ReflectionTestUtils.setField(service, "lossPoints", 0);

        service.recordWin(1L, 2L);

        assertEquals(1, winner.getPlayed());
        assertEquals(1, winner.getWon());
        assertEquals(0, winner.getDrawn());
        assertEquals(0, winner.getLost());
        assertEquals(3, winner.getPoints());

        assertEquals(1, loser.getPlayed());
        assertEquals(0, loser.getWon());
        assertEquals(0, loser.getDrawn());
        assertEquals(1, loser.getLost());
        assertEquals(0, loser.getPoints());

        verify(repository).save(winner);
        verify(repository).save(loser);
    }
    @Test
    void recordDrawShouldUpdateBothTeamsCorrectly() {

        StandingsEntryRepository repository =
                mock(StandingsEntryRepository.class);

        StandingsEntry homeTeam = new StandingsEntry();
        StandingsEntry awayTeam = new StandingsEntry();

        when(repository.findByTeamId(1L))
                .thenReturn(Optional.of(homeTeam));

        when(repository.findByTeamId(2L))
                .thenReturn(Optional.of(awayTeam));

        StandingsService service =
                new StandingsService(repository);

        ReflectionTestUtils.setField(service, "winPoints", 3);
        ReflectionTestUtils.setField(service, "drawPoints", 1);
        ReflectionTestUtils.setField(service, "lossPoints", 0);

        service.recordDraw(1L, 2L);

        assertEquals(1, homeTeam.getPlayed());
        assertEquals(0, homeTeam.getWon());
        assertEquals(1, homeTeam.getDrawn());
        assertEquals(0, homeTeam.getLost());
        assertEquals(1, homeTeam.getPoints());

        assertEquals(1, awayTeam.getPlayed());
        assertEquals(0, awayTeam.getWon());
        assertEquals(1, awayTeam.getDrawn());
        assertEquals(0, awayTeam.getLost());
        assertEquals(1, awayTeam.getPoints());

        verify(repository).save(homeTeam);
        verify(repository).save(awayTeam);
    }
    @Test
    void recordLossShouldUpdateBothTeamsCorrectly() {

        StandingsEntry winner = new StandingsEntry();
        StandingsEntry loser = new StandingsEntry();

        StandingsEntryRepository repository =
                mock(StandingsEntryRepository.class);

        when(repository.findByTeamId(1L))
                .thenReturn(Optional.of(winner));

        when(repository.findByTeamId(2L))
                .thenReturn(Optional.of(loser));

        StandingsService service =
                new StandingsService(repository);

        ReflectionTestUtils.setField(service, "winPoints", 3);
        ReflectionTestUtils.setField(service, "drawPoints", 1);
        ReflectionTestUtils.setField(service, "lossPoints", 0);

        service.recordWin(1L, 2L);

        assertEquals(1, winner.getPlayed());
        assertEquals(1, winner.getWon());
        assertEquals(0, winner.getDrawn());
        assertEquals(0, winner.getLost());
        assertEquals(3, winner.getPoints());

        assertEquals(1, loser.getPlayed());
        assertEquals(0, loser.getWon());
        assertEquals(0, loser.getDrawn());
        assertEquals(1, loser.getLost());
        assertEquals(0, loser.getPoints());
    }
}

