import { Button } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { Provider } from "next-auth/providers";
import { getProviders, getSession, signIn } from "next-auth/react";

export interface ISignInProps {
  providers: Provider[];
}

const SignIn = (props: ISignInProps) => {
  return <>
  {Object.values(props.providers).map((provider) => {
  return (
    <Button
      key={provider.id}
      onClick={() => signIn(provider.id)}
    >
      Sign in with {provider.name}
    </Button>
  );
})}
</>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await getProviders(),
    },
  };
}

export default SignIn