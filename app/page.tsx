import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { socialLinks } from "@/config/site";
import { ProfilePicture } from "@/components/ui/profile-picture";

export default function Page() {
  return (
    <section>
      <Link href={socialLinks.twitter} target="_blank">
        <ProfilePicture />
      </Link>

      <Balancer className="mb-8 font-sans text-2xl font-medium tracking-tight">
        I Build Things !
      </Balancer>

      <p className="text-left">
        Hi! I usually go by Ninjafire on the Internet, though my real name is
        Dharmesh. I'm an 21 year old developer, the photo you are looking is
        just an Piece of AI.
      </p>
    </section>
  );
}
