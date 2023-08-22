import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    label: "block text-sm font-medium leading-6 text-gray-200",
    input: "block w-full rounded-md border-0 py-1.5 bg-gray-700 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
  },
  variants: {
    style: {
      invalid: {
        label: 'text-red-500',
        input: 'ring-1 ring-inset ring-red-500 focus:ring-red-500'
      },
    },
  },
});

export interface InputFieldProps {
  id?: string;
  displayName?: string;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  required?: boolean;
  onBlur?: () => void;
  invalidMessage?: string;
  value: string;
  setValue: (value: string) => void;
}

export function InputField(props: InputFieldProps) {
  const { label, input } = styles({ style: props.invalidMessage ? 'invalid' : undefined });
  return (
    <div>
      {props.displayName ? (
        <label htmlFor={props.id} className={label()}>
          {props.displayName}
        </label>
      ) : null}
      <div className="mt-2">
        <input
          id={props.id}
          name={props.name}
          type={props.type}
          autoComplete={props.autoComplete}
          required={props.required}
          className={input()}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          onBlur={props.onBlur}
        />
      </div>
      {props.invalidMessage ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {props.invalidMessage}
        </p>
      ) : null}
    </div>
  );
}

export default InputField;
