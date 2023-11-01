import { SelectOptions, TextOptions, ConfirmOptions } from '@clack/prompts';
export { cancel, intro, note, outro, spinner } from '@clack/prompts';

interface Option<Value extends Readonly<string>> {
    value: Value;
    label?: string;
    hint?: string;
}
declare const checkIsCancel: (value: unknown) => undefined;
declare const select: (props: SelectOptions<Option<string>[], string>) => Promise<string | symbol>;
declare const text: (props: TextOptions) => Promise<string | symbol>;
declare const confirm: (props: ConfirmOptions) => Promise<boolean | symbol>;

export { checkIsCancel, confirm, select, text };
