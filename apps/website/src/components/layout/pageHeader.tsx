interface PageHeaderProps {
  text: string;
}
export default function PageHeader(props: PageHeaderProps) {
  return (
    <div className="border-b-4 border-primary bg-muted/50">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="font-display text-foreground text-3xl">{props.text}</h2>
      </div>
    </div>
  );
}
