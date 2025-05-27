import Image from "next/image";
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions.

import {byAngle} from "@cloudinary/url-gen/actions/rotate"

// Import the required actions and qualifiers.
import {fill} from "@cloudinary/url-gen/actions/resize";
import {source} from "@cloudinary/url-gen/actions/overlay";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
import { backgroundRemoval } from "@cloudinary/url-gen/actions/effect";
// Import required values.
import {text} from "@cloudinary/url-gen/qualifiers/source";
import {Position} from "@cloudinary/url-gen/qualifiers/position";
import { useTranslations } from "next-intl";
import {TextStyle} from "@cloudinary/url-gen/qualifiers/textStyle";
import {autoGravity, compass} from "@cloudinary/url-gen/qualifiers/gravity";
import { TextAlignment } from "@cloudinary/url-gen/qualifiers";
// Create and configure your Cloudinary instance.

export default function HeroImage() {
const cld = new Cloudinary({
  cloud: {
    cloudName: 'Carlo2024'
  }
}); 

const t = useTranslations('HeroMobil');

// Use the image with public ID, 'sample'.
const myImage = cld.image('admin-icon_arhhbv',);


// Transform the image.
myImage
  .resize(fill(800,800))
  // .removeBackgrounsd (removed as it is not a valid method)
  .roundCorners(byRadius(0))
  .effect(backgroundRemoval())
    .rotate(byAngle(0))
  .format('png');
  

  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="w-60 flex flex-col items-center lg:w-16">
    
      <Image src={myUrl} width={190} height={190} alt="Transformed Image" className="bg-neutral-300 lg:border-2 border-neutral-300 hover:bg-amber-500/30 shadow-xl lg:hover:bg-yellow-100/50" />
    </div>
    
    
  );
}
