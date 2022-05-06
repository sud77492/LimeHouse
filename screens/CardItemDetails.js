import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import HeaderImageScrollView from 'react-native-image-header-scroll-view';
import axios from 'axios';

import * as Animatable from 'react-native-animatable';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const CardItemDetails = ({route}) => {
  //const itemData = route.params.itemData;
  const navTitleView = useRef(null);
  const [details, setDetails] = useState('');

  useEffect(() => {
    const getData = async () => {
      await axios
        .get('https://api.limehome.com/properties/v1/public/properties/210')
        .then(res => {
          setDetails(res.data.payload);
          console.log(res.data.payload.images[0].url);
        })
        .catch(err => {
          console.log(err);
        });
    };
    getData();
  }, []);

  if (details.length === 0) {
    return (
      <View>
        <Text>API didn't call</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <HeaderImageScrollView
          maxHeight={MAX_HEIGHT}
          minHeight={MIN_HEIGHT}
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.3}
          renderHeader={() => (
            <Image
              source={{
                uri: details.images[0].url,
              }}
              style={styles.image}
            />
          )}
          renderForeground={() => (
            <View style={styles.titleContainer}>
              <Text style={styles.imageTitle}>{details.name}</Text>
            </View>
          )}
          renderFixedForeground={() => (
            <Animatable.View style={styles.navTitleView} ref={navTitleView}>
              <Text style={styles.navTitle}>{details.name}</Text>
            </Animatable.View>
          )}>
          <View style={[styles.section, styles.sectionLarge]}>
            <Text style={styles.sectionContent}>{details.description}</Text>
          </View>

          <View style={[styles.section, {height: 250}]}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{flex: 1}}
              region={{
                latitude: 52.3015493,
                longitude: 4.6939769,
                latitudeDelta: 3,
                longitudeDelta: 4,
              }}>
              {/* <MapView.Marker
                coordinate={itemData.coordinate}
                image={require('../assets/map_marker.png')}
              /> */}
            </MapView>
          </View>
        </HeaderImageScrollView>
      </View>
    );
  }
};

export default CardItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: MAX_HEIGHT,
    width: Dimensions.get('window').width,
    alignSelf: 'stretch',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
  },
  name: {
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    fontSize: 16,
    textAlign: 'justify',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  categoryContainer: {
    flexDirection: 'row',
    backgroundColor: '#FF6347',
    borderRadius: 20,
    margin: 10,
    padding: 10,
    paddingHorizontal: 15,
  },
  category: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
  },
  titleContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 24,
  },
  navTitleView: {
    height: MIN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 5,
    opacity: 0,
  },
  navTitle: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  sectionLarge: {
    minHeight: 300,
  },
});
