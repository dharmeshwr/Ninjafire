import Link from "next/link";

interface ArtPiece {
  id: number;
  title: string;
  href: string;
}

export default function Page() {
  const artPieces: ArtPiece[] = [
    { id: 1, title: "Particle Effect on Text", href: "/playground/1" },
    { id: 2, title: "Random Circles", href: "/playground/2" },
    { id: 3, title: "In progress (Not complete)", href: "/playground/3" },
  ];

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold">My Art Pieces</h2>
        <p className="text-sm text-foreground/70">
          This is what I create in my spare time.
        </p>
      </header>

      <ol className="flex list-inside list-decimal flex-col gap-2">
        {artPieces.map((piece) => (
          <li key={piece.id}>
            <Link href={piece.href} className="underline">
              {piece.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
