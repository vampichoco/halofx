#include <SoftwareSerial.h> //Librería que permite establecer comunicación serie en otros pins
#include <Adafruit_NeoPixel.h>

SoftwareSerial BT(8,9); //10 RX, 11 TX.
int led = 10;
int led2 = 3;
int lamp1 = 16;
int np = 6;
String readString;


byte r, g, b;

char input;

Adafruit_NeoPixel halofx = Adafruit_NeoPixel(12, np, NEO_GRB + NEO_KHZ800);

void setup()
{

  pinMode(led, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(lamp1, OUTPUT);
  
  
  BT.begin(9600); //Velocidad del puerto del módulo Bluetooth
  Serial.begin(9600); //Abrimos la comunicación serie con el PC y establecemos velocidad

  halofx.begin();
  halofx.show(); // Initialize all pixels to 'off'

  rainbowCycle(2);
  
}
 
void loop()
{

String valStr;


while (BT.available()) {
delay(10);  //small delay to allow input buffer to fill

char c = BT.read();  //gets one byte from serial buffer
if (c == ';') {
break;
}  //breaks out of capture loop to print readstring
readString += c; 
} //makes the string readString  

if (readString.length() > 0){
Serial.println(readString); 

char command = readString[0];
Serial.println(command);

switch (command) {
  case 'a': 
  setColor(readString);
  break;
  case 'b':
    valStr = 
    readString.substring(1, 4);

  
    Serial.println(valStr);   
    analogWrite(led, valStr.toInt()); 
    Serial.println("lampara1"); 
  break;
  case 'c': 
    valStr = 
    readString.substring(1, 4);

  
    Serial.println(valStr);   
    analogWrite(led2, valStr.toInt()); 
    Serial.println("lampara2");
    break;
  case 'd': 
    digitalWrite(led, LOW); 
    Serial.println("lampara1"); 
  break;
  case 'e': 
    digitalWrite(led2, LOW); 
    Serial.println("lampara2"); 
  
  
  }

readString = "";
}

    //


}

void setColor(String command){
  String rpart = command.substring(1, 4);
  String gpart = command.substring(4, 7); 
  String bpart = command.substring(7, 10);

  Serial.println(rpart);
  Serial.println(gpart); 
  Serial.println(bpart); 

  r = rpart.toInt(); 
  g = gpart.toInt();
  b = bpart.toInt();

  for (int i = 0; i <= 11; i++){
    halofx.setPixelColor(i, r, g, b);
  }
  halofx.show();
}


void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< halofx.numPixels(); i++) {
      halofx.setPixelColor(i, Wheel(((i * 256 / halofx.numPixels()) + j) & 255));
    }
    halofx.show();
    delay(wait);
  }
}

uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return halofx.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return halofx.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return halofx.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}
