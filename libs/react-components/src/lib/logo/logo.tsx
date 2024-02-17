import { tv } from "tailwind-variants";

const styles = tv({
  slots: {
    body: 'flex items-center gap-x-3',
    text: 'text-3xl font-bold text-white font-display',
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
  const { body, text } = styles({ style: props.variant || 'primary' });

  return (
    <div className={body()}>
      <h1 className={text()}>DarkThrone</h1>
    </div>
  );
}

export default Logo;
