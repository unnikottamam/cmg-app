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
  Checkbox,
  Divider,
  HelperText,
  Snackbar,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function Register() {
  const { colors } = useTheme();
  const [checked, setChecked] = React.useState(true);
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
      password: yup.string().required(),
      email_id: yup
        .string()
        .email()
        .required(),
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    register("recaptcha", { required: true });
    register("terms", { required: true });
  }, [register]);
  const onSubmit = (data) => {
    console.log(data);
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
          <HelperText type="error">Password is required.</HelperText>
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
              value={value}
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
        <Checkbox.Item
          label="I Agree To Terms & Conditions"
          status={checked ? "checked" : "unchecked"}
          onPress={() => {
            setChecked(!checked);
            setValue("terms", !checked);
          }}
        />
        <ReCaptchaV3
          captchaDomain={"https://coastmachinery.com"}
          siteKey={"6Ler7IQaAAAAAOCd21S817XzVsQJ18_wMIvnhUNE"}
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
          onPress={handleSubmit(onSubmit, onError)}
        >
          Sign Up
        </Button>
      </ScrollView>
      <Snackbar
        visible={errVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Close",
        }}
      >
        Some fields are required
      </Snackbar>
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
