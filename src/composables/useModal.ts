import { Component } from "vue";
import { PropsOf, RequiredProps } from "../types";
import useModalState from "./useModalState";

type OpenFn<C extends Component> = RequiredProps<PropsOf<C>> extends never
    ? (payload?: PropsOf<C>) => void
    : (payload: PropsOf<C>) => void;

/**
 * Composable for controlling state of the modal
 * @param modalComponent Component to display
 * @returns modal An object containing modal control functions
 * @returns modal.open Function to open the modal with optional props
 * @returns modal.close Function to close the modal
 */
export default function useModal<C extends Component>(modalComponent: C) {
    const { activeModal } = useModalState();

    /**
     * Open the modal
     * @param payload Props to pass to the modal component
     */
    const open: OpenFn<C> = (payload?: PropsOf<C>) => {
        activeModal.component.value = modalComponent;
        activeModal.payload.value = payload ?? null;
    }

    /**
     * Close the modal
     */
    const close = () => {
        activeModal.component.value = null;
        activeModal.payload.value = null;
    }

    return {
        open,
        close,
    }
}
