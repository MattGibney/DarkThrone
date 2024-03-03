interface PageHeaderProps {
  text: string;
}
export default function PageHeader(props: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-500 to-yellow-900">
      <div className="max-w-screen-lg mx-auto py-10 px-4">
        <h2 className="font-display text-black text-3xl">{props.text}</h2>
      </div>
    </div>
  );
}
