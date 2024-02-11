import { tv } from "tailwind-variants";
import { faSwords } from "font-awesome-pro/js-packages/@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = tv({
  slots: {
    body: 'flex items-center gap-x-3',
    icon: 'h-8 w-8 text-yellow-600',
    text: 'text-2xl font-bold text-white',
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
  const { body, icon, text } = styles({ style: props.variant || 'primary' });

  return (
    <div className={body()}>
      <FontAwesomeIcon icon={faSwords} className={icon()} />
      <p className={text()}>Dark Throne</p>
    </div>
  );
}

export default Logo;
