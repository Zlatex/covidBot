var CovidInfo = undefined;
import fetch from 'node-fetch';
import fs from 'fs';

export async function Start (callback,country){
    await fetch('https://corona.lmao.ninja/v2/countries/804?yesterday=false&strict&query%20')
    .then(res => res.text())
    .then(body => CovidInfo = JSON.parse(body));
    checkAndPost(callback);  
}

export async function checkAndPost (callback){
    if (!CovidInfo) return;
    var status = fs.readFileSync('./status.json');
    status = JSON.parse(status);
    if (status.updated !== CovidInfo.updated) {
        callback(CovidInfo.updated,CovidInfo.cases,CovidInfo.todayCases,
            CovidInfo.deaths,CovidInfo.todayDeaths,CovidInfo.recovered,
            CovidInfo.active,CovidInfo.critical,CovidInfo.tests);
        fs.writeFileSync('./status.json', JSON.stringify(CovidInfo));
    }
}