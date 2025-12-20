import { tv } from 'tailwind-variants';

const styles = tv({
  slots: {
    container:
      'text-center p-2 border-2 border-bder rounded-lg flex flex-col cursor-pointer',
    bonusText: 'text-sm text-foreground/45',
  },
  variants: {
    selected: {
      true: {
        container: 'border-primary bg-primary/10',
        bonusText: 'text-primary/80',
      },
    },
  },
});

export interface ClassCardProps {
  name: string;
  class: 'fighter' | 'cleric' | 'thief' | 'assassin';
  bonusText: string;
  isSelected?: boolean;
}
export default function ClassCard(props: ClassCardProps) {
  const { container, bonusText } = styles({ selected: props.isSelected });
  return (
    <div className={container()}>
      <h3 className="font-medium">{props.name}</h3>
      <p className={bonusText()}>{props.bonusText}</p>
    </div>
  );
}
