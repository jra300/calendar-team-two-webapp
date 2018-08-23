package com.teamtwo.calendar.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CalendarController {
    @RequestMapping("/")
    public String calendar() {
        return "index";
    }
    
    @RequestMapping("/index.html")
    public String index() {
        return "index";
    }
    
    @RequestMapping("/weather.html")
    public String weather() {
        return "weather";
    }
    
    @RequestMapping("/face1.html")
    public String face1() {
        return "face1";
    }
    
    @RequestMapping("/face2.html")
    public String face2() {
        return "face2";
    }
    
    @RequestMapping("/settings.html")
    public String settings() {
        return "settings";
    }

    @GetMapping("/logout")
    public String getLogoutPage(HttpServletRequest request, HttpServletResponse response) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null)
            new SecurityContextLogoutHandler().logout(request, response, authentication);

        return "redirect:/login";
    }
}
