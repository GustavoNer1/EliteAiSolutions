import { Still } from "remotion";
import { Capa, Logo } from "./Brand";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Still id="Logo" component={Logo} width={1024} height={1024} />
      <Still id="Capa" component={Capa} width={2160} height={1216} />
    </>
  );
};
