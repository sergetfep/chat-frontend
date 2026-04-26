# Chat Frontend

Frontend-часть для задания **Chat**.

Бейджик сборки: [![CI](https://github.com/sergetfep/chat-frontend/actions/workflows/web.yml/badge.svg?branch=main)](https://github.com/sergetfep/chat-frontend/actions/workflows/web.yml)

## Деплой

- Frontend опубликован на GitHub Pages: [Chat](https://sergetfep.github.io/chat-frontend/)
- Backend развёрнут на [Railway](https://chat-backend-production-3fb4.up.railway.app). Исходники [здесь](https://github.com/sergetfep/chat-backend)

## Запуск

```bash
npm i
npm start
```

Кодовая база взята из [задания](https://github.com/netology-code/ahj-homeworks/tree/AHJ-50/sse-ws/chat/frontend).

Изначально Frontend отправлял запросы на `http://localhost:3000`.

## Что реализовано

- регистрация пользователя через POST /new-user;
- обработка занятого никнейма;
- подключение к WebSocket после успешной регистрации;
- вывод списка пользователей;
- отправка и получение сообщений;
- свои сообщения отображаются справа и подписываются как You;
- сообщения других пользователей отображаются слева;
- при закрытии/обновлении вкладки frontend отправляет сообщение exit, чтобы backend удалил пользователя из списка.

## Ссылка за задание

[8. EventSource, Websockets](https://github.com/netology-code/ahj-homeworks/tree/AHJ-50/sse-ws)
