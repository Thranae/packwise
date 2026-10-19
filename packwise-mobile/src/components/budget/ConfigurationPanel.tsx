import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { MapPin, Calendar, Users, Diamond, Wallet, Car, Home, ChevronDown, X } from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';

const CustomSelect = ({ name, value, options, onChange, label }: any) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.value == value) || options[0];

  return (
    <>
      <TouchableOpacity 
        onPress={() => setOpen(true)}
        style={s.selectBtn}
        activeOpacity={0.7}
      >
        <Text style={s.selectText} numberOfLines={1}>
          {selectedOption?.label || value}
        </Text>
        <ChevronDown size={14} color="#64748b" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity 
          style={s.modalOverlay}
          activeOpacity={1} 
          onPress={() => setOpen(false)}
        >
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={22} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt: any) => (
                <TouchableOpacity
                  key={String(opt.value)}
                  onPress={() => {
                    onChange({ target: { name, value: opt.value } });
                    setOpen(false);
                  }}
                  style={[s.optionRow, value == opt.value && s.optionRowSelected]}
                  activeOpacity={0.7}
                >
                  <Text style={[s.optionText, value == opt.value && s.optionTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export const ConfigurationPanel = React.memo(({ inputs, setInputs, onCalculate }: any) => {
  const handleChange = React.useCallback((e: any) => {
    const { name, value } = e.target;
    setInputs((prev: any) => ({
      ...prev,
      [name]: name === 'days' || name === 'travelers' ? Number(value) : value,
    }));
  }, [setInputs]);

  const Field = ({ label, icon: Icon, iconColor = '#64748b', children }: any) => (
    <View style={s.field}>
      <View style={s.fieldLabel}>
        <Icon size={13} color={iconColor} />
        <Text style={s.fieldLabelText}>{label}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={s.panel}>
      <View style={s.fieldsGrid}>
        
        <Field label="Home Country" icon={MapPin}>
          <CustomSelect 
            name="originCountry" 
            value={inputs.originCountry} 
            onChange={handleChange} 
            label="Home Country"
            options={[
              { value: 'India', label: 'India' },
              { value: 'United States', label: 'United States' },
              { value: 'United Kingdom', label: 'United Kingdom' }
            ]} 
          />
        </Field>

        <Field label="Destination" icon={MapPin} iconColor="#4f46e5">
          <CustomSelect 
            name="destCountry" 
            value={inputs.destCountry} 
            onChange={handleChange} 
            label="Destination"
            options={Object.keys(COUNTRY_DATA).map(c => ({ value: c, label: c }))} 
          />
        </Field>

        <Field label="Duration" icon={Calendar}>
          <CustomSelect 
            name="days" 
            value={inputs.days} 
            onChange={handleChange} 
            label="Duration"
            options={[3,5,7,10,14,21,30].map(d => ({ value: d, label: `${d} Days` }))} 
          />
        </Field>

        <Field label="Travelers" icon={Users}>
          <CustomSelect 
            name="travelers" 
            value={inputs.travelers} 
            onChange={handleChange} 
            label="Travelers"
            options={[1,2,3,4,5,6].map(t => ({ value: t, label: `${t} ${t === 1 ? 'Adult' : 'Adults'}` }))} 
          />
        </Field>

        <Field label="Travel Style" icon={Diamond} iconColor="#8b5cf6">
          <CustomSelect 
            name="travelStyle" 
            value={inputs.travelStyle} 
            onChange={handleChange} 
            label="Travel Style"
            options={[
              { value: 'budget', label: 'Budget' },
              { value: 'standard', label: 'Standard' },
              { value: 'luxury', label: 'Luxury' }
            ]} 
          />
        </Field>

        <Field label="Transportation" icon={Car} iconColor="#3b82f6">
          <CustomSelect 
            name="transportation" 
            value={inputs.transportation || 'public'} 
            onChange={handleChange} 
            label="Transportation"
            options={[
              { value: 'public', label: 'Public Transit' },
              { value: 'rideshare', label: 'Taxi / Rideshare' },
              { value: 'rental', label: 'Car Rental' }
            ]} 
          />
        </Field>

        <Field label="Accommodation" icon={Home} iconColor="#f59e0b">
          <CustomSelect 
            name="accommodation" 
            value={inputs.accommodation || 'hotel'} 
            onChange={handleChange} 
            label="Accommodation"
            options={[
              { value: 'hostel', label: 'Hostel / Dorm' },
              { value: 'hotel', label: 'Standard Hotel' },
              { value: 'airbnb', label: 'Airbnb' },
              { value: 'resort', label: 'Luxury Resort' }
            ]} 
          />
        </Field>

        <View style={s.field}>
          <View style={{ height: 20 }} />
          <TouchableOpacity
            onPress={onCalculate}
            style={s.calcButton}
            activeOpacity={0.8}
          >
            <Text style={s.calcButtonText}>Apply Changes</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
});

const s = StyleSheet.create({
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  field: { 
    width: '48%', 
    marginBottom: 14, 
    gap: 6 
  },
  fieldLabel: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  fieldLabelText: { 
    fontSize: 10.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    letterSpacing: 1.2 
  },

  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  selectText: { 
    fontSize: 13.5, 
    fontFamily: 'Outfit_600SemiBold', 
    color: '#1e293b', 
    flex: 1, 
    marginRight: 6 
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: { 
    fontSize: 18, 
    fontFamily: 'Outfit_700Bold', 
    color: '#0f172a' 
  },

  optionRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'rgba(241, 245, 249, 0.6)',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  optionText: { 
    fontSize: 15, 
    fontFamily: 'Outfit_500Medium', 
    color: '#475569' 
  },
  optionTextSelected: { 
    fontFamily: 'Outfit_700Bold', 
    color: '#4f46e5' 
  },

  calcButton: {
    height: 44,
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  calcButtonText: { 
    fontSize: 13.5, 
    fontFamily: 'Outfit_700Bold', 
    color: '#ffffff',
    textAlign: 'center',
  },
});
