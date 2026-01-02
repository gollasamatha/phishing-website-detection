import { Shield, Github, BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-muted-foreground">
              Phishing Detection System v1.0
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Educational project for cybersecurity awareness. 
            <span className="text-primary"> For ethical use only.</span>
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Documentation
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
