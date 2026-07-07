import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type Props = {
  loading: boolean;
  children: ReactNode;
};

const LoadingLayout = ({ loading, children }: Props) => {
  if (loading) {
    return (
      <div
        className="
        min-h-[calc(100vh-100px)]
        flex
        items-center
        justify-center
      "
      >
        <LoaderCircle
          size={42}
          className="
            animate-spin
            text-orange-500
          "
        />
      </div>
    );
  }

  return children;
};

export default LoadingLayout;
