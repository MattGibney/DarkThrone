import { tv } from 'tailwind-variants';

const styles = tv({
  slots: {
    label: 'block text-sm font-medium leading-6 text-zinc-200',
    input:
      'block w-full rounded-md border-0 py-1.5 bg-zinc-700 shadow-sm ring-1 ring-inset placeholder:text-zinc-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
    feedback: 'mt-2 text-sm',
  },
  variants: {
    style: {
      neutral: {
        input: 'ring-zinc-700 focus:ring-yellow-600',
      },
      invalid: {
        input: 'ring-zinc-500 focus:ring-zinc-600',
        feedback: 'text-zinc-300',
      },
      valid: {
        input: 'ring-green-500 focus:ring-green-600',
        feedback: 'text-green-300',
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
  onFocus?: () => void;
  validationMessage?: string;
  validationState?: 'neutral' | 'valid' | 'invalid';
  value: string;
  setValue: (value: string) => void;
}

export function InputField(props: InputFieldProps) {
  const { label, input, feedback } = styles({
    style: props.validationState || 'neutral',
  });
  return (
    <div>
      {props.displayName ? (
        <label htmlFor={props.id} className={label()}>
          {props.displayName}
        </label>
      ) : null}
      <div className={props.displayName ? 'mt-2' : ''}>
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
          onFocus={props.onFocus}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>
      {props.validationMessage ? (
        <p className={feedback()}>{props.validationMessage}</p>
      ) : null}
    </div>
  );
}

export default InputField;
