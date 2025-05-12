import React from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-gray-800 border-b border-viewer-border flex items-center justify-between px-4 text-viewer-foreground">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-viewer-foreground hover:bg-viewer-accent"
        >
          <Menu size={20} />
        </Button>
        <div className="font-semibold text-lg">3D Viewer</div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center cursor-pointer px-3 py-1 rounded hover:bg-viewer-accent">
          <span className="mr-1">Models</span>
          <ChevronDown size={16} />
        </div>
        
        <div className="flex items-center cursor-pointer px-3 py-1 rounded hover:bg-viewer-accent">
          <span className="mr-1">Views</span>
          <ChevronDown size={16} />
        </div>
        
        <div className="flex items-center cursor-pointer px-3 py-1 rounded hover:bg-viewer-accent">
          <span className="mr-1">Tools</span>
          <ChevronDown size={16} />
        </div>
      </div>
      
      <div>
        <Button 
          variant="outline" 
          className="border-gray-600 text-viewer-foreground hover:bg-viewer-accent"
        >
          Share
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
