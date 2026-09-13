# DemoQA AQA tests (Playwright + TypeScript)

UI- и API-тесты для [DemoQA](https://demoqa.com/) как тестовое задание на позицию AQA.

## Требования

- Node.js 18+ (рекомендуется LTS)
- npm 9+
- доступ в интернет к `https://demoqa.com`

## Установка

```bash
npm install
npx playwright install chromium
```

Тесты запускаются в стандартном Playwright Chromium (проект `chromium` в `playwright.config.ts`).

## Запуск тестов

Весь suite:

```bash
npm test
```

С Playwright UI Mode:

```bash
npm run test:ui
```

Только UI:

```bash
npm run test:ui-suite
```

Только API:

```bash
npm run test:api
```

Отчёт после прогона:

```bash
npm run report
```

## Структура проекта

```text
├── playwright.config.ts      # конфиг Playwright (baseURL, chromium)
├── src/
│   ├── api/                  # тонкие клиенты поверх APIRequestContext
│   ├── data/                 # тестовые данные и генерация credentials
│   ├── fixtures/             # кастомные fixtures (pages, API, authorizedUser)
│   └── pages/                # Page Object для UI
└── tests/
    ├── ui/                   # UI-сценарии
    └── api/                  # API-сценарии
```

## Подход

### UI

Сценарий Web Tables идёт по пути из задания: главная → Elements → Web Tables → Add → форма → Submit.

Page Object (`HomePage`, `WebTablesPage`) держит локаторы и шаги страницы. Локаторы — `getByRole` и стабильные `#id` полей формы. Проверка добавления записи опирается на **email** (`test@test.com`), потому что в таблице уже есть другой Alden Cantrell.

### API

Клиенты `AccountApi` / `BookStoreApi` используют встроенный Playwright `request` (`APIRequestContext` с `baseURL` из конфига).

Покрыто:

- создание пользователя (`POST /Account/v1/User`);
- добавление книги (`POST /BookStore/v1/Books`) с предварительным получением токена;
- удаление книг (`DELETE /BookStore/v1/Books?UserId={userId}`);
- негативы: невалидный пароль, add/delete без Authorization.

ISBN зафиксирован константой (`9781449325862`, Git Pocket Guide) — каталог общий и read-only.

### Fixtures

`src/fixtures/test.ts` расширяет базовый `test`:

- `homePage` / `webTablesPage` — готовые POM;
- `accountApi` / `bookStoreApi` — клиенты на встроенном `request`;
- `createdUser` → `authorizedUser` — создание пользователя, JWT и cleanup в `try/finally` (удаление при наличии `userId` и `token`).

Так API-тесты книг не дублируют setup/auth/cleanup и остаются независимыми при параллельном и повторном запуске.

Публичный DemoQA API иногда отвечает с задержками или обрывает TLS при высокой конкуренции, поэтому в конфиге ограничены `workers` и включён один локальный retry.
