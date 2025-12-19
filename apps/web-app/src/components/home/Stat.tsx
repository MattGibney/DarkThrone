import Additional from './Additional';

interface StatProps {
  name: string;
  value: string | number;
  additional?: string | number;
}
export default function Stat({ name, value, additional }: StatProps) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-card px-4 py-8 sm:px-6 xl:px-8">
      <dt className="text-sm font-medium leading-6 text-card-foreground/60">
        {name}
      </dt>
      <dd className="w-full flex-none text-2xl font-medium leading-10 tracking-tight text-card-foreground">
        {value}
      </dd>
      {additional && <Additional additional={additional} />}
    </div>
  );
}
