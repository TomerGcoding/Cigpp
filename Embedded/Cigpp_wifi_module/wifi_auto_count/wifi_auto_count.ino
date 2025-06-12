#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <time.h> // For NTP time

const int reedPin = D2;
bool magnetPresent = true;
unsigned long magnetRemovedTime = 0;
bool triggered = false;

const char* ssid = "OmerSh";
const char* password = "0542304442";
const char* serverUrl = "http://10.100.102.4:8080/api/cigarettes";  // Replace with your actual endpoint

void setup() {
  Serial.begin(9600);
  pinMode(reedPin, INPUT_PULLUP);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  // Configure NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  Serial.println("Waiting for NTP time sync...");
  time_t now = time(nullptr);
  while (now < 24 * 3600) {  // Wait until at least Jan 2, 1970
    delay(500);
    Serial.print("*");
    now = time(nullptr);
  }
  Serial.println("\nTime synchronized.");
}

void loop() {
  int val = digitalRead(reedPin);

  if (val == LOW && !magnetPresent) {
    Serial.println("Magnet detected!");
    magnetPresent = true;
    triggered = false;  // reset trigger if magnet returned
  }

  if (val == HIGH && magnetPresent) {
    Serial.println("No magnet.");
    Serial.println(String(ESP.getChipId(), HEX));
    magnetRemovedTime = millis();
    magnetPresent = false;
  }

  // Check if 5 seconds passed without magnet
  if (!magnetPresent && !triggered && millis() - magnetRemovedTime >= 5000) {
    sendMagnetRemovedEvent();
    triggered = true;  // avoid repeated sending
  }

  delay(200);
}

void sendMagnetRemovedEvent() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient wifiClient;
    http.begin(wifiClient,serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Get time in ISO 8601
    time_t now = time(nullptr);
    struct tm* timeinfo = localtime(&now);
    char isoTime[30];
    strftime(isoTime, sizeof(isoTime), "%Y-%m-%dT%H:%M:%SZ", timeinfo);

    // Get unique ID
    String chipId = String(ESP.getChipId(), HEX);

    String json = "{";
    json += "\"deviceId\": \"" + chipId + "\",";
    json += "\"description\": \"device\",";
    json += "\"timestamp\": \"" + String(isoTime) + "\"";
    json += "}";

    int httpCode = http.POST(json);
    if (httpCode > 0) {
      Serial.printf("POST sent. Status: %d\n", httpCode);
    } else {
      Serial.printf("POST failed: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }
}
