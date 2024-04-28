import { Flex, FlexProps } from "@chakra-ui/react";
import { AirdropDistributionResult, useTokenSelectStore } from "@mad-land/lib";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export const DistributionChart = ({
  distributionData,
  ...props
}: Pick<AirdropDistributionResult, "distributionData"> & FlexProps) => {
  const { token } = useTokenSelectStore();

  return (
    <Flex height="70%" width="99%" p="8px" justifyContent="center" {...props}>
      <Doughnut
        data={{
          labels: distributionData.map((holder) => holder.userAddress),
          datasets: [
            {
              label: "Allocated",
              data: distributionData.map(
                (holder) =>
                  holder.distribution / 10 ** (token?.tokenDecimals ?? 0)
              ),
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
};
