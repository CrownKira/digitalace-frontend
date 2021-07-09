import { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";
import { UserConfig } from "../../types";

interface State {
  loading: boolean;
  loaded: boolean;
  data?: UserConfig;
  error?: any;
}

const useGetUserConfig = () => {
  const [state, setState] = useState<State>({
    loading: true,
    loaded: false,
  });
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getUserConfig()
      .then(({ data }: { data: UserConfig }) => {
        setState({
          loading: false,
          loaded: true,
          data,
        });
      })
      .catch((error: Error) => {
        setState({
          loading: false,
          loaded: true,
          error,
        });
      });
  }, [dataProvider]);

  return state;
};

export default useGetUserConfig;
