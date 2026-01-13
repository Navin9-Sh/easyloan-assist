import { LucideIcon } from "lucide-react";

interface HighlightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const HighlightCard = ({ title, description, icon: Icon }: HighlightCardProps) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-surface-elevated border border-highlight/20">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-highlight/10">
        <Icon className="h-7 w-7 text-highlight" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default HighlightCard;
