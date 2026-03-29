"use client";

import React from "react";
import Image from "next/image";

export function SwBackground() {
  return (
    <>
      {/* Chewbacca — bottom-left */}
      <div className="sw-char-chewie" aria-hidden="true">
        <Image
          src="/img/chewbacca.jpeg"
          alt=""
          width={380}
          height={380}
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority={false}
        />
      </div>

      {/* Millennium Falcon — bottom-right */}
      <div className="sw-char-falcon" aria-hidden="true">
        <Image
          src="/img/falcon.jpeg"
          alt=""
          width={420}
          height={260}
          style={{ objectFit: "cover", objectPosition: "center center" }}
          priority={false}
        />
      </div>
    </>
  );
}
