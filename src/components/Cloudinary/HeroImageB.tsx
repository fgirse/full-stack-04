
import Image from "next/image";





import { Cloudinary } from "@cloudinary/url-gen";

// Import required actions.

import { byAngle } from "@cloudinary/url-gen/actions/rotate";

// Import the required actions and qualifiers.
import { fill } from "@cloudinary/url-gen/actions/resize";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";

// Import required values.
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { useTranslations } from "next-intl";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { autoGravity, compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { TextAlignment } from "@cloudinary/url-gen/qualifiers";
// Create and configure your Cloudinary instance.

export default function HeroImage() {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "Carlo2024",
    },
  });

  const t = useTranslations("Hero");

  // Use the image with public ID, 'sample'.
  const myImage = cld.image("hero-banner05-Photoroom_xgmpgq",
  );

  // Transform the image.
  myImage
    .resize(fill(900,3000))
    .roundCorners(byRadius(0))
    .backgroundColor("black")

    .overlay(
      source(
        text((t("Headline")), new TextStyle("bowlby one sc",120)).textColor(
          "",
        ),
      ).position(
        new Position().gravity(compass("north")).offsetY(0).offsetX(0),
      ),
    )

    .overlay(
      source(
        text((t("Jahr")), new TextStyle("bowlby one sc",120)).textColor(
          "#darkorange",
        ),
      ).position(
        new Position().gravity(compass("north")).offsetY(10).offsetX(10),
      ),
    )


    .overlay(
      source(
        text((t("präTitle")), new TextStyle("bowlby one sc",80)).textColor(
          "#E3A40A",
        ),
      ).position(
        new Position().gravity(compass("north_west")).offsetY(110).offsetX(110),
      ),
    )


    .overlay(
      source(
        text(
          (t("Title")),
          new TextStyle("bowlby one sc", 160)
            .fontWeight("bold")
            .lineSpacing(-96)
            .textAlignment("justify")
                   

        ) .textColor(
          "64748b",
        )
      ).position(
        new Position().gravity(compass("north_west")).offsetY(280).offsetX(110),
      ),
    )

    .overlay(
      source(
        text(
          (t("postTitle")),
          new TextStyle("bowlby one sc", 36)
            .fontWeight("bold")
            .lineSpacing(-96)
            .textAlignment("justify")
              
            
            

        ) .textColor("#darkblue",
        )
      ).position(
        new Position().gravity(compass("north_west")).offsetY(7).offsetX(110),
      ),
    )

    .rotate(byAngle(0))
    .format("png");

  // Return the delivery URL
  const myUrl = myImage.toURL();
  return (
    <div className="flex flex-col items-ecnter">
      <Image
        src={myUrl}
        width={2080}
        height={900}
        alt="Transformed Image"
        className="text-white text-left"
      />
    </div>
  );
}
