/* eslint-disable no-nested-ternary -- allow */
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { LadBadge, MadLadsNft } from "@mad-dash/lib";
import { JsonMetadata } from "@metaplex-foundation/js";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { Blurhash } from "react-blurhash";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import { GoldPoints } from "../components";
import { madLadBadgeInfo, SupportedMarketplace } from "../constants";
import {
  DraggableGrid,
  StandardContainer,
  StandardIconButton,
  StandardTextWrapper,
  TitledStandardContainer,
} from "../shared";

import { ArBadge } from "./ArBadge";

const getCardGradient = (rank: number) => {
  const baseGradient =
    rank > 6000
      ? "linear-gradient(135deg, rgba(93, 102, 111, 1) 0%, rgba(53, 62, 71, 1) 100%)"
      : rank > 3500
      ? "linear-gradient(135deg, rgba(50, 154, 109, 1) 0%, rgba(93, 102, 111, 1) 100%)"
      : rank > 1500
      ? "linear-gradient(135deg, rgba(9, 155, 197, 1) 0%, rgba(50, 154, 109, 1) 100%)"
      : rank > 500
      ? "linear-gradient(135deg, rgba(218, 12, 218, 1) 0%, rgba(9, 155, 197, 1) 100%)"
      : rank > 0
      ? "linear-gradient(135deg, rgba(251, 177, 50, 1) 0%, rgba(255, 0, 0, 1) 100%)"
      : "linear-gradient(135deg, rgba(255, 0, 0, 1) 0%, rgba(128, 0, 0, 1) 100%)";

  return baseGradient;
};

export const TransferCardSection = ({
  userNfts,
  isInput,
}: {
  userNfts: MadLadsNft[];
  isInput?: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeBadge, setActiveBadge] = useState<LadBadge>(LadBadge.RickRoll);
  const [activeIndex, setActiveIndex] = useState(
    isInput ? 0 : userNfts.length - 1
  );
  const [imagesLoaded, setImagesLoaded] = useState<{
    [index: number]: boolean;
  }>({});
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    imageRefs.current.forEach((img, index) => {
      if (img && img.complete) {
        setImagesLoaded((prev) => ({ ...prev, [index]: true }));
      }
    });
  }, [userNfts]);

  const onLoaded = (index: number) => {
    setImagesLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const gridItems = useMemo(
    () =>
      userNfts[activeIndex]?.badges?.map((badge) => ({
        id: badge,
        child: (
          <Box
            boxSize="75px"
            bgColor="transparentRed"
            borderRadius="12px"
            _hover={{
              transform: "scale(1.05)",
              cursor: "pointer",
            }}
            transition="transform 0.4s ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              setActiveBadge(badge);
              onOpen();
            }}
          >
            <Image src={madLadBadgeInfo[badge].src} draggable={false} />
          </Box>
        ),
      })) ?? [],
    [activeIndex, onOpen, userNfts]
  );

  return (
    <StandardContainer overflow="hidden">
      <StandardContainer>
        <StandardTextWrapper>
          <Text>{userNfts[activeIndex]?.name ?? "N/A"}</Text>
          <GoldPoints goldPoints={userNfts[activeIndex]?.goldPoints} />
          <Flex gap="8px">
            {Object.values(SupportedMarketplace).map((marketplace) => (
              <StandardIconButton
                imgSrc={marketplace.logoSrc}
                onClick={() => {
                  // eslint-disable-next-line no-param-reassign -- ignore
                  window.open(
                    new URL(
                      userNfts[activeIndex].mintAddress?.toString() ?? "",
                      marketplace.itemUrl
                    ),
                    "_blank"
                  );
                }}
              />
            ))}
          </Flex>
        </StandardTextWrapper>
        <StandardTextWrapper>
          {userNfts[activeIndex]?.wormholeVestingBalance}
        </StandardTextWrapper>
      </StandardContainer>
      <Flex
        justifyContent="space-between"
        gap="40px"
        flexDir={isInput ? "row" : "row-reverse"}
      >
        <Flex flex={1} justifyContent="center" width="100%">
          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            onSlideChange={(swiper: SwiperClass) =>
              setActiveIndex(swiper.activeIndex)
            }
            initialSlide={activeIndex}
          >
            {userNfts?.map((nft, index) => {
              const background = getCardGradient(nft.rank ?? 10000);
              return (
                <SwiperSlide
                  key={nft.address.toString()}
                  className={index === activeIndex ? "animatedGradient" : ""}
                  style={{
                    cursor: "none",
                    backgroundImage: background,
                  }}
                >
                  <Flex width="100%" height="100%" p="2px">
                    <Flex overflow="hidden" borderRadius="15px">
                      <Flex zIndex="1">
                        <motion.img
                          // eslint-disable-next-line no-return-assign -- allow for this instance
                          ref={(el) => (imageRefs.current[index] = el)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: imagesLoaded[index] ? 1 : 0 }}
                          transition={{ opacity: { duration: 0.4 } }}
                          onLoad={() => onLoaded(index)}
                          src={
                            (nft as JsonMetadata).image ??
                            "https://placehold.co/1000x1000"
                          }
                          loading="lazy"
                          width="100%"
                          height="100%"
                        />
                      </Flex>
                      {nft?.imageBlurhash && !imagesLoaded[index] && (
                        <Flex>
                          <Blurhash
                            hash={nft?.imageBlurhash}
                            width="250px"
                            height="100%"
                          />
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Flex>
        <TitledStandardContainer
          title="Inventory"
          orientation="center"
          padding="0px"
        >
          <Flex
            height="100%"
            width="100%"
            overflowY="auto"
            flexDir="column"
            padding="16px"
          >
            <DraggableGrid key={activeIndex} gridItems={gridItems} />
          </Flex>
        </TitledStandardContainer>
      </Flex>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="transparent" borderRadius="16px">
          <Flex height="300px">
            <ArBadge imgSrc={madLadBadgeInfo[activeBadge].src} />
          </Flex>
          <Flex
            padding="12px 16px"
            flexDir="column"
            gap="12px"
            border="1px #4e3e3e solid"
            borderRadius="16px"
            bg="transparentRed"
            color="white"
          >
            <Flex
              flexDir="row"
              gap="8px"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <Text fontSize="18px" fontWeight={400}>
                {madLadBadgeInfo[activeBadge].title}
              </Text>
              {madLadBadgeInfo[activeBadge].date && (
                <Text fontSize="12px" color="gray" pb="2px">
                  {madLadBadgeInfo[activeBadge].date}
                </Text>
              )}
            </Flex>
            {madLadBadgeInfo[activeBadge].description && (
              <Text fontSize="14px">
                {madLadBadgeInfo[activeBadge].description}
              </Text>
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </StandardContainer>
  );
};
