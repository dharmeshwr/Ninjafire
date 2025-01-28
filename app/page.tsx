import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { socialLinks, summary } from "@/config/site";
import { ProfilePicture } from "@/components/ui/profile-picture";

export default function Page() {
  return (
    <section className="z-10">
      <Link href={socialLinks.twitter} target="_blank">
        <ProfilePicture
          imageSrc="/profile.png"
          circles={["#f5bb00", "#ec9f05", "#d76a03", "#bf3100"]}
        />
      </Link>

      <Balancer className="mb-8 font-sans text-2xl font-medium tracking-tight">
        I Build Things !
      </Balancer>

      <p className="prose text-left leading-8 text-foreground">{summary}</p>
    </section>
  );
}
