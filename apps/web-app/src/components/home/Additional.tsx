export default function Additional({
  additional,
}: {
  additional: string | number;
}) {
  return (
    <dd className="w-half flex-none text-base font-thin leading-10 tracking-tight text-foreground/60">
      {additional}
    </dd>
  );
}
