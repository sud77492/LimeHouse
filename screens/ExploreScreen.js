import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import axios from 'axios';

import {markers, mapDarkStyle, mapStandardStyle} from '../model/mapData';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ExploreScreen = ({navigation}) => {
  const theme = useTheme();
  console.log(navigation);

  const initialMapState = {
    markers,
    region: {
      latitude: 22.62938671242907,
      longitude: 88.4354486029795,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  const [state, setState] = React.useState(initialMapState);
  const [advice, setAdvice] = useState('');

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  // const getData = async () => {
  //   const {data} = await axios.get(
  //     `https://api.limehome.com/properties/v1/public/properties/?cityId=32&adults=1`,
  //   );
  //   console.log(data);
  //   setAdvice(data);
  // };

  useEffect(() => {
    console.log('url');
    // const url =
    //   'https://api.limehome.com/properties/v1/public/properties/?cityId=32&adults=1';
    // // const url = 'https://jsonplaceholder.typicode.com/todos/1';
    // console.log(url);
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(url);
    //     const json = await response.json();
    //     console.log(json);
    //     setAdvice(json.payload);
    //   } catch (error) {
    //     console.log('error', error);
    //   }
    // };

    const getData = async () => {
      await axios
        .get(
          'https://api.limehome.com/properties/v1/public/properties/?cityId=32&adults=1',
        )
        .then(res => {
          setAdvice(res.data.payload);
          console.log(res.data.payload);
        })
        .catch(err => {
          console.log(err);
        });
    };
    getData();

    mapAnimation.addListener(({value}) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= state.markers.length) {
        index = state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const {coordinate} = state.markers[index];
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: state.region.latitudeDelta,
              longitudeDelta: state.region.longitudeDelta,
            },
            350,
          );
        }
      }, 10);
    });
  }, []);

  // useEffect(() => {
  //   const url =
  //     'https://api.limehome.com/properties/v1/public/properties/?cityId=32&adults=1';
  //   console.log(url);
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(url);
  //       const json = await response.json();
  //       console.log(json);
  //       setAdvice(json.payload);
  //     } catch (error) {
  //       console.log('error', error);
  //     }
  //   };
  // }, []);

  const interpolations = state.markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: 'clamp',
    });

    return {scale};
  });

  const onMarkerPress = mapEventData => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * CARD_WIDTH + markerID * 20;
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }
    _scrollView.current.scrollTo({x: x, y: 0, animated: true});
  };

  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);
  if (advice.length === 0) {
    console.log("api didn't call");
  } else {
    console.log('api called');
  }
  if (advice.length === 0) {
    return (
      <View>
        <Text>API didn't call</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <MapView
          ref={_map}
          initialRegion={state.region}
          style={styles.container}
          provider={PROVIDER_GOOGLE}
          customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}>
          {state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            return (
              <MapView.Marker
                key={index}
                coordinate={marker.coordinate}
                onPress={e => onMarkerPress(e)}>
                <Animated.View style={[styles.markerWrap]}>
                  <Animated.Image
                    source={require('../assets/map_marker.png')}
                    style={[styles.marker, scaleStyle]}
                    resizeMode="cover"
                  />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          ref={_scrollView}
          horizontal
          pagingEnabled
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          style={styles.scrollView}
          contentInset={{
            top: 0,
            left: SPACING_FOR_CARD_INSET,
            bottom: 0,
            right: SPACING_FOR_CARD_INSET,
          }}
          contentContainerStyle={{
            paddingHorizontal:
              Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
          }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: mapAnimation,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}>
          {advice.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={{
                  uri: marker.images[0].url,
                }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {marker.name}
                  {/* Sudhanshu */}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.distance}
                  {/* Description */}
                </Text>
                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CardItemDetails');
                    }}
                    style={[
                      styles.signIn,
                      {
                        borderColor: '#FF6347',
                        borderWidth: 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: '#FF6347',
                        },
                      ]}>
                      Order Test
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10,
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
