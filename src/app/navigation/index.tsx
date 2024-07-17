import { usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DateTime, Duration } from "luxon";
import { Image, StyleSheet, Text, View } from "react-native";

import { appEnv } from "#shared/appEnv";
import { t } from "#shared/i18n";

export default function Home() {
  const pathname = usePathname();

  const isoDate = DateTime.now().toISO();
  const duration = Duration.fromObject({ weeks: 2 }).toHuman();

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/402px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        }}
      />
      <Text>{t("Welcome to the Joconde Bootstrap App")}</Text>
      <Text>
        {t("date actuelle :")} {isoDate}
      </Text>
      <Text>
        {t("Durée en semaine(s) :")} {duration}
      </Text>
      <Text>Current route: {pathname}</Text>
      <Text>{JSON.stringify(appEnv)}</Text>
      <StatusBar style="auto" />
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
  image: { height: 400, width: 400, resizeMode: "contain" },
});
