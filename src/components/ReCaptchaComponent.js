import * as React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const patchPostMessageJsCode = `(${String(function () {
  const originalPostMessage = window.postMessage;
  const patchedPostMessage = (message, targetOrigin, transfer) => {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = () =>
    String(Object.hasOwnProperty).replace("hasOwnProperty", "postMessage");
  window.postMessage = patchedPostMessage;
})})();`;

const getExecutionFunction = (siteKey, action) => {
  return `window.grecaptcha.execute('${siteKey}', { action: '${action}' }).then(
      function(args) {
        window.ReactNativeWebView.postMessage(args);
      }
    )`;
};

const getInvisibleRecaptchaContent = (siteKey, action) => {
  return `<!DOCTYPE html><html><head>
      <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
      <script>window.grecaptcha.ready(function() { ${getExecutionFunction(
        siteKey,
        action
      )} });</script>
      </head></html>`;
};

class ReCaptchaComponent extends React.PureComponent {
  _webViewRef = null;

  render() {
    return (
      <View style={{ flex: 0.0001, width: 0, height: 0 }}>
        <WebView
          ref={(ref) => {
            this._webViewRef = ref;
          }}
          javaScriptEnabled
          originWhitelist={["*"]}
          automaticallyAdjustContentInsets
          mixedContentMode={"always"}
          injectedJavaScript={patchPostMessageJsCode}
          source={{
            html: getInvisibleRecaptchaContent(
              this.props.siteKey,
              this.props.action
            ),
            baseUrl: this.props.captchaDomain,
          }}
          onMessage={(event) => {
            this.props.onReceiveToken(event.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}

export default ReCaptchaComponent;
