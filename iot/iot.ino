#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"
// GPIO 5 D1
#define LED D3
#define FAN D2
const int DHTPIN = D1;
const int DHTTYPE = DHT11;
// WiFi
const char *ssid = "Coc";            // Enter your WiFi name
const char *password = "12345678";  // Enter WiFi password


// MQTT Broker
const char *mqtt_broker = "broker.hivemq.com";
const int mqtt_port = 1883;
const char *topic_led = "iot/led_control";
const char *topic_fan = "iot/fan_control";
// const char *topic_iot = "iot/#";
const char *topic_thoitiet = "thoitiet";
const char *topic_fanlight = "fanlight";
// const char *mqtt_username = "hieu0110";
// const char *mqtt_password = "hieu0110";

bool ledState = false;
bool fanState = false;
WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Set software serial baud to 115200;
  Serial.begin(115200);
  // delay(1000);  // Delay for stability

  // Connecting to a WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to the WiFi network");

  // Setting LED pin as output
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);  // Turn off the LED initially
  pinMode(FAN, OUTPUT);
  digitalWrite(FAN, LOW);
  // Connecting to an MQTT broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp8266-client-";
    client_id += String(WiFi.macAddress());
    if (client.connect(client_id.c_str())) {
      Serial.println("Public EMQX MQTT broker connected");
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  client.subscribe(topic_led);
  client.subscribe(topic_fan);
}

void callback(char *topic, byte *payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];  // Convert *byte to string
  }
  // Serial.println(topic);
  if (String(topic) == String(topic_led)) {
    if (message == "on" && !ledState) {
      digitalWrite(LED, HIGH);  // Turn on the LED
      ledState = true;
    } else if (message == "off" && ledState) {
      digitalWrite(LED, LOW);  // Turn off the LED
      ledState = false;
    }
  } else if (String(topic) == String(topic_fan)) {
    if (message == "on" && !fanState) {
      digitalWrite(FAN, HIGH);  // Turn on the FAN
      fanState = true;
    } else if (message == "off" && fanState) {
      digitalWrite(FAN, LOW);  // Turn off the FAN
      fanState = false;
    }
  }
}
void loop() {
  double h = dht.readHumidity();
  double t = dht.readTemperature();
  int q = analogRead(A0);
   if (isnan(h)) {
    h = 0.0;
  }
  if (isnan(t)) {
    t = 0.0;
  }
  String nhietdo = String(t, 0);
  String doam = String(h, 0);
  String anhsang = String(q);
  StaticJsonDocument<200> jsonDocument;
  
  // Thêm dữ liệu nhiệt độ, độ ẩm và ánh sáng vào JSON
  jsonDocument["nhietdo"] = nhietdo;
  jsonDocument["doam"] = doam;
  jsonDocument["anhsang"] = anhsang;

  // Chuyển đổi JSON thành chuỗi
  char jsonStr[200];
  serializeJson(jsonDocument, jsonStr);
  // Gửi chuỗi JSON lên MQTT
  client.publish(topic_thoitiet, jsonStr);

  // trang thai led fan
  String ledstatus ;
  String fanstatus ;
 int ledState = digitalRead(LED);
 int fanState = digitalRead(FAN);
  if (ledState == HIGH) {
      ledstatus = "on";
  } else {
    ledstatus = "off";
  }
  if (fanState == HIGH) {
      fanstatus = "on";
  } else {
    fanstatus = "off";
  }
  StaticJsonDocument<200> jsonFanLight;
  jsonFanLight["light"] = ledstatus;
  jsonFanLight["fan"] = fanstatus;
  char FanLightStr[200];
  serializeJson(jsonFanLight, FanLightStr);
  client.publish(topic_fanlight, FanLightStr);

  client.loop();
  delay(2000);  // Delay for a short period in each loop iteration
}
