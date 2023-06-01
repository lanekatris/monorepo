// import React from "react";
//
// // @ts-ignore
// export default function ViewDiscPage({ params }) {
//   console.log("prams", params);
//   return <h1>hi</h1>;
// }

import React from "react";
import { useForm } from "react-hook-form";
import {
  DiscDto, useDeleteDiscMutation,
  useGetDiscQuery,
  useGetDiscsQuery,
  useUpdateDiscMutation
} from "../../gql/generated";
import { ApolloProvider } from "@apollo/client";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { darkTheme } from "../index";
import { navigate } from "gatsby";

import { Link } from "gatsby-theme-material-ui";

function EditDisc({ disc }: { disc: DiscDto }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiscDto>({ defaultValues: disc });
  const [update, { loading, error }] = useUpdateDiscMutation();
  const [removeMutation] = useDeleteDiscMutation({variables:{
    discId: disc.id
    }})
  const onSubmit = async (data: DiscDto) => {
    console.log('onsubmit', data)
    await update({
      variables: {
        input: {
          number: +data.number,
          discId: data.id,
          userId: data.userId,
          model: data.model,
          brand: data.brand,
          color: data.color,
          weight: data.weight? +data.weight: data.weight,
          price: data.price ? +data.price : data.price,
        },
      },
    });
    navigate("/discs");
  };
  console.log(errors);

  const remove = async (e) => {
    e.preventDefault()
    // console.log('delete me')
    await removeMutation()
    navigate('/discs')
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input autoFocus placeholder="number" type="number" {...register("number", {})} />
        <input placeholder="brand" type="text" {...register("brand", {})} />
        <input placeholder="color" type="text" {...register("color", {})} />
        <input placeholder="disc type" type="text" {...register("discType", {})} />
        <input placeholder="model" type="text" {...register("model", {})} />
        <input placeholder="price" type="text" {...register("price", {})} />
        <input placeholder="weight" type="number" {...register("weight", {})} />

        {error && <div>{JSON.stringify(error)}</div>}
        <input type="submit" disabled={loading} />
        <hr/>

        <button onClick={remove}>Delete</button>
        <hr/>
      </form>
      <Link to="/discs">Go to Discs</Link>
    </>
  );
}

function WrappedEditDisc({ id }: { id: string }) {
  const { data, loading, error } = useGetDiscQuery({
    variables: {
      id,
    },
    fetchPolicy: "network-only",
  });
  return data?.disc ? <EditDisc disc={data.disc} /> : null;
}

export default function App({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    // <ApolloProvider client={client}>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box p={3}>
          <Typography variant="h4">Edit Disc</Typography>
        </Box>
        <WrappedEditDisc id={id} />
      </Container>
    </ThemeProvider>
    // </ApolloProvider>
  );
}
