import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, withSpring, withTiming, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { Bot } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width } = Dimensions.get('window');

function TabItem({ route, index, state, descriptors, navigation }) {
  const { options } = descriptors[route.key];
  const isFocused = state.index === index;
  const isAiOrb = route.name === 'ai';

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const animatedGlassPillStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused && !isAiOrb ? 1 : 0, { duration: 200 }),
      transform: [{ scale: withSpring(isFocused && !isAiOrb ? 1 : 0.8, { damping: 15 }) }]
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused && !isAiOrb ? 1.15 : 1, { damping: 12, stiffness: 200 }) },
        { translateY: withSpring(isFocused && !isAiOrb ? -2 : 0, { damping: 12, stiffness: 200 }) }
      ]
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused && !isAiOrb ? 1 : 0, { duration: 200 }),
      height: withTiming(isFocused && !isAiOrb ? 14 : 0, { duration: 200 }),
      marginTop: withTiming(isFocused && !isAiOrb ? 2 : 0, { duration: 200 })
    };
  });

  if (isAiOrb) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.glassPill, animatedGlassPillStyle]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.5)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        {/* 3D Bottom Highlight */}
        {isFocused && (
          <View style={{ position: 'absolute', top: 2, opacity: 0.8 }}>
            {options.tabBarIcon({ color: 'rgba(255,255,255,1)', size: 22 })}
          </View>
        )}
        {/* 3D Top Shadow */}
        {isFocused && !isAiOrb && (
          <View style={{ position: 'absolute', top: -1, opacity: 0.3 }}>
            {options.tabBarIcon({ color: 'rgba(0,0,0,1)', size: 22 })}
          </View>
        )}
        {options.tabBarIcon({ color: isFocused ? '#2F6BFF' : '#475569', size: 22 })}
      </Animated.View>

      <Animated.Text style={[styles.tabText, { color: '#0f172a', fontWeight: '800' }, animatedTextStyle]}>
        {options.title}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const springConfig = { damping: 16, stiffness: 200 };

  return (
    <>
      <View style={[styles.container, { bottom: insets.bottom || 16 }]}>
        {/* Premium Deep Drop Shadow */}
        <View style={styles.shadowWrapper} />

        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          
          {/* Base Volumetric Gradient */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 248, 255, 0.4)', 'rgba(200, 224, 255, 0.15)']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* 3D Liquid Depth — Top Light Caustic */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.6)', 'transparent']}
            locations={[0, 0.15, 0.4]}
            style={StyleSheet.absoluteFill}
          />

          {/* 3D Liquid Depth — Bottom Subtle Dark */}
          <LinearGradient
            colors={['transparent', 'rgba(47, 107, 255, 0.04)', 'rgba(0, 0, 0, 0.06)']}
            locations={[0.5, 0.8, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Inner Glow Layer for extra depth */}
          <View style={styles.innerGlowLayer} />

          <View style={styles.innerGlass}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              if (options.href === null || route.name === 'explore') return null;
              
              return (
                <TabItem 
                  key={route.key} 
                  route={route} 
                  index={index} 
                  state={state} 
                  descriptors={descriptors} 
                  navigation={navigation} 
                />
              );
            })}
          </View>
        </BlurView>

        {/* Absolute Overlay for AI Orb */}
        {(() => {
          const aiRouteIndex = state.routes.findIndex(r => r.name === 'ai');
          if (aiRouteIndex === -1) return null;
          const route = state.routes[aiRouteIndex];
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (state.index !== aiRouteIndex && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const animatedOrbStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }]
          }));

          return (
            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', pointerEvents: 'box-none', zIndex: 50 }]}>
              <AnimatedPressable
                onPress={onPress}
                onPressIn={() => scale.value = withSpring(0.85, springConfig)}
                onPressOut={() => scale.value = withSpring(1, springConfig)}
                style={[styles.orbWrapper, animatedOrbStyle]}
              >
                {/* Spline 3D Orb — matching PWA sizing */}
                {/* Liquid Glass Backdrop instead of Aurora Glow */}
                <BlurView intensity={80} tint="light" style={styles.orbLiquidGlassBackdrop}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.3)', 'rgba(224, 236, 255, 0.1)']}
                    locations={[0, 0.4, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.8)', 'transparent', 'rgba(0,0,0,0.05)']}
                    locations={[0, 0.3, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  {/* Inner Glass Stroke for Extra Refraction */}
                  <View style={styles.orbLiquidGlassInnerStroke} pointerEvents="none" />
                </BlurView>
                <View style={styles.orbLiquidGlass}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.05)']}
                    locations={[0, 1]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.orbInnerBlue}>
                    {/* Spline 3D Viewer — loads runtime + scene like the PWA does */}
                    <View 
                      style={{
                        position: 'absolute',
                        top: -12,
                        left: -12,
                        right: -12,
                        bottom: -12,
                        overflow: 'hidden',
                        borderRadius: 40,
                      }}
                    >
                      <WebView
                        source={{ html: `
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
                            <style>
                              *{margin:0;padding:0;box-sizing:border-box}
                              html,body{width:100%;height:100%;overflow:hidden;background:transparent}
                              canvas{width:100%!important;height:100%!important;display:block}
                            </style>
                          </head>
                          <body>
                            <canvas id="canvas3d"></canvas>
                            <script type="module">
                              import { Application } from 'https://unpkg.com/@splinetool/runtime@1.9.82/build/runtime.js';
                              const canvas = document.getElementById('canvas3d');
                              const app = new Application(canvas);
                              app.load('https://prod.spline.design/UP9ptfgAz0jjQwkK/scene.splinecode')
                                .then(() => { 
                                  canvas.style.background = 'transparent';
                                });
                            </script>
                          </body>
                          </html>
                        `}}
                        style={{ flex: 1, backgroundColor: 'transparent' }}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        originWhitelist={['*']}
                        allowFileAccessFromFileURLs={true}
                        allowUniversalAccessFromFileURLs={true}
                        mixedContentMode="always"
                        onMessage={() => {}}
                      />
                    </View>
                  </View>
                </View>

              </AnimatedPressable>
            </View>
          );
        })()}

        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  shadowWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  blurContainer: {
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
  },
  innerGlowLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0,0,0,0.04)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(0,0,0,0.02)',
  },
  innerGlass: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    flex: 1,
    marginHorizontal: 2,
  },
  glassPill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 26,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 1)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 2,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    zIndex: 2,
    textAlign: 'center',
  },
  orbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
    width: 58,
    height: 58,
  },
  orbLiquidGlassBackdrop: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'rgba(255,255,255,1)',
    borderLeftColor: 'rgba(255,255,255,0.9)',
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderRightColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#2F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  orbLiquidGlassInnerStroke: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  orbLiquidGlass: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  orbInnerBlue: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

