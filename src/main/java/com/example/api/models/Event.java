package com.example.api.models;

import javax.persistence.*;

@Entity
public class Event {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	
	private String date;
	private String time;
	
	@Column(length = 65535, columnDefinition="Text")
	private String text;
	
	public Event() {
	}
	
	public Event(String date, String time, String text) {
		this.date = date;
		this.time = time;
		this.text = text;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	public String getTime() {
		return time;
	}
	
	public void setTime(String time) {
		this.time = time;
	}
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public int getId() {
		return id;
	}
	
}
