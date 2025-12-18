import { Plugin } from "vue";
import { StateInjectionKey } from "./keys";
import { createEmptyState } from "./state";

const plugin: Plugin<[], []> = (app) => {
    app.provide(StateInjectionKey, createEmptyState())
}

export default plugin;
