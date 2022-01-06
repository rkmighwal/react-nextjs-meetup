import { MongoClient } from "mongodb";
import Head from "next/head";
import React from "react";
import MeetupList from "../components/meetups/MeetupList";
import { CONFIGS } from "../appSettings";

const HomePage = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </React.Fragment>
  );
};

export const getStaticProps = async () => {
  // code executed during build process, never on client-side
  // can be used to fetch data from API
  const client = await MongoClient.connect(CONFIGS.mongoDb.connectionString);
  const db = client.db();

  const meetupsCollection = db.collection(CONFIGS.mongoDb.collectionName);

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
        description: meetup.description,
      })),
    },
    revalidate: 60, // in seconds
  };
};

// export const getServerSideProps = async (context) => {
//   const request = context.req;
//   const response = context.res;
//   // run always after deployment
//   return {
//     props: DUMMY_MEETUPS,
//   };
// };

export default HomePage;
