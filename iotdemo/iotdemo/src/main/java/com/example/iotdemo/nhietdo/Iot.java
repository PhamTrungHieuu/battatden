package com.example.iotdemo.nhietdo;

import java.sql.Timestamp;

public class Iot{
	int id;
	String nhietdo;
	String doam;
	String anhsang;
	Timestamp thoigian;
	public Iot() {
		super();
	}
	public Iot(int id, String nhietdo, String doam, String anhsang, Timestamp thoigian) {
		super();
		this.id = id;
		this.nhietdo = nhietdo;
		this.doam = doam;
		this.anhsang = anhsang;
		this.thoigian = thoigian;
	}
	public Iot(int id, String nhietdo, String doam, String anhsang) {
		super();
		this.id = id;
		this.nhietdo = nhietdo;
		this.doam = doam;
		this.anhsang = anhsang;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNhietdo() {
		return nhietdo;
	}
	public void setNhietdo(String nhietdo) {
		this.nhietdo = nhietdo;
	}
	public String getDoam() {
		return doam;
	}
	public void setDoam(String doam) {
		this.doam = doam;
	}
	public String getAnhsang() {
		return anhsang;
	}
	public void setAnhsang(String anhsang) {
		this.anhsang = anhsang;
	}
	public Timestamp getThoigian() {
		return thoigian;
	}
	public void setThoigian(Timestamp thoigian) {
		this.thoigian = thoigian;
	}
}