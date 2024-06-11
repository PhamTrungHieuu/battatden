package com.example.iotdemo.fanlinght;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.iotdemo.nhietdo.Iot;



@RestController
@CrossOrigin
public class FanlightController{
	@GetMapping("/fanlights")
	public List<Fanlight> getFanlights(Model model) throws IOException{
		Connection connection = null;
		Statement statement = null;
		ResultSet resultSet = null;
		List<Fanlight> fanlights = new ArrayList<>();
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo","root","123456");
			statement = connection.createStatement();
			resultSet = statement.executeQuery("select * from historyfanlight;");
			while(resultSet.next()) {
				int id = resultSet.getInt("id");
				String thietbi = resultSet.getString("thietbi");
				String trangthai = resultSet.getString("trangthai");
				Timestamp thoigian = resultSet.getTimestamp("thoigian");
				fanlights.add(new Fanlight(id, thietbi, trangthai,thoigian));
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		return fanlights;
	}
	@PostMapping("/addfanlight")
	public Fanlight addfanlight(@RequestBody Fanlight fanlight) throws IOException{
		Connection connection = null;
		PreparedStatement ps = null;
		int result = 0;
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo","root","123456");
			ps = connection.prepareStatement("INSERT INTO historyfanlight VALUES (?,?,?,?)");
			ps.setInt(1, Integer.valueOf(fanlight.getId()));
			ps.setString(2, fanlight.getThietbi());
			ps.setString(3, fanlight.getTrangthai());
			LocalDateTime currentDateTime = LocalDateTime.now();
			fanlight.setThoigian(Timestamp.valueOf(currentDateTime));
			ps.setTimestamp(4, fanlight.getThoigian());
			result = ps.executeUpdate();
			ps.close();
			connection.close();
		} catch(Exception e) {
			e.printStackTrace();
		}
		return fanlight;	
	}
	@GetMapping("/searchfanlight")
	public List<Fanlight> getFanlights(Model model, @RequestParam("startTime") Timestamp startTime, @RequestParam("endTime") Timestamp endTime) throws IOException {
	    Connection connection = null;
	    PreparedStatement preparedStatement = null;
	    ResultSet resultSet = null;
	    List<Fanlight> fanlights = new ArrayList<>();
	    
	    try {
	        Class.forName("com.mysql.cj.jdbc.Driver");
	        connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/jdbc_demo", "root", "123456");
	        
	        // Use a PreparedStatement to avoid SQL injection
	        String query = "SELECT * FROM historyfanlight WHERE thoigian BETWEEN ? AND ?";
	        preparedStatement = connection.prepareStatement(query);
	        preparedStatement.setTimestamp(1, startTime);
	        preparedStatement.setTimestamp(2, endTime);
	        
	        resultSet = preparedStatement.executeQuery();
	        
	        while (resultSet.next()) {
	            int id = resultSet.getInt("id");
	            String thietbi = resultSet.getString("thietbi");
	            String trangthai = resultSet.getString("trangthai");
	            Timestamp thoigian = resultSet.getTimestamp("thoigian");
	            fanlights.add(new Fanlight(id, thietbi, trangthai, thoigian));
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    } finally {
	        // Close resources in a finally block
	        try {
	            if (resultSet != null) {
	                resultSet.close();
	            }
	            if (preparedStatement != null) {
	                preparedStatement.close();
	            }
	            if (connection != null) {
	                connection.close();
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	    }
	    model.addAttribute("fanlights", fanlights);
	    return fanlights;
	}
}