> We're dsplce.co, check out our work on our website: [dsplce.co](https://dsplce.co) 🖤

# vue-modal

[![Vue version](https://img.shields.io/npm/dependency-version/%40dsplce-co%2Fvue-modal/dev/vue?style=for-the-badge&logo=vuedotjs&logoColor=white&label=%20&color=4FC08D)](https://vuejs.org/)
[![TypeScript version](https://img.shields.io/npm/dependency-version/%40dsplce-co%2Fvue-modal/dev/typescript?style=for-the-badge&logo=typescript&logoColor=white&label=%20&color=3279C6)](https://www.typescriptlang.org/)
[![NPM downloads](https://img.shields.io/npm/dw/%40dsplce-co%2Fvue-modal?style=for-the-badge&color=FF0447)](https://www.npmjs.com/package/@dsplce-co/vue-modal)
[![NPM unpacked size](https://img.shields.io/npm/unpacked-size/%40dsplce-co%2Fvue-modal?style=for-the-badge)](https://www.npmjs.com/package/@dsplce-co/vue-modal)
[![License](https://img.shields.io/npm/l/%40dsplce-co%2Fvue-modal?style=for-the-badge&color=007EC7)](https://www.npmjs.com/package/@dsplce-co/vue-modal)
[![NPM version](https://img.shields.io/npm/v/%40dsplce-co%2Fvue-modal?style=for-the-badge&color=0F80C1)](https://www.npmjs.com/package/@dsplce-co/vue-modal)

🧩 **Call modals imperatively, declare them declaratively** — a minimal, type-safe modal framework for [Vue 3](https://vuejs.org/).

`vue-modal` lets you register a modal once and then drive it from anywhere — open it, close it, hand it fully-typed props — without prop-drilling a single `isOpen` flag through your component tree. It's the elevator, not the staircase: you don't pour a new shaft on every floor, you mount one collector and press the button (`modal.open()`) from wherever you happen to be standing.

## 🖤 Features

- **Type-safe by construction** — `useModal` reads your component's own props and makes you pass the required ones; the wrong shape gets caught by your editor, not by your users.
- **Open and close from anywhere** — modal state lives outside the component tree, so whoever holds the composable holds the off-switch. No `isOpen` ref drilled through five components that don't care.
- **Teleport-rendered** — mount one `<ModalCollector />` and every modal renders at `<body>` with a z-index that _always wins_; no `overflow: hidden` parent clips it in half.
- **Esc _and_ click-outside** — both dismissals wired out of the box, the two things every human reflexively reaches for.
- **Zero CSS to import** — built-in fade (tune it with `transitionDuration`), styles injected straight from the JS; no stylesheet for you to forget.

And the bits you'd expect to _just work_:

- one modal on screen at a time (why would you ever want two? 🤨)
- a `ModalCollector` slot for bringing your own overlay and wrapper
- `<script setup>`-native, Composition API throughout
- an `unplugin` resolver + preset, so `useModal` and `ModalCollector` auto-import themselves

---

## Table of Contents

- [🖤 Features](#-features)
- [📦 Installation](#-installation)
- [🧪 Usage](#-usage)
  - [1. Install the plugin](#1-install-the-plugin)
  - [2. Drop in the collector](#2-drop-in-the-collector)
  - [3. Build a modal](#3-build-a-modal)
  - [4. Open it with useModal](#4-open-it-with-usemodal)
- [📐 API reference](#-api-reference)
  - [VueModalPlugin](#vuemodalplugin)
  - [ModalCollector](#modalcollector)
  - [useModal](#usemodal)
  - [ModalOverlay](#modaloverlay)
  - [What the collector handles](#what-the-collector-handles)
  - [Writing a modal component](#writing-a-modal-component)
- [🎨 Styling](#-styling)
- [🔧 Advanced usage](#-advanced-usage)
  - [Auto-import with unplugin](#auto-import-with-unplugin)
  - [Custom modal overlay and wrapper](#custom-modal-overlay-and-wrapper)
- [🛠️ Requirements](#%EF%B8%8F-requirements)
- [📁 Repo & Contributions](#-repo--contributions)
- [📄 License](#-license)

⸻

## 📦 Installation

```bash
npm install @dsplce-co/vue-modal
# or
yarn add @dsplce-co/vue-modal
# or
pnpm add @dsplce-co/vue-modal
```

That's the whole dependency — it leans on Vue 3 and nothing else you have to install yourself (see [Requirements](#%EF%B8%8F-requirements)).

⸻

## 🧪 Usage

Four steps: install the plugin, drop the collector in once, write a modal, open it. The first two you do a single time; after that it's just `useModal` wherever you need it.

### 1. Install the plugin

The plugin wires up the global modal state every `useModal` call reaches into. Add it in your app entry:

```js
import { createApp } from 'vue';
import VueModalPlugin from '@dsplce-co/vue-modal';
import App from './App.vue';

const app = createApp(App);

app.use(VueModalPlugin);
app.mount('#app');
```

### 2. Drop in the collector

`ModalCollector` is the single place all your modals actually render — your one elevator shaft. Put it once at your app root and never think about it again:

```vue
<template>
  <div id="app">
    <router-view />

    <users-view /> <!-- We'll get to this in a moment -->

    <modal-collector />
  </div>
</template>

<script setup>
import { ModalCollector } from '@dsplce-co/vue-modal';
</script>
```

### 3. Build a modal

Here's the part people expect to be hard and isn't: a modal is just a component. Say you've got a user list and you want an "are you sure?" before deleting one — that confirmation dialog is a plain Vue component that takes props like any other and emits `close` when it's done:

```vue
<template>
  <div class="confirmation-modal">
    <h2>Confirm Action</h2>
    <p>Are you sure you want to delete {{ user.name }}?</p>

    <div class="confirmation-modal__actions">
      <button @click="$emit('close')">Cancel</button>
      <button @click="confirmDelete">Confirm</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from './UsersView.vue';

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['close']);

const confirmDelete = () => {
  props.onConfirm(props.user.id);
  emit('close');
};
</script>

<style>
.confirmation-modal {
  background: white;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
}

.confirmation-modal__actions {
  display: flex;
  gap: .5rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.confirmation-modal__actions button {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.confirmation-modal__actions button:first-child {
  background: #e5e7eb;
}

.confirmation-modal__actions button:last-child {
  background: #ff3b89;
  color: white;
}
</style>
```

### 4. Open it with `useModal`

Now wire it up. `useModal` takes your component and hands back an `open`/`close` pair — and because it read your props, it *knows* `user` and `onConfirm` are required and won't let you call `open()` without them:

```vue
<template>
  <div class="users-view">
    <!-- ❗ Notice the ConfirmationModal is not mounted directly -->
    <!-- anywhere — it is the ModalCollector's job to render modals -->
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
        <button @click="onDelete(user)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useModal } from '@dsplce-co/vue-modal';
import { ref } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue';

export type User = {
  id: string;
  name: string;
};

const users = ref<User[]>([
  { id: '1', name: 'Walter White' },
  { id: '2', name: 'Hank Schrader' },
]);

const deleteUser = (id) => {
  console.log('Deleting user with id:', id);
  // Your deletion logic here
};

// Register the modal
const modal = useModal(ConfirmationModal);

const onDelete = (user: User) => {
  // Open modal with required props
  modal.open({
    user,
    onConfirm: () => deleteUser(user.id),
  });
};
</script>
```

⸻

## 📐 API reference

### `VueModalPlugin`

The Vue plugin that sets up global modal state. Install it once — everything else assumes it's there, and `useModal` throws a clear error if it isn't:

```js
import { createApp } from 'vue';
import VueModalPlugin from '@dsplce-co/vue-modal';

app.use(VueModalPlugin);
```

### `ModalCollector`

The component that renders the active modal, via Vue's `<teleport>`. Mount it once, near your app root.

| Prop | Type | Default | What it does |
|------|------|---------|--------------|
| `transitionDuration` | `string` | `"0.5s"` | Length of the fade in/out — any CSS time value (`"200ms"`, `"1s"`, …) |

It also exposes a default slot — `{ component, payload, close }` — for when you want to render the overlay and wrapper yourself. See [Custom modal overlay and wrapper](#custom-modal-overlay-and-wrapper).

```vue
<template>
  <ModalCollector />
  <!-- or, slower fade: -->
  <ModalCollector transition-duration="1s" />
</template>
```

### `useModal`

Creates a typed controller for one modal component:

```js
import { useModal } from '@dsplce-co/vue-modal';

const modal = useModal(YourModalComponent);
```

Returns:

- `open(props)` — opens the modal, passing `props` through to your component
- `close()` — closes whatever's open

**Type safety is the whole point.** The controller infers from your component whether props are required or optional, and the compiler holds you to it:

```ts
// If the modal has required props
modal.open({ requiredProp: 'value' }); // ✅ TypeScript enforces this

// If the modal has only optional props
modal.open(); // ✅ props can be omitted
modal.open({ optionalProp: 'value' }); // ✅ or provided
```

### `ModalOverlay`

The default backdrop — a fixed, centered, blurred overlay that the collector wraps your modal in automatically. You only import it directly when you're building a [custom collector slot](#custom-modal-overlay-and-wrapper) and want the stock backdrop back. Like `ModalCollector`, it's exported from the package and resolvable via the [unplugin resolver](#auto-import-with-unplugin).

### What the collector handles

- **Teleport** — modals render at `<body>` level, above everything (`z-index: 10000`)
- **Backdrop** — a semi-transparent overlay with a `blur(4px)` behind your content
- **Dismissal** — `Esc` and click-outside both close the active modal
- **Transitions** — fade in/out, timed by `transitionDuration`
- **One at a time** — opening a modal replaces whatever was already open
- **Centering** — full-viewport overlay, content centered

> **On accessibility:** vue-modal deliberately stays out of your modal's *content*, which means it doesn't impose ARIA roles or a focus trap on you. `role="dialog"`, `aria-modal`, labelling and focus management belong in your own modal component — that's where the content lives, so that's where they make sense. Wire them there.

### Writing a modal component

Whatever you open just needs to play along with two things:

1. **Emit `close`** — `$emit('close')` (or `defineEmits(['close'])`) is how your modal asks to be dismissed. The collector also closes on `Esc` and click-outside, but an in-modal "Close" button needs this.
2. **Declare props normally** — `defineProps` as usual; the collector binds whatever you passed to `open()` straight onto your component.

Styling the *content* is yours; the overlay and positioning are the collector's (see [Styling](#-styling)).

```vue
<template>
  <div class="my-modal">
    <h2>{{ title }}</h2>
    <button @click="$emit('close')">Close</button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});

defineEmits(['close']);
</script>
```

⸻

## 🎨 Styling

The library brings the bare minimum: the overlay, the blur, the centering, the fade. Everything *inside* the modal — the card, the padding, the buttons — is yours, because it's your component. No design opinions shipped, nothing of yours to override.

⸻

## 🔧 Advanced usage

### Auto-import with unplugin

`vue-modal` ships a resolver for [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) and a preset for [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import), so the components and the composable show up without you importing them by hand.

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VueModalResolver, VueModalPreset } from '@dsplce-co/vue-modal/resolver'

export default defineConfig({
  plugins: [
    Components({ resolvers: [VueModalResolver()] }),
    AutoImport({ imports: [VueModalPreset] }),
  ],
})
```

Now `ModalCollector` and `ModalOverlay` are auto-imported as components, and `useModal` is globally available without imports:

```vue
<script setup lang="ts">
import ConfirmationModal from './ConfirmationModal.vue'

const modal = useModal(ConfirmationModal) // no import needed
</script>

<template>
  <ModalCollector /> <!-- no import needed -->
</template>
```

### Custom modal overlay and wrapper

Don't like the stock overlay? The `ModalCollector` default slot hands you the active `component`, its `payload`, and a `close` function — render the lot however you like:

```vue
<ModalCollector v-slot="{ component, payload, close }">
  <div v-if="component !== null" class="custom-overlay">
    <div class="custom-modal-container">
      <div class="modal-header">
        <button @click="close">×</button>
      </div>

      <component :is="component" v-bind="payload" @close="close" />
    </div>
  </div>
</ModalCollector>
```

⸻

## 🛠️ Requirements

- **Vue 3** — declared as a peer dependency (`3.x`)

⸻

## 📁 Repo & Contributions

📦 **Package**: [@dsplce-co/vue-modal](https://www.npmjs.com/package/@dsplce-co/vue-modal)<br/>
🛠️ **Repo**: [github.com/dsplce-co/vue-modal](https://github.com/dsplce-co/vue-modal)

Contributions, issues, suggestions welcome. Hit us up 🖤

⸻

## 📄 License

MIT or Apache-2.0, at your option.
