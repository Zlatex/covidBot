import fs from 'fs';

export function sub(ctx) {//добавляет чат в список чатов для рассылки
    var users = fs.readFileSync('./chats.json');// Получение текущего часта
    users = JSON.parse(users);
    if (users[0].includes(ctx.update.message.chat.id)) return ctx.reply('Данный чат уже есть получает рассылку'); //Проверка на то, получает ли чат уже рассылку, если да, то выходит с программы
    users[0].push(ctx.update.message.chat.id);//Добавление чата в список
    fs.writeFileSync('./chats.json', JSON.stringify(users)) // Сохранение файла
    ctx.reply('Вы успешно подписались');
}
export function unsub(ctx) {//удаляет чат с списока чатов для рассылки
    var users = fs.readFileSync('./chats.json');// Получение текущего часта
    users = JSON.parse(users);
    const userIndex  = users[0].indexOf(ctx.update.message.chat.id);// Получение индекса чата в списке
    if (userIndex == -1) return ctx.reply('Вы не подписаны');//Если нет в списке - выходим и отправляем соотвествующеё сообщение
    users[0].splice(userIndex,1);// Удаление пользователя с списка
    fs.writeFileSync('./chats.json', JSON.stringify(users)) // Сохранение файла
    ctx.reply('Вы успешно отписались');
}