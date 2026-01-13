import { Users, Target, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="section-padding">
      <div className="section-container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            About LoanAssist
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner in navigating the loan process.
          </p>
        </div>

        {/* Introduction */}
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-slate">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              LoanAssist was started with a simple goal: to help everyday people 
              access loans without the confusion and hassle that often comes with 
              the process. We understand that applying for a loan can be overwhelming, 
              especially when you're not sure where to start or what documents you need.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-12">
              That's where we come in. We work as a bridge between you and trusted 
              lending partners, guiding you through the entire process — from understanding 
              your eligibility to submitting your application. Our team takes pride in 
              being honest, transparent, and always putting your needs first.
            </p>
          </div>

          {/* Values */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="text-center p-6 rounded-xl bg-surface-elevated">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Customer First</h3>
              <p className="text-sm text-muted-foreground">
                Your needs and concerns always come first. We listen, understand, and act accordingly.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-surface-elevated">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                No hidden charges, no surprises. We explain everything upfront so you can make informed decisions.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-surface-elevated">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Trust</h3>
              <p className="text-sm text-muted-foreground">
                We've built our reputation on trust. Your information is safe with us, and we deliver on our promises.
              </p>
            </div>
          </div>

          {/* Closing Note */}
          <div className="rounded-xl border border-border bg-muted p-8 text-center">
            <p className="text-muted-foreground leading-relaxed">
              We're not a bank or a direct lender. We're a team that genuinely wants to help 
              you find the right loan for your situation. If you have questions or need guidance, 
              don't hesitate to reach out — we're here to help.
            </p>
            <p className="mt-4 font-medium text-foreground">
              — The LoanAssist Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
