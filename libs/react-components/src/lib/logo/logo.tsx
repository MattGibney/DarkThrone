import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    body: 'flex items-end gap-x-2 font-display',
    text: 'text-3xl font-bold text-white',
    subText: 'text-zinc-500 -mt-1',
  },
  variants: {
    style: {
      primary: {
        body: '',
      },
    },
  },
});

export interface LogoProps {
  variant?: 'primary';
}

export function Logo(props: LogoProps) {
  const { body, text, subText } = styles({ style: props.variant || 'primary' });

  return (
    <div className={body()}>
      <h1 className={text()}>DarkThrone</h1>
      <p className={subText()}>Reborn</p>
    </div>
  );
}

export default Logo;
