import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    label: "ml-3 block text-sm leading-6 text-zinc-200",
    input: "h-4 w-4 rounded bg-zinc-700 border-0 text-yellow-600 focus:ring-yellow-600"
  }
});

export interface InputCheckboxProps {
  id?: string;
  displayName?: string;
  name?: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

export function InputCheckbox(props: InputCheckboxProps) {
  const { label, input } = styles();
  return (
    <div className="flex items-center">
      <input
        id={props.id}
        name={props.name}
        type="checkbox"
        className={input()}
        checked={props.value}
        onChange={(e) => props.setValue(e.target.checked)}
      />
      {props.displayName ? (
        <label htmlFor={props.id} className={label()}>
          Remember me
        </label>
      ) : null}
    </div>
  );
}

export default InputCheckbox;
