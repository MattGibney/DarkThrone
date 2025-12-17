import { JSX } from 'react';
import { PlayerRace } from '@darkthrone/interfaces';
import { tv } from 'tailwind-variants';

const styles = tv({
  slots: {
    container:
      'text-center h-40 p-2 border-2 rounded-lg flex flex-col cursor-pointer',
    bonusText: 'text-sm text-foreground/50',
  },
  variants: {
    selectedRace: {
      human: {
        container: 'border-sky-400 bg-sky-600/25',
        bonusText: 'text-sky-300',
      },
      elf: {
        container: 'border-emerald-400 bg-emerald-600/25',
        bonusText: 'text-emerald-300',
      },
      goblin: {
        container: 'border-red-400 bg-red-600/25',
        bonusText: 'text-red-300',
      },
      undead: {
        container: 'border-zinc-400 bg-zinc-600/75',
        bonusText: 'text-zinc-300',
      },
    },
  },
});

export interface RaceCardProps {
  name: string;
  race: PlayerRace;
  selectedRace?: PlayerRace;
  icon: () => JSX.Element;
  bonusText: string;
}
export default function RaceCard(props: RaceCardProps) {
  const { container, bonusText } = styles({
    selectedRace: props.selectedRace,
  });
  return (
    <div className={container()}>
      <div className="grow flex flex-col justify-center items-center">
        {props.icon()}
      </div>
      <h3 className="font-medium">{props.name}</h3>
      <p className={bonusText()}>{props.bonusText}</p>
    </div>
  );
}
