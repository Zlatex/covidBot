import fs from 'fs';
import * as botInfo from './botInfo.js' //Статичная информация для дальнейшего использования ботом


export function sub(ctx) {//добавляет чат в список чатов для рассылки
    var users = fs.readFileSync('./chats.json');// Получение текущего списка чатов
    users = JSON.parse(users);
    if (users[0].includes(ctx.update.message.chat.id)) return ctx.reply('Данный чат уже есть получает рассылку'); //Проверка на то, получает ли чат уже рассылку, если да, то выходит с программы
    users[0].push(ctx.update.message.chat.id);//Добавление чата в список
    fs.writeFileSync('./chats.json', JSON.stringify(users)) // Сохранение файла
    ctx.reply('Вы успешно подписались');
}
export function unsub(ctx) {//удаляет чат с списока чатов для рассылки
    var users = fs.readFileSync('./chats.json');// Получение текущего списка чатов
    users = JSON.parse(users);
    const userIndex  = users[0].indexOf(ctx.update.message.chat.id);// Получение индекса чата в списке
    if (userIndex == -1) return ctx.reply('Вы не подписаны');//Если нет в списке - выходим и отправляем соотвествующеё сообщение
    users[0].splice(userIndex,1);// Удаление пользователя с списка
    fs.writeFileSync('./chats.json', JSON.stringify(users)) // Сохранение файла
    ctx.reply('Вы успешно отписались');
}

//Меняет дату карантина
export function quarantine(ctx){
    if (botInfo.Admins.includes(ctx.update.message.from.id) == -1) return ctx.reply('Вы не администратор'); // Если не администратор - выходим
    if (ctx.match.length < 2) return ctx.reply('Не верный формат (/quarantine DD.MM.YYYY)'); //Если не передано никаних значений - выходим
    const value = ctx.match[1];// Записывем переданое значение в переменную
    var info = fs.readFileSync('./botinfo.json'); //"Открываем" файл с инфой
    info = JSON.parse(info);
    var date = value.split(".");//Делим переданое значение на масив (0 - Дата, 1 - Месяц, 2 - Год)
    if (date.length < 3 | date.length > 3 | date[2].length != 4) 
        return ctx.reply('Не верный формат (/quarantine DD.MM.YYYY)'); //Если менше либо больше 3 значений или значение года не равно YYYY - выходим
    date = new Date(`${date[2]}-${date[1]}-${date[0]}`);//Переводим значение в Date формат(Это не обязательно)
    info.quarantine = date;//Заменям старую дану на новую
    fs.writeFileSync('./botinfo.json', JSON.stringify(info)) // Сохраненяем файл
    ctx.reply('Дата успешно изменена');
}

//Пишет сколько осталось до окончания карантина
export function q(ctx){
    const StaticInfo = fs.readFileSync('./botinfo.json');
    const quarantineEndDate = new Date(JSON.parse(StaticInfo).quarantine);
    const NowDATE = new Date();// Текущее время
    const leftDays = parseInt((quarantineEndDate-NowDATE) / 60000 / 60 / 24)// Осталось дней до конца карантина
    ctx.reply(`До закінчення карантину залишилось ${leftDays} днів`);
}