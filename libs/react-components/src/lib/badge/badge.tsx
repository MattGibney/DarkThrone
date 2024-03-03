import { tv } from 'tailwind-variants';

const styles = tv({
  slots: {
    body: 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
  },
  variants: {
    style: {
      yellow: {
        body: 'bg-yellow-400/10 text-yellow-500 ring-yellow-400/20',
      },
      gray: {
        body: 'bg-gray-400/10 text-gray-400 ring-gray-400/20',
      },
    },
  },
});

export interface BadgeProps {
  text?: string;
  variant?: 'yellow' | 'gray';
}

export function Badge(props: BadgeProps) {
  const { body } = styles({ style: props.variant || 'yellow' });

  return <span className={body()}>{props.text}</span>;
}

export default Badge;
