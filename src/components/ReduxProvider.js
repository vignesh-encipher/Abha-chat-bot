"use client";

import { Provider } from 'react-redux';
import { wrapper } from '../store';

function ReduxProvider({ children, ...props }) {
  const { store } = wrapper.useWrappedStore(props);
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
