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

      <p className="text-left leading-8">
        perspiciatis unde omnis iste natus error sit voluptatem accusantium
        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
        inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
        quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
        eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur
      </p>
    </section>
  );
}
