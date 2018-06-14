package com.example.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.api.models.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByDateContaining(String text);
    List<Event> findAllByOrderByIdAsc();
}
    
