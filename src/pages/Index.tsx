import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HighlightCard from "@/components/HighlightCard";
import { Clock, FileCheck, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const highlights = [
    {
      icon: Clock,
      title: "Quick Approval",
      description: "Get your loan approved within 24-48 hours with our streamlined process.",
    },
    {
      icon: FileCheck,
      title: "Minimal Documentation",
      description: "We keep paperwork simple. Only essential documents required.",
    },
    {
      icon: Shield,
      title: "Trusted Support",
      description: "Dedicated support throughout your loan journey. Your trust is our priority.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-secondary">
        <div className="section-container section-padding">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Trusted & Easy
              <br />
              <span className="text-primary">Loan Assistance</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We help you navigate the loan process with transparency and care. 
              Whether it's a personal loan, home loan, or business loan — we're here to guide you every step of the way.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[160px]">
                <Link to="/apply">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                <Link to="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why Choose LoanAssist?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We focus on making the loan process simple, quick, and stress-free for you.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <HighlightCard key={index} {...highlight} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="section-container py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-primary-foreground sm:text-2xl">
                Ready to get started?
              </h2>
              <p className="mt-2 text-primary-foreground/80">
                Apply now and get a callback within 24 hours.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/apply">Apply for Loan</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
