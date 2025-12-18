import { AllowedComponentProps, ComponentCustomProps, VNodeProps } from "vue";

type VueInternalProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

export type PropsOf<C> =
    C extends new (...args: any) => { $props: infer P }
        ? Omit<P, keyof VueInternalProps>
        : never;

export type RequiredProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
