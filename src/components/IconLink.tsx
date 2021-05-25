import { ThemeColors } from "@emotion/react";
import Color from "color";
import React from "react";

import { styled } from "./emotion";
import Icon, { IconName } from "./Icon";

const Anchor = styled.a<{ color: keyof ThemeColors }>(
  {
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  ({ color, theme }) => ({
    "&:hover": {
      path: {
        fill: Color(theme.colors[color]).darken(0.2).hex(),
      },
    },
  }),
);

interface Props extends React.HTMLProps<HTMLAnchorElement> {
  iconName: IconName;
  color: keyof ThemeColors;
  size?: number;
}

const IconLink: React.FC<Props> = ({
  children,
  color,
  iconName,
  size = 24,
  ...props
}) => (
  <Anchor
    color={color}
    css={{ width: size, height: size }}
    {...props}
    as={undefined}
  >
    <Icon color={color} name={iconName} size={size} />
    {children}
  </Anchor>
);

export default IconLink;
