export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  text: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      type={props.type}
      className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
    >
      {props.text}
    </button>
  );
}

export default Button;
