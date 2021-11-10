import * as React from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Divider,
  HelperText,
  Snackbar,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import AntDesign from "react-native-vector-icons/AntDesign";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { WEB_URL, WOO_KEY, WOO_SECRET } from "../config";

const { width: screenWidth } = Dimensions.get("window");
export default function AddProduct() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [featuredImage, setFeaturedImage] = React.useState(null);
  let [maxGallery, setMaxGallery] = React.useState(0);
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [productVideo, setProductVideo] = React.useState(null);
  const video = React.useRef(null);

  const [errVisible, setErrVisible] = React.useState(false);
  const onDismissSnackBar = () => setErrVisible(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions!");
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    register("prodVideo");
    register("featImg", { required: true });
    register("galImages");
  }, [register]);

  const pickFeaturedImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setFeaturedImage(result.uri);
      setValue("featImg", result.uri, { shouldValidate: true });
    }
  };

  const pickGalleryImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.cancelled && maxGallery < 8) {
      setGalleryImages([...galleryImages, { id: uuidv4(), url: result.uri }]);
      setMaxGallery(maxGallery + 1);
      setValue("galImages", galleryImages);
    }
  };

  const removeGalleryImages = (imageID) => {
    setGalleryImages(galleryImages.filter((item) => item.id !== imageID));
    setValue(
      "galImages",
      galleryImages.filter((item) => item.id !== imageID)
    );
    setMaxGallery(maxGallery - 1);
  };

  const removeProductVideo = () => {
    setProductVideo(null);
    setValue("prodVideo", null);
  };

  const pickProductVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.72,
    });

    if (!result.cancelled) {
      setProductVideo(result.uri);
      setValue("prodVideo", result.uri);
    }
  };

  const onSubmit = async (data) => {
    let dimensions = {
      length: data.length ? data.length : "",
      width: data.width ? data.width : "",
      height: data.height ? data.height : "",
    };

    let attributes = [];
    let attrCount = -1;

    if (data.pa_amps) {
      attributes.push({
        id: 8,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_amps.trim()],
      });
    }
    if (data.pa_brand) {
      attributes.push({
        id: 1,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_brand.trim()],
      });
    }
    if (data.pa_hp) {
      attributes.push({
        id: 6,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_hp.trim()],
      });
    }
    if (data.pa_model) {
      attributes.push({
        id: 3,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_model.trim()],
      });
    }
    if (data.pa_phase) {
      attributes.push({
        id: 4,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_phase.trim()],
      });
    }
    if (data.pa_serialno) {
      attributes.push({
        id: 16,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_serialno.trim()],
      });
    }
    if (data.pa_voltage) {
      attributes.push({
        id: 5,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_voltage.trim()],
      });
    }
    if (data.pa_yearmfg) {
      attributes.push({
        id: 14,
        position: ++attrCount,
        visible: true,
        variation: false,
        options: [data.pa_yearmfg.trim()],
      });
    }

    let formData = {
      type: "simple",
      name: data.name.trim(),
      description: data.description.trim(),
      categories: [
        {
          id: data.product_cat,
        },
      ],
      regular_price: data.regular_price,
      attributes: attributes,
      dimensions: dimensions,
      weight: data.weight,
      meta_data: [
        {
          key: "product_city",
          value: data.location,
        },
      ],
    };
    console.log(formData);
    // const response = await axios.post(
    //   `${WEB_URL}/wp-json/wc/v3/products?consumer_key=${WOO_KEY}&consumer_secret=${WOO_SECRET}`,
    //   formData
    // );
    // const resData = await response.data;
    // if (resData) {
    //   if (resData.status !== "success") {
    //     return console.log(resData);
    //   }
    //   reset({
    //     name: "",
    //     location: "",
    //     product_cat: "",
    //     regular_price: "",
    //     description: "",
    //     weight: "",
    //     length: "",
    //     width: "",
    //     height: "",
    //     pa_amps: "",
    //     pa_brand: "",
    //     pa_hp: "",
    //     pa_model: "",
    //     pa_phase: "",
    //     pa_serialno: "",
    //     pa_voltage: "",
    //     pa_yearmfg: "",
    //   });
    //   setValue("featImg", "");
    //   setValue("prodVideo", "");
    //   setValue("galImages", "");
    //   navigation.navigate("Products", { productAdded: true, id: 361 });
    // }
  };

  const onError = () => {
    setErrVisible(true);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={160}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
        <Title style={styles.titleTextOne}>Tell us about your machine</Title>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Product Name *"
              returnKeyType="done"
            />
          )}
          name="name"
          defaultValue=""
        />
        {errors.name && (
          <HelperText type="error">Product name is required.</HelperText>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Location (Optional)"
              returnKeyType="done"
            />
          )}
          name="location"
          defaultValue=""
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange } }) => (
            <RNPickerSelect
              placeholder={{ label: "Select a category *", value: null }}
              textInputProps={{
                style: {
                  borderColor: colors.inputColor,
                  color: colors.inputColor,
                  ...styles.inputStyles,
                },
              }}
              useNativeAndroidPickerStyle={false}
              onValueChange={(value) => {
                onChange(value);
              }}
              items={[
                { label: "Woodworking", value: 361 },
                { label: "Metalworking", value: 377 },
                { label: "Stone & Glass", value: 380 },
                { label: "Warehousing", value: 382 },
              ]}
            />
          )}
          name="product_cat"
          defaultValue=""
        />
        {errors.product_cat && (
          <HelperText type="error">Select a category.</HelperText>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Selling Price (CAD $) *"
              keyboardType="numeric"
              returnKeyType="done"
            />
          )}
          name="regular_price"
          defaultValue=""
        />
        {errors.regular_price && (
          <HelperText type="error">Selling price is required.</HelperText>
        )}
        <Text style={styles.smallText}>
          *Selling price including CMG’s 20% commission
        </Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Product Description"
              returnKeyType="done"
            />
          )}
          name="description"
          defaultValue=""
        />
        <Text style={styles.smallText}>
          Describe any damage / repairs of your product
        </Text>
        <Divider style={styles.divider} />
        <Title style={styles.titleText}>Specifications (Optional)</Title>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Weight (lbs)"
              keyboardType="numeric"
              returnKeyType="done"
            />
          )}
          name="weight"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Length (inch)"
              keyboardType="numeric"
              returnKeyType="done"
            />
          )}
          name="length"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Width (inch)"
              keyboardType="numeric"
              returnKeyType="done"
            />
          )}
          name="width"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Height (inch)"
              keyboardType="numeric"
              returnKeyType="done"
            />
          )}
          name="height"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Amps"
              returnKeyType="done"
            />
          )}
          name="pa_amps"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Brand"
              returnKeyType="done"
            />
          )}
          name="pa_brand"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="HP"
              returnKeyType="done"
            />
          )}
          name="pa_hp"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Model"
              returnKeyType="done"
            />
          )}
          name="pa_model"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Phase"
              returnKeyType="done"
            />
          )}
          name="pa_phase"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Serial No."
              returnKeyType="done"
            />
          )}
          name="pa_serialno"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Voltage"
              returnKeyType="done"
            />
          )}
          name="pa_voltage"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInput}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Year Mfg."
              keyboardType="numeric"
              returnKeyType="done"
            />
          )}
          name="pa_yearmfg"
          defaultValue=""
        />

        <Divider style={styles.divider} />
        <Title style={styles.titleText}>Images & Video</Title>
        <View style={styles.mediaWrap}>
          {featuredImage && (
            <View style={styles.featuredWrap}>
              <Image
                source={{ uri: featuredImage }}
                style={{
                  width: screenWidth * 0.7,
                  height: screenWidth * 0.7,
                  ...styles.imageStyles,
                }}
              />
            </View>
          )}
          <Button
            uppercase={false}
            icon="image"
            mode="outlined"
            style={styles.addMediaBtn}
            onPress={pickFeaturedImage}
          >
            {featuredImage ? "Change Featured Image" : "Select Featured Image"}
          </Button>
          {errors.featImg && (
            <HelperText type="error">Featured image is required.</HelperText>
          )}

          {galleryImages && (
            <View style={styles.galWrap}>
              {galleryImages.map((image) => (
                <View
                  key={image.id}
                  style={{
                    width: screenWidth * 0.3,
                    height: screenWidth * 0.3,
                    ...styles.galItem,
                  }}
                >
                  <Pressable
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.primary,
                      ...styles.closeBtn,
                    }}
                    onPress={() => removeGalleryImages(image.id)}
                  >
                    <AntDesign name="close" color={colors.primary} size={16} />
                  </Pressable>
                  <Image
                    source={{ uri: image.url }}
                    style={styles.galItemImg}
                  />
                </View>
              ))}
            </View>
          )}

          {maxGallery < 8 && (
            <Button
              uppercase={false}
              icon="image"
              mode="outlined"
              onPress={pickGalleryImages}
            >
              Select Gallery Images
            </Button>
          )}

          {productVideo ? (
            <View style={styles.videoBox}>
              <Video
                style={{
                  width: screenWidth * 0.7,
                  height: screenWidth * 0.7,
                  ...styles.videoItem,
                }}
                resizeMode="cover"
                ref={video}
                source={{
                  uri: productVideo,
                }}
                useNativeControls
                isLooping
              />
              <Button
                uppercase={false}
                mode="outlined"
                icon="close"
                onPress={removeProductVideo}
              >
                Remove Video
              </Button>
            </View>
          ) : (
            <Button
              uppercase={false}
              icon="video"
              mode="outlined"
              style={styles.addMediaBtn}
              onPress={pickProductVideo}
            >
              Select Product Video
            </Button>
          )}
        </View>

        <Button
          icon="plus"
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={handleSubmit(onSubmit, onError)}
        >
          Add Product
        </Button>
      </ScrollView>
      <Snackbar
        visible={errVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Close",
        }}
      >
        Fill all required fields
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 20,
  },
  titleTextOne: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
  titleText: {
    textAlign: "center",
    fontSize: 18,
  },
  textInput: {
    height: 50,
    marginBottom: 5,
  },
  smallText: {
    fontSize: 12,
    marginBottom: 5,
  },
  buttonContent: {
    height: 48,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  inputStyles: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 50,
    marginBottom: 5,
    marginTop: 5,
  },
  divider: {
    marginVertical: 8,
  },
  featuredWrap: {
    alignItems: "center",
  },
  imageStyles: {
    borderRadius: 300,
  },
  videoBox: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  videoItem: {
    borderRadius: 5,
    marginBottom: 10,
  },
  mediaWrap: {
    marginBottom: 5,
  },
  galWrap: {
    flex: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -4,
    marginTop: 8,
  },
  addMediaBtn: {
    marginTop: 8,
  },
  galItem: {
    position: "relative",
    paddingHorizontal: 4,
    marginVertical: 4,
  },
  galItemImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  closeBtn: {
    position: "absolute",
    right: 10,
    top: 5,
    width: 34,
    height: 34,
    borderWidth: 2,
    zIndex: 9,
    borderRadius: 34,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
