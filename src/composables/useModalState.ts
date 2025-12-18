import { inject } from "vue";
import { StateInjectionKey } from "../keys";

export default function useModalState() {
    const modalState = inject(StateInjectionKey);

    if (!modalState) {
        throw new Error("VueModal plugin was not initalized, make sure to include it in the plugins list");
    }

    return modalState;
}
