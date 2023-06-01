import styles from './index.module.css';

// import {configure} from 'react-apollo-form';
// import PeriqlesForm from 'periqles';
// import {} from 'react-apollo-form/dist/lib/'

// const jsonSchema = require('../../src/apollo-form-json-schema.json')
// import {GraphQLBridge} from 'uniforms-bridge-graphql'
// import { buildASTSchema, parse } from 'graphql';
// import {AutoForm} from 'uniforms'
// import {AutoForm} from 'uniforms-bootstrap5'
// import {AutoForm} from 'uniforms-semantic'
// const schema = `
// type Adventure {
//   activities: [AdventureActivity!]!
//   date: Date!
//   id: ID!
// }
//
// enum AdventureActivity {
//   OUTDOOR_ROCK_CLIMBING
//   VOLLEYBALL
// }
//
// input CreateAdventureInput {
//   activities: [AdventureActivity!]!
//   date: Date
// }
//
// # A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
// scalar Date
//
// type Mutation {
//   adventureCreate(input: CreateAdventureInput!): Boolean!
// }
//
// type Query {
//   anything: ID
// }
//
// `
//
// const schemaType = buildASTSchema(parse(schema)).getType('CreateAdventureInput')
// const bridge = new GraphQLBridge(schemaType, (model: object) => null, {date: {
//   component: () => <h1>asdfasfd</h1>
//   }})
//
// console.log('bridge', bridge)

// const client = new ApolloClient({
//   uri: 'http://localhost:3333/graphql',
//   cache: new InMemoryCache()
// })

// const ApplicationForm = configure<ApolloFormMutationNames>({
//   client: client as any,
//   jsonSchema
// })

/* eslint-disable-next-line */
export interface TestiesProps {}

import React from 'react';
import { useForm } from 'react-hook-form';

function Balls() {
  // const idk = useForm();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
// return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="datetime" placeholder="Date" {...register("Date", {})} />
      <select {...register("Activities", { required: true })}>
        <option value="Volleyball">Volleyball</option>
        <option value="Outdoor Rock Climbing">Outdoor Rock Climbing</option>
      </select>

      <input type="submit" />
    </form>
  );
}

export function Testies(props: TestiesProps) {
  // const mut = gql`
  //   mutation adventureCreate($input: CreateAdventureInput!){
  //     adventureCreate(input: $input)
  //   }
  // `
  //
  // const [create, response] = useMutation(mut );

  return (
    <div className={styles['container']}>
      <h1>Welcome to Testies!</h1>
      {/*<ApplicationForm data={{}} ui={{}} config={{*/}
      {/*  mutation:{*/}
      {/*    name: 'adventureCreate',*/}
      {/*    document: gql`*/}
      {/*       mutation adventureCreate($input: CreateAdventureInput!){*/}
      {/*       adventureCreate(input: $input)*/}
      {/*       }*/}
      {/*  `*/}
      {/*  }*/}
      {/*}} />*/}

        {/*<PeriqlesForm mutationName='adventureCreate' useMutation={create} />*/}
    {/*<AutoForm schema={bridge} />*/}
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username" type="text" placeholder="Username" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password" type="password" placeholder="******************" />
              <p className="text-red-500 text-xs italic" >Please choose a password.</p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button">
              Sign In
            </button>
            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
<Balls />

    </div>
  );
}

export default Testies;
