import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { CONFIGS } from "../../appSettings";
import React from "react";
import Head from "next/head";

const MeetupDetails = (props) => {
  return (
    <React.Fragment>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </Head>
      <MeetupDetail
        image={props.image}
        title={props.title}
        key={props.id}
        address={props.address}
        description={props.description}
      />
    </React.Fragment>
  );
};

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(CONFIGS.mongoDb.connectionString);
  const db = client.db();

  const meetupsCollection = db.collection(CONFIGS.mongoDb.collectionName);

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async (context) => {
  // code executed during build process, never on client-side
  // can be used to fetch data from API
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(CONFIGS.mongoDb.connectionString);
  const db = client.db();

  const meetupsCollection = db.collection(CONFIGS.mongoDb.collectionName);

  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  client.close();

  return {
    props: {
      image: meetup.image,
      title: meetup.title,
      id: meetup._id.toString(),
      address: meetup.address,
      description: meetup.description,
    },
    revalidate: 60, // in seconds
  };
};

export default MeetupDetails;
