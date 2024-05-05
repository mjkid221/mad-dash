import { Box, BoxProps, Flex } from "@chakra-ui/react";

export const GoldPoints = ({ goldPoints }: { goldPoints?: number }) => {
  if (!goldPoints) return <GoldContainer points={0} type={PointsType.Iron} />;
  const pointsStr = goldPoints.toString();
  const numDigits = pointsStr.length;

  let gold = 0;
  let silver = 0;
  let bronze = 0;
  // Extract values based on number of digits
  if (numDigits >= 6) {
    gold = parseInt(pointsStr.slice(0, numDigits - 6), 10);
  }
  if (numDigits >= 4) {
    silver = parseInt(pointsStr.slice(numDigits - 6, numDigits - 4), 10);
  }
  if (numDigits >= 2) {
    bronze = parseInt(pointsStr.slice(numDigits - 4, numDigits - 2), 10);
  }

  const iron = parseInt(pointsStr.slice(numDigits - 2, numDigits), 10) ?? 0;

  return (
    <Flex flexDir="row" gap="12px">
      {gold > 0 && <GoldContainer points={gold} type={PointsType.Gold} />}
      {silver > 0 && <GoldContainer points={silver} type={PointsType.Silver} />}
      {bronze > 0 && <GoldContainer points={bronze} type={PointsType.Bronze} />}
      <GoldContainer points={iron} type={PointsType.Iron} />
    </Flex>
  );
};

enum PointsType {
  Gold,
  Silver,
  Bronze,
  Iron,
}

const PointsProps: Record<PointsType, BoxProps> = {
  [PointsType.Gold]: {
    bg: "rgb(255, 215, 0)",
  },
  [PointsType.Silver]: {
    bg: "rgb(211, 211, 211)",
  },
  [PointsType.Bronze]: {
    bg: "rgb(185, 115, 51)",
  },
  [PointsType.Iron]: {
    border: "1px rgb(185, 115, 51) solid",
  },
};
const GoldContainer = ({
  points,
  type,
}: {
  points: number;
  type: PointsType;
}) => (
  <Flex gap="4px" alignItems="center">
    {points}
    <Box boxSize="12px" borderRadius="full" {...PointsProps[type]} mb="2px" />
  </Flex>
);
