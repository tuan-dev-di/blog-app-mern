import { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store.js";
import ThemeProvider from "./ThemeProvider";

/**
 * Hàm xây dựng cây Provider từ danh sách các cặp [Component, props]
 */
const buildProvidersTree =
  (providers) =>
  ({ children }) =>
    providers.reduceRight(
      (child, [Component, props]) => (
        <Component {...(props || {})}>{child}</Component>
      ),
      children
    );

// Danh sách Provider theo thứ tự từ ngoài vào trong
const ProvidersTree = buildProvidersTree([
  [StrictMode],
  [Provider, { store }],
  [PersistGate, { persistor }],
  [ThemeProvider],
]);

export default ProvidersTree;