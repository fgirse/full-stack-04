import React from 'react';
import Image from 'next/image';

// Removed server-side Cloudinary upload code; this should be handled on the server, not in a React component.



const src="https://res.cloudinary.com/carlo2024/raw/upload/v1754979958/Rondetta-Swash_ccpk7v.ttf"

const HeroImageB = () => (
  <Image
    src="https://res.cloudinary.com/jlengstorf/image/upload/w_800/g_west,x_30,w_350,c_fit,co_white,bo_4px_solid_black,l_text:snowballs.ttf_180_stroke:Let%20it%20snow!,fl_layer_apply/"
    fill alt={''} />
);
export default HeroImageB;