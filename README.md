# kryzhov-profile-gql

Цифровая визитка: GraphQL API на NestJS, Prisma и PostgreSQL. Отдаёт мой профиль, навыки, опыт работы и проекты.

## Запуск в Docker

Нужны Git и Docker с Docker Compose.

```bash
git clone https://github.com/liringlas/kryzhov-profile-gql.git
cd kryzhov-profile-gql
cp .env.example .env
docker compose up --build
```

При старте контейнер применяет миграции и заполняет базу из `src/seed/profile.json`. Apollo Sandbox: http://localhost:3000/graphql (порт задаёт `APP_PORT` в `.env`).

## Запуск приложения без Docker

Нужен Node.js 24. Nest CLI и Prisma CLI ставить глобально не надо, они в devDependencies.

```bash
cp .env.example .env
docker compose up -d db     # только PostgreSQL
npm ci                      # postinstall генерирует Prisma Client
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

## Данные на русском и английском

По умолчанию база заполняется на русском из `src/seed/profile.json`. Английская версия лежит в `src/seed/profile.en.json`:

```bash
cp src/seed/profile.en.json src/seed/profile.json
docker compose up --build   # без Docker: npx prisma db seed и перезапуск приложения
```

Вернуть русский: `git checkout src/seed/profile.json`.

Имя профиля служит первичным ключом и значением аргумента `name` по умолчанию, поэтому зависит от языка: «Константин Рыжов» в русской версии, «Konstantin Ryzhov» в английской. Запрос без `name` вернёт профиль, который сейчас в базе, а с именем из другой версии вернёт `null`.

## Пример запроса

```graphql
query {
  profile {
    name
    description
    links {
      name
      url
    }
    skills {
      name
    }
    experiences {
      company
      title
      startDate
      endDate
      achievements {
        description
      }
    }
    projects {
      name
      description
      url
    }
  }
}
```
