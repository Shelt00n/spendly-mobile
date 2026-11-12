import { Pressable, StyleSheet, Text, View } from "react-native";
import { categoryById, dayLabel, fmt, type Transaction } from "../data";
import { colors, radius } from "../theme";

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={s.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function TxRow({ tx, onLongPress }: { tx: Transaction; onLongPress?: () => void }) {
  const cat = categoryById(tx.category);
  const income = tx.amount > 0;
  return (
    <Pressable onLongPress={onLongPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]}>
      <View style={[s.icon, { backgroundColor: cat.color + "26" }]}>
        <Text style={s.emoji}>{cat.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle} numberOfLines={1}>{tx.note || cat.label}</Text>
        <Text style={s.rowSub}>{cat.label} · {dayLabel(tx.date)}</Text>
      </View>
      <Text style={[s.amount, { color: income ? colors.green : colors.ink }]}>{fmt(tx.amount, true)}</Text>
    </Pressable>
  );
}

/** Горизонтальная полоса прогресса. */
export function Bar({ value, color, track = colors.line, height = 8 }: { value: number; color: string; track?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: "hidden" }}>
      <View style={{ width: `${Math.min(100, Math.max(0, value * 100))}%`, height: "100%", borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

const s = StyleSheet.create({
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 26, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.ink },
  sectionAction: { fontSize: 14, fontWeight: "600", color: colors.muted },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  icon: { width: 46, height: 46, borderRadius: radius.s + 2, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 22 },
  rowTitle: { fontSize: 15, fontWeight: "600", color: colors.ink },
  rowSub: { fontSize: 12.5, color: colors.muted, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: "700" },
});
