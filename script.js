//* ============ getPrayerTimes ==============//
let getPrayerTimes = async (country, city, month, year, long, lat) => {
  let url;

  document.body.style.cursor = "wait";
  if (dataStorage[2] === "Manu") {
    url = ` https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`;
    // url=` https://api.aladhan.com/v1/timingsByCity`
  } else {
    url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${long}&method=3&month=${month}&year=${year}`;
  }

  let response = await fetch(url);
  let json = await response.json();
  let element = json.data;

  let Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha;
  Fajr = element.timings.Fajr.slice(0, 5);
  Sunrise = element.timings.Sunrise.slice(0, 5);
  Dhuhr = element.timings.Dhuhr.slice(0, 5);
  Asr = element.timings.Asr.slice(0, 5);
  Maghrib = element.timings.Maghrib.slice(0, 5);
  Isha = element.timings.Isha.slice(0, 5);

  document.getElementById("Fajr").innerHTML = Fajr;
  document.getElementById("Sunrise").innerHTML = Sunrise;
  document.getElementById("Dhuhr").innerHTML = Dhuhr;
  document.getElementById("Asr").innerHTML = Asr;
  document.getElementById("Maghrib").innerHTML = Maghrib;
  document.getElementById("Isha").innerHTML = Isha;

  PrayerTimesTab = [Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha];

  TimeLeft();
  Timer = setInterval(TimeLeft, 1000);

  // Day Gregorian
  let weekday, day, monthLetter;
  weekday = element.date.gregorian.weekday.en;
  day = element.date.gregorian.day;
  monthLetter = element.date.gregorian.month.en;

  let TodayGregorian = weekday + " - " + day + " " + monthLetter + " " + year;
  document.getElementById("TodayGreg").innerHTML = TodayGregorian;

  // Day Hijri
  weekday = element.date.hijri.weekday.ar;
  day = element.date.hijri.day;
  monthLetter = element.date.hijri.month.ar;
  year = element.date.hijri.year;
  let TodayHijri = weekday + " - " + day + " " + monthLetter + " " + year;
  document.getElementById("TodayHijri").innerHTML = TodayHijri;
  document.body.style.cursor = "default";
};
//* ============ getPrayerTimes ==============//

//* ============ TimeLeft ==============//
function TimeLeft() {
  let HourNowSec, FajrSec, DhuhrSec, AsrSec, MaghribSec, IshaSec;
  let Fajr, Dhuhr, Asr, Maghrib, Isha;

  const Now = new Date();
  let HH = Now.getHours();
  let MM = Now.getMinutes();
  let SS = Now.getSeconds();
  let HourNow = HH + ":" + MM + ":" + SS;

  Fajr = PrayerTimesTab[0];
  Dhuhr = PrayerTimesTab[2];
  Asr = PrayerTimesTab[3];
  Maghrib = PrayerTimesTab[4];
  Isha = PrayerTimesTab[5];

  HourNowSec = TimeToSec(HourNow);
  FajrSec = TimeToSec(Fajr + ":00");
  DhuhrSec = TimeToSec(Dhuhr + ":00");
  AsrSec = TimeToSec(Asr + ":00");
  MaghribSec = TimeToSec(Maghrib + ":00");
  IshaSec = TimeToSec(Isha + ":00");

  let NextPrayer;
  let TimeDiff, TimeLeftString;
  if (HourNowSec > FajrSec && HourNowSec <= DhuhrSec) {
    //Before Dhuhr
    NextPrayer = "Dhuhr";
    TimeDiff = TimeDifference(HourNowSec, DhuhrSec);
  } else if (HourNowSec > DhuhrSec && HourNowSec <= AsrSec) {
    //Before Asr
    NextPrayer = "Asr";
    TimeDiff = TimeDifference(HourNowSec, AsrSec);
  } else if (HourNowSec > AsrSec && HourNowSec <= MaghribSec) {
    //Before Maghrib
    NextPrayer = "Maghrib";
    TimeDiff = TimeDifference(HourNowSec, MaghribSec);
  } else if (HourNowSec > MaghribSec && HourNowSec <= IshaSec) {
    //Before Isha
    NextPrayer = "Isha";
    TimeDiff = TimeDifference(HourNowSec, IshaSec);
  } else {
    //Before Fajr
    NextPrayer = "Fajr";
    MidnightSec = TimeToSec("24:00:00");
    TimeDiff =
      TimeDifference(HourNowSec, MidnightSec) + TimeDifference(0, FajrSec);
  }
  TimeLeftString = SecToTime(TimeDiff);
  document.getElementById("TimesLeftCell").innerHTML = TimeLeftString;
  if (LastPrayer === "") {
    LastPrayer = NextPrayer;
  } else if (LastPrayer != NextPrayer) {
    document.getElementById(LastPrayer).style.backgroundColor =
      "rgba(1, 49, 53, 0.3)";
    LastPrayer = NextPrayer;
  }
  document.getElementById(NextPrayer).style.background = "#21377a";
}
//* ============ TimeLeft ==============//

//* ============ SecToTime ==============//
function SecToTime(Seconds) {
  let HH = Math.floor(Seconds / 3600);
  let Rest = Seconds % 3600;
  let MM = Math.floor(Rest / 60);
  let SS = Rest % 60;

  if (HH < 10) {
    HH = "0" + HH;
  }
  if (MM < 10) {
    MM = "0" + MM;
  }
  if (SS < 10) {
    SS = "0" + SS;
  }

  return HH + ":" + MM + ":" + SS;
}
//* ============ SecToTime ==============//

//* ============ TimeDifference ==============//
function TimeDifference(Time1, Time2) {
  let diff = Math.abs(Time1 - Time2);
  return diff;
}
//* ============ TimeDifference ==============//

//* ============ TimeToSec ==============//
function TimeToSec(Time) {
  let T = Time.split(":");
  let Result = +T[0] * 60 * 60 + +T[1] * 60 + +T[2];
  return Result;
}
//* ============ TimeToSec ==============//

//* ============ getCountries ==============//
let getCountries = async () => {
  document.body.style.cursor = "wait";
  let url = `https://countriesnow.space/api/v0.1/countries`;
  let response = await fetch(url);
  let json = await response.json();
  document.getElementById("countries").innerHTML = "";
  json.data.forEach((element) => {
    let country = `<option value="${element.country}">${element.country}</option>`;
    document.getElementById("countries").innerHTML += country;
    if (element.country == "Palau") {
      let country = `<option value="Palestine">Palestine</option>`;
      document.getElementById("countries").innerHTML += country;
    }
  });
  document
    .getElementById("countries")
    .addEventListener("change", CountrySelected);
  CountrySelected();
  document.body.style.cursor = "default";
};
//* ============ getCountries ==============//

//* ============ CountrySelected ==============//
function CountrySelected() {
  let Country = document.getElementById("countries").value;
  getCities(Country);
}
//* ============ CountrySelected ==============//

//* ============ getCities ==============//
let getCities = async (Country) => {
  let city = "";
  let PalestineCities = [
    "Jerusalem",
    "Bethlehem",
    "Beit Jala",
    "Beit Sahour",
    "Hebron",
    "Sabastia",
    "Jericho",
    "Ramallah",
    "Nablus",
    "Tulkarem",
    "Jenin",
    "Gaza",
    "Rafah",
    "Khan Younis",
  ];
  console.log(PalestineCities);
  document.body.style.cursor = "wait";
  let url = `https://countriesnow.space/api/v0.1/countries`;
  let response = await fetch(url);
  let json = await response.json();
  document.getElementById("cities").innerHTML = "";
  if (Country == "Palestine") {
    PalestineCities.forEach((element) => {
      console.log(element);
      city += `<option value="${element}">${element}</option>`;
    });
    document.getElementById("cities").innerHTML += city;
    document.body.style.cursor = "default";
  } else {
    json.data.forEach((element) => {
      if (element.country == Country) {
        element.cities.forEach((element) => {
          city += `<option value="${element}">${element}</option>`;
        });
        document.getElementById("cities").innerHTML += city;
        document.body.style.cursor = "default";
        return;
      }
    });
  }

  document.body.style.cursor = "default";
};
//* ============ getCities ==============//

//* ============ OkClicked ==============//
function OkClicked() {
  let country, city;
  let Now, todayFull, today, month, year;
  let long, lat, CalDisplayed;

  Now = new Date();
  month = Now.getMonth() + 1;
  year = Now.getFullYear();
  today = Now.getDate();
  if (document.getElementById("Manual").checked) {
    country = document.getElementById("countries").value;
    city = document.getElementById("cities").value;
    document.getElementById("titleCountry").innerHTML = country;
    document.getElementById("titleCity").innerHTML = city;
    CalDisplayed = dataStorage[5];
    dataStorage = [country, city, "Manu", "", "", CalDisplayed];
  } else {
    long = document.getElementById("long").innerHTML;
    lat = document.getElementById("lat").innerHTML;
    document.getElementById("titleCountry").innerHTML = "Longitude : " + long;
    document.getElementById("titleCity").innerHTML = "Latitude : " + lat;
    CalDisplayed = dataStorage[5];
    dataStorage = ["", "", "Auto", long, lat, CalDisplayed];
  }
  if (dataStorage[5] === "") {
    getPrayerTimes(country, city, month, year, long, lat);
  } else {
    fillCalendar();
  }
  SetInLocalStorage();
  //Close the window
  let Window = document.querySelector(".WindowBackground");
  Window.style.visibility = "hidden";
  Window.innerHTML = "";
}
//* ============ OkClicked ==============//

//* ============ initGeolocation ==============//
function initGeolocation() {
  if (navigator.geolocation) {
    // Call getCurrentPosition with success and failure callbacks
    navigator.geolocation.getCurrentPosition(success, fail);
  } else {
    alert("Sorry, your browser does not support geolocation services.");
  }
}
//* ============ initGeolocation ==============//

//* ============ success ==============//
function success(position) {
  document.getElementById("long").innerHTML = position.coords.longitude;
  document.getElementById("lat").innerHTML = position.coords.latitude;
}
//* ============ success ==============//

//* ============ fail ==============//
function fail() {
  // Could not obtain location
}
//* ============ fail ==============//

//* ============ ManuSelected ==============//
function ManuSelected() {
  document.getElementById("ComboBoxes").style.visibility = "visible";
  document.getElementById("LongLatitude").style.visibility = "hidden";
  getCountries();
}
//* ============ ManuSelected ==============//

//* ============ AutoSelected ==============//
function AutoSelected() {
  document.getElementById("long").innerHTML == "" ? initGeolocation() : "";
  document.getElementById("ComboBoxes").style.visibility = "hidden";
  document.getElementById("LongLatitude").style.visibility = "visible";
}
//* ============ AutoSelected ==============//

//* ============ Settings ==============//
function Settings() {
  let ManuCheck, AutoCheck;
  if (dataStorage[2] === "Manu") {
    ManuCheck = "checked";
    AutoCheck = "";
  } else {
    ManuCheck = "";
    AutoCheck = "checked";
  }
  let content = `
        <div class="Window">
            <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
                    <p>Choose your favorite localisation method:</p>
                    <form>
                        <input type="radio" id="Manual" ${ManuCheck} name="fav_localisation" value="Manual" onclick="ManuSelected()">
                        <label for="Manual">Manual: Country and City</label><br>
                        <input type="radio" id="Auto" ${AutoCheck} name="fav_localisation" value="Automatic" onclick="AutoSelected()">
                        <label for="Auto">Automatic: Longitude and Latitude</label><br>
                    </form> 
            </div>

            <div id="ComboBoxes">
                <div>
                    <label for="countries">Country :</label>
                    <select name ="countries" id="countries"></select>
                </div>
                <div>
                    <label for="cities">City : </label>
                    <select name ="cities" id="cities"></select>
                </div>
            </div>
            <div id="LongLatitude">
                <div>
                    <label>Longitude : </label><span id="long"></span>
                </div>
                <div>
                    <label>Latitude : </label><span id="lat"></span>
                </div>
                
            </div>
            
            <div class = "Buttons">
                <button onclick="OkClicked()" class="OK_btn">OK</button>
                <button onclick="CancelClicked()" class="Cancel_btn">Cancel</button>
            </div>
        </div>
        
    `;
  let Window = document.querySelector(".WindowBackground");
  Window.style.visibility = "visible";
  Window.innerHTML = content;

  if (dataStorage[2] == "Auto") {
    document.getElementById("LongLatitude").style.visibility = "visible";
    document.getElementById("ComboBoxes").style.visibility = "hidden";
    document.getElementById("long").innerHTML = dataStorage[3];
    document.getElementById("lat").innerHTML = dataStorage[4];
  } else {
    document.getElementById("ComboBoxes").style.visibility = "visible";
    document.getElementById("LongLatitude").style.visibility = "hidden";
    getCountries();
  }
  // InitSettingWindow()
}
//* ============ Settings ==============//

//* ============ CancelClicked ==============//
function CancelClicked() {
  //Close the window
  let Window = document.querySelector(".WindowBackground");
  Window.style.visibility = "hidden";
  Window.innerHTML = "";
}
//* ============ CancelClicked ==============//

//* ============ SetInLocalStorage ==============//
function SetInLocalStorage() {
  localStorage.setItem("Data", JSON.stringify(dataStorage));
}
//* ============ SetInLocalStorage ==============//

//* ============ Init ==============//
function Init() {
  let country, city;
  let Now, todayFull, today, month, year;
  let long, lat;

  document.body.style.cursor = "wait";
  Now = new Date();
  month = Now.getMonth() + 1;
  year = Now.getFullYear();
  today = Now.getDate();

  if (dataStorage[5] === "") {
    if (dataStorage[2] === "Manu") {
      country = dataStorage[0];
      city = dataStorage[1];
      document.getElementById("titleCountry").innerHTML = country;
      document.getElementById("titleCity").innerHTML = city;
      getPrayerTimes(country, city, month, year, long, lat);
    } else {
      let long = dataStorage[3];
      let lat = dataStorage[4];
      document.getElementById("titleCountry").innerHTML = "Longitude : " + long;
      document.getElementById("titleCity").innerHTML = "Latitude : " + lat;
      getPrayerTimes(country, city, month, year, long, lat);
    }
  } else {
    if (dataStorage[2] === "Manu") {
      country = dataStorage[0];
      city = dataStorage[1];
      document.getElementById("titleCountry").innerHTML = country;
      document.getElementById("titleCity").innerHTML = city;
    } else {
      let long = dataStorage[3];
      let lat = dataStorage[4];
      document.getElementById("titleCountry").innerHTML = "Longitude : " + long;
      document.getElementById("titleCity").innerHTML = "Latitude : " + lat;
    }
    let TimesTable = document.getElementById("timesDiv");
    document.querySelector(".TimesTableWrap").removeChild(TimesTable);
    fillCalendar();
  }

  document.getElementById("CalendarIcon").addEventListener("click", Calendar);

  document.body.style.cursor = "default";
}
//* ============ Init ==============//

//* ============ getDataFromStorage ==============//
function getDataFromStorage() {
  let DataFromStorage;
  DataFromStorage = JSON.parse(localStorage.getItem("Data"));
  if (DataFromStorage != null) {
    dataStorage = DataFromStorage;
  } else {
    dataStorage = [
      "Saudia Arabia", //Country
      "Mecca", //City
      "Manu", //Manu: set adress with Country and City ||| Auto: Longitude + Latitude
      "0", //Longitude
      "0", //Latitude
      "", // Calendar window is active
    ];
  }
}
//* ============ getDataFromStorage ==============//

//* ============ fillCalendar ==============//
let fillCalendar = async () => {
  let url;
  let Now, month, year;
  let todayFull, today;

  document.body.style.cursor = "wait";
  Now = new Date();
  month = Now.getMonth() + 1;
  year = Now.getFullYear();
  today = Now.getDate();
  todayFull = today + "-" + month + "-" + year;
  if (dataStorage[2] === "Manu") {
    let country, city;
    country = dataStorage[0];
    city = dataStorage[1];
    url = `https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=3&month=${month}&year=${year}`;
    document.getElementById("titleCountry").innerHTML = country;
    document.getElementById("titleCity").innerHTML = city;
  } else {
    let long, lat;
    long = dataStorage[3];
    lat = dataStorage[4];
    url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${long}&method=3&month=${month}&year=${year}`;
    document.getElementById("titleCountry").innerHTML = "Longitude : " + long;
    document.getElementById("titleCity").innerHTML = "Latitude : " + lat;
  }

  let response = await fetch(url);
  let json = await response.json();
  let content = `
        <tr>
            <th><p>التقويم</p><p>الهجري</p></th>
            <th><p>الفجر</p><p>Fajr</p></th>
            <th><p>الشروق</p><p>Sunrise</p></th>
            <th><p>الظهر</p><p>Dhuhr</p></th>
            <th><p>العصر</p><p>Asr</p></th>
            <th><p>المغرب</p><p>Maghrib</p></th>
            <th><p>العشـاء</p><p>Isha</p></th>
            <th><p>Gregorian</p><p>Calendar</p></th>
        </tr>
    `;
  document.querySelector("#CalendarContent table").innerHTML = content;
  json.data.forEach((element) => {
    let Fajr = element.timings.Fajr.slice(0, 5);
    let Sunrise = element.timings.Sunrise.slice(0, 5);
    let Dhuhr = element.timings.Dhuhr.slice(0, 5);
    let Asr = element.timings.Asr.slice(0, 5);
    let Maghrib = element.timings.Maghrib.slice(0, 5);
    let Isha = element.timings.Isha.slice(0, 5);

    let dateGreg = element.date.gregorian.date;
    let dateHijri = element.date.hijri.date;
    if (todayFull === element.date.gregorian.date) {
      content += `
                <tr>
                    <td id="today">${dateHijri}</td>
                    <td id="today">${Fajr}</td>
                    <td id="today">${Sunrise}</td>
                    <td id="today">${Dhuhr}</td>
                    <td id="today">${Asr}</td>
                    <td id="today">${Maghrib}</td>
                    <td id="today">${Isha}</td>
                    <td id="today">${dateGreg}</td>
                </tr>
        `;
    } else {
      content += `
            <tr>
                <td>${dateHijri}</td>
                <td>${Fajr}</td>
                <td>${Sunrise}</td>
                <td>${Dhuhr}</td>
                <td>${Asr}</td>
                <td>${Maghrib}</td>
                <td>${Isha}</td>
                <td>${dateGreg}</td>
            </tr>
        `;
    }
  });
  document.querySelector("#CalendarContent table").innerHTML = content;
  document.body.style.cursor = "default";
};
//* ============ fillCalendar ==============//

//* ============ Calendar ==============//
function Calendar() {
  let TimesTable = document.getElementById("timesDiv");
  let CalendarContent = document.getElementById("CalendarContent");
  let content = "";

  if (!TimesTable) {
    //Calendar displayed
    document.querySelector(".Calendar").removeChild(CalendarContent);
    content = `
            <div id="timesDiv">
                <div>
                    <table id="dateTable">
                        <tr>
                            <td id="TodayHijri"> </td>
                            <td id="TodayGreg"></td>
                        </tr>
                    </table>
                </div>

                <table id="TimesLeftTable">
                    <tr>
                        <td>الوقت المتبقي </td>
                        <td  id="TimesLeftCell"></td>
                        <td>Time Left </td>
                    </tr>
                </table>

                <table id="TimesTable">
                    <tr id="raw">
                        <td>الفجر </td>
                        <td class="TimesUnpair" id="Fajr"></td>
                        <td>Fajr</td>
                    </tr>
                    <tr>
                        <td>الشروق </td>
                        <td class="TimesPair" id="Sunrise"></td>
                        <td>Sunrise</td>
                    </tr>
                    <tr id="raw">
                        <td>الظهر </td>
                        <td class="TimesUnpair" id="Dhuhr"></td>
                        <td>Dhuhr</td>
                    </tr>
                    <tr>
                        <td>العصر </td>
                        <td class="TimesPair" id="Asr"></td>
                        <td>Asr</td>
                    </tr>
                    <tr id="raw">
                        <td>المغرب </td>
                        <td class="TimesUnpair" id="Maghrib"></td>
                        <td>Maghrib</td>
                    </tr>
                    <tr>
                        <td>العشـاء </td>
                        <td class="TimesPair" id="Isha"></td>
                        <td>Isha</td>
                    </tr>
                </table>
            </div>
        `;
    document.querySelector(".TimesTableWrap").innerHTML += content;
    document.getElementById("CalendarIcon").removeAttribute("style");
    dataStorage[5] = "";
    Init();
  } else {
    document.querySelector(".TimesTableWrap").removeChild(TimesTable);
    content = `
            <div id="CalendarContent">
                <table>
                    
                </table>
            </div>
        `;
    document.querySelector(".Calendar").innerHTML = content;
    document
      .getElementById("CalendarIcon")
      .setAttribute("style", "color: greenyellow;");
    dataStorage[5] = "Calendar";
    fillCalendar();
    clearInterval(Timer);
  }
  SetInLocalStorage();
}
//* ============ Calendar ==============//

//* ============ InitSettingWindow ==============//
function InitSettingWindow() {
  if (dataStorage[2] === "Manu") {
    //Init Radio
    let Radio = document.getElementById("Manual");
    Radio.setAttribute("checked", "checked");
    Radio = document.getElementById("Auto");
    Radio.removeAttribute("checked");
    //Init Radio - End
  } else {
    //Init Radio
    let Radio = document.getElementById("Auto");
    Radio.setAttribute("checked", "checked");
    Radio = document.getElementById("Manual");
    Radio.removeAttribute("checked");
    //Init Radio - End
    document.getElementById("long").innerHTML = dataStorage[3];
    document.getElementById("lat").innerHTML = dataStorage[4];
  }
  getCountries();
}
//* ============ InitSettingWindow ==============//

var dataStorage = [];
var Timer;
var PrayerTimesTab = [];
var LastPrayer = "";
getDataFromStorage();
Init();
