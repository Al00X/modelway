import { useState } from "react";

// if you pass a function as opt (second parameter), it'll act like onSuccess() callback,
// or you can pass an object for more callbacks, just like .subscribe() in RXJS.
// Supports Axios error message response
//
// generic R = Result, A = Args
//
// return => Array [ result, invokePromiseFn(), additionalInfo ]
export default function usePromise<R, A>(
  promiseFn: (args?: A) => Promise<R>,
  opt?:
    | {
        onSuccess?: (result: R) => void;
        onError?: (error: any) => void;
        onFinally?: () => void;
      }
    | ((result: R) => void)
) {
  const [result, setResult] = useState<R | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return [
    result,
    (args?: A) => {
      setError(null);
      setResult(null);
      setLoading(true);

      const isOptFn = opt && typeof opt === "function";
      promiseFn(args)
        .then((result) => {
          if (isOptFn) opt(result);
          else if (opt?.onSuccess) opt.onSuccess(result);

          setResult(result);
        })
        .catch((error) => {
          if (!isOptFn && opt?.onError) opt.onError(error);
          setError(error);
        })
        .finally(() => {
          if (!isOptFn && opt?.onFinally) opt.onFinally();
          setLoading(false);
        });
    },
    {
      error: error,
      loading: loading,
    },
  ] as [
    R | null,
    (args?: A) => void,
    {
      error: any | null;
      loading: boolean;
    }
  ];
}
