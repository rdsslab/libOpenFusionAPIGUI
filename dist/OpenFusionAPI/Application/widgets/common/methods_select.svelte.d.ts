export default MethodsSelect;
type MethodsSelect = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const MethodsSelect: import("svelte").Component<{
    disabled?: boolean;
    option?: string | number | undefined;
    onselect?: (e: {
        value: any;
    }) => void;
}, {}, "option" | "disabled">;
type $$ComponentProps = {
    disabled?: boolean;
    option?: string | number | undefined;
    onselect?: (e: {
        value: any;
    }) => void;
};
