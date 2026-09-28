package Project.LeagueTrack.controller;

import Project.LeagueTrack.entity.Team;
import Project.LeagueTrack.service.TeamService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TeamController.class)
class TeamControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TeamService teamService;

    @Test
    void getAllTeamsShouldReturnTeams() throws Exception {

        Team team1 = new Team("CSE Titans");
        Team team2 = new Team("ECE Warriors");

        given(teamService.getAllTeams())
                .willReturn(List.of(team1, team2));

        mockMvc.perform(get("/api/teams"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("CSE Titans"))
                .andExpect(jsonPath("$[1].name").value("ECE Warriors"));
    }
}
