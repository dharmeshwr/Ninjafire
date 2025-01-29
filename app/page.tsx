import Balancer from "react-wrap-balancer";

import { socialLinks, tagline } from "@/config/site";
import { ProfilePicture } from "@/components/ui/profile-picture";
import { Summary } from "@/components/ui/summary";

export default function Page() {
  return (
    <section className="z-10">
      <a href={socialLinks.twitter} target="_blank">
        <ProfilePicture
          imageSrc="/profile.png"
          circles={["#f5bb00", "#ec9f05", "#d76a03", "#bf3100"]}
        />
      </a>

      <Balancer className="mb-8 font-sans text-2xl font-medium tracking-tight">
        {tagline}
      </Balancer>

      <Summary />
    </section>
  );
}
