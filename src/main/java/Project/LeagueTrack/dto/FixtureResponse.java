package Project.LeagueTrack.dto;

import java.util.List;

public class FixtureResponse {

    private Long fixtureId;
    private Integer roundNumber;
    private List<MatchResponse> matches;

    public FixtureResponse() {
    }

    public FixtureResponse(
            Long fixtureId,
            Integer roundNumber,
            List<MatchResponse> matches) {

        this.fixtureId = fixtureId;
        this.roundNumber = roundNumber;
        this.matches = matches;
    }

    public Long getFixtureId() {
        return fixtureId;
    }

    public void setFixtureId(Long fixtureId) {
        this.fixtureId = fixtureId;
    }

    public Integer getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(Integer roundNumber) {
        this.roundNumber = roundNumber;
    }

    public List<MatchResponse> getMatches() {
        return matches;
    }

    public void setMatches(List<MatchResponse> matches) {
        this.matches = matches;
    }
}
