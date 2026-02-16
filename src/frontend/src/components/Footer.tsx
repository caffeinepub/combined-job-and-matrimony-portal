import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025. Built with <Heart className="inline h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
