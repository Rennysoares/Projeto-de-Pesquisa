import { Animated } from "react-native";

export const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
      backgroundColor: '#000'
    },
});

export const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })
        : 0
    );
  
    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [
                  screen.width, // Focused, but offscreen in the beginning
                  0, // Fully focused
                  screen.width * -0.3, // Fully unfocused
                ],
                extrapolate: 'clamp',
              }),
              inverted
            ),
          },
        ],
      },
      shadowStyle:{
        backgroundColor: '#000'
      },
      overlayStyle:{
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      },
      containerStyle:{
        backgroundColor: 'rgba(0, 0, 0, 0)'
      },
    };
  };