package Project.LeagueTrack.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "LeagueTrack API",
                version = "1.0.0",
                description = """
                        LeagueTrack is a tournament management REST API
                        for team registration, round-robin fixture generation,
                        match result management, and standings calculation.
                        """
        )
)
public class OpenApiConfig {
}
