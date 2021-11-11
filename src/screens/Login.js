import * as React from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  HelperText,
  Portal,
  Snackbar,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";
import { WEB_URL } from "../config";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log(result);
  } else {
    console.log("none");
  }
}

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
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [errVisible, setErrVisible] = React.useState(false);
  const onDismissSnackBar = () => setErrVisible(false);

  getValueFor("usertoken");

  const onSubmit = async (data) => {
    const response = await fetch(`${WEB_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    });

    if (!response.ok) {
      console.log("error");
    }

    const resData = await response.json();
    if (resData.roles !== "vendor") {
      console.log("not vendor");
    }

    save("usertoken", resData.token);
    save("userid", resData.userid.toString());
    save("userrole", resData.roles);
    save("userdisplayname", resData.user_display_name);
    save("username", data.username);
    save("password", data.password.toString(0));
  };

  return (
    <ScrollView>
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
            style={{ backgroundColor: colors.surface, ...styles.textInput }}
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
            style={{ backgroundColor: colors.surface, ...styles.textInput }}
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
        icon={() => <AntDesign name="login" color={colors.primary} size={18} />}
        style={{
          backgroundColor: colors.accentShadow,
          borderColor: colors.primary,
          backgroundColor: colors.surface,
          ...styles.button,
        }}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLbl}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        Login
      </Button>
      <Portal>
        <Snackbar
          visible={errVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Close",
          }}
        >
          Login Failed.
        </Snackbar>
      </Portal>
    </ScrollView>
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
