import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Divider,
  HelperText,
  Portal,
  Snackbar,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCaptchaComponent from "../components/ReCaptchaComponent";
import { CAPTCHA_KEY, WEB_URL } from "../config";
import axios from "axios";
import { useAuth } from "../contexts/Auth";

export default function Register() {
  const auth = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [userCountry, setUserCountry] = React.useState();
  let canadaStates = [
    {
      label: "Alberta",
      value: "AB",
    },
    {
      label: "British Columbia",
      value: "BC",
    },
    {
      label: "Manitoba",
      value: "MB",
    },
    {
      label: "New Brunswick",
      value: "NB",
    },
    {
      label: "Newfoundland and Labrador",
      value: "NL",
    },
    {
      label: "Northwest Territories",
      value: "NT",
    },
    {
      label: "Nova Scotia",
      value: "NS",
    },
    {
      label: "Nunavut",
      value: "NU",
    },
    {
      label: "Ontario",
      value: "ON",
    },
    {
      label: "Prince Edward Island",
      value: "PE",
    },
    {
      label: "Quebec",
      value: "QC",
    },
    {
      label: "Saskatchewan",
      value: "SK",
    },
    {
      label: "Yukon Territory",
      value: "YT",
    },
  ];
  let usaStates = [
    {
      value: "AL",
      label: "Alabama",
    },
    {
      value: "AK",
      label: "Alaska",
    },
    {
      value: "AZ",
      label: "Arizona",
    },
    {
      value: "AR",
      label: "Arkansas",
    },
    {
      value: "CA",
      label: "California",
    },
    {
      value: "CO",
      label: "Colorado",
    },
    {
      value: "CT",
      label: "Connecticut",
    },
    {
      value: "DE",
      label: "Delaware",
    },
    {
      value: "DC",
      label: "District Of Columbia",
    },
    {
      value: "FL",
      label: "Florida",
    },
    {
      value: "GA",
      label: "Georgia",
    },
    {
      value: "HI",
      label: "Hawaii",
    },
    {
      value: "ID",
      label: "Idaho",
    },
    {
      value: "IL",
      label: "Illinois",
    },
    {
      value: "IN",
      label: "Indiana",
    },
    {
      value: "IA",
      label: "Iowa",
    },
    {
      value: "KS",
      label: "Kansas",
    },
    {
      value: "KY",
      label: "Kentucky",
    },
    {
      value: "LA",
      label: "Louisiana",
    },
    {
      value: "ME",
      label: "Maine",
    },
    {
      value: "MD",
      label: "Maryland",
    },
    {
      value: "MA",
      label: "Massachusetts",
    },
    {
      value: "MI",
      label: "Michigan",
    },
    {
      value: "MN",
      label: "Minnesota",
    },
    {
      value: "MS",
      label: "Mississippi",
    },
    {
      value: "MO",
      label: "Missouri",
    },
    {
      value: "MT",
      label: "Montana",
    },
    {
      value: "NE",
      label: "Nebraska",
    },
    {
      value: "NV",
      label: "Nevada",
    },
    {
      value: "NH",
      label: "New Hampshire",
    },
    {
      value: "NJ",
      label: "New Jersey",
    },
    {
      value: "NM",
      label: "New Mexico",
    },
    {
      value: "NY",
      label: "New York",
    },
    {
      value: "NC",
      label: "North Carolina",
    },
    {
      value: "ND",
      label: "North Dakota",
    },
    {
      value: "OH",
      label: "Ohio",
    },
    {
      value: "OK",
      label: "Oklahoma",
    },
    {
      value: "OR",
      label: "Oregon",
    },
    {
      value: "PA",
      label: "Pennsylvania",
    },
    {
      value: "RI",
      label: "Rhode Island",
    },
    {
      value: "SC",
      label: "South Carolina",
    },
    {
      value: "SD",
      label: "South Dakota",
    },
    {
      value: "TN",
      label: "Tennessee",
    },
    {
      value: "TX",
      label: "Texas",
    },
    {
      value: "UT",
      label: "Utah",
    },
    {
      value: "VT",
      label: "Vermont",
    },
    {
      value: "VA",
      label: "Virginia",
    },
    {
      value: "WA",
      label: "Washington",
    },
    {
      value: "WV",
      label: "West Virginia",
    },
    {
      value: "WI",
      label: "Wisconsin",
    },
    {
      value: "WY",
      label: "Wyoming",
    },
  ];

  const schema = yup
    .object({
      recaptcha: yup.string().required(),
      first_name: yup.string().required(),
      last_name: yup.string().required(),
      shop_name: yup.string().required(),
      username: yup.string().required(),
      password: yup.string().required().min(5),
      email_id: yup.string().email().required(),
      cellnumber: yup.string().required(),
      country: yup.string().required(),
      state: yup.string().required(),
      zipcode: yup.string().required(),
    })
    .required();

  const [errVisible, setErrVisible] = React.useState(false);
  const onDismissSnackBar = () => setErrVisible(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    register("recaptcha", { required: true });
  }, [register]);

  const onSubmit = async (data) => {
    let formData = `captcha_res=${data.recaptcha}&first_name=${
      data.first_name
    }&last_name=${data.last_name}&shop_name=${data.shop_name}&username=${
      data.username
    }&email_id=${data.email_id}&password=${data.password}&cellnumber=${
      data.cellnumber
    }&message=${data.message ? data.message : ""}&street=${
      data.street ? data.street : ""
    }&city=${data.city ? data.city : ""}&country=${data.country}&state=${
      data.state
    }&zipcode=${data.zipcode}`;
    const response = await axios.post(
      `${WEB_URL}/wp-content/themes/coast-machinery/inc/form-signup.php`,
      formData
    );
    const resData = await response.data;
    if (resData) {
      if (resData.status !== "success") {
        return setErrVisible(true);
      }
      reset({
        first_name: "",
        last_name: "",
        shop_name: "",
        username: "",
        email_id: "",
        password: "",
        cellnumber: "",
        message: "",
        street: "",
        city: "",
        country: "",
        state: "",
        zipcode: "",
      });
      const loginRes = await auth.signIn(data.username, data.password);
      if (!loginRes) {
        setErrVisible(true);
      }
      navigation.navigate("Dashboard");
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={160}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
        <Title style={{ color: colors.primary, ...styles.titleTextOne }}>
          1. Basic Information
        </Title>
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
              label="First Name *"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="first_name"
          defaultValue=""
        />
        {errors.first_name && (
          <HelperText type="error">First name is required.</HelperText>
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
              label="Last Name *"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="last_name"
          defaultValue=""
        />
        {errors.last_name && (
          <HelperText type="error">Last name is required.</HelperText>
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
              label="Shop / Vendor Name *"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="shop_name"
          defaultValue=""
        />
        {errors.shop_name && (
          <HelperText type="error">Shop / Vendor name is required.</HelperText>
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
              label="Email Address *"
              keyboardType="email-address"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="email_id"
          defaultValue=""
        />
        {errors.email_id && (
          <HelperText type="error">Email Address is required.</HelperText>
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
              label="Username *"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="username"
          defaultValue=""
        />
        {errors.username && (
          <HelperText type="error">Username is required.</HelperText>
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
              label="Password *"
              returnKeyType="done"
              outlineColor={colors.primary}
              secureTextEntry={true}
              textContentType="password"
            />
          )}
          name="password"
          defaultValue=""
        />
        {errors.password && (
          <HelperText type="error">
            Password is required & atleast 5 characters.
          </HelperText>
        )}

        <Divider style={styles.divider} />
        <Title style={{ color: colors.primary, ...styles.titleText }}>
          2. Contact Details
        </Title>
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
              label="Cell Number *"
              returnKeyType="done"
              keyboardType="phone-pad"
              outlineColor={colors.primary}
            />
          )}
          name="cellnumber"
          defaultValue=""
        />
        {errors.cellnumber && (
          <HelperText type="error">Cell Number is required.</HelperText>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange } }) => (
            <RNPickerSelect
              placeholder={{ label: "Country *", value: null }}
              useNativeAndroidPickerStyle={false}
              textInputProps={{
                style: {
                  borderColor: colors.primary,
                  color: colors.inputColor,
                  backgroundColor: colors.surface,
                  ...styles.inputStyles,
                },
              }}
              onValueChange={(value) => {
                onChange(value);
                setUserCountry(value);
              }}
              items={[
                { label: "Canada", value: "CA" },
                { label: "USA", value: "USA" },
              ]}
            />
          )}
          name="country"
          defaultValue=""
        />
        {errors.country && (
          <HelperText type="error">Country is required</HelperText>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange } }) => (
            <RNPickerSelect
              placeholder={{ label: "State/Province *", value: null }}
              useNativeAndroidPickerStyle={false}
              textInputProps={{
                style: {
                  borderColor: colors.primary,
                  color: colors.inputColor,
                  backgroundColor: colors.surface,
                  ...styles.inputStyles,
                },
              }}
              onValueChange={(value) => {
                onChange(value);
              }}
              items={userCountry === "USA" ? usaStates : canadaStates}
            />
          )}
          name="state"
          defaultValue=""
        />
        {errors.state && (
          <HelperText type="error">State/Province is required</HelperText>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ backgroundColor: colors.surface, ...styles.textInput }}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="Street Address"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="street"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{ backgroundColor: colors.surface, ...styles.textInput }}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="City"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="city"
          defaultValue=""
        />
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
              value={value.toUpperCase()}
              label="Postal / Zip Code *"
              returnKeyType="done"
              outlineColor={colors.primary}
            />
          )}
          name="zipcode"
          defaultValue=""
        />
        {errors.zipcode && (
          <HelperText type="error">Postal / Zip Code is required.</HelperText>
        )}
        <ReCaptchaComponent
          captchaDomain={WEB_URL}
          siteKey={CAPTCHA_KEY}
          onReceiveToken={(token) =>
            setValue("recaptcha", token, { shouldValidate: true })
          }
        />
        <Button
          icon="plus"
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLbl}
          onPress={handleSubmit(onSubmit)}
        >
          Sign Up
        </Button>
      </ScrollView>
      <Portal>
        <Snackbar
          visible={errVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Close",
          }}
        >
          Something went wrong, Please try again.
        </Snackbar>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 30,
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
  inputStyles: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 50,
    marginBottom: 5,
    marginTop: 5,
  },
  smallText: {
    fontSize: 12,
    marginBottom: 5,
  },
  buttonContent: {
    height: 48,
  },
  buttonLbl: {
    fontWeight: "700",
  },
  button: {
    marginTop: 10,
    marginBottom: 30,
  },
  divider: {
    marginVertical: 10,
  },
});
