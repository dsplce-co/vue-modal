<template>
    <teleport to="body">
        <slot
            :component
            :payload
            :close
        >
            <transition
                :enter-active-class="$style['fade-enter-active']"
                :leave-active-class="$style['fade-leave-active']"
                :enter-from-class="$style['fade-enter-from']"
                :leave-to-class="$style['fade-leave-to']"
            >
                <overlay v-if="component !== null">
                    <on-click-outside @trigger="close">
                        <component
                            :is="component"
                            v-bind="payload"
                            @close="close"
                        />
                    </on-click-outside>
                </overlay>
            </transition>
        </slot>
    </teleport>
</template>

<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components';
import { useEventListener } from '@vueuse/core';
import { computed, onBeforeUnmount, toValue, Transition } from 'vue';
import useModalState from './composables/useModalState';
import Overlay from './Overlay.vue';

withDefaults(
    defineProps<{
        /**
         * Duration of the overlay animation
         * @default 0.5s
         */
        transitionDuration?: string;
    }>(),
    {
        transitionDuration: "0.5s"
    },
)

const { activeModal } = useModalState();
const payload = computed(() => activeModal.payload.value ?? {});
const component = computed(() => activeModal.component.value);

const close = () => {
    activeModal.payload.value = null;
    activeModal.component.value = null;
};

onBeforeUnmount(close);

useEventListener(document, 'keydown', event => {
    if (event.key === 'Escape') {
        close();
    }
});

defineExpose({
    payload,
    component,
    close,
});
</script>

<script lang="ts">
/**
 * Teleport-like component for displaying active modal
 */
export default {}
</script>

<style module>
.fade-enter-active,
.fade-leave-active {
    transition: opacity v-bind(transitionDuration) ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
