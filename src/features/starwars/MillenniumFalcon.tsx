"use client";

import React from "react";
import Image from "next/image";

export function MillenniumFalcon() {
  return (
    <div className="sw-falcon-fly" aria-hidden="true">
      <Image
        src="/img/falcon.jpeg"
        alt=""
        width={200}
        height={120}
        className="rounded-lg"
        style={{ objectFit: "cover" }}
        priority={false}
      />
    </div>
  );
}
