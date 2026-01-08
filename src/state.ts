import { Component, shallowRef, ShallowRef } from "vue";

export interface State {
    activeModal: {
        component: ShallowRef<Component | null>;
        payload: ShallowRef<Record<PropertyKey, unknown> | null>;
    }
}

export function createEmptyState(): State {
    return {
        activeModal: {
            component: shallowRef(null),
            payload: shallowRef(null)
        }
    }
}
