var CovidInfo = undefined;
import fetch from 'node-fetch';
import fs from 'fs';

export async function Start (callback,country){
    await fetch('https://api.covid19api.com/total/country/' + country)
    .then(res => res.text())
    .then(body => CovidInfo = JSON.parse(body)[JSON.parse(body).length-1]);
    checkAndPost(callback);  
}

export async function checkAndPost (callback){
    if (!CovidInfo) return;
    var status = fs.readFileSync('./status.json');
    status = JSON.parse(status);
    if (status.Date !== CovidInfo.Date) {
        callback(CovidInfo.Date,CovidInfo.Confirmed,CovidInfo.Confirmed - status.Confirmed,CovidInfo.Deaths,CovidInfo.Recovered);
        fs.writeFileSync('./status.json', JSON.stringify(CovidInfo));
    }
}