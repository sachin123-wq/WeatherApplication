const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html" , "utf-8");

// console.log(homeFile);

const replaceVal = (tempVal , orgVal) => {

    let temperature = tempVal.replace("{%tempval%}" , orgVal.main.temp);

    temperature = temperature.replace("{%tempmin%}" , orgVal.main.temp_min);    
    // console.log(temperature);
    temperature = temperature.replace("{%tempmax%}" , orgVal.main.temp_max);    
    temperature = temperature.replace("{%location%}" , orgVal.name);    
    temperature = temperature.replace("{%country%}" , orgVal.sys.country);   

    // console.log(temperature);

    return temperature;
};



const server = http.createServer((req,res) => {

    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Jaipur&appid=fe9f5e41e1573eaab77c14a61d8a7bf9").on("data", chunk => {
            // console.log(chunk);
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            // console.log(arrData[0].main.temp);

            const realTimeData = arrData.map( (val) => replaceVal(homeFile , val)).join("");
            res.write(realTimeData);
            // console.log(realTimeData);
        })
        .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
        });
    }
    else{
        res.end("File Not Found");
    }
});

server.listen(8000 , '127.0.0.1');