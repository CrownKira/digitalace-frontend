import React from "react";
import { useGetList, Record } from "react-admin";

import { incrementReference } from "../../utils";

export const useGetIncrementedReference = ({
  resource,
  prefix,
}: {
  resource: string;
  prefix: string;
}) => {
  const { data, ids, loading, loaded } = useGetList<Record>(
    resource,
    { page: 1, perPage: 1 },
    { field: "id", order: "DESC" },
    {}
  );

  return {
    reference:
      data && ids.length > 0
        ? incrementReference(data[ids[0]].reference, prefix, 4)
        : `${prefix}-0000`,
    loading,
    loaded,
  };
};
