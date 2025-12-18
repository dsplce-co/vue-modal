import { InjectionKey } from "vue";
import { State } from "./state";

export const StateInjectionKey: InjectionKey<State> = Symbol("State")
