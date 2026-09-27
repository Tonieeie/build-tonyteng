import React from "react";
import { Composition, Still } from "remotion";
import { OgImage } from "./OgImage";
import { ProjectShot } from "./ProjectShot";
import { PROMO_FULL_FRAMES, PromoFull } from "./Promo";
import { Promo, PROMO_FRAMES } from "./PromoShort";
import { FPS, H, W } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="PromoFull" component={PromoFull} durationInFrames={PROMO_FULL_FRAMES} fps={FPS} width={W} height={H} />
    <Still id="OgImage" component={OgImage} width={1200} height={630} />
    <Still id="ProjectShot" component={ProjectShot} width={1600} height={1000} defaultProps={{ desktop: "projects/hotel.png", mobile: "projects/hotel_m.png" }} />
  </>
);
