import { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";
import { UserProfile } from "../types";

interface State {
  loading: boolean;
  loaded: boolean;
  identity?: UserProfile;
  error?: any;
}

const useGetUserProfile = () => {
  const [state, setState] = useState<State>({
    loading: true,
    loaded: false,
  });
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getUserProfile()
      .then(({ data }: { data: UserProfile }) => {
        setState({
          loading: false,
          loaded: true,
          identity: data,
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

export default useGetUserProfile;
