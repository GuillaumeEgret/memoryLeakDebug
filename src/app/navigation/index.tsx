import { StyleSheet, Text, View } from "react-native";

import { FakePlayer } from "#app/Component/FakePlayer";
import { useAnalytics } from "#app/useAnalytics";
import { t } from "#shared/i18n";

export default function Home() {
  useAnalytics();
  return (
    <View style={styles.container}>
      <Text>{t("Welcome to the DebugChallenge Bootstrap App")}</Text>
      <FakePlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
