import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MapPin, Calendar, Users, Diamond, Wallet, Car, Home, ChevronDown, X } from 'lucide-react-native';
import { COUNTRY_DATA } from '../../utils/costEngine';

const CustomSelect = ({ name, value, options, onChange, label }: any) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.value == value) || options[0];

  return (
    <>
      <TouchableOpacity 
        onPress={() => setOpen(true)}
        className="w-full bg-[#0f131d] border border-white/10 rounded-xl px-3 py-2.5 flex flex-row items-center justify-between"
      >
        <Text className="text-sm font-medium text-white truncate pr-2" numberOfLines={1}>
          {selectedOption?.label || value}
        </Text>
        <ChevronDown size={14} color="#9ca3af" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity 
          className="flex-1 bg-black/60 justify-end"
          activeOpacity={1} 
          onPress={() => setOpen(false)}
        >
          <View className="bg-[#111827] w-full rounded-t-3xl p-5 border-t border-gray-800 max-h-[70%]">
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-white">{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <X size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt: any) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    onChange({ target: { name, value: opt.value } });
                    setOpen(false);
                  }}
                  className={`py-4 px-4 rounded-xl mb-2 flex flex-row items-center ${
                    value == opt.value ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'
                  }`}
                >
                  <Text className={`text-base ${value == opt.value ? 'text-blue-400 font-bold' : 'text-white/70'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <View className="h-10" />
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

  const Field = ({ label, icon: Icon, iconColor = '#9ca3af', children }: any) => (
    <View className="flex flex-col gap-1.5 w-[48%] mb-4">
      <View className="flex flex-row items-center gap-1.5">
        <Icon size={12} color={iconColor} />
        <Text className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View className="w-full bg-[#111827] rounded-[32px] p-6 border border-gray-800 mt-2 mb-4">
      <View className="flex flex-row flex-wrap justify-between">
        
        <Field label="Home Country" icon={MapPin} labelText="Home Country">
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

        <Field label="Destination" icon={MapPin} iconColor="#60a5fa" labelText="Destination">
          <CustomSelect 
            name="destCountry" 
            value={inputs.destCountry} 
            onChange={handleChange} 
            label="Destination"
            options={Object.keys(COUNTRY_DATA).map(c => ({ value: c, label: c }))} 
          />
        </Field>

        <Field label="Duration" icon={Calendar} labelText="Duration">
          <CustomSelect 
            name="days" 
            value={inputs.days} 
            onChange={handleChange} 
            label="Duration"
            options={[3,5,7,10,14,21,30].map(d => ({ value: d, label: `${d} Days` }))} 
          />
        </Field>

        <Field label="Travelers" icon={Users} labelText="Travelers">
          <CustomSelect 
            name="travelers" 
            value={inputs.travelers} 
            onChange={handleChange} 
            label="Travelers"
            options={[1,2,3,4,5,6].map(t => ({ value: t, label: `${t} ${t === 1 ? 'Adult' : 'Adults'}` }))} 
          />
        </Field>

        <Field label="Travel Style" icon={Diamond} iconColor="#c084fc" labelText="Travel Style">
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

        <Field label="Transportation" icon={Car} iconColor="#60a5fa" labelText="Transportation">
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

        <Field label="Accommodation" icon={Home} iconColor="#fbbf24" labelText="Accommodation">
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

        <View className="w-[48%] justify-end pb-1">
          <TouchableOpacity
            onPress={onCalculate}
            className="h-[42px] w-full bg-blue-600 items-center justify-center rounded-xl"
          >
            <Text className="text-white text-sm font-bold">Calculate Budget</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
});
