import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          EchoShield
        </h1>
      </div>
    </header>
  );
}
