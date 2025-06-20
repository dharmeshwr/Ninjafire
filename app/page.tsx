import Balancer from "react-wrap-balancer";

import { socialLinks, tagline } from "@/config/site";
import { ProfilePicture } from "@/components/ui/profile-picture";
import { Quote } from "@/components/ui/quote";
import { Summary } from "@/components/ui/summary";

export default function Page() {
  return (
    <section className="z-0 md:z-30">
      <a href={socialLinks.twitter} target="_blank">
        <ProfilePicture
          circles={["#f5bb00", "#ec9f05", "#d76a03", "#bf3100"]}
        />
      </a>

      <Balancer className="mb-8 font-serif text-2xl font-medium tracking-tight">
        {tagline}
      </Balancer>

      <Summary />

      <Quote />
    </section>
  );
}
