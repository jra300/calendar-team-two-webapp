package com.teamtwo.calendar.test;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamtwo.calendar.Calendar;
import com.teamtwo.calendar.configuration.SecurityConfiguration;
import com.teamtwo.calendar.controllers.EventController;
import com.teamtwo.calendar.models.Event;
import com.teamtwo.calendar.repositories.EventRepository;

@RunWith(SpringRunner.class)
@WebMvcTest(EventController.class)
@ContextConfiguration(classes = { Calendar.class, SecurityConfiguration.class })
public class CalendarTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EventRepository eventRepository;

    @Test
    public void contextLoads() {
    }

    @Test
    public void returnsEmployeeAsJson() throws Exception {
        Event event = new Event("date", "time", "text");

        List<Event> allEvents = Arrays.asList(event);

        given(eventRepository.findAll()).willReturn(allEvents);

        mvc.perform(get("/events").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].date", is(event.getDate())));
    }

    @Test
    public void postsEmployee() throws Exception {
        Event event = new Event("date1", "time1", "text1");
        String requestJson = objectMapper.writeValueAsString(event);

        mvc.perform(post("/events").contentType(MediaType.APPLICATION_JSON).content(requestJson))
                .andExpect(status().isOk());
    }

}
