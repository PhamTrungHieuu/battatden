package com.example.iotdemo.nhietdo;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class IotController {
	@GetMapping("/iots")
	public List<Iot> getIots(Model model) throws IOException {
		Connection connection = null;
		Statement statement = null;
		ResultSet resultSet = null;
		List<Iot> iots = new ArrayList<>();
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo", "root", "123456");
			statement = connection.createStatement();
			resultSet = statement.executeQuery("select * from dataiot;");
			while (resultSet.next()) {
				int id = resultSet.getInt("id");
				String nhietdo = resultSet.getString("nhietdo");
				String doam = resultSet.getString("doam");
				String anhsang = resultSet.getString("anhsang");
				Timestamp thoigian = resultSet.getTimestamp("thoigian");
				iots.add(new Iot(id, nhietdo, doam, anhsang, thoigian));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return iots;
	}

	@GetMapping("/iot")
	public Iot getIot(Model model) throws IOException {
		Connection connection = null;
		Statement statement = null;
		ResultSet resultSet = null;
		Iot iot = new Iot();

		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo", "root", "123456");
			statement = connection.createStatement();
			resultSet = statement.executeQuery("select * from dataiot;");
			while (resultSet.next()) {
				int id = resultSet.getInt("id");
				String nhietdo = resultSet.getString("nhietdo");
				String doam = resultSet.getString("doam");
				String anhsang = resultSet.getString("anhsang");
				iot.setId(id);
				iot.setNhietdo(nhietdo);
				iot.setDoam(doam);
				iot.setAnhsang(anhsang);

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return iot;
	}

	@PostMapping("/add")
	public Iot addiot(@RequestBody Iot iot) throws IOException {
		Connection connection = null;
		PreparedStatement ps = null;
		int result = 0;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo", "root", "123456");
			ps = connection.prepareStatement("INSERT INTO dataiot VALUES (?,?,?,?,?)");
			ps.setInt(1, Integer.valueOf(iot.getId()));
			ps.setString(2, iot.getNhietdo());
			ps.setString(3, iot.getDoam());
			ps.setString(4, iot.getAnhsang());

			LocalDateTime currentDateTime = LocalDateTime.now();
			iot.setThoigian(Timestamp.valueOf(currentDateTime));

			ps.setTimestamp(5, iot.getThoigian());
			result = ps.executeUpdate();
			ps.close();
			connection.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return iot;
	}

	@GetMapping("/searchiot")
	public List<Iot> getIot(
			@RequestParam(name = "nhietdo", required = false) String nhietdo,
			@RequestParam(name = "doam", required = false) String doam,
			@RequestParam(name = "anhsang", required = false) String anhsang,
			Model model
			) throws IOException {
		Connection connection = null;
		PreparedStatement ps = null;
		ResultSet resultSet = null;
		List<Iot> iotList = new ArrayList<>();
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo", "root", "123456");
			
			StringBuilder query = new StringBuilder("SELECT * FROM dataiot WHERE 1 = 1");
			
			if (nhietdo != "" ) {
				query.append(" AND nhietdo = " + nhietdo);
			}
			if (doam != "") {
				query.append(" AND doam = " + doam);
			}
			if (anhsang != "") {
				query.append(" AND anhsang = " + anhsang);
			}
			
			ps = connection.prepareStatement(query.toString());
			
			
			resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				Iot iot = new Iot();
				iot.setId(resultSet.getInt("id"));
				iot.setNhietdo(resultSet.getString("nhietdo"));
				iot.setDoam(resultSet.getString("doam"));
				iot.setAnhsang(resultSet.getString("anhsang"));
				iot.setThoigian(resultSet.getTimestamp("thoigian"));
				iotList.add(iot);;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// Đóng kết nối, PreparedStatement và ResultSet ở đây
		}
		
		model.addAttribute("iotList", iotList);
		return iotList;
	}
}