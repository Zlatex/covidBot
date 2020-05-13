var CovidInfo = undefined;
import fetch from 'node-fetch';
import fs from 'fs';

export async function Start (callback,country){
    await fetch(`https://corona.lmao.ninja/v2/countries/${country}?yesterday=false&strict&query%20`)
    .then(res => res.text())
    .then(body => CovidInfo = JSON.parse(body)); // Присваивает переменной CovidInfo актуальные данны об коронавирусе
    checkAndPost(callback);  //Проверить изменились ли данные с последней рассылки
}

export async function checkAndPost (callback){
    if (!CovidInfo) return;//Если CovidInfo = undefined, то выходим
    var status = fs.readFileSync('./status.json');// Информация об последней рассылке
    status = JSON.parse(status);
    if (status.cases === CovidInfo.cases) return; // Если данные совпадают, то выходим
    
    callback(CovidInfo.updated,CovidInfo.cases,CovidInfo.todayCases, //
        CovidInfo.deaths,CovidInfo.todayDeaths,CovidInfo.recovered, // возвращает в main.js информацию об коронавирусе, чтобы отправить её пользователям
        CovidInfo.active,CovidInfo.critical,CovidInfo.tests);      // 

    fs.writeFileSync('./status.json', JSON.stringify(CovidInfo));//Сохранение актуальной информации
}

export async function infoCounty (ctx){
    if (ctx.match.length < 2) return ctx.reply('Не верный формат (/covid county)'); //Если не передано никаних значений - выходим
    var CovidInfo;
    const country = ctx.match[1];
    try{
        await fetch(`https://corona.lmao.ninja/v2/countries/${country}?yesterday=false&strict&query%20`)
        .then(res => res.text())
        .then(body => CovidInfo = JSON.parse(body)); // Присваивает переменной CovidInfo актуальные данны об коронавирусе
        if (CovidInfo.message) return ctx.reply('Старана не найдена'); //Если страна не найдена - выходим
        ctx.reply(`
            Коронавірус в ${CovidInfo.country}\n\nВсього захворіло: ${CovidInfo.cases}(${CovidInfo.todayCases} нових)\
            \nВсього хворих: ${CovidInfo.active}(${CovidInfo.critical} в критичному стані)\nПомерло: ${CovidInfo.deaths}(${CovidInfo.todayDeaths} нових)\
            \nВиліковано: ${CovidInfo.recovered}\nВсього протестовано: ${CovidInfo.tests}
            `)//Отправка сообщения
    }catch(err){ctx.reply('Ошибка')}
    


}