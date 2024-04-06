import { chakra, Skeleton } from "@chakra-ui/react";

export const StandardSkeleton = chakra(Skeleton, {
  baseStyle: {
    height: "37px",
    borderRadius: "8px",
  },
});
