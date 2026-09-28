package Project.LeagueTrack.exception;

public class TeamDeletionNotAllowedException extends RuntimeException {

    public TeamDeletionNotAllowedException(String message) {
        super(message);
    }
}
