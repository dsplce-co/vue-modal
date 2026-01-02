> We're dsplce.co, check out our work on [github.com/dsplce-co](https://github.com/dsplce-co) 🖤

# vue-modal

🧩 **Modal composable for Vue** — A minimal and type-safe framework for modals in [Vue.js](https://vuejs.org/) applications.

---

## 🖤 Features

✅ Type-safe modal system with generics<br>
✅ Automatic prop requirement inference<br>
✅ Close your modals from anywhere with composables<br>
✅ ARIA-compliant<br>
✅ Esc key handling<br>
✅ Click outside to close<br>
✅ Teleport-based rendering with proper z-index<br>
✅ Built-in smooth transitions<br>
✅ Zero external CSS dependencies<br>
✅ Vue 3 Composition API ready<br>

---

## 📦 Installation

Add to your `package.json`:

```bash
npm install @dsplce-co/vue-modal
# or
yarn add @dsplce-co/vue-modal
# or
pnpm add @dsplce-co/vue-modal
```

This package requires Vue 3.

---

## 🧪 Usage

### 1. Set up the plugin

Install the Vue Modal plugin in your main application file to enable global modal state management:

```js
import { createApp } from 'vue';
import VueModalPlugin from '@dsplce-co/vue-modal';
import App from './App.vue';

const app = createApp(App);

app.use(VueModalPlugin);
app.mount('#app');
```

### 2. Add modal collector

Add the `ModalCollector` component to your app root to enable modal rendering. This will manage the rendering of all modals in a single location.

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

### 3. Create modal component

Imagine in your application there is a user list view, and you want to add the functionality to delete a user. You decide a confirmation dialog would come in handy.

In `vue-modal`, your modal component can be any regular Vue component. It receives props as usual and can emit a `close` event:

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

### 4. Use the modal

Now that you've defined the confirmation modal, let's use it with the `useModal` composable:

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

---

## 📐 API reference

### Plugin setup

#### `VueModalPlugin`

Vue plugin that sets up global modal state management.

```js
import { createApp } from 'vue';
import VueModalPlugin from '@dsplce-co/vue-modal';

app.use(VueModalPlugin);
```

### Components

#### `ModalCollector`

Component that manages modal rendering using Vue's teleport system.

```vue
<template>
  <ModalCollector />
</template>
```

### Composables

#### `useModal`

Creates a typed modal controller for a specific component:

```js
import { useModal } from '@dsplce-co/vue-modal';

const modal = useModal(YourModalComponent);
```

Returns an object with:
- `open(props)` - Opens the modal with provided props
- `close()` - Closes the modal

**Type safety**: The composable automatically infers whether props are required or optional based on your component's prop definitions:

```ts
// If modal has required props
modal.open({ requiredProp: 'value' }); // ✅ TypeScript enforces this

// If modal has only optional props
modal.open(); // ✅ Props can be omitted
modal.open({ optionalProp: 'value' }); // ✅ Or provided
```

### Modal component guidelines

Your modal components should:

1. **Emit `close` event**: Use `$emit('close')` or `defineEmits(['close'])` to enable closing
2. **Handle props**: Define props normally using `defineProps` or `props` option
3. **Style appropriately**: Apply styles for the modal content (overlay is handled by the collector)

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

### Modal features

- **Accessibility**: Proper ARIA attributes and focus management
- **Keyboard Navigation**: Esc key closes modal automatically
- **Click Outside**: Click outside the modal content to close
- **Portal Rendering**: Modals render at the body level using Vue's teleport
- **Single Modal**: Only one modal can be open at a time (why would you want to show more than one modal at a time? 🤨)
- **Transitions**: Smooth fade in/out animations
- **Responsive**: Full viewport coverage with centered content
- **Backdrop**: Semi-transparent backdrop with blur effect

---

## 🎨 Styling

The library provides minimal base styles for the overlay and positioning. You're responsible for styling your modal components.

---

## 🔧 Advanced usage

### Custom modal overlay and wrapper

You can customise how modals are rendered by using the ModalCollector's slot:

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

---

## 📁 Repo & contributions

📦 Package: [@dsplce-co/vue-modal](https://www.npmjs.com/package/@dsplce-co/vue-modal)<br/>
🛠️ Repo: [github.com/dsplce-co/vue-modal](https://github.com/dsplce-co/vue-modal)<br/>

Contributions, issues, ideas? Hit us up 🖤

---

## 🔒 License

MIT or Apache-2.0, at your option.

---
