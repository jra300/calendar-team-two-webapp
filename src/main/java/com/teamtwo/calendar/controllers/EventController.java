package com.teamtwo.calendar.controllers;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.teamtwo.calendar.models.Event;
import com.teamtwo.calendar.repositories.EventRepository;

@RestController
@CrossOrigin("*")
public class EventController {
	@Autowired
    EventRepository eventRepository;
	
	@GetMapping("/events")
    public List<Event> index(){
        return eventRepository.findAllByOrderByIdAsc();
    }
	
	@GetMapping("/events/date/{date}")
    public List<Event> getEventsByDate(@PathVariable String date) {
		return eventRepository.findAllByDateOrderByIdAsc(date);
    }
	
    @PostMapping("/events")
    public Event create(@RequestBody Map<String, String> body){
        String date = body.get("date");
        String time = body.get("time");
        String text = body.get("text");

        return eventRepository.save(new Event(date, time, text));
    }
    
    @GetMapping("/events/{id}")
    public Event getEventById(@PathVariable int id) {
    	Event event;
    
    	try {
    		event = eventRepository.findById(id).get();
    		return event;
    	} catch(NoSuchElementException e) {
    		return null;
    	}
    	
    }
    
    @PutMapping("/events/{id}")
    public Event updateEvent(@RequestBody Map<String, String> body, @PathVariable int id) {
    	Event event;
    	
    	String date = body.get("date");
        String time = body.get("time");
        String text = body.get("text");
    
    	try {
    		event = eventRepository.findById(id).get();
    		event.setDate(date);
    		event.setTime(time);
    		event.setText(text);
    		
    		return eventRepository.save(event);
    	} catch(NoSuchElementException e) {
    		return null;
    	}
    	
    }
    
    @DeleteMapping("/events/{id}")
    public void deleteEventById(@PathVariable int id) {
    	eventRepository.deleteById(id);   	
    }
    
    @DeleteMapping("/events")
    public void deleteAll() {
    	eventRepository.deleteAll();	
    }
}
