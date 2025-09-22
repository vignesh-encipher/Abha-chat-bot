import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { wrapper, store } from "../../store";
import { Provider } from "react-redux";
import {  useState } from "react";

function MyApp({ Component, pageProps }) {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <Provider store={store}>
      <span>
        {/* {showTerminal && <Header />} */}
        <div>
          <Component {...pageProps} />
        </div>
      </span>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
