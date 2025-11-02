# vue3-inventory
## ЧГК?
Небольшое демо некого рпг инвентаря.

Реализовано два варианта:
- / главный экран с видом некого инвентаря, где можно увеличить число предметов, уменьшить и полностью удалить стак.
- /split-view некий фристаил на тему окна обмена или продажи. Тут реализована идея, что в левой части экрана наш инвентарь, в правой - некий торговец с каждый раз уникальным ассортиментом.

Для своего инвентаря реализовано сохранение в LocalStorage с синхронизацией обновления данных в другой вкладке барузера.

В проекте использован Vue, Pinia, TailwindCSS, Vite.

# Cтруктура проекта

Краткое описание директорий и их назначения

---

### `/assets`
Ресурсы приложения — глобальные стили, изображения и т.п.

---

### `/components`
UI-компоненты.
Разделены по уровням абстракции:
- `atoms` — базовые, переиспользуемые элементы интерфейса (кнопки, карточки, и т.п.).
- `features` — более крупные компоненты, реализующие конкретную бизнес-логику (работа с инвентарём).

---

### `/composables`
Переиспользуемая логика Vue.

---

### `/data-source`
Слой работы с данными — моки, и имитация API.

---

### `/pages`
Компоненты-страницы, соответствующие маршрутам приложения.
Тут происходит сборка фич и атомов в единое целое, а так же идеальное место, чтобы вытаскивать, например квери параметры для их использовать в фичах.

---

### `/stores`
Состояние приложения.
Хранение, сериализация и управление данными (например, содержимое инвентаря).

---

### `/types`
Типы и структуры данных.

---

### `/utils`
Мелкие вспомогательные функции — форматирование, логирование, объединение классов и т.п.
Не зависят от Vue и могут использоваться в любом месте проекта или уехать в отдельный пакет.

---

### Корневые файлы
- `App.vue` — корневой компонент приложения.
- `main.ts` — точка входа, инициализация Vue, Pinia и роутера.
- `router.ts` — конфигурация маршрутов.

---

## Быстрый старт

```sh
npm install
```
### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Preview

```sh
npm run preview -- --host
```


## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).
