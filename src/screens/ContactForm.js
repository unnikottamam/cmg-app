import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  HelperText,
  RadioButton,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CAPTCHA_KEY, WEB_URL } from "../config";
import axios from "axios";
import ReCaptchaComponent from "../components/ReCaptchaComponent";

export default function ContactForm({
  title,
  productCode,
  lookingfor,
  onFormSubmit,
}) {
  const shipping = title.match(/shipping/i) ? true : false;
  const offer = title.match(/offer/i) ? true : false;
  const schema = yup
    .object({
      recaptcha: yup.string().required(),
      full_name: yup.string().required(),
      email_id: yup.string().email().required(),
      phone_number:
        shipping || offer
          ? yup.string().required()
          : yup.string().notRequired(),
      offer_price: offer ? yup.number().required() : yup.number().notRequired(),
      country: yup.string().notRequired(),
      zip_code: shipping ? yup.string().required() : yup.string().notRequired(),
      message:
        shipping || offer
          ? yup.string().notRequired()
          : yup.string().required(),
    })
    .required();

  const { colors } = useTheme();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [userCountry, setUserCountry] = React.useState("Canada");

  React.useEffect(() => {
    register("recaptcha", { required: true });
  }, [register]);

  const onSubmit = async (data) => {
    let formData = `lookingfor=${lookingfor}&source=Mobile-App&product_code=${
      productCode ? productCode : ""
    }&captcha_res=${data.recaptcha}&full_name=${data.full_name}&email_id=${
      data.email_id
    }&contact_no=${data.phone_number ? data.phone_number : ""}&message=${
      data.message ? data.message : ""
    }&offer_price=${
      data.offer_price ? data.offer_price : ""
    }&country=${userCountry}&zipcode=${data.zip_code ? data.zip_code : ""}`;
    const response = await axios.post(
      `https://stag.coastmachinery.com/wp-content/themes/coast-machinery/inc/form-action.php`,
      formData
    );
    if (response.data) {
      if (response.data.status == "success") {
        reset({
          full_name: "",
          email_id: "",
          phone_number: "",
          message: "",
          offer_price: "",
          country: "",
          zip_code: "",
        });
      }
      onFormSubmit(response.data);
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={160}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
        <Title style={styles.titleText}>{title ? title : "Contact Us"}</Title>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ backgroundColor: colors.surface, ...styles.textInput }}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Full Name *"
              returnKeyType="done"
            />
          )}
          name="full_name"
          defaultValue=""
        />
        {errors.full_name && (
          <HelperText type="error">Name is required</HelperText>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ backgroundColor: colors.surface, ...styles.textInput }}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Email address *"
              keyboardType="email-address"
              returnKeyType="done"
            />
          )}
          name="email_id"
          defaultValue=""
        />
        {errors.email_id && (
          <HelperText type="error">Email address is required</HelperText>
        )}

        <Controller
          control={control}
          rules={{
            required: shipping || offer ? true : false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ backgroundColor: colors.surface, ...styles.textInput }}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Phone number"
              keyboardType="phone-pad"
              returnKeyType="done"
            />
          )}
          name="phone_number"
          defaultValue=""
        />
        {errors.phone_number && (
          <HelperText type="error">Phone number is required</HelperText>
        )}

        {offer && (
          <>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    ...styles.textInput,
                  }}
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label="Offer price *"
                  keyboardType="number-pad"
                  returnKeyType="done"
                />
              )}
              name="offer_price"
              defaultValue=""
            />
            {errors.offer_price && (
              <HelperText type="error">Offer price is required</HelperText>
            )}
          </>
        )}

        {shipping && (
          <>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{
                    backgroundColor: colors.surface,
                    ...styles.textInput,
                  }}
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  label="Zip / Postal Code *"
                  returnKeyType="done"
                />
              )}
              name="zip_code"
              defaultValue=""
            />
            {errors.zip_code && (
              <HelperText type="error">
                Zip / Postal Code is required
              </HelperText>
            )}
            <Text>Shipping Country</Text>
            <View style={{ alignItems: "center", flexDirection: "row" }}>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <RadioButton
                  value="USA"
                  status={userCountry === "USA" ? "checked" : "unchecked"}
                  onPress={() => setUserCountry("USA")}
                />
                <Text>USA</Text>
              </View>
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <RadioButton
                  value="Canada"
                  status={userCountry === "Canada" ? "checked" : "unchecked"}
                  onPress={() => setUserCountry("Canada")}
                />
                <Text>Canada</Text>
              </View>
            </View>
          </>
        )}

        <Controller
          control={control}
          rules={{
            required: shipping || offer ? false : true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ backgroundColor: colors.surface, ...styles.textInput }}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Message"
              returnKeyType="done"
            />
          )}
          name="message"
          defaultValue=""
        />
        {errors.message && (
          <HelperText type="error">Message is required</HelperText>
        )}
        <ReCaptchaComponent
          captchaDomain={WEB_URL}
          siteKey={CAPTCHA_KEY}
          onReceiveToken={(token) =>
            setValue("recaptcha", token, { shouldValidate: true })
          }
        />
        <Button
          icon="email-outline"
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Send
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 70,
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
});
