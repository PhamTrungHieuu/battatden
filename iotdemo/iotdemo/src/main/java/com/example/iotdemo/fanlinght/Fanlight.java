package com.example.iotdemo.fanlinght;

import java.sql.Timestamp;

public class Fanlight{
	int id;
	public Timestamp getThoigian() {
		return thoigian;
	}
	public void setThoigian(Timestamp thoigian) {
		this.thoigian = thoigian;
	}
	public Fanlight(int id, String thietbi, String trangthai, Timestamp thoigian) {
		super();
		this.id = id;
		this.thietbi = thietbi;
		this.trangthai = trangthai;
		this.thoigian = thoigian;
	}
	String thietbi;
	String trangthai;
	Timestamp thoigian;
	public Fanlight() {
		super();
	}
	public Fanlight(int id, String thietbi, String trangthai) {
		super();
		this.id = id;
		this.thietbi = thietbi;
		this.trangthai = trangthai;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getThietbi() {
		return thietbi;
	}
	public void setThietbi(String thietbi) {
		this.thietbi = thietbi;
	}
	public String getTrangthai() {
		return trangthai;
	}
	public void setTrangthai(String trangthai) {
		this.trangthai = trangthai;
	}
}