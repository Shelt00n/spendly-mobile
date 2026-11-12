import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Bar, SectionTitle } from "../components/Ui";
import { CATEGORIES, fmt, type Transaction } from "../data";
import { colors, radius, shadow } from "../theme";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function StatsScreen({ txs }: { txs: Transaction[] }) {
  const [mode, setMode] = useState<"expense" | "income">("expense");

  const week = useMemo(() => {
    // последние 7 дней: 6..12 ноября 2026 (пт..чт)
    return Array.from({ length: 7 }, (_, i) => {
      const day = 6 + i;
      const iso = `2026-11-${String(day).padStart(2, "0")}`;
      const sum = txs.filter((t) => t.date === iso && (mode === "expense" ? t.amount < 0 : t.amount > 0))
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      const weekday = DAYS[(new Date(2026, 10, day).getDay() + 6) % 7];
      return { day, weekday, sum, today: day === 12 };
    });
  }, [txs, mode]);
  const max = Math.max(...week.map((w) => w.sum), 1);
  const total = week.reduce((s, w) => s + w.sum, 0);

  const cats = useMemo(() => {
    const list = CATEGORIES.filter((c) => (mode === "income" ? c.income : !c.income)).map((c) => ({
      ...c,
      sum: txs.filter((t) => t.category === c.id).reduce((s, t) => s + Math.abs(t.amount), 0),
    }));
    const all = list.reduce((s, c) => s + c.sum, 0) || 1;
    return list.filter((c) => c.sum > 0).sort((a, b) => b.sum - a.sum).map((c) => ({ ...c, share: c.sum / all }));
  }, [txs, mode]);

  return (
    <ScrollView contentContainerStyle={st.wrap} showsVerticalScrollIndicator={false}>
      <Text style={st.title}>Статистика</Text>
      <View style={st.seg}>
        {(["expense", "income"] as const).map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={[st.segBtn, mode === m && st.segOn]}>
            <Text style={[st.segText, mode === m && st.segTextOn]}>{m === "expense" ? "Расходы" : "Доходы"}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[st.chartCard, shadow]}>
        <Text style={st.muted}>За 7 дней</Text>
        <Text style={st.total}>{fmt(total)}</Text>
        <View style={st.chart}>
          {week.map((w) => (
            <View key={w.day} style={st.col}>
              <Text style={st.colValue}>{w.sum ? Math.round(w.sum / 100) / 10 + "k" : ""}</Text>
              <View style={st.colTrack}>
                <View style={[st.colFill, { height: `${(w.sum / max) * 100}%`, backgroundColor: w.today ? colors.lime : colors.ink }]} />
              </View>
              <Text style={[st.colLabel, w.today && { color: colors.ink, fontWeight: "800" }]}>{w.weekday}</Text>
            </View>
          ))}
        </View>
      </View>

      <SectionTitle title="По категориям" />
      <View style={[st.list, shadow]}>
        {cats.map((c) => (
          <View key={c.id} style={st.catRow}>
            <View style={[st.catIcon, { backgroundColor: c.color + "26" }]}><Text style={{ fontSize: 20 }}>{c.emoji}</Text></View>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={st.catTop}>
                <Text style={st.catLabel}>{c.label}</Text>
                <Text style={st.catSum}>{fmt(c.sum)} <Text style={st.muted}>· {Math.round(c.share * 100)}%</Text></Text>
              </View>
              <Bar value={c.share} color={c.color} />
            </View>
          </View>
        ))}
        {!cats.length && <Text style={[st.muted, { textAlign: "center", padding: 20 }]}>Нет данных</Text>}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: "800", color: colors.ink, letterSpacing: -0.6, marginBottom: 16 },
  seg: { flexDirection: "row", backgroundColor: colors.line, borderRadius: radius.m, padding: 4, marginBottom: 16 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.s + 2, alignItems: "center" },
  segOn: { backgroundColor: colors.card },
  segText: { fontWeight: "600", color: colors.muted },
  segTextOn: { color: colors.ink },
  chartCard: { backgroundColor: colors.card, borderRadius: radius.l, padding: 18 },
  muted: { color: colors.muted, fontSize: 13, fontWeight: "500" },
  total: { fontSize: 30, fontWeight: "800", color: colors.ink, letterSpacing: -0.6, marginTop: 4 },
  chart: { flexDirection: "row", gap: 8, height: 180, marginTop: 18 },
  col: { flex: 1, alignItems: "center", gap: 6 },
  colValue: { fontSize: 10, color: colors.muted, height: 14 },
  colTrack: { flex: 1, width: "100%", borderRadius: 10, backgroundColor: colors.bg, justifyContent: "flex-end", overflow: "hidden" },
  colFill: { width: "100%", borderRadius: 10, minHeight: 4 },
  colLabel: { fontSize: 12, color: colors.muted, fontWeight: "600" },
  list: { backgroundColor: colors.card, borderRadius: radius.l, padding: 16, gap: 18 },
  catRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  catIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  catTop: { flexDirection: "row", justifyContent: "space-between" },
  catLabel: { fontWeight: "600", color: colors.ink },
  catSum: { fontWeight: "700", color: colors.ink },
});
