import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MessageCircle, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="section-container py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Buy & sell locally.
            <br />
            <span className="text-primary">No middleman.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg">
            A community marketplace where neighbors trade items and services. Simple, direct, local.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/browse">
                Browse Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" size="lg">
                <Link to="/auth?tab=signup">Create Account</Link>
              </Button>
            )}
            {user && (
              <Button asChild variant="outline" size="lg">
                <Link to="/create">Sell Something</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-16">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Search, title: "Find what you need", desc: "Browse listings by category or search for specific items in your area." },
              { icon: MessageCircle, title: "Chat with sellers", desc: "Message sellers directly to ask questions and arrange meetups." },
              { icon: Shield, title: "Deal with confidence", desc: "See seller profiles and ratings. Meet locally for safe transactions." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container py-16 text-center">
        <h2 className="text-2xl font-bold">Ready to start?</h2>
        <p className="text-muted-foreground mt-2">Join your local community marketplace today.</p>
        <Button asChild size="lg" className="mt-6">
          <Link to={user ? "/browse" : "/auth?tab=signup"}>
            {user ? "Browse Listings" : "Sign Up Free"}
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Landing;
