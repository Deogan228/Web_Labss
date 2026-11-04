# Лабораторная работа №3 — Товары: валидация, аутентификация, роли, тесты

Вариант 2 — Products. Продолжение ЛР2 (Next.js App Router, данные из [DummyJSON](https://dummyjson.com/docs/products)).

## Запуск

1. Создайте файл `.env.local` с секретом для сессий (образец — `.env.example`):

   ```bash
   npx auth secret
   ```

2. Установите зависимости и запустите приложение:

   ```bash
   npm install
   npm run dev
   ```

Приложение откроется на http://localhost:3000.

## Учётные записи

Вход выполняется через DummyJSON (`POST /auth/login`), роль берётся из профиля пользователя.

| Логин | Пароль | Роль | Права |
| --- | --- | --- | --- |
| `emilys` | `emilyspass` | администратор | просмотр, создание, изменение, удаление |
| `averyp` | `averyppass` | пользователь | просмотр, создание, изменение |

Анонимный пользователь может только просматривать товары.

## Тесты

```bash
npm test           # компонентные тесты (Vitest + React Testing Library + user-event)
npm run coverage   # тесты с отчётом о покрытии (@vitest/coverage-v8), HTML-отчёт — в coverage/
```

## Что добавлено в ЛР3

- Zod-схемы данных (`lib/schemas.ts`): одна схема товара для формы и для сервера, типы через `z.infer`;
  через Zod проверяются также ответы DummyJSON, параметры адреса и переменные окружения;
- вход и выход через Auth.js (`auth.ts`), сессия — зашифрованный JWT в `httpOnly`-cookie;
- роли `user` и `admin` (`lib/permissions.ts`); доступ проверяется на сервере
  в страницах, Server Functions и Route Handler (`lib/session.ts`), `proxy.ts` — только удобный редирект;
- интерфейс на Tailwind CSS + DaisyUI, формы на React Hook Form.

## Структура

```
app/            страницы, loading/error, Server Functions, Route Handlers, вход
components/     компоненты интерфейса
lib/            схемы Zod, права, сессия, слой работы с DummyJSON
store/          Zustand store и провайдер
tests/          компонентные тесты
auth.ts         настройка Auth.js
proxy.ts        редирект анонимного пользователя со страниц создания и изменения
```
