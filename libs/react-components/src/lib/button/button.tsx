import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    body: "flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  },
  variants: {
    style: {
      primary: {
        body: 'bg-yellow-600 hover:bg-yellow-500 focus-visible:outline-yellow-600 text-white'
      },
      secondary: {
        body: 'bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 focus-visible:outline-zinc-600'
      }
    },
  },
});

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button(props: ButtonProps) {
  const { body } = styles({ style: props.variant || 'primary' });

  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={body()}
    >
      {props.text}
    </button>
  );
}

export default Button;
