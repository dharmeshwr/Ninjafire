export function Modal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
      <div className="flex size-[47rem] min-w-[35rem] rounded border-2 border-foreground/60 bg-background"></div>
    </div>
  );
}
