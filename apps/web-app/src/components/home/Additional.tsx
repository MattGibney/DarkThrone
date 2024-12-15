export default function Additional({
  additional,
}: {
  additional: string | number;
}) {
  return (
    <dd className="w-half flex-none text-base font-thin leading-10 tracking-tight text-zinc-200">
      {additional}
    </dd>
  );
}
