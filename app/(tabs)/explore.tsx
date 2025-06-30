import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, ScrollView, View, Text, SafeAreaView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Collapsible } from '@/components/Collapsible';

export default function ExploreScreen() {
  // State for auto-rotating content
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const [currentFertilizerIndex, setCurrentFertilizerIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Get current Bengali month for personalized content
  const getCurrentBengaliMonth = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const bengaliMonths: { [key: number]: string } = {
      4: "বৈশাখ", 5: "জ্যৈষ্ঠ", 6: "আষাঢ়", 7: "শ্রাবণ",
      8: "ভাদ্র", 9: "আশ্বিন", 10: "কার্তিক", 11: "অগ্রহায়ণ",
      12: "পৌষ", 1: "মাঘ", 2: "ফাল্গুন", 3: "চৈত্র"
    };
    return bengaliMonths[month] || "বৈশাখ";
  };

  // 1. PERSONALIZED TIPS BASED ON CURRENT MONTH
  const monthlyTips: { [key: string]: string } = {
    "বৈশাখ": "গরমে ভুট্টা ও তরমুজ চাষ শুরু করুন। সেচের পানি সাশ্রয় করুন।",
    "জ্যৈষ্ঠ": "আমন ধানের বীজতলা তৈরি করুন। গরমে গাছের ছায়ার ব্যবস্থা করুন।",
    "আষাঢ়": "আমন ধান রোপণ শুরু করুন। বর্ষার পানি সংরক্ষণ করুন।",
    "শ্রাবণ": "পাট কাটা ও আমন ধানের যত্ন নিন। জলাবদ্ধতা এড়ান।",
    "ভাদ্র": "আমন ধানে সার প্রয়োগ করুন। শাকসবজি চাষ শুরু করুন।",
    "আশ্বিন": "শীতকালীন সবজির চারা তৈরি করুন। আমন ধান রক্ষণাবেক্ষণ করুন।",
    "কার্তিক": "আমন ধান কাটা ও রবি ফসল বপন করুন। বোরোর জমি তৈরি করুন।",
    "অগ্রহায়ণ": "গম, সরিষা ও আলু চাষ করুন। শীতের জন্য প্রস্তুতি নিন।",
    "পৌষ": "বোরো ধানের চারা তৈরি করুন। কুয়াশা থেকে ফসল রক্ষা করুন।",
    "মাঘ": "বোরো ধান রোপণ করুন। শীতকালীন সবজির যত্ন নিন।",
    "ফাল্গুন": "বোরো ধানে সার দিন। গ্রীষ্মকালীন ফসলের প্রস্তুতি নিন।",
    "চৈত্র": "বোরো ধান কাটার প্রস্তুতি। গরমকালীন চাষের পরিকল্পনা করুন।"
  };

  // 2. BASIC FARMING TIPS (Enhanced and Practical)
  const basicFarmingTips = [
    {
      icon: "🌱",
      title: "ভালো বীজ নির্বাচন ও সংরক্ষণ",
      tip: "প্রত্যয়িত উন্নত জাতের বীজ ব্যবহার করুন। বীজ কিনার আগে প্যাকেটের তারিখ দেখুন। বীজ পরীক্ষা করে নিন - পানিতে ভাসে এমন বীজ বাদ দিন।",
      benefit: "৩০-৪০% বেশি ফলন ও রোগমুক্ত ফসল",
      actionSteps: "১. নির্ভরযোগ্য দোকান থেকে কিনুন ২. অঙ্কুরোদগম পরীক্ষা করুন ৩. শুকনো ও ঠান্ডা জায়গায় রাখুন"
    },
    {
      icon: "💧",
      title: "বুদ্ধিমত্তার সাথে সেচ ব্যবস্থাপনা",
      tip: "সকাল (৬-৮টা) বা সন্ধ্যায় (৪-৬টা) সেচ দিন। মাটির ৫ সেমি গভীরে আঙুল দিয়ে আর্দ্রতা পরীক্ষা করুন। ড্রিপ পদ্ধতি ব্যবহার করুন।",
      benefit: "৫০% পানি সাশ্রয় ও উন্নত ফলন",
      actionSteps: "১. মাটির আর্দ্রতা পরীক্ষা ২. সেচের সময় মেনে চলুন ৩. পানি জমতে দেবেন না"
    },
    {
      icon: "🌿",
      title: "জৈব সার ও কম্পোস্ট তৈরি",
      tip: "রান্নাঘরের বর্জ্য, গোবর ও খড় মিশিয়ে কম্পোস্ট তৈরি করুন। কেঁচো সার ব্যবহার করুন। সবুজ সার হিসেবে ধৈঞ্চা চাষ করুন।",
      benefit: "মাটির উর্বরতা বৃদ্ধি ও ৩০% খরচ কমে",
      actionSteps: "১. বর্জ্য সংগ্রহ করুন ২. ৩ মাস পচতে দিন ৩. নিয়মিত মিশিয়ে দিন"
    },
    {
      icon: "🪲",
      title: "প্রাকৃতিক পোকামাকড় নিয়ন্ত্রণ",
      tip: "নিম তেল, সাবান পানি ও ছাই ব্যবহার করুন। ফেরোমন ট্র্যাপ ব্যবহার করুন। উপকারী পোকা (মাকড়সা, ব্যাঙ) সংরক্ষণ করুন।",
      benefit: "৮০% কীটনাশক কমিয়ে নিরাপদ ফসল",
      actionSteps: "১. প্রতিদিন জমি দেখুন ২. প্রাকৃতিক স্প্রে করুন ৩. উপকারী পোকা রক্ষা করুন"
    },
    {
      icon: "⏰",
      title: "সঠিক সময়ে সঠিক কাজ",
      tip: "আবহাওয়ার পূর্বাভাস দেখে কাজ করুন। চাঁদের তিথি অনুযায়ী বীজ বপন করুন। মৌসুমি ক্যালেন্ডার অনুসরণ করুন।",
      benefit: "সময়মতো চাষে দ্বিগুণ লাভ সম্ভব",
      actionSteps: "১. আবহাওয়া খবর শুনুন ২. ক্যালেন্ডার মেনে চলুন ৩. সময়ে বীজ বপন করুন"
    },
    {
      icon: "📊",
      title: "মাটি পরীক্ষা ও pH নিয়ন্ত্রণ",
      tip: "বছরে অন্তত একবার মাটি পরীক্ষা করান। pH ৬.৫-৭.৫ রাখুন। চুন প্রয়োগ করে অম্লতা কমান। জিপসাম দিয়ে লবণাক্ততা কমান।",
      benefit: "সারের সঠিক ব্যবহার ও ২৫% বেশি ফলন",
      actionSteps: "১. মাটি পরীক্ষা করান ২. pH মাপুন ৩. প্রয়োজন অনুযায়ী চুন দিন"
    }
  ];

  // 2. SEASONAL FARMING GUIDE (Month-wise)
  const seasonalGuide = [
    {
      season: "বর্ষাকাল",
      months: "জ্যৈষ্ঠ - ভাদ্র (মে-আগস্ট)",
      mainCrops: ["আমন ধান", "পাট", "শাকসবজি", "কচু"],
      tips: "জলাবদ্ধতা এড়ান, নালা তৈরি করুন। উঁচু জমিতে সবজি চাষ করুন।",
      fertilizer: "ইউরিয়া ও ফসফেট সার প্রয়োগ করুন। জৈব সার বেশি ব্যবহার করুন।",
      pest: "বাদামী গাছ ফড়িং, মাজরা পোকা ও পাতা পোড়া রোগের সতর্কতা",
      specialAdvice: "বৃষ্টির পানি সংরক্ষণ করুন ও জমিতে পানি জমতে দেবেন না।"
    },
    {
      season: "শীতকাল",
      months: "অগ্রহায়ণ - ফাল্গুন (নভেম্বর-মার্চ)",
      mainCrops: ["বোরো ধান", "গম", "আলু", "সরিষা", "টমেটো"],
      tips: "কুয়াশা ও ঠান্ডা থেকে ফসল রক্ষা করুন। পলিথিন টানেল ব্যবহার করুন।",
      fertilizer: "কমপ্লেক্স সার ও জৈব সার ব্যবহার করুন। পটাশ সার বেশি দিন।",
      pest: "জাব পোকা, নাবি ব্লাইট রোগ ও মরিচা রোগের যত্ন নিন",
      specialAdvice: "সকালে হালকা সেচ দিন ও রাতে গাছ ঢেকে রাখুন।"
    },
    {
      season: "গ্রীষ্মকাল",
      months: "চৈত্র - জ্যৈষ্ঠ (মার্চ-মে)",
      mainCrops: ["ভুট্টা", "তরমুজ", "বেগুন", "মরিচ", "লাউ"],
      tips: "পর্যাপ্ত পানি সরবরাহ ও ছায়ার ব্যবস্থা করুন। মালচিং করুন।",
      fertilizer: "পটাশ সার বেশি দিন, নাইট্রোজেন কম। মাইক্রো নিউট্রিয়েন্ট প্রয়োগ করুন।",
      pest: "লাল মাকড়, থ্রিপস পোকা ও পাউডারি মিলডিউ রোগের সাবধানতা",
      specialAdvice: "দিনে ২-৩ বার হালকা সেচ দিন ও গাছের গোড়ায় খড় বিছান।"
    }
  ];

  // 3. FERTILIZER GUIDE (Simple and Clear)
  const fertilizerGuide = [
    {
      crop: "ধান",
      icon: "🌾",
      stage1: {
        time: "বীজতলায় (বপনের সময়)",
        fertilizer: "গোবর ৫ কেজি + টিএসপি ১০০ গ্রাম (প্রতি শতকে)"
      },
      stage2: {
        time: "রোপণের ১৫ দিন পর",
        fertilizer: "ইউরিয়া ৮০ গ্রাম + এমওপি ৪০ গ্রাম (প্রতি শতকে)"
      },
      stage3: {
        time: "কাইচ থোড় আসার সময়",
        fertilizer: "ইউরিয়া ৮০ গ্রাম (প্রতি শতকে)"
      }
    },
    {
      crop: "আলু",
      icon: "🥔",
      stage1: {
        time: "জমি তৈরির সময়",
        fertilizer: "গোবর ১০ কেজি + টিএসপি ১৫০ গ্রাম (প্রতি শতকে)"
      },
      stage2: {
        time: "রোপণের ২৫ দিন পর",
        fertilizer: "ইউরিয়া ১০০ গ্রাম + এমওপি ৮০ গ্রাম (প্রতি শতকে)"
      },
      stage3: {
        time: "মাটি কুপিয়ে দেওয়ার সময়",
        fertilizer: "ইউরিয়া ৫০ গ্রাম (প্রতি শতকে)"
      }
    },
    {
      crop: "ভুট্টা",
      icon: "🌽",
      stage1: {
        time: "বীজ বপনের সময়",
        fertilizer: "গোবর ৮ কেজি + টিএসপি ১২০ গ্রাম (প্রতি শতকে)"
      },
      stage2: {
        time: "বপনের ২০ দিন পর",
        fertilizer: "ইউরিয়া ১২০ গ্রাম + এমওপি ৬০ গ্রাম (প্রতি শতকে)"
      },
      stage3: {
        time: "সিল্ক আসার সময়",
        fertilizer: "ইউরিয়া ৬০ গ্রাম (প্রতি শতকে)"
      }
    },
    {
      crop: "টমেটো",
      icon: "🍅",
      stage1: {
        time: "চারা রোপণের সময়",
        fertilizer: "গোবর ১২ কেজি + টিএসপি ২০০ গ্রাম (প্রতি শতকে)"
      },
      stage2: {
        time: "রোপণের ৩০ দিন পর",
        fertilizer: "ইউরিয়া ১৫০ গ্রাম + এমওপি ১০০ গ্রাম (প্রতি শতকে)"
      },
      stage3: {
        time: "ফুল আসার সময়",
        fertilizer: "ইউরিয়া ৮০ গ্রাম + বরিক এসিড ১০ গ্রাম (প্রতি শতকে)"
      }
    }
  ];

  // 4. COMMON PROBLEMS & SOLUTIONS (Categorized)
  const commonProblems = [
    {
      problem: "পাতা হলুদ হয়ে যাওয়া",
      icon: "🟡",
      category: "পুষ্টি সমস্যা",
      reasons: ["নাইট্রোজেনের অভাব", "অতিরিক্ত পানি", "আয়রনের অভাব", "মাটির pH সমস্যা"],
      solutions: ["ইউরিয়া সার প্রয়োগ", "নিকাশের ব্যবস্থা", "আয়রন সালফেট প্রয়োগ", "মাটির pH সংশোধন"],
      prevention: "নিয়মিত সুষম সার প্রয়োগ ও মাটি পরীক্ষা করুন"
    },
    {
      problem: "গাছ মরে যাওয়া",
      icon: "🥀",
      category: "রোগ সমস্যা",
      reasons: ["মূল পচা রোগ", "অতিরিক্ত সেচ", "ছত্রাক আক্রমণ", "ভাইরাস সংক্রমণ"],
      solutions: ["আক্রান্ত গাছ তুলে ফেলা", "ছত্রাকনাশক স্প্রে", "সেচ কমান", "প্রতিরোধী জাত ব্যবহার"],
      prevention: "পরিষ্কার বীজ ব্যবহার ও জমিতে পানি জমতে দেবেন না"
    },
    {
      problem: "ফলন কম হওয়া",
      icon: "📉",
      category: "ব্যবস্থাপনা সমস্যা",
      reasons: ["মাটির উর্বরতা কমে যাওয়া", "ভুল জাতের বীজ", "অনুপযুক্ত পরিচর্যা", "পোকামাকড়ের আক্রমণ"],
      solutions: ["জৈব সার ব্যবহার", "উন্নত জাতের বীজ", "নিয়মিত পরিচর্যা", "সমন্বিত বালাই ব্যবস্থাপনা"],
      prevention: "মাটি পরীক্ষা করে সার প্রয়োগ ও ফসল আবর্তন করুন"
    },
    {
      problem: "পোকামাকড়ের আক্রমণ",
      icon: "🪲",
      category: "বালাই সমস্যা",
      reasons: ["প্রাকৃতিক শত্রুর অভাব", "অতিরিক্ত নাইট্রোজেন", "আবহাওয়ার পরিবর্তন", "পরিষ্কার পরিচ্ছন্নতার অভাব"],
      solutions: ["জৈব কীটনাশক ব্যবহার", "নিম তেল স্প্রে", "ফেরোমন ট্র্যাপ", "সহায়ক পোকা সংরক্ষণ"],
      prevention: "নিয়মিত জমি পরিদর্শন ও পরিষ্কার পরিচ্ছন্নতা বজায় রাখুন"
    }
  ];

  // 5. EMERGENCY CONTACTS (Essential Numbers)
  const emergencyContacts = [
    { name: "কৃষি কল সেন্টার", number: "১৬১২৩", icon: "📞", time: "২৪ ঘন্টা" },
    { name: "আবহাওয়া তথ্য", number: "১০৯০", icon: "🌤️", time: "২৪ ঘন্টা" },
    { name: "কৃষি সম্প্রসারণ অফিসার", number: "স্থানীয়", icon: "👨‍🌾", time: "সকাল ৮টা - বিকাল ৫টা" },
    { name: "কৃষি ব্যাংক", number: "১৬২৩৬", icon: "🏦", time: "সকাল ৯টা - বিকাল ৪টা" }
  ];

  // Auto-rotate tips every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % basicFarmingTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate seasonal guide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSeasonIndex(prev => (prev + 1) % seasonalGuide.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate fertilizer guide every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFertilizerIndex(prev => (prev + 1) % fertilizerGuide.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4caf50"
            colors={['#4caf50']}
          />
        }
      >
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎓 কৃষি শিক্ষা ও গাইড</Text>
            <Text style={styles.subtitle}>সহজ ভাষায় কৃষি তথ্য ও পরামর্শ</Text>
          </View>

          {/* Monthly Personalized Tip */}
          <View style={styles.monthlyTipSection}>
            <Text style={styles.sectionTitle}>🗓️ {getCurrentBengaliMonth()} মাসের বিশেষ পরামর্শ</Text>
            <View style={styles.monthlyTipCard}>
              <Text style={styles.monthlyTipText}>{monthlyTips[getCurrentBengaliMonth()]}</Text>
            </View>
          </View>

          {/* 1. DAILY TIP (Most Important - First) */}
          <View style={styles.tipSection}>
            <Text style={styles.sectionTitle}>💡 আজকের কৃষি টিপ</Text>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>{basicFarmingTips[currentTipIndex].icon}</Text>
              <Text style={styles.tipTitle}>{basicFarmingTips[currentTipIndex].title}</Text>
              <Text style={styles.tipDescription}>{basicFarmingTips[currentTipIndex].tip}</Text>
              
              <View style={styles.benefitContainer}>
                <Text style={styles.benefitLabel}>✅ সুবিধা:</Text>
                <Text style={styles.benefitText}>{basicFarmingTips[currentTipIndex].benefit}</Text>
              </View>
              
              <View style={styles.actionContainer}>
                <Text style={styles.actionLabel}>🎯 করণীয়:</Text>
                <Text style={styles.actionSteps}>{basicFarmingTips[currentTipIndex].actionSteps}</Text>
              </View>
            </View>
            <View style={styles.indicatorContainer}>
              {basicFarmingTips.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicator, 
                    index === currentTipIndex && styles.activeIndicator
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* 2. SEASONAL GUIDE (Important for Planning) */}
          <View style={styles.seasonSection}>
            <Text style={styles.sectionTitle}>📅 মৌসুমি কৃষি গাইড</Text>
            <View style={styles.seasonCard}>
              <View style={styles.seasonHeader}>
                <Text style={styles.seasonTitle}>{seasonalGuide[currentSeasonIndex].season}</Text>
                <Text style={styles.seasonMonths}>{seasonalGuide[currentSeasonIndex].months}</Text>
              </View>
              
              <View style={styles.seasonContent}>
                <View style={styles.seasonItem}>
                  <Text style={styles.seasonLabel}>🌾 প্রধান ফসল:</Text>
                  <Text style={styles.seasonText}>{seasonalGuide[currentSeasonIndex].mainCrops.join(', ')}</Text>
                </View>
                
                <View style={styles.seasonItem}>
                  <Text style={styles.seasonLabel}>💡 পরামর্শ:</Text>
                  <Text style={styles.seasonText}>{seasonalGuide[currentSeasonIndex].tips}</Text>
                </View>
                
                <View style={styles.seasonItem}>
                  <Text style={styles.seasonLabel}>🧪 সার:</Text>
                  <Text style={styles.seasonText}>{seasonalGuide[currentSeasonIndex].fertilizer}</Text>
                </View>
                
                <View style={styles.seasonItem}>
                  <Text style={styles.seasonLabel}>⚠️ সতর্কতা:</Text>
                  <Text style={styles.seasonText}>{seasonalGuide[currentSeasonIndex].pest}</Text>
                </View>
                
                <View style={styles.seasonItem}>
                  <Text style={styles.seasonLabel}>💡 বিশেষ পরামর্শ:</Text>
                  <Text style={styles.seasonText}>{seasonalGuide[currentSeasonIndex].specialAdvice}</Text>
                </View>
              </View>
            </View>
            <View style={styles.indicatorContainer}>
              {seasonalGuide.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicator, 
                    index === currentSeasonIndex && styles.activeIndicator
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* 3. FERTILIZER GUIDE (Practical Information) */}
          <View style={styles.fertilizerSection}>
            <Text style={styles.sectionTitle}>🧪 সার প্রয়োগ গাইড</Text>
            <View style={styles.fertilizerCard}>
              <View style={styles.fertilizerHeader}>
                <Text style={styles.fertilizerIcon}>{fertilizerGuide[currentFertilizerIndex].icon}</Text>
                <Text style={styles.fertilizerCrop}>{fertilizerGuide[currentFertilizerIndex].crop} চাষে সার প্রয়োগ</Text>
              </View>
              
              <View style={styles.stageContainer}>
                <View style={styles.stageItem}>
                  <Text style={styles.stageNumber}>১</Text>
                  <View style={styles.stageContent}>
                    <Text style={styles.stageTime}>{fertilizerGuide[currentFertilizerIndex].stage1.time}</Text>
                    <Text style={styles.stageFertilizer}>{fertilizerGuide[currentFertilizerIndex].stage1.fertilizer}</Text>
                  </View>
                </View>
                
                <View style={styles.stageItem}>
                  <Text style={styles.stageNumber}>২</Text>
                  <View style={styles.stageContent}>
                    <Text style={styles.stageTime}>{fertilizerGuide[currentFertilizerIndex].stage2.time}</Text>
                    <Text style={styles.stageFertilizer}>{fertilizerGuide[currentFertilizerIndex].stage2.fertilizer}</Text>
                  </View>
                </View>
                
                <View style={styles.stageItem}>
                  <Text style={styles.stageNumber}>৩</Text>
                  <View style={styles.stageContent}>
                    <Text style={styles.stageTime}>{fertilizerGuide[currentFertilizerIndex].stage3.time}</Text>
                    <Text style={styles.stageFertilizer}>{fertilizerGuide[currentFertilizerIndex].stage3.fertilizer}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.indicatorContainer}>
              {fertilizerGuide.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicator, 
                    index === currentFertilizerIndex && styles.activeIndicator
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* 4. COMMON PROBLEMS & SOLUTIONS */}
          <View style={styles.problemSection}>
            <Text style={styles.sectionTitle}>🔧 সাধারণ সমস্যা ও সমাধান</Text>
            {commonProblems.map((problem, index) => (
              <View key={index} style={styles.problemCard}>
                <View style={styles.problemHeader}>
                  <Text style={styles.problemIcon}>{problem.icon}</Text>
                  <View style={styles.problemTitleContainer}>
                    <Text style={styles.problemTitle}>{problem.problem}</Text>
                    <Text style={styles.problemCategory}>{problem.category}</Text>
                  </View>
                </View>
                
                <View style={styles.problemContent}>
                  <Text style={styles.problemLabel}>🔍 কারণ:</Text>
                  {problem.reasons.map((reason, idx) => (
                    <Text key={idx} style={styles.problemItem}>• {reason}</Text>
                  ))}
                  
                  <Text style={styles.problemLabel}>✅ সমাধান:</Text>
                  {problem.solutions.map((solution, idx) => (
                    <Text key={idx} style={styles.solutionItem}>• {solution}</Text>
                  ))}
                  
                  <Text style={styles.problemLabel}>🛡️ প্রতিরোধ:</Text>
                  <Text style={styles.preventionItem}>{problem.prevention}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 5. QUICK REFERENCE (Expandable Sections) */}
          <View style={styles.referenceSection}>
            <Text style={styles.sectionTitle}>📚 দ্রুত তথ্য</Text>
            
            <Collapsible title="🌡️ ফসল অনুযায়ী উপযুক্ত তাপমাত্রা">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>🌾 ধান: ২০-৩৫°C</Text>
                <Text style={styles.referenceItem}>🥔 আলু: ১৫-২৫°C</Text>
                <Text style={styles.referenceItem}>🌽 ভুট্টা: ২১-৩০°C</Text>
                <Text style={styles.referenceItem}>🍅 টমেটো: ১৮-২৭°C</Text>
                <Text style={styles.referenceItem}>🧄 পেঁয়াজ: ১৫-২৫°C</Text>
              </View>
            </Collapsible>

            <Collapsible title="💧 সেচের পরিমাণ (প্রতি মৌসুমে)">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>🌾 ধান: ১০০০-১২০০ মিমি</Text>
                <Text style={styles.referenceItem}>🥔 আলু: ৫০০-৭০০ মিমি</Text>
                <Text style={styles.referenceItem}>🌽 ভুট্টা: ৫০০-৮০০ মিমি</Text>
                <Text style={styles.referenceItem}>🌾 গম: ৪৫০-৬৫০ মিমি</Text>
                <Text style={styles.referenceItem}>🌻 সরিষা: ৩০০-৪৫০ মিমি</Text>
              </View>
            </Collapsible>

            <Collapsible title="🧪 সারের মাত্রা (প্রতি শতকে)">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>💙 ইউরিয়া: ৮০০ গ্রাম - ১ কেজি</Text>
                <Text style={styles.referenceItem}>🟤 টিএসপি: ৪০০-৫০০ গ্রাম</Text>
                <Text style={styles.referenceItem}>🟡 এমওপি: ৩০০-৪০০ গ্রাম</Text>
                <Text style={styles.referenceItem}>🟫 গোবর সার: ৪০-৫০ কেজি</Text>
                <Text style={styles.referenceItem}>🔴 কমপ্লেক্স: ৫০০-৭০০ গ্রাম</Text>
              </View>
            </Collapsible>

            <Collapsible title="📏 বীজের পরিমাণ (প্রতি শতকে)">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>🌾 ধান: ৮০-১০০ গ্রাম</Text>
                <Text style={styles.referenceItem}>🌾 গম: ৪০০-৫০০ গ্রাম</Text>
                <Text style={styles.referenceItem}>🌽 ভুট্টা: ১০০-১৫০ গ্রাম</Text>
                <Text style={styles.referenceItem}>🌻 সরিষা: ৩০-৪০ গ্রাম</Text>
                <Text style={styles.referenceItem}>🥔 আলু: ১০-১৫ কেজি</Text>
              </View>
            </Collapsible>

            <Collapsible title="🏥 রোগ চিহ্নিতকরণ ও চিকিৎসা">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>🟡 পাতা হলুদ: নাইট্রোজেনের অভাব - ইউরিয়া প্রয়োগ করুন</Text>
                <Text style={styles.referenceItem}>🟤 বাদামী দাগ: ছত্রাক রোগ - ছত্রাকনাশক স্প্রে করুন</Text>
                <Text style={styles.referenceItem}>🪲 পোকার আক্রমণ: নিম তেল বা সাবান পানি ব্যবহার করুন</Text>
                <Text style={styles.referenceItem}>🥀 গাছ মরা: মূল পচা রোগ - নিকাশের ব্যবস্থা করুন</Text>
                <Text style={styles.referenceItem}>📉 ফলন কম: সুষম সার প্রয়োগ ও নিয়মিত যত্ন</Text>
              </View>
            </Collapsible>

            <Collapsible title="📱 কৃষি অ্যাপ ও ওয়েবসাইট">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>🌐 কৃষি তথ্য সার্বিস: krishi.gov.bd</Text>
                <Text style={styles.referenceItem}>🌤️ আবহাওয়া বিভাগ: bmd.gov.bd</Text>
                <Text style={styles.referenceItem}>💰 বাজার দর: dam.gov.bd</Text>
                <Text style={styles.referenceItem}>🔬 কৃষি গবেষণা: bari.gov.bd</Text>
                <Text style={styles.referenceItem}>📚 কৃষি সম্প্রসারণ: dae.gov.bd</Text>
              </View>
            </Collapsible>

            <Collapsible title="💳 কৃষি ঋণ ও বীমা তথ্য">
              <View style={styles.referenceContent}>
                <Text style={styles.referenceItem}>🏦 কৃষি ব্যাংক: ৪% সুদে কৃষি ঋণ</Text>
                <Text style={styles.referenceItem}>💳 সোনালী ব্যাংক: কৃষি কার্ড সুবিধা</Text>
                <Text style={styles.referenceItem}>🕌 ইসলামী ব্যাংক: শরিয়াহ ভিত্তিক ঋণ</Text>
                <Text style={styles.referenceItem}>🛡️ ফসল বীমা: ২% প্রিমিয়ামে সুরক্ষা</Text>
                <Text style={styles.referenceItem}>📞 ঋণ হেল্পলাইন: ১৬২৩৬</Text>
              </View>
            </Collapsible>
          </View>

          {/* 6. QUICK ACTIONS (Fast Access to Common Tasks) */}
          <View style={styles.quickActionSection}>
            <Text style={styles.sectionTitle}>⚡ দ্রুত কাজ</Text>
            <View style={styles.quickActionGrid}>
              <TouchableOpacity 
                style={styles.quickActionCard} 
                onPress={() => Alert.alert("আবহাওয়া", "আজকের আবহাওয়া: ৩২°C, রৌদ্রোজ্জ্বল\n\nআগামী ৩ দিন:\n• আজ: রৌদ্রোজ্জ্বল\n• কাল: হালকা বৃষ্টি\n• পরশু: মেঘলা")}
              >
                <Text style={styles.quickActionIcon}>🌤️</Text>
                <Text style={styles.quickActionTitle}>আবহাওয়া</Text>
                <Text style={styles.quickActionSubtitle}>আজকের পূর্বাভাস</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => Alert.alert("সার ক্যালকুলেটর", "আপনার জমির পরিমাণ:\n• ১ একর = ৪৩ শতক\n• ১ শতক = ৪৩৫.৬ বর্গফুট\n\nসার পরিমাণ (প্রতি শতক):\n• ইউরিয়া: ৮০০ গ্রাম\n• টিএসপি: ৪০০ গ্রাম\n• এমওপি: ৩০০ গ্রাম")}
              >
                <Text style={styles.quickActionIcon}>🧮</Text>
                <Text style={styles.quickActionTitle}>সার ক্যালকুলেটর</Text>
                <Text style={styles.quickActionSubtitle}>পরিমাণ হিসাব</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => Alert.alert("বাজার দর", "আজকের বাজার দর (প্রতি মণে):\n\n🌾 ধান: ১,২০০-১,৪০০ টাকা\n🥔 আলু: ৮০০-১,০০০ টাকা\n🧄 পেঁয়াজ: ২,৫০০-৩,০০০ টাকা\n🍅 টমেটো: ১,৫০০-২,০০০ টাকা")}
              >
                <Text style={styles.quickActionIcon}>💰</Text>
                <Text style={styles.quickActionTitle}>বাজার দর</Text>
                <Text style={styles.quickActionSubtitle}>আজকের দাম</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionCard}
                onPress={() => Alert.alert("রোগ নির্ণয়", "সাধারণ রোগের লক্ষণ:\n\n🟡 পাতা হলুদ → নাইট্রোজেনের অভাব\n🟤 বাদামী দাগ → ছত্রাক রোগ\n🪲 পোকার ছিদ্র → পোকার আক্রমণ\n🥀 গাছ মরা → মূল পচা রোগ\n\nবিস্তারিত জানতে সমস্যা বিভাগ দেখুন।")}
              >
                <Text style={styles.quickActionIcon}>🔍</Text>
                <Text style={styles.quickActionTitle}>রোগ নির্ণয়</Text>
                <Text style={styles.quickActionSubtitle}>দ্রুত চেকআপ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 7. EMERGENCY CONTACTS (Important for Help) */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>📞 জরুরি যোগাযোগ</Text>
            <View style={styles.contactGrid}>
              {emergencyContacts.map((contact, index) => (
                <TouchableOpacity key={index} style={styles.contactCard}>
                  <Text style={styles.contactIcon}>{contact.icon}</Text>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                  <Text style={styles.contactTime}>{contact.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌾 আরও তথ্যের জন্য স্থানীয় কৃষি অফিসে যোগাযোগ করুন
            </Text>
          </View>

          {/* 7. AGRICULTURAL CALENDAR (Comprehensive Month-wise Guide) */}
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>📅 সম্পূর্ণ কৃষি ক্যালেন্ডার</Text>
            <View style={styles.calendarGrid}>
              <View style={styles.calendarCard}>
                <Text style={styles.calendarMonth}>বৈশাখ-জ্যৈষ্ঠ (এপ্রিল-মে)</Text>
                <Text style={styles.calendarActivities}>
                  🌾 বোরো ধান কাটা • 🌽 ভুট্টা রোপণ • 🥒 গ্রীষ্মকালীন সবজি • 🍃 পাট বীজ তৈরি
                </Text>
                <Text style={styles.calendarTips}>💡 গরমে বেশি সেচ দিন ও মালচিং করুন</Text>
              </View>
              
              <View style={styles.calendarCard}>
                <Text style={styles.calendarMonth}>আষাঢ়-শ্রাবণ (জুন-জুলাই)</Text>
                <Text style={styles.calendarActivities}>
                  🌾 আমন ধান রোপণ • 🥔 আগাম আলু • 🌿 পাট চাষ • 🥬 কলমি শাক
                </Text>
                <Text style={styles.calendarTips}>💡 বর্ষার পানি সংরক্ষণ ও নিকাশের ব্যবস্থা করুন</Text>
              </View>
              
              <View style={styles.calendarCard}>
                <Text style={styles.calendarMonth}>ভাদ্র-আশ্বিন (আগস্ট-সেপ্টেম্বর)</Text>
                <Text style={styles.calendarActivities}>
                  🌾 আমন ধানের যত্ন • 🥔 আলু জমি তৈরি • 🌸 ফুলের চাষ • 🧄 পেঁয়াজ রোপণ
                </Text>
                <Text style={styles.calendarTips}>💡 জলাবদ্ধতা দূর করুন ও রোগ দমনের প্রস্তুতি নিন</Text>
              </View>
              
              <View style={styles.calendarCard}>
                <Text style={styles.calendarMonth}>কার্তিক-অগ্রহায়ণ (অক্টোবর-নভেম্বর)</Text>
                <Text style={styles.calendarActivities}>
                  🥔 আলু রোপণ • 🌻 সরিষা ও তিল • 🌾 গম বীজ বপন • 🥬 শীতকালীন সবজি
                </Text>
                <Text style={styles.calendarTips}>💡 শীতের জন্য প্রস্তুতি নিন ও কুয়াশার ক্ষতি রোধ করুন</Text>
              </View>
              
              <View style={styles.calendarCard}>
                <Text style={styles.calendarMonth}>পৌষ-মাঘ (ডিসেম্বর-জানুয়ারি)</Text>
                <Text style={styles.calendarActivities}>
                  🌾 আমন ধান কাটা • 🥔 আলুর যত্ন • 🌻 সরিষা ফুল • ❄️ ঠান্ডা প্রতিরোধ
                </Text>
                <Text style={styles.calendarTips}>💡 কুয়াশায় ছত্রাক রোগের সতর্কতা অবলম্বন করুন</Text>
              </View>
              
              <View style={styles.calendarCard}>
                <Text style={styles.calendarMonth}>ফাল্গুন-চৈত্র (ফেব্রুয়ারি-মার্চ)</Text>
                <Text style={styles.calendarActivities}>
                  🥔 আলু তোলা • 🌾 বোরো ধানের যত্ন • 🌻 সরিষা কাটা • 🌱 বীজতলা প্রস্তুতি
                </Text>
                <Text style={styles.calendarTips}>💡 গরম বাড়ার আগে ফসল সংগ্রহ ও বীজ সংরক্ষণ করুন</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1b5e20',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4a4a4a',
    fontWeight: '500',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  
  // Tip Section
  tipSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tipCard: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  tipIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  benefitContainer: {
    alignItems: 'center',
  },
  benefitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 14,
    color: '#1b5e20',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Season Section
  seasonSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  seasonCard: {
    backgroundColor: '#fff8e1',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  seasonHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  seasonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f57c00',
    marginBottom: 5,
  },
  seasonMonths: {
    fontSize: 14,
    color: '#666',
  },
  seasonContent: {
    marginTop: 10,
  },
  seasonItem: {
    marginBottom: 12,
  },
  seasonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 5,
  },
  seasonText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  
  // Fertilizer Section
  fertilizerSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  fertilizerCard: {
    backgroundColor: '#f3e5f5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  fertilizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fertilizerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  fertilizerCrop: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7b1fa2',
  },
  stageContainer: {
    marginTop: 10,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: '#fce4ec',
    padding: 15,
    borderRadius: 10,
  },
  stageNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ad1457',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  stageContent: {
    flex: 1,
  },
  stageTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 8,
  },
  stageFertilizer: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  
  // Problem Section
  problemSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  problemCard: {
    backgroundColor: '#ffebee',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  problemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  problemTitleContainer: {
    flex: 1,
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c62828',
    marginBottom: 4,
  },
  problemCategory: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  problemContent: {
    marginTop: 10,
  },
  problemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 8,
    marginTop: 10,
  },
  problemItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  solutionItem: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 5,
    marginLeft: 10,
    fontWeight: '500',
  },
  preventionItem: {
    fontSize: 14,
    color: '#1976d2',
    marginLeft: 10,
    marginTop: 5,
    fontWeight: '500',
    fontStyle: 'italic',
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
  },
  
  // Reference Section
  referenceSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  referenceContent: {
    padding: 15,
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    marginTop: 10,
  },
  referenceItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  
  // Contact Section
  contactSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  contactGrid: {
    marginTop: 15,
  },
  contactCard: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 5,
  },
  contactTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // Common Styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#4caf50',
  },
  
  // Footer
  footer: {
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  
  // Agricultural Calendar Styles
  calendarSection: {
    marginTop: 10,
  },
  calendarGrid: {
    gap: 12,
  },
  calendarCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  calendarActivities: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  calendarTips: {
    fontSize: 13,
    color: '#4CAF50',
    fontStyle: 'italic',
    backgroundColor: '#F1F8E9',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
    paddingLeft: 12,
  },
  
  // Monthly Tip Styles
  monthlyTipSection: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  monthlyTipCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  monthlyTipText: {
    fontSize: 16,
    color: '#1565c0',
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Action Steps Styles
  actionContainer: {
    marginTop: 15,
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 6,
  },
  actionSteps: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  
  // Quick Action Styles
  quickActionSection: {
    backgroundColor: '#fff',
    marginVertical: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#f8f9fa',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
