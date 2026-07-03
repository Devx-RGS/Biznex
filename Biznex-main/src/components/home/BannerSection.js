import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { BANNERS } from '../../data/homeData';
import { colors } from '../../constants/colors';

const W = Dimensions.get('window').width;

export default function BannerSection() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (idxRef.current + 1) % BANNERS.length;
      try { ref.current?.scrollToIndex({ index: next, animated: true }); } catch (_) {}
      idxRef.current = next;
      setActive(next);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={s.wrap}>
      <FlatList
        ref={ref}
        data={BANNERS}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={i => i.id}
        getItemLayout={(_, index) => ({ length: W, offset: W * index, index })}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems[0]) { idxRef.current = viewableItems[0].index; setActive(viewableItems[0].index); }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={[s.card, { backgroundColor: item.bg }]}>
            <View style={[s.circle1, { backgroundColor: item.accent + '25' }]} />
            <View style={[s.circle2, { backgroundColor: item.accent + '15' }]} />
            <View style={s.sponsoredTag}><Text style={s.sponsoredTxt}>Sponsored</Text></View>
            <Text style={[s.company, { color: item.accent }]}>{item.company}</Text>
            <Text style={s.tagline}>{item.tagline}</Text>
            <View style={[s.learnBtn, { borderColor: item.accent }]}>
              <Text style={[s.learnTxt, { color: item.accent }]}>Learn More →</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={s.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[s.dot, active === i && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:        { marginBottom: 8 },
  card:        { width: W, height: 155, paddingHorizontal: 24, paddingVertical: 20, overflow: 'hidden', justifyContent: 'center' },
  circle1:     { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -40, top: -40 },
  circle2:     { position: 'absolute', width: 120, height: 120, borderRadius: 60, right: 60,  bottom: -50 },
  sponsoredTag:{ position: 'absolute', top: 12, right: 16, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  sponsoredTxt:{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular', fontSize: 10 },
  company:     { fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 6 },
  tagline:     { color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', fontSize: 13, marginBottom: 14 },
  learnBtn:    { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 },
  learnTxt:    { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  dots:        { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 4 },
  dot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 3 },
  dotActive:   { width: 18, backgroundColor: colors.accent },
});
