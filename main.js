import * as botInfo from './botInfo.js' //Статичная информация для дальнейшего использования ботом
import Telegraf  from 'telegraf';
import * as covid from './covid.js'
import fs from 'fs';

const bot = new Telegraf(botInfo.token); 

const dtf = new Intl.DateTimeFormat('ua', { year: '2-digit', month: '2-digit', day: '2-digit' }) //на StackOverwlow нашел, переводит Date в месяци, дни, годы

var postFun = async function (date=null,Confirmed,newConfirmed,Deaths,newDeaths,Recovered,active,critical,tests){//Функция, которая отправляет людям из списка сообщение об ситуации с коронавирусом
    if (date === null) return; // если ничего не приходит (всё переменные равны undefined)
    var users = fs.readFileSync('./chats.json');//Список пользователей, которым нужно отправить рассылку
    users = JSON.parse(users)[0];
    const NowDATE = new Date();// Текущее время
    const leftDays = parseInt((botInfo.quarantineEndDate-NowDATE) / 60000 / 60 / 24)// Осталось дней до конца карантина
    const [{ value: m },,{ value: d },,{ value: y }] = dtf.formatToParts(botInfo.quarantineEndDate); //на StackOverwlow нашел, переводит Date в месяци, дни, годы
    users.forEach(async (id,index)=>{ //Думаю тут всё понятно, масив, который перебирает пользователей, которым нужно отправить рассылку
        if (index % 10 === 0) await sleep(1000)//Каждый 10 пользователей делать паузу так как в телеграме лимиты 30 в секунду(10 чтобы сильно не нагружать бота)
        const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(new Date(date)); 

        bot.telegram.sendMessage(id,`
        Коронавірус в Україні станом на ${mo}.${da}.${ye}\n\nВсього захворіло: ${Confirmed}(${newConfirmed} нових)\
        \nВсього хворих: ${active}(${critical} в критичному стані)\nПомерло: ${Deaths}(${newDeaths} нових)\
        \nВиліковано: ${Recovered}\nВсього протестовано: ${tests}\n\nКарантин до ${m}.${d}.${y}(${leftDays} днів осталось)
        `)//Отправка сообщения
    })
}
covid.Start(postFun,botInfo.Country);

setInterval(()=>covid.checkAndPost(postFun),60000)//Проверяет каждую минуту не появились ли новые данные


var sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms));}


bot.launch()
