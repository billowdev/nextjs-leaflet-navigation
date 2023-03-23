import Layout from "@/components/Layouts/Layout";
import { BuildingPayload } from "@/models/building.model";
import { getBuilding, getBuildings } from "@/services/buildingService";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { Field, Form, Formik, FormikProps} from "formik";
import { TextField } from "formik-material-ui";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState} from "react";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { updateBuilding } from "@/store/slices/buildingSlice";
import toast, { Toaster } from "react-hot-toast";
import withAuth from "@/components/withAuth";
import { IconOptions, LatLng, LatLngExpression } from 'leaflet';
import { Switch } from '@material-ui/core';
import {isServer} from '@/utils/common.util'
import FormControlLabel from '@material-ui/core/FormControlLabel';

export interface BuildingPayloadC {
	bid: string
	desc: string
	id: number
	is_node: boolean
	lat?: string
	lng?: string
	name: string
	image: string
  }
  



const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false, // disable server-side rendering
});

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false, // disable server-side rendering
});

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false, // disable server-side rendering
});
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false, // disable server-side rendering
});



const AddBuilding = () => {

  const [currentLatLng, setCurrentLatLng] = React.useState<[number, number]>([17.18898481078793, 104.0896523550969]);
  const [currentLat, setCurrentLat] = React.useState<number>(17.18898481078793);
  const [currentLng, setCurrentLng] = React.useState<number>(parseFloat(104.0896523550969));

  const center: LatLngExpression = [currentLatLng[0], currentLatLng[1]];
  const zoom: number = 16;

  const handleMarkerDragEnd = (event: any) => {
    console.log([parseFloat(event.target.getLatLng()['lat']), parseFloat(event.target.getLatLng()['lng'])])
    setCurrentLat(parseFloat(event.target.getLatLng()['lat']));
    setCurrentLng(parseFloat(event.target.getLatLng()['lng']));
    setCurrentLatLng([parseFloat(event.target.getLatLng()['lat']), parseFloat(event.target.getLatLng()['lng'])])
  }




  const router = useRouter();
  const dispatch = useAppDispatch();
  const showForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    isValid,
    setSubmitting,
  }: FormikProps<BuildingPayload>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
             เพิ่มข้อมูลอาคาร
            </Typography>
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="bid"
              type="text"
              label="รหัสอาคาร/โหนด"
            />
   
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="name"
              type="text"
              label="ชื่ออาคาร"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              component={TextField}
              name="desc"
              type="text"
              label="รายละเอียด"
            />
            <br />
           <Field
              style={{ marginTop: 16 }}
              fullWidth
              value={currentLat}
              component={TextField}
              onChange={(e: React.ChangeEvent<any>) => {
                e.preventDefault();
                const newLat = parseFloat(e.target.value);
                setCurrentLat(newLat);
              }}
              name="lat"
              type="text"
              label="ละติจูด"
            />
            <br />
            <Field
              style={{ marginTop: 16 }}
              fullWidth
              value={currentLng}
              onChange={(e: React.ChangeEvent<any>) => {
                e.preventDefault();
                setCurrentLng(parseFloat(e.target.value));
                setFieldValue("lng", currentLng.toString());
              }}
              component={TextField}
              name="lng"
              type="text"
              label="ลองจิจูด"
            />
            <br />

     <FormControlLabel
            control={
              <Field
                name="is_node"
                render={({ field }) => (
                  <Switch
                    disabled={false}
                    {...field}
                    checked={values.is_node}
                    onBlur={(e: React.ChangeEvent<any>) => {
                      e.preventDefault();
                      const { name, value } = e.target;
                      setFieldTouched(name, true);
                    }}
                    onChange={(e: React.ChangeEvent<any>) => {
                      e.preventDefault();
                      const { name, checked } = e.target;
                      setFieldValue(name, checked);
                    }}

                  />
                )}
              />
            }
            label="เป็นข้อมูลสถานที่หรืออาคารใช่หรือไม่"
          />

          </CardContent>
          <CardActions>
            <Button
              disabled={!isValid}
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginRight: 1 }}
            >
              เพิ่ม
            </Button>
            <Link href="/panel/buildings" passHref>
              <Button variant="outlined" fullWidth>
                ยกเลิก
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Form>
    );
  };

    

  const initialValues: BuildingPayload =  {
    name: "",
    desc:"",
    bid: "",
    image: "",
    is_node: false,
    lat: currentLat,
    lng: currentLng
  }

  return (
    <Layout>
      <Formik
        validate={(values) => {
          let errors: any = {};
          if (!values.bid) errors.bid = "กรุณากรอกรหัสโหนด";
          if (!values.name) errors.name = "กรุณากรอกชื่ออาคาร";
        
          return errors;
        }}
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
       
           //   const createStatus = await dispatch(createBuilding(newUpdateLatLng))
          // console.log(newUpdateLatLng)
        const newValues = {...values, ...{lat:currentLat}, ...{lng:currentLng}}   
       console.log("=================")
          console.log(newValues)
          console.log("=================")
          // if (updateStatus.meta.requestStatus === "fulfilled") {
          //   toast.success("เพิ่มข้อมูลอาคารสำเร็จ")
          //   router.push("/panel/buildings")
          // }
          setSubmitting(false);
        }}
      >
        {(props) => showForm(props)}
      </Formik>

      <MapContainer center={center} zoom={zoom} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

       <Marker position={center} draggable={true} eventHandlers={{
          dragend: handleMarkerDragEnd
        }}
        >     

          <Popup autoClose={false}>
        <span>โหนด</span>
      </Popup></Marker> 

      </MapContainer>

      

    </Layout>
  );
};

export default withAuth(AddBuilding);
