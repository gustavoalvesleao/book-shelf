import * as React from "react";

type AsyncState<DataType> =
  | {
      status: "idle";
      data?: null;
      error?: null;
      promise?: null;
    }
  | {
      status: "pending";
      data?: null;
      error?: null;
      promise: Promise<DataType>;
    }
  | {
      status: "resolved";
      data: DataType;
      error: null;
      promise: null;
    }
  | {
      status: "rejected";
      data: null;
      error: Error;
      promise: null;
    };

type AsyncAction<DataType> =
  | { type: "reset" }
  | { type: "pending"; promise: Promise<DataType> }
  | { type: "resolved"; data: DataType; promise?: Promise<DataType> }
  | { type: "rejected"; error: Error; promise?: Promise<DataType> };

function asyncReducer<DataType>(
  state: AsyncState<DataType>,
  action: AsyncAction<DataType>
): AsyncState<DataType> {
  const actionType = action.type;
  switch (actionType) {
    case "reset": {
      return {
        status: "idle",
        data: null,
        error: null,
        promise: null,
      };
    }
    case "pending": {
      return {
        status: "pending",
        data: null,
        error: null,
        promise: action.promise,
      };
    }
    case "resolved": {
      if (action.promise && action.promise !== state.promise) return state;
      return {
        status: "resolved",
        data: action.data,
        error: null,
        promise: null,
      };
    }
    case "rejected": {
      if (action.promise && action.promise !== state.promise) return state;
      return {
        status: "rejected",
        data: null,
        error: action.error,
        promise: null,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${actionType}`);
    }
  }
}

function useAsync<DataType>() {
  const mounted = React.useRef(false);

  const [state, unsafeDispatch] = React.useReducer<
    React.Reducer<AsyncState<DataType>, AsyncAction<DataType>>
  >(asyncReducer, {
    status: "idle",
    data: null,
    error: null,
    promise: null,
  });

  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const dispatch = React.useCallback(
    (action) => (mounted.current ? unsafeDispatch(action) : undefined),
    [unsafeDispatch]
  );

  const { data, error, status } = state;

  const run = React.useCallback(
    (promise: Promise<DataType>) => {
      dispatch({ type: "pending", promise });
      promise.then(
        (successResponse) => {
          dispatch({ type: "resolved", data: successResponse, promise });
        },
        (errorResponse) => {
          dispatch({ type: "rejected", error: errorResponse, promise });
        }
      );
    },
    [dispatch]
  );

  const setData = React.useCallback(
    (newData: DataType) => dispatch({ type: "resolved", data: newData }),
    [dispatch]
  );
  const setError = React.useCallback(
    (newError: Error) => dispatch({ type: "rejected", error: newError }),
    [dispatch]
  );

  const reset = React.useCallback(
    () => dispatch({ type: "reset" }),
    [dispatch]
  );

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export { useAsync };
