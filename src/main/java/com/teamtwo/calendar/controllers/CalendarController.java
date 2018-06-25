package com.teamtwo.calendar.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CalendarController {
	@RequestMapping("/")
	public String calendar() {
		return "index";
	}
}
