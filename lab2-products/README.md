# Лабораторная работа №2 — Товары (Next.js App Router)

Вариант 2 — Products. Данные берутся из [DummyJSON](https://dummyjson.com/docs/products).

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на http://localhost:3000.

Адрес API можно поменять переменной окружения `DUMMYJSON_URL` (по умолчанию `https://dummyjson.com`).

## Что есть в проекте

- список товаров с поиском и пагинацией (`limit` / `skip`);
- страница товара с динамическим маршрутом `/products/[id]`;
- добавление и удаление — через Server Functions (`app/products/actions.ts`);
- изменение — через Route Handler `PUT /api/products/[id]`, с оптимистичным обновлением;
- состояния загрузки (`loading.tsx`, скелетоны), пустого результата, ошибки (`error.tsx`),
  повторной загрузки при показанных данных и отправки мутации;
- общее клиентское состояние — Zustand (`store/`);
- кэширование запросов — `'use cache'` + `cacheLife` + `cacheTag` (`lib/products.ts`).

DummyJSON только имитирует изменения и ничего не сохраняет, поэтому добавленные, изменённые
и удалённые товары хранятся в store до перезагрузки страницы.

## Проверка состояний загрузки и ошибки

`scripts/mock-api.mjs` — прокси к DummyJSON, в котором можно включить задержку или ошибку 500:

```bash
node scripts/mock-api.mjs
# в другом терминале (PowerShell):
$env:DUMMYJSON_URL="http://127.0.0.1:4010"; npm run dev
```

Управление прокси: открыть в браузере `http://127.0.0.1:4010/__control?delay=3000` (задержка 3 с)
или `http://127.0.0.1:4010/__control?fail=1` (ошибка 500), сбросить — `?delay=0&fail=0`.

## Структура

```
app/                  страницы, loading.tsx, error.tsx, Server Functions, Route Handler
components/           компоненты интерфейса
hooks/                usePendingNavigation — переход с флагом загрузки
lib/                  слой работы с API (products.ts), типы, адреса
scripts/              mock-api.mjs — прокси для проверки состояний
store/                Zustand store и провайдер
```
