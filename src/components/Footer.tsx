import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="font-bold">
            <span className="text-primary">Market</span>Place
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MarketPlace. Buy & sell locally.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
