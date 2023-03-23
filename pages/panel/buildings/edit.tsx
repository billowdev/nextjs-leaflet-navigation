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
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-material-ui";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { updateBuilding } from "@/store/slices/buildingSlice";
import toast, { Toaster } from "react-hot-toast";
import withAuth from "@/components/withAuth";
import { IconOptions, LatLng, LatLngExpression } from 'leaflet';
import { Switch, FormControlLabel } from '@material-ui/core';
import { buildingImageURL } from '@/utils/common.util'
import { isServer, getBase64 } from '@/utils/common.util'


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


type Props = {
  building: BuildingPayload;
  allBuildings: BuildingPayload[]
  accessToken: string
  // building: BuildingPayloadC;
  // allBuildings: BuildingPayloadC[]
};





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



const Edit = ({ building, allBuildings, accessToken }: Props) => {





  const [currentLat, setCurrentLat] = React.useState<number>(parseFloat(building.lat));
  const [currentLng, setCurrentLng] = React.useState<number>(parseFloat(building.lng));

  const [currentLatLng, setCurrentLatLng] = React.useState<[number, number]>([parseFloat(building.lat), parseFloat(building.lng)]);
  const center: LatLngExpression = [currentLatLng[0], currentLatLng[1]];
  const zoom: number = 16;

  const handleMarkerDragEnd = (event: any) => {
    // console.log([parseFloat(event.target.getLatLng()['lat']), parseFloat(event.target.getLatLng()['lng'])])
    setCurrentLat(event.target.getLatLng()['lat']);
    setCurrentLng(event.target.getLatLng()['lng']);
    setCurrentLatLng([parseFloat(event.target.getLatLng()['lat']), parseFloat(event.target.getLatLng()['lng'])])
  }



  const router = useRouter();
  const dispatch = useAppDispatch();
  const showForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    isValid,
  }: FormikProps<BuildingPayload>) => {
    return (
      <Form>
        <Card>
          <CardContent sx={{ padding: 4 }}>
            <Typography gutterBottom variant="h3">
              แก้ไขข้อมูลอาคาร
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
                setCurrentLat(currentLat);
                setFieldValue("lat", currentLat.toString());
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
                setCurrentLng(currentLng);
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
                  render={({ field }:any) => (
                    <Switch
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

            <div style={{ margin: 16 }}>{showPreviewImage(values)}</div>

            <div>
              <Image
                objectFit="cover"
                alt="product image"
                src="/static/img/logo-h.png"
                width={25}
                height={20}
              />
              <span style={{ color: "#00B0CD", marginLeft: 10 }}>
                Add Picture
              </span>

              <input
                type="file"
                onChange={(e: React.ChangeEvent<any>) => {
                  e.preventDefault();
                  setFieldValue("file", e.target.files[0]); // for upload
                  setFieldValue(
                    "file_obj",
                    URL.createObjectURL(e.target.files[0])
                  ); // for preview image
                }}
                name="image"
                click-type="type1"
                multiple
                accept="image/*"
                id="files"
                style={{ padding: "20px 0 0 20px" }}
              />
            </div>

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
              แก้ไข
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

  const showPreviewImage = (values: any) => {
    if (values.file_obj) {
      return (
        <Image
          objectFit="contain"
          alt="building image"
          src={values.file_obj}
          width={100}
          height={100}
        />
      );
    } else if (values.image) {
      return (
        <Image
          objectFit="contain"
          alt="building image"
          src={buildingImageURL(values.image)}
          width={100}
          height={100}
        />
      );
    }
  };
  return (
    <Layout>
      <Formik
        validate={(values) => {
          let errors: any = {};
          if (!values.bid) errors.bid = "กรุณากรอกรหัสโหนด";
          if (!values.name) errors.name = "กรุณากรอกชื่ออาคาร";
          return errors;
        }}
        initialValues={building}
        onSubmit={async (values, { setSubmitting }) => {
          let data : FormData = new FormData();
          data.append("id", String(values.id));
          data.append("bid", String(values.bid));
          data.append("desc", String(values.desc));
          data.append("is_node", String(values.is_node));
         
          data.append("lat", String(currentLat));
          data.append("lng", String(currentLng));
          data.append("name", String(values.name));
          if (values.file) {
            data.append("file", values.file);
            data.append("image", values.file.filename);
          }
          const updateStatus = await dispatch(updateBuilding({id:values.id, body:data, accessToken}))

          if (updateStatus.meta.requestStatus === "fulfilled") {
            toast.success("แก้ไขข้อมูลอาคารสำเร็จ")
            router.push("/panel/buildings")
          }
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
        <span>โหนดที่กำลังแก้ไข</span>
      </Popup></Marker> 


      {/* {allBuildings
      .map(({ bid, name, desc, lat, lng, image }) => (
              <Marker key={bid} position={[parseFloat(lat), parseFloat(lng)]}>
                <Popup>
                  <div>
                    <h3>{bid}</h3>
                    <h3>{name}</h3>
                    <p>{desc}</p>
                  </div>
                </Popup>
              </Marker>
            ))} */}

              {/* {
                allBuildings
                .filter(bd => bd.bid !== building.bid)
                .map(({ bid, name, desc, lat, lng, image }) => (
                  <Marker key={bid} position={[parseFloat(lat), parseFloat(lng)]}>
                    <Popup key={bid}>
                      <div>
                        <h3>{bid}</h3>
                        <h3>{name}</h3>
                        <p>{desc}</p>
                      </div>
                    </Popup>
                  // </Marker>
                ))
              } */}

{/* {allBuildings.map(({ bid, name, desc, lat, lng, image }) => (
        <Marker key={bid} position={[parseFloat(lat), parseFloat(lng)]}  icon={redIcon ?? undefined}>
          <Popup>
            <div>
              <h3>{bid}</h3>
              <h3>{name}</h3>
              <p>{desc}</p>
            </div>
          </Popup>
        </Marker>
      ))} */}
      </MapContainer>

      

    </Layout >
  );
};

export default withAuth(Edit);

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { dataId }: any = context.query;
  if (dataId) {
    const building = await getBuilding(dataId);
    const allBuildings = await getBuildings();
    const accessToken = context.req.cookies['access_token']

    return {
      props: {
        building,
        allBuildings,
        accessToken
      },
    };
  } else {
    return { props: {} };
  }
};
