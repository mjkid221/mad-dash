import { Flex, FlexProps } from "@chakra-ui/react";
import { AirdropDistributionResult } from "@mad-land/lib";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export const DistributionChart = ({
  distributionData,
  ...props
}: Pick<AirdropDistributionResult, "distributionData"> & FlexProps) => (
  <Flex height="70%" p="8px" justifyContent="center" {...props}>
    <Doughnut
      data={{
        labels: distributionData.map((holder) => holder.userAddress),
        datasets: [
          {
            label: "Allocated",
            data: distributionData.map((holder) => holder.distribution),
            borderWidth: 1,
          },
        ],
      }}
      options={
        // hide legends
        {
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        }
      }
    />
  </Flex>
);
