import { StatusBar } from "expo-status-bar";
import { useReducer, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AddSheet } from "./src/components/AddSheet";
import { SEED, type Transaction } from "./src/data";
import { HomeScreen } from "./src/screens/HomeScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { colors } from "./src/theme";

type Action = { type: "add"; tx: Omit<Transaction, "id"> } | { type: "delete"; id: string };

function reducer(state: Transaction[], action: Action): Transaction[] {
  switch (action.type) {
    case "add":
      return [{ ...action.tx, id: `t${Date.now()}` }, ...state];
    case "delete":
      return state.filter((t) => t.id !== action.id);
  }
}

type Tab = "home" | "stats";

export default function App() {
  const [txs, dispatch] = useReducer(reducer, SEED);
  const [tab, setTab] = useState<Tab>("home");
  const [adding, setAdding] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={st.root} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          {tab === "home" ? (
            <HomeScreen txs={txs} onDelete={(id) => dispatch({ type: "delete", id })} onOpenStats={() => setTab("stats")} />
          ) : (
            <StatsScreen txs={txs} />
          )}
        </View>

        <View style={st.tabbar}>
          <TabButton icon="◉" label="Главная" active={tab === "home"} onPress={() => setTab("home")} />
          <Pressable style={st.fab} onPress={() => setAdding(true)} accessibilityLabel="Добавить операцию">
            <Text style={st.fabText}>+</Text>
          </Pressable>
          <TabButton icon="▤" label="Статистика" active={tab === "stats"} onPress={() => setTab("stats")} />
        </View>

        <AddSheet visible={adding} onClose={() => setAdding(false)} onSave={(tx) => dispatch({ type: "add", tx })} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabButton({ icon, label, active, onPress }: { icon: string; label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={st.tab} accessibilityRole="tab" accessibilityState={{ selected: active }}>
      <Text style={[st.tabIcon, active && { color: colors.lime }]}>{icon}</Text>
      <Text style={[st.tabLabel, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  tabbar: {
    position: "absolute", left: 20, right: 20, bottom: 20, height: 68, borderRadius: 34,
    backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 10,
  },
  tab: { alignItems: "center", gap: 2, width: 90 },
  tabIcon: { fontSize: 18, color: colors.muted },
  tabLabel: { fontSize: 11, color: colors.muted, fontWeight: "600" },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center", marginTop: -34, borderWidth: 5, borderColor: colors.bg },
  fabText: { fontSize: 30, fontWeight: "500", color: colors.ink, marginTop: -2 },
});
