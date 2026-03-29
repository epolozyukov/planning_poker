"use client";

import React from "react";
import Image from "next/image";

export function SwBackground() {
  return (
    <div className="sw-char-chewie" aria-hidden="true">
      <Image
        src="/img/chewbacca.jpeg"
        alt=""
        width={320}
        height={320}
        style={{ objectFit: "cover", objectPosition: "center top" }}
        priority={false}
      />
    </div>
  );
}
