import Image from "next/image";
import {Cloudinary} from "@cloudinary/url-gen";

// Import required actions.

import {byAngle} from "@cloudinary/url-gen/actions/rotate"



  // Import the required actions and qualifiers.
  import {fill} from "@cloudinary/url-gen/actions/resize";
  import {source} from "@cloudinary/url-gen/actions/overlay";
  import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";

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

const t = useTranslations('Hero');

// Use the image with public ID, 'sample'.
const myImage = cld.image('hero-banner05-Photoroom_xgmpgq',);


// Transform the image.
myImage
  .resize(fill(3600, 900))
  .roundCorners(byRadius(0)).overlay(   
    source(
      text(t("Headline"), new TextStyle('bowlby one sc',80))
      .textColor('#fffeee')       
    )
  
    .position(new Position().gravity(compass('north_east')).offsetY(0).offsetX(0)))



  .overlay(   
    source(
      text(t("präTitle"), new TextStyle('bowlby one sc',54))
      .textColor('orange')       
    )
    
    .position(new Position().gravity(compass('north_west')).offsetY(560).offsetX(110)))

  
  .overlay(   
    source(
      text(t("Title"), new TextStyle('bowlby one sc',96))
      .textColor('white')       
    )
    
    .position(new Position().gravity(compass('north_west')).offsetY(638).offsetX(110)))

    .overlay(   
      source(
        text(t("postTitle"), new TextStyle('raleway', 36) .textAlignment('justify') .fontWeight('black')) // Apply 'bold' using .fontWeight()
          .textColor('white')      
      )
      .position(new Position().gravity(compass('north_west')).offsetY(740).offsetX(119)))
  

    
  .rotate(byAngle(0))
  .format('png');
  

  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="flex flex-col items-center">
    
      <Image src={myUrl} width={1980} height={900} alt="Transformed Image" className="text-white text-left" />
    </div>
    
    
  );
}