import { Github, File, Database, Plus, Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full">
      {/* Top Bar: Name, Search, and Actions */}
      <div className="flex items-center justify-between px-6 py-2">
        {/* Left Side: App Name */}
        <h1 className="text-xl font-semibold text-[#2758d1]">Kuberns</h1>

        {/* Center: Search Form */}
        <div className="w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="bg-card rounded-md px-8 py-2 w-full text-foreground placeholder:text-muted-foreground" 
              placeholder="Quick Search" 
              type="text" 
            />
          </div>
        </div>

        {/* Right Side: Credits, Add New, and Icons */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-primary bg-card p-1 rounded-lg text-center font-semibold w-20">
              360
              <p className="text-xs text-muted-foreground">Credits left</p>
            </div>
            
          </div>
          <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add New</span>
          </button>
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
        </div>
      </div>

      {/* Bottom Bar: Navigation */}
      <div className="flex items-center justify-between bg-card h-10 px-6 border-t border-border">
        <div className="flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
              <File className="w-4 h-4" />
              <span>Projects</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
              <Database className="w-4 h-4" />
              <span>Datastore</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;