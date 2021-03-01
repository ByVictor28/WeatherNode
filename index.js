const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(cors());

let options = { weekday: 'long', month: 'short', day: 'numeric' };
app.get("/city", async (req,res) => {
    
    const city = req.query.city;
    const units = req.query.units;
    try {
        const byCityName = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.SECRET_KEY}&units=${units}`);
        // console.log(byCityName.data);
        const coords = byCityName.data.coord;
        
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=current,hourly,minutely,alerts&appid=${process.env.SECRET_KEY}&units=${units}`)
        
        // console.log(response.data);

        
        const weekWeather = response.data.daily.map(day => {
            
            return {
                date:new Date(day.dt * 1000).toLocaleDateString("en-US", options),
                icon:day.weather[0].icon,
                top:day.temp.min,
                buttom:day.temp.max
            }
        });

        const format = {
            current:{
                place:byCityName.data.name,
                temp:byCityName.data.main.temp,
                description:`${byCityName.data.weather[0].main} - ${byCityName.data.weather[0].description}`,
                date:byCityName.data.dt,
                icon:byCityName.data.weather[0].icon    
            },
            daily:weekWeather,
            Hightlights:{
                wind: {
                    pressure:byCityName.data.wind.speed,
                    deg :byCityName.data.wind.deg, 
                },
                humidity:byCityName.data.main.humidity,
                visibility: byCityName.data.visibility,
                pressure:byCityName.data.main.pressure,
            }
        }
        

        res.status(200).send(format)

    } catch (error) {
        console.log(error.message); 
        res.status(404).send({error:error.message})
    }
})
app.get("/coords", async (req,res) => {
    
    const lat = req.query.lat;
    const lon = req.query.lon;
    const units = req.query.units;
    
    try {
        const byCityName = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.SECRET_KEY}&units=${units}`);
        // console.log(byCityName);
        const coords = byCityName.data.coord;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=hourly,minutely,alerts&appid=${process.env.SECRET_KEY}&units=${units}`)
        // console.log(response.data);
         
        const weekWeather = response.data.daily.map(day => {
            return {
                date:new Date(day.dt * 1000).toLocaleDateString("en-US", options),
                icon:day.weather[0].icon,
                top:day.temp.min,
                buttom:day.temp.max
            }
        });

        const format = {
            current:{
                place:byCityName.data.name,
                temp:byCityName.data.main.temp,
                description:`${byCityName.data.weather[0].main} - ${byCityName.data.weather[0].description}`,
                date:byCityName.data.dt,
                icon:byCityName.data.weather[0].icon    
            },
            daily:weekWeather,
            Hightlights:{
                wind: {
                    pressure:byCityName.data.wind.speed,
                    deg :byCityName.data.wind.deg, 
                },
                humidity:byCityName.data.main.humidity,
                visibility: byCityName.data.visibility,
                pressure:byCityName.data.main.pressure,
            }
        }
        res.status(200).send(format)
    } catch (error) {
        // console.log(error.data); 
        res.status(404).send({error:error.message})
    }
})

app.listen( PORT , () => {
    console.log("Listening in port: " + PORT);
}) 