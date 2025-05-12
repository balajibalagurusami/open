import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div 
      className={cn(
        "bg-gray-800 border-r border-viewer-border h-[calc(100vh-4rem)] transition-all duration-300 overflow-auto flex flex-col",
        isOpen ? "w-64" : "w-0"
      )}
    >
      {isOpen && (
        <>
          <div className="flex justify-between items-center p-4 border-b border-viewer-border">
            <h2 className="font-semibold text-viewer-foreground">Project Explorer</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-viewer-foreground hover:bg-viewer-accent"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-viewer-muted mb-2">MODELS</h3>
              <ul className="space-y-2 text-viewer-foreground">
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Building Structure</li>
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Interior Elements</li>
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">MEP Systems</li>
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Landscape</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-viewer-muted mb-2">VIEWS</h3>
              <ul className="space-y-2 text-viewer-foreground">
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Default View</li>
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Top View</li>
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Front Elevation</li>
                <li className="px-2 py-1 hover:bg-viewer-accent rounded cursor-pointer">Side Elevation</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-viewer-muted mb-2">PROPERTIES</h3>
              <div className="text-viewer-foreground bg-viewer-accent bg-opacity-50 p-3 rounded">
                <p className="text-sm text-viewer-muted mb-1">Select an element to view properties</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
