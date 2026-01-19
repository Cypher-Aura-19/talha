import { ReactLenis } from "lenis/react";

export default function Page() {
  return (
    <>
      <ReactLenis root />
      <div className="container">
        <div className="archive">
          <img src="/img_01.webp" alt="" />
          <img src="/img_02.webp" alt="" />
          <img src="/img_03.webp" alt="" />
          <img src="/img_04.webp" alt="" />
        </div>
      </div>
    </>
  );
}
