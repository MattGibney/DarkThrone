import { tv } from 'tailwind-variants';

const styles = tv({
  slots: {
    body: 'flex w-full justify-center rounded-md px-8 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  },
  variants: {
    style: {
      primary: {
        body: 'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600 text-white',
      },
      'primary-outline': {
        body: 'ring-1 ring-inset ring-yellow-600/80 bg-transparent hover:bg-yellow-600/20 focus-visible:outline-yellow-600 text-yellow-600',
      },
      secondary: {
        body: 'bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 focus-visible:outline-zinc-600',
      },
    },
  },
});

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'primary-outline' | 'secondary';
  isDisabled?: boolean;
}

export function Button(props: ButtonProps) {
  const { body } = styles({ style: props.variant || 'primary' });

  return (
    <button
      type={props.type}
      onClick={props.isDisabled ? () => null : props.onClick}
      className={body()}
      disabled={props.isDisabled}
    >
      {props.text} {props.children}
    </button>
  );
}

export default Button;
