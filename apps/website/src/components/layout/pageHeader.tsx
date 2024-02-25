interface PageHeaderProps {
  text: string;
}
export default function PageHeader(props: PageHeaderProps) {
  return (
    <div
      className="
        border-b-4
        border-amber-600
      "
    >
      <div
        className="
        max-w-screen-lg
        mx-auto

        py-3
      "
      >
        <h2 className="font-display text-white text-3xl">{props.text}</h2>
      </div>
    </div>
  );
}
