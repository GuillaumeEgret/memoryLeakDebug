import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SafeAreaTest = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ marginTop: insets.top, backgroundColor: "red", flex: 1 }}
    ></View>
  );
};
