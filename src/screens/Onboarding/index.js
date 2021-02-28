import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {images, theme, COLORS, FONTS, SIZES} from '../../constants';

const {onboarding1, onboarding2, onboarding3} = images;

const DATA = [
  {
    title: "Let's Travelling",
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
    img: onboarding1,
  },
  {
    title: 'Navigation',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
    img: onboarding2,
  },
  {
    title: 'Destination',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut',
    img: onboarding3,
  },
];

const index = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [completed, setCompleted] = useState(false);
  const scroll = useRef(null);
  useEffect(() => {
    // Here we check if the user already finished the onboarding
    scrollX.addListener((scroll) => {
      console.log('scroll', scroll);
      if (Math.floor(scroll.value / SIZES.width) === DATA.length - 1) {
        setCompleted(3);
      }
    });
    return () => scrollX.removeListener();
  }, []);

  const renderContent = () => {
    return (
      <Animated.ScrollView
        ref={scroll}
        bounces={false}
        horizontal
        pagingEnabled
        scrollEnabled
        decelerationRate={0}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {React.Children.toArray(
          DATA.map((item) => (
            <View style={styles.slideContainer}>
              {/* Image */}
              <View style={styles.slideImageContainer}>
                <Image
                  source={item.img}
                  resizeMode="cover"
                  style={styles.slideImage}
                />
              </View>
              {/* Text */}
              <View style={styles.slideTextContainer}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDescription}>{item.description}</Text>
              </View>
            </View>
          )),
        )}
      </Animated.ScrollView>
    );
  };

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View style={styles.dotsContainer}>
        {React.Children.toArray(
          DATA.map((_, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base, 17, SIZES.base],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    opacity,
                  },
                ]}
              />
            );
          }),
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>{renderContent()}</View>
      <View style={styles.dotsRootContainer}>{renderDots()}</View>
      {/* Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => {
          scroll.current.scrollTo({
            x: SIZES.width * (DATA.length - 1),
          });
          console.log('skipped');
        }}>
        <Text style={styles.skipButtonText}>
          {completed ? "Let's go!" : 'Skip'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  slideContainer: {
    width: SIZES.width,
  },
  slideImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideTextContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 40,
    right: 40,
  },
  slideTitle: {
    ...FONTS.h1,
    color: COLORS.gray,
    textAlign: 'center',
  },
  slideDescription: {
    ...FONTS.body3,
    textAlign: 'center',
    marginTop: SIZES.base,
    color: COLORS.gray,
  },
  skipButton: {
    backgroundColor: COLORS.blue,
    position: 'absolute',
    bottom: 28,
    right: 0,
    width: 150,
    height: 60,
    justifyContent: 'center',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    paddingLeft: 20,
  },
  skipButtonText: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  dotsRootContainer: {
    position: 'absolute',
    bottom: SIZES.height > 700 ? '30%' : '20%',
  },
  dotsContainer: {
    flexDirection: 'row',
    height: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.blue,
    marginHorizontal: SIZES.radius / 2,
  },
});
export default index;
