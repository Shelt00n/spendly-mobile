import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Bar, SectionTitle, TxRow } from "../components/Ui";
import { categoryById, fmt, MONTHLY_BUDGET, type Transaction } from "../data";
import { colors, radius, shadow } from "../theme";

interface Props {
  txs: Transaction[];
  onDelete: (id: string) => void;
  onOpenStats: () => void;
}

export function HomeScreen({ txs, onDelete, onOpenStats }: Props) {
  const [hidden, setHidden] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { balance, income, spent, top } = useMemo(() => {
    const income = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const spent = -txs.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
    const byCat = new Map<string, number>();
    txs.filter((t) => t.amount < 0).forEach((t) => byCat.set(t.category, (byCat.get(t.category) ?? 0) - t.amount));
    const top = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { balance: 12840 + income - spent, income, spent, top };
  }, [txs]);

  const left = MONTHLY_BUDGET - spent;
  const visible = showAll ? txs : txs.slice(0, 5);

  return (
    <ScrollView contentContainerStyle={st.wrap} showsVerticalScrollIndicator={false}>
      <View style={st.header}>
        <View>
          <Text style={st.hello}>Привет, Егор 👋</Text>
          <Text style={st.date}>Ноябрь 2026</Text>
        </View>
        <View style={st.avatar}><Text style={st.avatarText}>ЕК</Text></View>
      </View>

      <LinearGradient colors={[colors.ink2, colors.ink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.card}>
        <View style={st.cardTop}>
          <Text style={st.cardLabel}>Общий баланс</Text>
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={10}>
            <Text style={st.eye}>{hidden ? "🙈" : "👁"}</Text>
          </Pressable>
        </View>
        <Text style={st.balance}>{hidden ? "•••••• ₴" : fmt(balance)}</Text>
        <View style={st.flows}>
          <View style={st.flow}>
            <Text style={st.flowArrow}>↓</Text>
            <View><Text style={st.flowLabel}>Доходы</Text><Text style={st.flowValue}>{fmt(income)}</Text></View>
          </View>
          <View style={st.flow}>
            <Text style={[st.flowArrow, { backgroundColor: "#ffffff1a", color: "#fff" }]}>↑</Text>
            <View><Text style={st.flowLabel}>Расходы</Text><Text style={st.flowValue}>{fmt(spent)}</Text></View>
          </View>
        </View>
        <View style={st.blob} />
      </LinearGradient>

      <View style={[st.budget, shadow]}>
        <View style={st.budgetTop}>
          <Text style={st.budgetTitle}>Бюджет на месяц</Text>
          <Text style={[st.budgetLeft, left < 0 && { color: colors.red }]}>
            {left >= 0 ? `осталось ${fmt(left)}` : `перерасход ${fmt(-left)}`}
          </Text>
        </View>
        <Bar value={spent / MONTHLY_BUDGET} color={spent > MONTHLY_BUDGET ? colors.red : colors.ink} height={10} />
        <View style={st.topCats}>
          {top.map(([id, sum]) => {
            const c = categoryById(id as Transaction["category"]);
            return (
              <Pressable key={id} style={st.topCat} onPress={onOpenStats}>
                <Text style={{ fontSize: 18 }}>{c.emoji}</Text>
                <Text style={st.topCatLabel}>{c.label}</Text>
                <Text style={st.topCatSum}>{fmt(sum)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionTitle title="Операции" action={showAll ? "Свернуть" : "Все"} onAction={() => setShowAll((v) => !v)} />
      <View style={[st.list, shadow]}>
        {visible.map((t) => <TxRow key={t.id} tx={t} onLongPress={() => onDelete(t.id)} />)}
        {!txs.length && <Text style={st.empty}>Пока пусто — добавьте первую операцию кнопкой +</Text>}
      </View>
      <Text style={st.hint}>Удерживайте операцию, чтобы удалить её</Text>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  hello: { fontSize: 24, fontWeight: "800", color: colors.ink, letterSpacing: -0.5 },
  date: { fontSize: 14, color: colors.muted, marginTop: 2 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.lime, alignItems: "center", justifyContent: "center" },
  avatarText: { fontWeight: "800", color: colors.ink },
  card: { borderRadius: radius.xl, padding: 22, overflow: "hidden" },
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  cardLabel: { color: "#ffffff99", fontSize: 14, fontWeight: "500" },
  eye: { fontSize: 18 },
  balance: { color: "#fff", fontSize: 38, fontWeight: "800", letterSpacing: -1, marginTop: 8, marginBottom: 22 },
  flows: { flexDirection: "row", gap: 12 },
  flow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: radius.m, backgroundColor: "#ffffff0f" },
  flowArrow: { width: 32, height: 32, borderRadius: 16, textAlign: "center", lineHeight: 32, fontWeight: "800", backgroundColor: colors.lime, color: colors.ink, overflow: "hidden" },
  flowLabel: { color: "#ffffff80", fontSize: 12 },
  flowValue: { color: "#fff", fontSize: 15, fontWeight: "700" },
  blob: { position: "absolute", right: -40, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: colors.lime, opacity: 0.16 },
  budget: { marginTop: 16, backgroundColor: colors.card, borderRadius: radius.l, padding: 18, gap: 14 },
  budgetTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  budgetTitle: { fontSize: 16, fontWeight: "700", color: colors.ink },
  budgetLeft: { fontSize: 13, fontWeight: "600", color: colors.green },
  topCats: { flexDirection: "row", gap: 8 },
  topCat: { flex: 1, padding: 12, borderRadius: radius.m, backgroundColor: colors.bg, gap: 4 },
  topCatLabel: { fontSize: 12, color: colors.muted },
  topCatSum: { fontSize: 14, fontWeight: "700", color: colors.ink },
  list: { backgroundColor: colors.card, borderRadius: radius.l, paddingHorizontal: 16, paddingVertical: 6 },
  empty: { color: colors.muted, textAlign: "center", padding: 24 },
  hint: { textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 12 },
});
