import * as React from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  HelperText,
  Snackbar,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const { colors } = useTheme();
  const schema = yup
    .object({
      username: yup.string().required(),
      password: yup.string().required(),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [errVisible, setErrVisible] = React.useState(false);
  const onDismissSnackBar = () => setErrVisible(false);

  const onSubmit = (data) => {
    fetch("https://stag.coastmachinery.com/wp-json/jwt-auth/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token && data.roles.includes("vendor")) {
          setErrVisible(false);
          const storeData = async (data) => {
            try {
              const jsonValue = JSON.stringify(data);
              await AsyncStorage.setItem("userinfo", jsonValue);
            } catch (e) {
              setErrVisible(true);
            }
          };
          storeData(data);
        } else {
          setErrVisible(true);
        }
      });
  };
  const onError = () => {};

  return (
    <>
      <Title style={{ color: colors.primary, ...styles.titleText }}>
        Login to your Account
      </Title>
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
            label="Username *"
            returnKeyType="done"
            textContentType="username"
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
            style={styles.textInput}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            label="Password *"
            returnKeyType="done"
            secureTextEntry={true}
            textContentType="password"
            outlineColor={colors.primary}
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && (
        <HelperText type="error">Password is required.</HelperText>
      )}
      <Button
        mode="outlined"
        color={colors.primary}
        icon={() => <AntDesign name="login" color={colors.primary} size={18} />}
        style={{
          backgroundColor: colors.accentShadow,
          borderColor: colors.primary,
          backgroundColor: colors.surface,
          ...styles.button,
        }}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLbl}
        onPress={handleSubmit(onSubmit, onError)}
      >
        Login
      </Button>
      <Snackbar
        visible={errVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Close",
        }}
      >
        Login Failed.
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  textInput: {
    height: 48,
    marginBottom: 5,
  },
  buttonContent: {
    height: 48,
    flexDirection: "row-reverse",
  },
  buttonLbl: {
    fontWeight: "700",
  },
  button: {
    borderWidth: 2,
    marginTop: 10,
  },
});
