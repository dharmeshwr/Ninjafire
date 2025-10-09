import Header from "@/components/layout/header";
import Sextion1 from "@/components/layout/section-1";
import Sextion2 from "@/components/layout/section-2";

export default async function Page() {
  return (
    <>
      <div className="overlays">
        <div className="overlay paper" />
        <div className="overlay halftone" />
        <div className="overlay ghostink" />
        <div className="overlay distress" />
        <div className="overlay paper-border" />
      </div>
      <div className="noscrollbar mx-auto max-w-[2300px] select-none px-4 text-black">
        <Header />
        <Sextion1 />
        <Sextion2 />
      </div>
    </>
  );
}
