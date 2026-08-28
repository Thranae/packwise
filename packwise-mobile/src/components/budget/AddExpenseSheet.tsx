import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown, SlideOutDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus, DollarSign, Tag } from 'lucide-react-native';
import { useBudgetStore } from '../../store/useBudgetStore';

interface AddExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Food', 'Transport', 'Lodging', 'Activities', 'Other'] as const;

const LiquidIconBox = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.iconBoxShadow}>
    <BlurView intensity={80} tint="light" style={styles.iconBoxPill}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.2)', 'transparent']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.02)', 'rgba(47, 107, 255, 0.15)']}
        locations={[0.5, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.iconBoxStroke} pointerEvents="none" />
      {children}
    </BlurView>
  </View>
);

export default function AddExpenseSheet({ visible, onClose }: AddExpenseSheetProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Food');
  const [note, setNote] = useState('');
  const insets = useSafeAreaInsets();
  
  const addExpense = useBudgetStore((state) => state.addExpense);

  const handleSave = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    
    addExpense({
      amount: val,
      category,
      note,
    });
    
    setAmount('');
    setNote('');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardContainer}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={onClose}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
          </Pressable>
        </Animated.View>
        
        <Animated.View entering={SlideInDown.springify().damping(35).stiffness(200)} exiting={SlideOutDown} style={[styles.sheet, { marginBottom: Math.max(insets.bottom + 16, 24) }]}>
          <BlurView intensity={100} tint="extraLight" style={styles.glassInner}>
            
            <View style={styles.partitionContainer}>
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.015)' }]} />
              <View style={styles.partitionInnerStroke} pointerEvents="none" />
              
              <View style={styles.contentPadding}>
                <View style={styles.header}>
                  <Text style={styles.title}>Add Expense</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <X size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <LiquidIconBox>
                    <DollarSign size={20} color="#2F6BFF" strokeWidth={2.5} />
                  </LiquidIconBox>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.categoryRow}>
                  {CATEGORIES.map((cat) => {
                    const isActive = category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        activeOpacity={0.8}
                        style={styles.catBtnShadow}
                        onPress={() => setCategory(cat)}
                      >
                        <BlurView intensity={isActive ? 80 : 40} tint={isActive ? "default" : "light"} style={styles.catBtnPill}>
                          <LinearGradient
                            colors={isActive 
                              ? ['#5AA9FF', '#2F6BFF'] 
                              : ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.2)']}
                            locations={isActive ? [0, 1] : [0, 0.3, 1]}
                            style={StyleSheet.absoluteFillObject}
                          />
                          {isActive && (
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0.5)', 'transparent']}
                              locations={[0, 1]}
                              style={StyleSheet.absoluteFillObject}
                            />
                          )}
                          {!isActive && (
                            <LinearGradient
                              colors={['transparent', 'rgba(0, 0, 0, 0.02)', 'rgba(47, 107, 255, 0.08)']}
                              locations={[0.5, 0.8, 1]}
                              style={StyleSheet.absoluteFillObject}
                            />
                          )}
                          <View style={[styles.catBtnStroke, isActive && { borderColor: 'rgba(255, 255, 255, 0.3)', borderBottomColor: 'rgba(0,0,0,0.2)' }]} pointerEvents="none" />
                          <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
                        </BlurView>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.inputContainer}>
                  <LiquidIconBox>
                    <Tag size={20} color="#64748b" strokeWidth={2.5} />
                  </LiquidIconBox>
                  <TextInput
                    style={[styles.input, { fontSize: 16 }]}
                    placeholder="Note (optional)"
                    value={note}
                    onChangeText={setNote}
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <TouchableOpacity activeOpacity={0.8} style={styles.saveBtnShadow} onPress={handleSave}>
                  <BlurView intensity={80} tint="default" style={styles.saveBtnPill}>
                    <LinearGradient
                      colors={['#5AA9FF', '#2F6BFF']}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <LinearGradient
                      colors={['rgba(255,255,255,0.6)', 'transparent']}
                      locations={[0, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.saveBtnStroke} pointerEvents="none" />
                    <Text style={styles.saveText}>Save Expense</Text>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>

          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    marginHorizontal: 16,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: -16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
  },
  glassInner: {
    padding: 16,
  },
  partitionContainer: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 2,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.15)',
    borderLeftColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 1)',
    borderRightColor: 'rgba(255, 255, 255, 0.8)',
  },
  partitionInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  contentPadding: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  iconBoxShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 12,
  },
  iconBoxPill: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconBoxStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  catBtnShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  catBtnPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  catBtnStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  catTextActive: {
    color: '#fff',
  },
  saveBtnShadow: {
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 8,
  },
  saveBtnPill: {
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
