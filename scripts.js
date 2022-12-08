const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function capitalize_name(city_name){
  let words = city_name.split(" ");
  let new_city_name="";
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  new_city_name = words.join(" ");
  return new_city_name;
}

class City_data_unit {
  constructor(
    time_info,
    location_info,
    temp_info,
    description_info,
    humidity_info,
    wind_speed_info,
    visibility_info,
    pressure_info,
    icon_info
  ) {
    this.time_info = time_info;
    this.location_info = location_info;
    this.temp_info = temp_info;
    this.description_info = description_info;
    this.humidity_info = humidity_info;
    this.wind_speed_info = wind_speed_info;
    this.visibility_info = visibility_info;
    this.pressure_info = pressure_info;
    this.icon_info=icon_info;
  }
}

const weather_app = (() => {
  let input_city_name = "Beijing";
  let input_country_code = "CN";

  const create_search_box =  () => {


    const weather_section = document.querySelector(".weather_section");
    weather_section.innerHTML = `<h1>weather forecast</h1>
    <form id="location_form">
      <span class="location_flex">
        <label for="location_country">Country Code:</label>
          <input
            required
            type="text"
            name="location_country"
            id="location_country"
            placeholder="e.g. US"
          />
      </span>
      <span class="location_flex">
        <label for="location_city">City Name:</label>
        <input
          required
          type="text"
          name="location_city"
          id="location_city"
          placeholder="e.g. New York"
        />
      </span>
      <button id="search" type="submit" >Search</button>
    </form>`;
  };

  const create_loading_component =()=>{
    
    const loading_component = document.createElement("div");
    loading_component.innerHTML = `<div class="loadingio-spinner-dual-ball-m3olvrazpq9"><div class="ldio-gi7vg4f000f">
    <div></div><div></div><div></div>
    </div></div>`;
    const weather_section = document.querySelector(".weather_section");
    weather_section.innerHTML="";
    weather_section.appendChild(loading_component);
  }

  const get_weather_info = async () => {
    console.log("it is processing!");
    create_loading_component();
    return await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input_city_name},${input_country_code}&appid=395e7f4eb5715d9f27ce7b001301bd4d&units=metric`,
      {
        mode: "cors",
      }
    )
      .then(function (response) {
        if (response["status"] === 404) throw new Error("Not Found City");

        const target_info = response.json().then((result) => {
          const current_time = new Date();
          const utc0_time = new Date(
            current_time.getUTCFullYear(),
            current_time.getUTCMonth(),
            current_time.getUTCDate(),
            current_time.getUTCHours(),
            current_time.getUTCMinutes(),
            current_time.getUTCSeconds()
          );
          const local_timestamp = new Date(
            utc0_time.getTime() + result["timezone"] * 1000
          );

          const local_time = `${
            month[local_timestamp.getMonth()]
          } ${local_timestamp.getDate()}, ${local_timestamp.toLocaleTimeString()}`;

          const country_name = result["sys"]["country"];
          const location_name = `${capitalize_name(input_city_name)}, ${country_name}`;
          const temp = `${result["main"]["temp"]}°C`;
          const description = result["weather"][0]["description"];
          const humidity = `${result["main"]["humidity"]}%`;
          const windspeed = `${result["wind"]["speed"]}m/s`;
          const visibility = `${result["visibility"]}m`;
          const pressure = `${result["main"]["pressure"]}hPa`;
          const icon = `${result["weather"][0]["icon"]}`;

          const target_info = new City_data_unit(
            local_time,
            location_name,
            temp,
            description,
            humidity,
            windspeed,
            visibility,
            pressure,
            icon
          );


          const weather_section = document.querySelector(".weather_section");
          weather_section.target = target_info;
          return target_info;
        });

        return target_info;
      })
      .catch(function (err) {
        throw err;
      });
  };

  const display_details = () => {
    const weather_section = document.querySelector(".weather_section");


    const data_display = document.createElement("div");
    data_display.classList.add("data_display");
    data_display.innerHTML = `<h2>Details</h2>
    <div class="data_grid_1">
      <div class="data_details">   

        <p>${weather_section.target["time_info"]}</p>
        <p>${weather_section.target["location_info"]}</p>
        <p>${weather_section.target["temp_info"]}</p>
        <div class="data_grid_2">
          <span>Description:</span>
          <span>${weather_section.target["description_info"]}</span>
          <span>Humidity:</span>
          <span>${weather_section.target["humidity_info"]}</span> 
          <span>Wind Speed:</span>
          <span>${weather_section.target["wind_speed_info"]}</span> 
          <span>Visibility:</span>
          <span>${weather_section.target["visibility_info"]}</span>
          <span>Pressure:</span>
          <span>${weather_section.target["pressure_info"]}</span>
        </div>
      </div>
      <span class="image_span">
        <img
          src="https://openweathermap.org/img/wn/${weather_section.target["icon_info"]}@2x.png"
          alt="${weather_section.target["description_info"]}"
        />
      </span>
      <span class="button_span">
        <button type="reset" >Back</button>
      </span>
    </div>`;
    weather_section.innerHTML = "";



    weather_section.appendChild(data_display);

    const back_button = document.querySelector(".button_span>button");
    back_button.addEventListener("click", flow_controller );
     

  };

  const get_location_id = () => {
 
    const location_form = document.querySelector("#location_form");

    function log_the_location(e) {
      
      const formData = new FormData(e.target);
      input_city_name = formData.get("location_city");
      input_country_code = formData.get("location_country");
      get_weather_info().then((result) => {
        display_details();
      }).catch( (err) =>{
        alert(err);
        flow_controller();
      } )

      e.preventDefault();
    }

    location_form.addEventListener("submit", log_the_location);
  };

  const flow_controller = () => {
    create_search_box();
    get_location_id();
  };
  return { flow_controller };
})();

weather_app.flow_controller();
