<template>
    <div :class="$style['vue-modal__overlay']">
        <slot />
    </div>
</template>

<style module>
.vue-modal__overlay {
    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    inset: 0;
    z-index: 10000;

    backdrop-filter: blur(4px);
    background-color: rgba(0, 0, 0, .25);
}
</style>
