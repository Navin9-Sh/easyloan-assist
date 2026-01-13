import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface LoanCardProps {
  title: string;
  description: string;
  eligibility: string[];
  icon: LucideIcon;
}

const LoanCard = ({ title, description, eligibility, icon: Icon }: LoanCardProps) => {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 card-shadow transition-all hover:card-shadow-hover hover:border-highlight/30">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>
      
      <div className="mb-5">
        <p className="text-xs font-medium text-foreground mb-2">Eligibility:</p>
        <ul className="space-y-1">
          {eligibility.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-highlight flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      <Button asChild variant="orange" className="w-full">
        <Link to="/apply">Apply Now</Link>
      </Button>
    </div>
  );
};

export default LoanCard;
