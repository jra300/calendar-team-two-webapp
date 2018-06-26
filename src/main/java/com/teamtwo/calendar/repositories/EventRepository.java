package com.teamtwo.calendar.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.teamtwo.calendar.models.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByDateContaining(String text);

    List<Event> findAllByOrderByIdAsc();

    List<Event> findAllByDateOrderByIdAsc(String date);
}