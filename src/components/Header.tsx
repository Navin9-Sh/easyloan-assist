import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="section-container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">Market</span>
          <span className="text-foreground">Place</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          {user && (
            <>
              <Button asChild size="sm" variant="default">
                <Link to="/create">
                  <Plus className="h-4 w-4 mr-1" />
                  Sell
                </Link>
              </Button>
              <Link to="/chat" className="text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-listings")}>My Listings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/bookmarks")}>Saved Items</DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>Admin Panel</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {!user && (
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Log In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth?tab=signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          <Link to="/browse" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Browse</Link>
          {user ? (
            <>
              <Link to="/create" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Sell an Item</Link>
              <Link to="/chat" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Messages</Link>
              <Link to="/profile" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>My Profile</Link>
              <Link to="/my-listings" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>My Listings</Link>
              <Link to="/bookmarks" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Saved Items</Link>
              {isAdmin && <Link to="/admin" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
              <button className="text-sm text-destructive py-1" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Log In</Link>
              <Link to="/auth?tab=signup" className="block text-sm py-1" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
