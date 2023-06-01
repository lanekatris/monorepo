import { Unauthenticated } from '@site/src/components/unauthenticated';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/components/useAuth';
import { CreditScore } from '@site/src/components/creditScore';
import { HealthObservation } from '@site/src/components/healthObservation';
import { AdventureCreate } from '@site/src/components/adventureCreate';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useSdk } from "@site/src/components/useSdk";
import {v4 as uuid} from 'uuid'

function EventsPageInner() {
  const { token } = useAuth();
  return (
    <Layout title="Events Page">
      <main style={{ margin: '0 auto', width: 500, marginTop: '1em' }}>
        {!token && <Unauthenticated />}
        {token && (
          <>
            <h1>📜 Record Some Data 📜</h1>
            <CreditScore />
            <br />
            <HealthObservation />
            <br />
            <AdventureCreate />
            <br />
            <CarChooser />
            <br/>
            <br />
            <ComputerSleeper />
            <br />
            <br />
          </>
        )}
      </main>
    </Layout>
  );
}

export default function EventsPage(): JSX.Element {
  return <BrowserOnly>{() => <EventsPageInner />}</BrowserOnly>;
}

function ComputerSleeper():JSX.Element{
  const sdk = useSdk();
  const onSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('go to sleep')
    sdk.sleepComputer();
  }, [sdk.sleepComputer])

  return <>
    <h3>Put computer to sleep</h3>
    <form onSubmit={onSubmit}>
      <button type="submit">Go to sleep</button>
    </form>
  </>
}

function CarChooser() : JSX.Element {
  const sdk = useSdk();
  const [state, setState] = useState({
    isAdding: false,
    newVehicleName: '',
    vehicles: []
  })

   useEffect(() => {
    async function getVehicles() {
      const result = await sdk.vehicles();
      setState({ ...state, vehicles: result.vehicles })
    }
  getVehicles();
    // return result.vehicles;
  }, [setState])

  console.log('vehicles', state)

  const toggleAdd = () =>{
    setState({...state, isAdding: !state.isAdding})
  }

  const vehicleDriven = async (vehicleId: string) => {
    console.log('vehicle driven', vehicleId)
    const result = await sdk.vehicleDriven({
      input: {
        // vehicleId: '6FFE78A8-8784-4971-9A58-C28F355FDA3E',
        vehicleId,
        userId: 'a80cf46b-c842-4b75-8f4a-38e4699301c0',
        date: new Date().toUTCString()
      }
    });
  }

  const createVehicle = async (e) => {
    e.preventDefault()

    const result = await sdk.vehicleNameUpdated({input:{
      name: state.newVehicleName,
      vehicleId: uuid(),
        userId: 'a80cf46b-c842-4b75-8f4a-38e4699301c0',
        date: new Date().toUTCString()
      }})
    console.log('result', result)
  }

  // get vehicles
  // Create vehicle
  return <>
    <h3>Vehicle Driven</h3>
    {/*{!state.isAdding && <>*/}
      <ul>
        {state.vehicles.map(vehicle => <li key={vehicle.id}>{vehicle.name} ({vehicle.lastDriven})<button onClick={() => vehicleDriven(vehicle.id)}>Driven</button></li>)}
        {/*<option>Honda</option>*/}
        {/*<option>Tundra</option>*/}
        {/*<option>Equinox</option>*/}
      </ul>
      <button onClick={toggleAdd}>Add New Car</button>
    {/*</>}*/}

    {state.isAdding && <>
      <form onSubmit={createVehicle}><input value={state.newVehicleName} onChange={e => setState({...state, newVehicleName: e.target.value})} /><button type="submit">Create</button></form>
      {/*<button onClick={toggleAdd}>Cancel</button>*/}
    </>}

  </>
}
