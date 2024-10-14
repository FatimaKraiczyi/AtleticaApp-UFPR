import { createIcon } from "@gluestack-ui/icon";
import { Path, G, Svg } from "react-native-svg";
export const LogoutIcon = createIcon({
    Root: Svg,
    viewBox: "0 0 24 24",
    path: (<G>
      <Path d="M16 13v-2H8V8l-5 4 5 4v-3h8zm-1-9H5c-1.1 0-2 .9-2 2v4h2V6h10v12H5v-4H3v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#8E8E8E"/>
    </G>),
});
