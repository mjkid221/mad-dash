/* eslint-disable no-nested-ternary -- allow */
import { Flex } from "@chakra-ui/react";
import { FindNftsByOwnerOutputV2 } from "@mad-land/lib";
import { JsonMetadata } from "@metaplex-foundation/js";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

export const TransferCardSection = ({
  userNfts,
}: {
  userNfts: FindNftsByOwnerOutputV2;
}) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const getCardGradient = (rank: number, isActive: boolean) => {
    const baseGradient =
      rank > 6000
        ? "linear-gradient(135deg, rgba(93, 102, 111, 1) 0%, rgba(53, 62, 71, 1) 100%)"
        : rank > 3500
        ? "linear-gradient(135deg, rgba(50, 154, 109, 1) 0%, rgba(25, 77, 55, 1) 100%)"
        : rank > 1500
        ? "linear-gradient(135deg, rgba(9, 155, 197, 1) 0%, rgba(4, 78, 99, 1) 100%)"
        : rank > 500
        ? "linear-gradient(135deg, rgba(218, 12, 218, 1) 0%, rgba(109, 6, 109, 1) 100%)"
        : rank > 0
        ? "linear-gradient(135deg, rgba(251, 177, 50, 1) 0%, rgba(125, 88, 25, 1) 100%)"
        : "linear-gradient(135deg, rgba(255, 0, 0, 1) 0%, rgba(128, 0, 0, 1) 100%)";

    return isActive ? `${baseGradient}, animatedGradient` : baseGradient;
  };
  return (
    <Flex gap="8px">
      <Swiper
        effect="cards"
        grabCursor
        modules={[EffectCards]}
        onSlideChange={(swiper: SwiperClass) =>
          setActiveIndex(swiper.activeIndex)
        }
      >
        {userNfts?.map((nft, index) => (
          <SwiperSlide
            key={nft.address.toString()}
            className={index === activeIndex ? "animatedGradient" : ""}
            style={{
              cursor: "none",
              backgroundImage: getCardGradient(
                nft.rank!,
                index === activeIndex
              ),
              height: "295px",
            }}
          >
            <Flex width="100%" height="100%" padding="3px">
              <Flex overflow="hidden" borderRadius="15px">
                <LazyLoadImage
                  alt={nft.name}
                  src={(nft as JsonMetadata).image}
                  height="100%"
                  width="100%"
                  effect="blur"
                />
              </Flex>
            </Flex>
          </SwiperSlide>
        ))}
      </Swiper>
    </Flex>
  );
};
