export default Variable;
type Variable = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<{
        idapp?: string | number | undefined;
        isReadOnly?: boolean | undefined;
        showCode?: boolean | undefined;
        appVars?: AppVarRow[] | undefined;
        title?: string | undefined;
        environment?: string | undefined;
        onchange?: ((vars: AppVarRow[]) => void) | undefined;
        oncopy?: ((appvar: AppVarRow) => void) | undefined;
    }>): void;
};
declare const Variable: import("svelte").Component<{
    idapp?: number | string;
    isReadOnly?: boolean;
    showCode?: boolean;
    appVars?: Array<import("../../../types/models.js").AppVarRow>;
    title?: string;
    environment?: string;
    onchange?: (vars: Array<import("../../../types/models.js").AppVarRow>) => void;
    oncopy?: (appvar: import("../../../types/models.js").AppVarRow) => void;
}, {}, "idapp" | "isReadOnly" | "showCode" | "appVars" | "title" | "environment">;
