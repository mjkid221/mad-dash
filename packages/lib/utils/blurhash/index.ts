import { encode } from "blurhash";
import { createCanvas, loadImage, Image } from "canvas";

const getImageData = (image: Image) => {
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");

  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height);
};

/**
 * Set of helper functions for use in encoding images to obtain blurhashes.
 */
export const encodeImageToBlurhash = async (imageUrl?: string) => {
  if (!imageUrl) {
    return undefined;
  }
  try {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);

    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
  } catch {
    return undefined;
  }
};
