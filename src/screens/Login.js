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
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import { ScrollView } from "react-native-gesture-handler";

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
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const response = await dispatch(authActions.login(data));
    console.log(response);

    // try {
    //   dispatch(authActions.login(data));
    //   setErrVisible(false);
    // } catch (err) {
    //   setErrVisible(true);
    // }
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
