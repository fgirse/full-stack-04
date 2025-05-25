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

const t = useTranslations('HeroMobil');

// Use the image with public ID, 'sample'.
const myImage = cld.image('Strategic-Planning-for-Mid-Sized-Healthcare-Organizations-Turning-Vision-into-Daily-Impact-1400x788_zq6ftu_400x800_laihov',);


// Transform the image.
myImage
  .resize(fill(1900,3700))
  .roundCorners(byRadius(0)).overlay(   
    source(
      text(t("Headline"), new TextStyle('bowlby one sc',90))
      .textColor('#FFFFFF')       
    )
  
    .position(new Position().gravity(compass('north_west')).offsetY(50).offsetX(50)))

    .overlay(   
      source(
        text(t("Jahr"), new TextStyle('bowlby one sc',160))
        .textColor('orange')       
      )
      
      .position(new Position().gravity(compass('north_west')).offsetY(130).offsetX(50)))
  

  .overlay(   
    source(
      text(t("präTitle"), new TextStyle('bowlby one sc',60))
      .textColor('orange')       
    )
    
    .position(new Position().gravity(compass('west')).offsetY(690).offsetX(110)))

  
  .overlay(   
    source(
      text(t("Title"), new TextStyle('bowlby one sc',290) .lineSpacing(-180))
      .textColor('white')       
    )
    
    .position(new Position().gravity(compass('west')).offsetY(1138).offsetX(110)))

    .overlay(   
      source(
        text(t("postTitle"), new TextStyle('raleway', 48) .textAlignment('justify') .fontWeight('black') .lineSpacing (-50) ) // Apply 'bold' using .fontWeight()
          .textColor('white') 
             
      )
      .position(new Position().gravity(compass('south_west')).offsetY(5).offsetX(1)))
  

    
  .rotate(byAngle(0))
  .format('png');
  

  // Return the delivery URL
  const myUrl = myImage.toURL()
  return(
    
    
    <div className="flex flex-col justify-start items-center ">
    
      <Image src={myUrl} width={1980} height={900} alt="Transformed Image" className="text-white text-left" />
    </div>
    
    
  );
}