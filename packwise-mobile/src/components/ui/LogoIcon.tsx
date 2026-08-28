import React from 'react';
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { View } from 'react-native';

export const LogoIcon = ({ size = 40 }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg viewBox="-8 -8 64 64" width={size} height={size} fill="none">
        <Defs>
          {/* Metallic Silver for Handle & Ribs */}
          <LinearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ffffff" />
            <Stop offset="20%" stopColor="#e2e8f0" />
            <Stop offset="50%" stopColor="#94a3b8" />
            <Stop offset="80%" stopColor="#f8fafc" />
            <Stop offset="100%" stopColor="#64748b" />
          </LinearGradient>

          {/* Premium Titanium Body */}
          <LinearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#cbd5e1" />
            <Stop offset="40%" stopColor="#64748b" />
            <Stop offset="100%" stopColor="#334155" />
          </LinearGradient>

          {/* 3D Glossy Blue Pin */}
          <LinearGradient id="pin3D" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#93c5fd" />
            <Stop offset="40%" stopColor="#3b82f6" />
            <Stop offset="100%" stopColor="#1d4ed8" />
          </LinearGradient>

          {/* Dark Rubber Wheels */}
          <LinearGradient id="rubber" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#475569" />
            <Stop offset="100%" stopColor="#0f172a" />
          </LinearGradient>
        </Defs>

        {/* 3D Drop Shadows */}
        <G transform="translate(0, 4)">
          <Rect x="10" y="12" width="28" height="30" rx="4" fill="rgba(0,0,0,0.3)" blurRadius={4} />
          <Path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill="rgba(0,0,0,0.3)" />
        </G>

        {/* Suitcase Group */}
        <G>
          {/* Back Handle Pole Shadows */}
          <Path d="M18 12V6 M30 12V6" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          {/* Telescopic Handle Poles */}
          <Path d="M18 12V6 M30 12V6" stroke="url(#metal)" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Handle Grip Shadow */}
          <Path d="M15 6.5H33" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          {/* Handle Grip */}
          <Path d="M15 5.5H33" stroke="url(#metal)" strokeWidth="4" strokeLinecap="round" />
          
          {/* Suitcase Body Base */}
          <Rect x="10" y="12" width="28" height="30" rx="4" fill="url(#titanium)" />
          {/* Suitcase Rim/Stroke */}
          <Rect x="10" y="12" width="28" height="30" rx="4" stroke="url(#metal)" strokeWidth="1.5" />
          
          {/* 3D Vertical Ribs (Rimowa style) */}
          {/* Shadows */}
          <Path d="M15 14V34 M24 14V34 M33 14V34" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          {/* Highlights */}
          <Path d="M14 14V34 M23 14V34 M32 14V34" stroke="url(#metal)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Wheels Base */}
          <Circle cx="15" cy="44" r="3" fill="url(#rubber)" />
          <Circle cx="33" cy="44" r="3" fill="url(#rubber)" />
          {/* Wheels Inner Rim */}
          <Circle cx="15" cy="44" r="1.5" fill="url(#metal)" />
          <Circle cx="33" cy="44" r="1.5" fill="url(#metal)" />
        </G>

        {/* Location Pin */}
        <G transform="translate(0, -3)">
          {/* Pin Body */}
          <Path d="M24 16C27.3137 16 30 18.6863 30 22C30 26 24 32 24 32C24 32 18 26 18 22C18 18.6863 20.6863 16 24 16Z" fill="url(#pin3D)" />
          {/* Pin Gloss/Highlight */}
          <Path d="M24 17C26.5 17 28.5 19 29 21.5C28.5 18 26.5 17.5 24 17.5C21.5 17.5 19.5 18 19 21.5C19.5 19 21.5 17 24 17Z" fill="#ffffff" opacity="0.6" />
          {/* Inner White Hole with shadow */}
          <Circle cx="24" cy="22" r="2.5" fill="#e2e8f0" />
          <Circle cx="24" cy="21.5" r="1.5" fill="#ffffff" />
        </G>
      </Svg>
    </View>
  );
};
