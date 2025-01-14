import Image from "next/image";

export function ProfilePicture() {
  return (
    <Image
      src="/profile.png"
      alt="Profile photo"
      className="mx-auto mb-10 mt-0 block rounded-full bg-gray-100 sm:float-right sm:mb-5 sm:ml-5 lg:mb-5 lg:mt-5"
      unoptimized
      width={160}
      height={160}
      priority
    />
  );
}
