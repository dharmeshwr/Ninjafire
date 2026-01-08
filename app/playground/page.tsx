export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-xl">Welcome to my playground!</p>
      <p>
        <a href="/playground/canvas" className="hover:underline">
          1. Canvas
        </a>
        <br />
        <a href="/playground/editor" className="hover:underline">
          2. Editor
        </a>
        <br />
        <a href="/playground/nodes" className="hover:underline">
          3. Nodes
        </a>
        <br />
        <a href="/playground/sstv" className="hover:underline">
          4. SSTV
        </a>
      </p>
    </div>
  );
}
