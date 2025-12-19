import { PlayerRace } from '@darkthrone/interfaces';
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from '@darkthrone/shadcnui/avatar';
import { cn } from '@darkthrone/shadcnutils';

const sizeClasses = {
  default: {
    root: 'h-12 w-12',
    icon: 'h-8',
    fallback: '',
  },
  small: {
    root: 'h-8 w-8',
    icon: 'h-5',
    fallback: '',
  },
  fill: {
    root: 'h-full w-full aspect-square',
    icon: 'h-full',
    fallback: 'p-12 aspect-square',
  },
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

const raceIcons = {
  human: (className: string) => (
    <svg
      className={className}
      style={{ fill: '#06b6d4' }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M237.5 508.32A48 48 0 0 0 256 512V224H25.63C55.11 370.52 148.77 471.34 237.5 508.32zm229-424.64l-192-80A57.34 57.34 0 0 0 256.06 0H256v224h230.5a491.56 491.56 0 0 0 9.5-96 48 48 0 0 0-29.5-44.32z" />
      <path
        style={{ opacity: 0.4 }}
        d="M256 224v288a48.12 48.12 0 0 0 18.41-3.68c72.34-30.14 180.16-123 212.09-284.29zM237.59 3.67l-192 80A47.92 47.92 0 0 0 16 128a485.36 485.36 0 0 0 9.63 96H256V0a57.58 57.58 0 0 0-18.41 3.67z"
      />
    </svg>
  ),
  elf: (className: string) => (
    <svg
      className={className}
      style={{ fill: '#10b981' }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
    >
      <path d="M546.2 9.7c-5.6-12.5-21.6-13-28.3-1.2C486.9 62.4 431.4 96 368 96h-80C182 96 96 182 96 288c0 7 .8 13.7 1.5 20.5C161.3 262.8 253.4 224 384 224c8.8 0 16 7.2 16 16s-7.2 16-16 16C132.6 256 26 410.1 2.4 468c-6.6 16.3 1.2 34.9 17.5 41.6 16.4 6.8 35-1.1 41.8-17.3 1.5-3.6 20.9-47.9 71.9-90.6 32.4 43.9 94 85.8 174.9 77.2C465.5 467.5 576 326.7 576 154.3c0-50.2-10.8-102.2-29.8-144.6z" />
    </svg>
  ),
  goblin: (className: string) => (
    <svg
      className={className}
      style={{ fill: '#ef4444' }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
    >
      <path d="M346.74 32.44L224 52.9V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v36.9L37.26 32.44C17.76 29.19 0 44.23 0 64.01v191.98c0 19.77 17.76 34.81 37.26 31.56L192 261.77l154.74 25.79C366.25 290.81 384 275.77 384 256V64.01c0-19.78-17.76-34.82-37.26-31.57zM160 299.54V496c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V299.54l-32-5.33-32 5.33z" />
    </svg>
  ),
  undead: (className: string) => (
    <svg
      className={className}
      style={{ fill: '#9ca3af' }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path d="M256 0C114.6 0 0 100.3 0 224c0 70.1 36.9 132.6 94.5 173.7 9.6 6.9 15.2 18.1 13.5 29.9l-9.4 66.2c-1.4 9.6 6 18.2 15.7 18.2H192v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h64v-56c0-4.4 3.6-8 8-8h16c4.4 0 8 3.6 8 8v56h77.7c9.7 0 17.1-8.6 15.7-18.2l-9.4-66.2c-1.7-11.7 3.8-23 13.5-29.9C475.1 356.6 512 294.1 512 224 512 100.3 397.4 0 256 0zm-96 320c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm192 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" />
    </svg>
  ),
};

const defaultIcon = (
  <svg
    className="h-full w-full text-muted"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export interface AvatarProps {
  url?: string;
  race?: PlayerRace;
  size?: 'default' | 'small' | 'fill';
  variant?: 'circle' | 'square';
  className?: string;
}

export function Avatar(props: AvatarProps) {
  const sizeKey = props.size ?? 'default';
  const variantKey = props.variant ?? 'circle';
  const size = sizeClasses[sizeKey];

  return (
    <ShadcnAvatar
      className={cn(
        'overflow-hidden',
        size.root,
        shapeClasses[variantKey],
        props.className,
      )}
    >
      {props.url ? <AvatarImage src={props.url} alt="" /> : null}
      <AvatarFallback
        className={cn(
          'bg-muted flex items-center justify-center',
          size.root,
          size.fallback,
          shapeClasses[variantKey],
        )}
      >
        {props.race ? raceIcons[props.race](size.icon) : defaultIcon}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}

export default Avatar;
