export default AsyncWrapper;
type AsyncWrapper = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const AsyncWrapper: import("svelte").Component<{
    endpoint: any;
    onchange: Function;
    app: any;
}, {}, "endpoint" | "app">;
type $$ComponentProps = {
    endpoint: any;
    onchange: Function;
    app: any;
};
