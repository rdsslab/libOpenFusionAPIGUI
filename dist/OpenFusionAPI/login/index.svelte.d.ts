export default Index;
type Index = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Index: import("svelte").Component<{
    onlogin?: Function;
    onfail?: Function;
    isOverlay?: boolean;
}, {}, "">;
type $$ComponentProps = {
    onlogin?: Function;
    onfail?: Function;
    isOverlay?: boolean;
};
