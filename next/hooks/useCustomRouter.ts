import useRouter from "@unitools/router";

export interface CustomRouterProps {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  navigate: (path: string) => void;
  query: { [key: string]: string | undefined };
}

export default function useCustomRouter(): CustomRouterProps {
  const router = useRouter();

  const customRouterProps = {
    ...router,
    query: {},
  };

  return customRouterProps;
}