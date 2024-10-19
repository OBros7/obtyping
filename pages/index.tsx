import type { NextPage } from 'next'
import { HomeMain } from '@/Home'
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface HomeProps {
  session?: Session;
}

const Home: NextPage<HomeProps> = ({ session }) => {
  return <HomeMain />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default Home;