import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CATEGORIES, type CategoryId, type Transaction } from "../data";
import { colors, radius } from "../theme";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, "id">) => void;
}

/** Нижняя шторка добавления операции со своей цифровой клавиатурой. */
export function AddSheet({ visible, onClose, onSave }: Props) {
  const [kind, setKind] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [note, setNote] = useState("");

  const cats = CATEGORIES.filter((c) => (kind === "income" ? c.income : !c.income));
  const value = parseFloat(amount) || 0;

  const press = (k: string) => {
    if (k === "⌫") return setAmount((a) => a.slice(0, -1));
    if (k === "." && amount.includes(".")) return;
    if (amount.split(".")[1]?.length === 2) return;
    if (amount.replace(".", "").length >= 7) return;
    setAmount((a) => (a === "0" && k !== "." ? k : a + k));
  };

  const switchKind = (k: "expense" | "income") => {
    setKind(k);
    setCategory(k === "income" ? "salary" : "food");
  };

  const save = () => {
    if (!value) return;
    onSave({ amount: kind === "expense" ? -value : value, category, note: note.trim(), date: "2026-11-12" });
    setAmount("");
    setNote("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={st.scrim} onPress={onClose} />
      <View style={st.sheet}>
        <View style={st.handle} />
        <View style={st.seg}>
          {(["expense", "income"] as const).map((k) => (
            <Pressable key={k} onPress={() => switchKind(k)} style={[st.segBtn, kind === k && st.segOn]}>
              <Text style={[st.segText, kind === k && st.segTextOn]}>{k === "expense" ? "Расход" : "Доход"}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[st.amount, !amount && { color: colors.muted }]}>
          {kind === "expense" ? "−" : "+"}{amount || "0"} ₴
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
          {cats.map((c) => (
            <Pressable key={c.id} onPress={() => setCategory(c.id)}
              style={[st.chip, category === c.id && { backgroundColor: colors.ink, borderColor: colors.ink }]}>
              <Text style={{ fontSize: 16 }}>{c.emoji}</Text>
              <Text style={[st.chipText, category === c.id && { color: "#fff" }]}>{c.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput value={note} onChangeText={setNote} placeholder="Комментарий (необязательно)"
          placeholderTextColor={colors.muted} style={st.input} maxLength={40} />

        <View style={st.pad}>
          {KEYS.map((k) => (
            <Pressable key={k} onPress={() => press(k)} style={({ pressed }) => [st.key, pressed && { backgroundColor: colors.line }]}>
              <Text style={st.keyText}>{k}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={save} disabled={!value} style={[st.save, !value && { opacity: 0.4 }]}>
          <Text style={st.saveText}>Сохранить</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "#12131A80" },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: 20, paddingBottom: 28, gap: 14 },
  handle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: colors.line },
  seg: { flexDirection: "row", backgroundColor: colors.bg, borderRadius: radius.m, padding: 4 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.s + 2, alignItems: "center" },
  segOn: { backgroundColor: colors.lime },
  segText: { fontWeight: "600", color: colors.muted },
  segTextOn: { color: colors.ink },
  amount: { fontSize: 44, fontWeight: "800", textAlign: "center", color: colors.ink, letterSpacing: -1 },
  chips: { gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, borderWidth: 1, borderColor: colors.line },
  chipText: { fontWeight: "600", color: colors.ink },
  input: { backgroundColor: colors.bg, borderRadius: radius.m, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.ink },
  pad: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  key: { width: "31.5%", paddingVertical: 14, borderRadius: radius.m, backgroundColor: colors.bg, alignItems: "center" },
  keyText: { fontSize: 22, fontWeight: "600", color: colors.ink },
  save: { backgroundColor: colors.ink, borderRadius: radius.m, paddingVertical: 17, alignItems: "center" },
  saveText: { color: colors.lime, fontWeight: "800", fontSize: 16 },
});
