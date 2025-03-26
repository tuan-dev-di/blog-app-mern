import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ProvidersTree from "./components/ProvidersTree.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <ProvidersTree>
    <App />
  </ProvidersTree>
);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <PersistGate persistor={persistor}>
//         <Theme>
//           <App />
//         </Theme>
//       </PersistGate>
//     </Provider>
//   </StrictMode>
// );
