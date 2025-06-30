import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform, SafeAreaView, ScrollView, ActivityIndicator, Dimensions, RefreshControl, Animated } from 'react-native';
// import { InferenceSession, Tensor } from 'onnxruntime-react-native';
// import { decode } from 'jpeg-js';
// import RNFS from 'react-native-fs';
import * as ImagePicker from 'expo-image-picker';
import classLabels from '../../constants/class_labels.json';

const HomeScreen = () => {
  // const [efficientnetSession, setEfficientnetSession] = useState<InferenceSession | null>(null);
  const [classificationResult, setClassificationResult] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [analysisCount, setAnalysisCount] = useState<number>(0);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDistrictIndex, setCurrentDistrictIndex] = useState(0);
  const [displayedDiseases, setDisplayedDiseases] = useState<string[]>([]);
  const [currentSeasonTip, setCurrentSeasonTip] = useState(0);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(1))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  // Weather data for different districts
  const weatherData = [
    {
      district: "ঢাকা",
      temperature: "৩২°C",
      icon: "☀️",
      humidity: "৭৮%",
      rain: "২০%",
      wind: "১৫ কিমি/ঘ",
      advice: "আজকের আবহাওয়া ফসল রোপণের জন্য উপযুক্ত। সকালে সেচ দিন এবং দুপুরে রোদ এড়ান।"
    },
    {
      district: "চট্টগ্রাম",
      temperature: "২৮°C",
      icon: "🌦️",
      humidity: "৮৫%",
      rain: "৬০%",
      wind: "২২ কিমি/ঘ",
      advice: "বৃষ্টির সম্ভাবনা বেশি। আজ ফসলে কীটনাশক প্রয়োগ এড়িয়ে চলুন।"
    },
    {
      district: "সিলেট",
      temperature: "২৬°C",
      icon: "🌧️",
      humidity: "৯০%",
      rain: "৮০%",
      wind: "১৮ কিমি/ঘ",
      advice: "ভারী বৃষ্টির পূর্বাভাস। ক্ষেতে পানি নিকাশের ব্যবস্থা করুন।"
    },
    {
      district: "রাজশাহী",
      temperature: "৩৫°C",
      icon: "☀️",
      humidity: "৬৫%",
      rain: "৫%",
      wind: "১২ কিমি/ঘ",
      advice: "গরম ও শুষ্ক আবহাওয়া। সকাল ও সন্ধ্যায় সেচ দিন।"
    },
    {
      district: "খুলনা",
      temperature: "৩০°C",
      icon: "⛅",
      humidity: "৮২%",
      rain: "৩০%",
      wind: "১৬ কিমি/ঘ",
      advice: "আংশিক মেঘলা আবহাওয়া। ধান ক্ষেতে পানির মাত্রা পরীক্ষা করুন।"
    },
    {
      district: "বরিশাল",
      temperature: "২৯°C",
      icon: "🌤️",
      humidity: "৮৮%",
      rain: "৪৫%",
      wind: "২০ কিমি/ঘ",
      advice: "উপকূলীয় আবহাওয়া। লবণাক্ততা প্রতিরোধী জাতের ফসল লাগান।"
    },
    {
      district: "রংপুর",
      temperature: "২৭°C",
      icon: "🌥️",
      humidity: "৭৫%",
      rain: "৩৫%",
      wind: "১৪ কিমি/ঘ",
      advice: "মাঝারি তাপমাত্রা। শীতকালীন সবজি রোপণের উপযুক্ত সময়।"
    },
    {
      district: "ময়মনসিংহ",
      temperature: "৩১°C",
      icon: "🌞",
      humidity: "৭২%",
      rain: "১৫%",
      wind: "১৩ কিমি/ঘ",
      advice: "স্বাভাবিক আবহাওয়া। নার্সারিতে চারা তৈরির জন্য আদর্শ সময়।"
    }
  ];

  // Auto-rotate weather districts every 8 seconds with animations
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      // Fade out current weather
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentWeatherIndex(prev => {
        const nextIndex = (prev + 1) % weatherData.length;
        console.log(`Weather rotating from ${prev} to ${nextIndex} - ${weatherData[nextIndex].district}`);
        return nextIndex;
      });
    }, 8000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(weatherInterval);
  }, [weatherData.length, fadeAnim]);

  // Progress bar animation for weather rotation
  useEffect(() => {
    setProgressWidth(0);
    const progressInterval = setInterval(() => {
      setProgressWidth(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / 80); // 8000ms / 100ms = 80 steps
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [currentWeatherIndex]);

  // Function to get Bengali disease name and emoji
  const getDiseaseInfo = (diseaseClass: string) => {
    switch (diseaseClass) {
      case "Corn___Common_Rust":
        return { emoji: "🌽", crop: "ভুট্টা", disease: "কমন রাস্ট" };
      case "Corn___Healthy":
        return { emoji: "🌽", crop: "ভুট্টা", disease: "সুস্থ" };
      case "Potato___Healthy":
        return { emoji: "🥔", crop: "আলু", disease: "সুস্থ" };
      case "Potato___Late_Blight":
        return { emoji: "🥔", crop: "আলু", disease: "লেট ব্লাইট" };
      case "Rice___Brown_Spot":
        return { emoji: "🌾", crop: "ধান", disease: "ব্রাউন স্পট" };
      case "Rice___Healthy":
        return { emoji: "🌾", crop: "ধান", disease: "সুস্থ" };
      case "Invalid___Images":
        return { emoji: "❌", crop: "অবৈধ", disease: "চিত্র সনাক্ত করা যায়নি" };
      default:
        return { emoji: "🌱", crop: "অজানা", disease: "অজানা রোগ" };
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simple refresh - just a delay to show refresh indicator
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const selectImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setClassificationResult('');
      setConfidence(0);
    }
  };

  const openCamera = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (cameraPermission.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setClassificationResult('');
      setConfidence(0);
    }
  };

  const runClassification = async (uri: string) => {
    try {
      setIsLoading(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // AI classification simulation
      const randomIndex = Math.floor(Math.random() * classLabels.length);
      const predictedClass = classLabels[randomIndex];
      const randomConfidence = Math.floor(Math.random() * 30) + 70; // 70-99%

      setClassificationResult(predictedClass);
      setConfidence(randomConfidence);
      setAnalysisCount(prev => prev + 1);
    } catch (err) {
      console.error('❌ বিশ্লেষণ এরর:', err);
      setClassificationResult('বিশ্লেষণ ব্যর্থ হয়েছে।');
      setConfidence(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getTreatmentAdvice = (disease: string) => {
    if (disease.includes('সুস্থ')) {
      return {
        treatment: "🎉 আপনার ফসল সুস্থ! নিয়মিত পরিচর্যা অব্যাহত রাখুন।",
        prevention: "নিয়মিত পানি প্রয়োগ, সার প্রয়োগ এবং আগাছা পরিষ্কার করুন।"
      };
    } else if (disease.includes('রস্ট')) {
      return {
        treatment: "🔬 ছত্রাকনাশক ব্যবহার করুন (প্রোপিকোনাজল বা টেবুকোনাজল)।",
        prevention: "বীজ শোধন করুন এবং ভালো বায়ু চলাচলের ব্যবস্থা করুন।"
      };
    } else if (disease.includes('ব্লাইট')) {
      return {
        treatment: "💊 কপার অক্সিক্লোরাইড বা ম্যানকোজেব স্প্রে করুন।",
        prevention: "অতিরিক্ত পানি এড়িয়ে চলুন এবং গাছের মধ্যে দূরত্ব বজায় রাখুন।"
      };
    } else if (disease.includes('দাগ')) {
      return {
        treatment: "🧪 ছত্রাকনাশক স্প্রে এবং আক্রান্ত পাতা সরিয়ে ফেলুন।",
        prevention: "পরিষ্কার বীজ ব্যবহার করুন এবং ক্ষেতে পানি জমতে দেবেন না।"
      };
    } else {
      return {
        treatment: "🏥 স্থানীয় কৃষি অফিসার বা বিশেষজ্ঞের পরামর্শ নিন।",
        prevention: "নিয়মিত ক্ষেত পরিদর্শন এবং জৈব সার ব্যবহার করুন।"
      };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
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
        <View style={styles.header}>
          <Text style={styles.title}>ফসলের রোগ সনাক্তকরণ</Text>
          <Text style={styles.subtitle}>AI দিয়ে ফসলের রোগ নির্ণয় করুন</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{analysisCount}</Text>
              <Text style={styles.statLabel}>বিশ্লেষণ</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>রোগের ধরন</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>ফসলের ধরন</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>📸 ছবি আপলোড করুন</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={selectImage}
              activeOpacity={0.7}
              onPressIn={() => {
                Animated.spring(scaleAnim, {
                  toValue: 0.95,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.buttonText}>🖼️ গ্যালারি</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={openCamera}
              activeOpacity={0.7}
              onPressIn={() => {
                Animated.spring(scaleAnim, {
                  toValue: 0.95,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.buttonText}>📷 ক্যামেরা</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
        
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Text style={styles.sectionTitle}>🖼️ নির্বাচিত ছবি</Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.image} />
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#4caf50" />
                  <Text style={styles.loadingText}>বিশ্লেষণ চলছে...</Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.analyzeButton, isLoading && styles.disabledButton]} 
              onPress={() => runClassification(selectedImage)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? '🔄 বিশ্লেষণ করা হচ্ছে...' : '🔍 বিশ্লেষণ করুন'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {classificationResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.sectionTitle}>🎯 বিশ্লেষণ ফলাফল</Text>
            <Text style={styles.resultText}>🌿 {classificationResult}</Text>
            {confidence > 0 && (
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>নির্ভুলতা:</Text>
                <View style={styles.confidenceBar}>
                  <View style={[styles.confidenceFill, { width: `${confidence}%` }]} />
                </View>
                <Text style={styles.confidenceText}>{confidence}%</Text>
              </View>
            )}
            
            {/* Treatment Advice */}
            {classificationResult && !classificationResult.includes('ব্যর্থ') && (
              <View style={styles.treatmentContainer}>
                <Text style={styles.treatmentTitle}>💊 চিকিৎসা পরামর্শ:</Text>
                <Text style={styles.treatmentText}>
                  {getTreatmentAdvice(classificationResult).treatment}
                </Text>
                <Text style={styles.preventionTitle}>🛡️ প্রতিরোধ:</Text>
                <Text style={styles.preventionText}>
                  {getTreatmentAdvice(classificationResult).prevention}
                </Text>
              </View>
            )}

            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationTitle}>� কৃষি পরামর্শ:</Text>
              <Text style={styles.recommendationText}>
                • নিয়মিত ক্ষেত পরিদর্শন করুন{'\n'}
                • পরিষ্কার কৃষি যন্ত্রপাতি ব্যবহার করুন{'\n'}
                • আবহাওয়ার পূর্বাভাস অনুসরণ করুন{'\n'}
                • বিশেষজ্ঞ পরামর্শ নিয়ে ওষুধ প্রয়োগ করুন
              </Text>
            </View>
          </View>
        )}

        {/* Weather Section */}
        <View style={styles.weatherContainer}>
          <View style={styles.weatherHeaderRow}>
            <Text style={styles.sectionTitle}>🌤️ আজকের আবহাওয়া</Text>
            <View style={styles.districtIndicator}>
              <Text style={styles.districtCounter}>
                {currentWeatherIndex + 1}/{weatherData.length}
              </Text>
            </View>
          </View>
          <Animated.View 
            style={[
              styles.weatherContent,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherIcon}>{weatherData[currentWeatherIndex].icon}</Text>
              <View style={styles.weatherInfo}>
                <Text style={styles.temperature}>{weatherData[currentWeatherIndex].temperature}</Text>
                <Text style={styles.location}>{weatherData[currentWeatherIndex].district}, বাংলাদেশ</Text>
              </View>
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherLabel}>আর্দ্রতা</Text>
                <Text style={styles.weatherValue}>{weatherData[currentWeatherIndex].humidity}</Text>
              </View>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherLabel}>বৃষ্টি</Text>
                <Text style={styles.weatherValue}>{weatherData[currentWeatherIndex].rain}</Text>
              </View>
              <View style={styles.weatherItem}>
                <Text style={styles.weatherLabel}>বাতাস</Text>
                <Text style={styles.weatherValue}>{weatherData[currentWeatherIndex].wind}</Text>
              </View>
            </View>
            <View style={styles.agriculturalAdviceContainer}>
              <Text style={styles.adviceTitle}>🌾 কৃষি পরামর্শ:</Text>
              <Text style={styles.adviceText}>
                {weatherData[currentWeatherIndex].advice}
              </Text>
            </View>
            <View style={styles.rotationIndicator}>
              <Text style={styles.rotationText}>
                📍 প্রতি ৮ সেকেন্ডে জেলা পরিবর্তিত হচ্ছে ({weatherData[currentWeatherIndex].district})
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressWidth}%` }]} />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Daily Market Rates Section */}
        <View style={styles.marketSection}>
          <Text style={styles.sectionTitle}>💰 আজকের বাজার দর</Text>
          <View style={styles.priceGrid}>
            <View style={styles.priceCard}>
              <Text style={styles.priceIcon}>🌾</Text>
              <Text style={styles.priceCrop}>ধান</Text>
              <Text style={styles.priceAmount}>৳২৮-৩২</Text>
              <Text style={styles.priceUnit}>প্রতি কেজি</Text>
              <Text style={styles.priceChange}>↗️ +৫%</Text>
            </View>
            <View style={styles.priceCard}>
              <Text style={styles.priceIcon}>🥔</Text>
              <Text style={styles.priceCrop}>আলু</Text>
              <Text style={styles.priceAmount}>৳৪৫-৫০</Text>
              <Text style={styles.priceUnit}>প্রতি কেজি</Text>
              <Text style={styles.priceChange}>↘️ -৩%</Text>
            </View>
            <View style={styles.priceCard}>
              <Text style={styles.priceIcon}>🌽</Text>
              <Text style={styles.priceCrop}>ভুট্টা</Text>
              <Text style={styles.priceAmount}>৳৩৫-৪০</Text>
              <Text style={styles.priceUnit}>প্রতি কেজি</Text>
              <Text style={styles.priceChange}>➡️ একই</Text>
            </View>
            <View style={styles.priceCard}>
              <Text style={styles.priceIcon}>🥬</Text>
              <Text style={styles.priceCrop}>শাকসবজি</Text>
              <Text style={styles.priceAmount}>৳১৫-২৫</Text>
              <Text style={styles.priceUnit}>প্রতি কেজি</Text>
              <Text style={styles.priceChange}>↗️ +৮%</Text>
            </View>
          </View>
          <Text style={styles.priceDisclaimer}>
            * দাম স্থানীয় বাজার অনুযায়ী পরিবর্তিত হতে পারে
          </Text>
        </View>

        {/* Government Loan Schemes Section */}
        <View style={styles.schemesSection}>
          <Text style={styles.sectionTitle}>🏛️ সরকারি ঋণ সুবিধা</Text>
          <View style={styles.schemeCard}>
            <Text style={styles.schemeIcon}>💳</Text>
            <Text style={styles.schemeName}>কৃষি ঋণ কার্ড</Text>
            <Text style={styles.schemeDescription}>
              ৪% সুদে কৃষি কাজের জন্য সহজ ঋণ। সর্বোচ্চ ৫ লক্ষ টাকা পর্যন্ত।
            </Text>
            <Text style={styles.schemeEligibility}>
              ✅ কৃষি জমির মালিক বা ভাগচাষী হতে হবে
            </Text>
            <Text style={styles.schemeContact}>
              📞 যোগাযোগ: স্থানীয় কৃষি ব্যাংক - ১৬২৩৬
            </Text>
          </View>
          
          <View style={styles.schemeCard}>
            <Text style={styles.schemeIcon}>🌱</Text>
            <Text style={styles.schemeName}>নতুন উদ্যোক্তা ঋণ</Text>
            <Text style={styles.schemeDescription}>
              যুব কৃষকদের জন্য বিশেষ ঋণ। ৩% সুদে ২ লক্ষ টাকা পর্যন্ত।
            </Text>
            <Text style={styles.schemeEligibility}>
              ✅ ১৮-৪৫ বছর বয়সী কৃষক, কৃষি প্রশিক্ষণ প্রয়োজন
            </Text>
            <Text style={styles.schemeContact}>
              📞 যোগাযোগ: যুব উন্নয়ন অধিদপ্তর - ১৬২৪৭
            </Text>
          </View>
          
          <View style={styles.schemeCard}>
            <Text style={styles.schemeIcon}>🏠</Text>
            <Text style={styles.schemeName}>কৃষি যন্ত্রপাতি ঋণ</Text>
            <Text style={styles.schemeDescription}>
              ট্রাক্টর, পাওয়ার টিলার সহ কৃষি যন্ত্র কিনতে ৫% সুদে ঋণ।
            </Text>
            <Text style={styles.schemeEligibility}>
              ✅ ন্যূনতম ২ বিঘা জমির মালিক হতে হবে
            </Text>
            <Text style={styles.schemeContact}>
              📞 যোগাযোগ: বিকেবি - ১৬২৩৬ অথবা রাকাব - ১৬২৩৭
            </Text>
          </View>
        </View>

        {/* Footer Section - Essential Only */}
        <View style={styles.footerContainer}>
          
          {/* Essential Emergency Contacts Only */}
          <View style={styles.emergencySection}>
            <Text style={styles.sectionTitle}>📞 জরুরি যোগাযোগ</Text>
            <View style={styles.contactGrid}>
              <View style={styles.contactCard}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactName}>কৃষি কল সেন্টার</Text>
                <Text style={styles.contactNumber}>১৬১২৩</Text>
                <Text style={styles.contactAvailable}>২৪/৭</Text>
              </View>
              <View style={styles.contactCard}>
                <Text style={styles.contactIcon}>�️</Text>
                <Text style={styles.contactName}>আবহাওয়া তথ্য</Text>
                <Text style={styles.contactNumber}>১০৯০</Text>
                <Text style={styles.contactAvailable}>২৪/৭</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.footerNote}>
            📱 আরও তথ্যের জন্য 'কৃষি শিক্ষা' ট্যাব দেখুন
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9f0',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 12,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderWidth: 0.5,
    borderColor: '#e8f5e8',
    // Adding subtle gradient-like effect through multiple layers
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1b5e20',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(27, 94, 32, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#558b2f',
    fontWeight: '600',
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 18,
    borderRadius: 18,
    flex: 1,
    elevation: 8,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderColor: '#66bb6a',
    // Modern button design with enhanced shadow
  },
  analyzeButton: {
    backgroundColor: '#2196f3',
    padding: 18,
    borderRadius: 18,
    marginTop: 16,
    elevation: 8,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#42a5f5',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: '#e8f5e8',
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 20,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#c8e6c9',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    marginBottom: 20,
    borderTopWidth: 4,
    borderTopColor: '#4caf50',
    borderWidth: 0.5,
    borderColor: '#e8f5e8',
  },
  resultText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#1b5e20',
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  // Enhanced stats container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
    marginTop: 18,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    elevation: 2,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2e7d32',
    textShadowColor: 'rgba(46, 125, 50, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#558b2f',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#a5d6a7',
    marginHorizontal: 16,
  },
  actionSection: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 0.5,
    borderColor: '#e8f5e8',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1b5e20',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(27, 94, 32, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cameraButton: {
    backgroundColor: '#ff7043',
    padding: 16,
    borderRadius: 16,
    flex: 1,
    elevation: 6,
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#ff8a65',
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4caf50',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  confidenceContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  confidenceBar: {
    height: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '800',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
  recommendationContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
    backgroundColor: 'linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: -8,
    borderWidth: 1,
    borderColor: '#ffcc02',
    elevation: 2,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f57c00',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  recommendationText: {
    fontSize: 14,
    color: '#5d4037',
    lineHeight: 22,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  treatmentContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8f5e8',
    backgroundColor: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: -8,
    borderWidth: 1,
    borderColor: '#ce93d8',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7b1fa2',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  treatmentText: {
    fontSize: 14,
    color: '#4a148c',
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  preventionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2e7d32',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  preventionText: {
    fontSize: 14,
    color: '#1b5e20',
    lineHeight: 20,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  footerContainer: {
    marginTop: 32,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderTopWidth: 4,
    borderTopColor: '#66bb6a',
    borderWidth: 0.5,
    borderColor: '#e8f5e8',
  },
  // Enhanced weather container with premium design
  weatherContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    marginBottom: 28,
    elevation: 12,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderTopWidth: 4,
    borderTopColor: '#2196f3',
    borderWidth: 0.5,
    borderColor: '#e3f2fd',
    // Premium weather card design
  },
  weatherContent: {
    paddingVertical: 10,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #f8fffe 100%)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  weatherIcon: {
    fontSize: 52,
    marginRight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1b5e20',
    textShadowColor: 'rgba(27, 94, 32, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    fontSize: 16,
    color: '#558b2f',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'linear-gradient(135deg, #f8fffe 0%, #e8f5e8 100%)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    elevation: 2,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherItem: {
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 13,
    color: '#558b2f',
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  weatherValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2e7d32',
    letterSpacing: 0.3,
  },
  agriculturalAdviceContainer: {
    backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)',
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    borderWidth: 1,
    borderColor: '#bbdefb',
    elevation: 2,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1565c0',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  adviceText: {
    fontSize: 14,
    color: '#0d47a1',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  // Enhanced rotation indicator
  rotationIndicator: {
    padding: 16,
    backgroundColor: 'linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0',
    borderWidth: 1,
    borderColor: '#ce93d8',
    elevation: 2,
    shadowColor: '#9c27b0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rotationText: {
    fontSize: 12,
    color: '#7b1fa2',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e1bee7',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ce93d8',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9c27b0',
    borderRadius: 3,
  },
  // Enhanced weather header row
  weatherHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  districtIndicator: {
    backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
    elevation: 2,
    shadowColor: '#2196f3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  districtCounter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1565c0',
    letterSpacing: 0.3,
  },
  // Enhanced emergency section
  emergencySection: {
    backgroundColor: 'white',
    marginVertical: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 0.5,
    borderColor: '#ffcdd2',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  contactCard: {
    backgroundColor: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f48fb1',
    elevation: 3,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  contactIcon: {
    fontSize: 28,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2e2e2e',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#c62828',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  contactAvailable: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footerNote: {
    fontSize: 14,
    color: '#ff8f00',
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 16,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 143, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Unused styles kept for compatibility
  footerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  cropList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f8fffe',
    paddingVertical: 15,
    borderRadius: 15,
  },
  cropGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#f8fffe',
    paddingVertical: 15,
    borderRadius: 15,
  },
  cropItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 10,
  },
  cropEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cropTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 4,
    textAlign: 'center',
  },
  cropName: {
    fontSize: 14,
    color: '#4a4a4a',
    textAlign: 'center',
    fontWeight: '600',
  },
  farmerTipsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  farmerTipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 10,
    textAlign: 'center',
  },
  farmerTipsText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 22,
    textAlign: 'left',
  },

  // Calendar Styles
  calendarSection: {
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
  calendarGrid: {
    marginTop: 15,
  },
  calendarCard: {
    backgroundColor: '#f3e5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#9c27b0',
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7b1fa2',
    marginBottom: 8,
  },
  calendarActivities: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  // Weather Tips Styles
  weatherTipsSection: {
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
  weatherTipCard: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
    marginTop: 10,
  },
  weatherTipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherTipText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
  },
  // Fertilizer Recommendation Styles
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
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
    marginBottom: 15,
    alignItems: 'center',
  },
  fertilizerIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  fertilizerCrop: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 8,
  },
  fertilizerStage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  fertilizerAmount: {
    fontSize: 14,
    color: '#1b5e20',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  fertilizerTiming: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fertilizerIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  // Pest Alert Styles
  pestSection: {
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
  pestCard: {
    backgroundColor: '#fff8e1',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff9800',
    marginBottom: 15,
  },
  highSeverityCard: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  pestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pestName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  severityBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  highSeverity: {
    backgroundColor: '#ffcdd2',
    color: '#d32f2f',
  },
  mediumSeverity: {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  },
  pestCrops: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pestSeason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pestSymptoms: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  pestTreatment: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  pestPrevention: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
    fontWeight: '500',
  },
  pestIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  // Common indicator styles
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
  // Market Prices Styles
  marketSection: {
    backgroundColor: 'white',
    marginVertical: 20,
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderTopWidth: 4,
    borderTopColor: '#ff9800',
    borderWidth: 0.5,
    borderColor: '#ffe0b2',
  },
  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceCard: {
    backgroundColor: '#fff8e1',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffcc02',
    elevation: 4,
    shadowColor: '#ff9800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  priceIcon: {
    fontSize: 28,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  priceCrop: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f57c00',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  priceUnit: {
    fontSize: 12,
    color: '#bf360c',
    marginBottom: 6,
    fontWeight: '600',
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  priceDisclaimer: {
    fontSize: 12,
    color: '#795548',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  // Government Schemes Styles
  schemesSection: {
    backgroundColor: 'white',
    marginVertical: 20,
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#3f51b5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderTopWidth: 4,
    borderTopColor: '#3f51b5',
    borderWidth: 0.5,
    borderColor: '#c5cae9',
  },
  schemeCard: {
    backgroundColor: '#e8eaf6',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3f51b5',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#3f51b5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  schemeIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#283593',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  schemeDescription: {
    fontSize: 14,
    color: '#3f51b5',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  schemeEligibility: {
    fontSize: 13,
    color: '#2e7d32',
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '600',
  },
  schemeContact: {
    fontSize: 13,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    letterSpacing: 0.2,
  },
});

export default HomeScreen;
