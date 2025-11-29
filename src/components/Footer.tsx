"use client";

import { Heart, Github, Mail, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-5 py-10 bg-background">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10 text-center">
       
        <div className="flex justify-center items-center gap-6 text-muted-foreground">
          <a
            href="https://github.com/AbdelrahmanMostafa0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>

          <a
            href="https://abdelrahmanmostafa.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Globe className="w-5 h-5" />
          </a>

          <a
            href="mailto:abdelrahmanmostafa.developer@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Tagline */}
        <div dir="ltr" className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500" />
          <span>By <a
            href="https://github.com/AbdelrahmanMostafa0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline underline-offset-2"
          >Abdelrahman Mostafa</a></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
