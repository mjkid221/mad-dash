import { Box } from "@chakra-ui/react";
import type { Meta, StoryFn } from "@storybook/react";

import { Example, ExampleProps } from "./Example";

export default {
  title: "Example/example",
  component: Example,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box maxW="md" mx="auto" p="16px">
        <Story />
      </Box>
    ),
  ],
} as Meta;

const Template: StoryFn<ExampleProps> = (args) => <Example {...args} />;

export const StoryOne = Template.bind({});
StoryOne.args = {
  title: "This is an example story",
  color: "green.500",
};

export const StoryTwo = Template.bind({});
StoryTwo.args = {
  title: "This is another example story",
  color: "yellow.500",
};
