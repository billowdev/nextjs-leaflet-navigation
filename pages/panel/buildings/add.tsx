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
import Link from "next/link";
import React, { useEffect, useState} from "react";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import { useAppDispatch } from "@/store/store";
import { createBuilding } from "@/store/slices/buildingSlice";
import toast, { Toaster } from "react-hot-toast";
import withAuth from "@/components/withAuth";
import { IconOptions, LatLng, LatLngExpression } from 'leaflet';
import { Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { buildingImageURL } from '@/utils/common.util'
  

  interface Props {
    accessToken?: string
    allBuildings: BuildingPayload[]

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



const AddBuilding = ({ accessToken, allBuildings }: Props) => {

  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [currentLatLng, setCurrentLatLng] = React.useState<[number, number]>([17.18898481078793, 104.0896523550969]);
  const [currentLat, setCurrentLat] = React.useState<number>(17.18898481078793);
  const [currentLng, setCurrentLng] = React.useState<number>(104.0896523550969);
  const initialValues: BuildingPayload =  {
    name: "",
    desc:"",
    bid: "",
    image: "",
    is_node: false,
    lat: currentLat.toString(),
    lng: currentLng.toString()
    
  }
  const [addValue, setAddValue] = React.useState<BuildingPayload>(initialValues);

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
    isValid
   
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
                const newLat = parseFloat(e.target.value);
                setCurrentLat(newLat);
                setFieldValue("lat", newLat);
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
              const newLng = parseFloat(e.target.value);
              setCurrentLng(newLng);
              setFieldValue("lng", newLng);
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
                        setFieldTouched(name, value);
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

  const showDialog = () => {
    return (
      <Dialog
        open={openDialog}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <br />
          คุณต้องการเพิ่มข้อมูลใช่หรือไม่? : {addValue.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          การเพิ่มข้อมูลโหนดอาจจะกระทบกับระบบนำทาง
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="info">
            ยกเลิก
          </Button>
          <Button onClick={handleAddConfirm} color="primary">
            เพิ่มข้อมูล
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleAddConfirm = async () => {
       console.log(addValue)
      let data : FormData = new FormData();
      data.append("bid", String(addValue.bid));
      data.append("desc", String(addValue.desc));
      data.append("is_node", String(addValue.is_node));
      data.append("lat", String(currentLat));
      data.append("lng", String(currentLng));
      data.append("name", String(addValue.name));
      if (addValue.file) {
        data.append("file", addValue.file);
      }
      const createStatus = await dispatch(createBuilding({data, accessToken}))
      if (createStatus.meta.requestStatus === "fulfilled") {
        toast.success("เพิ่มข้อมูลอาคารสำเร็จ")
        router.push("/panel/buildings")
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
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          setAddValue(values)
          setOpenDialog(true);
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
        <span>โหนดที่กำลังจะเพิ่ม</span>
      </Popup></Marker> 

  {
              allBuildings
              .filter(bd => bd.lat !== currentLat.toString() || bd.lng !== currentLng.toString())
              .map(({ bid, name, desc, lat, lng, image }) => (
                <Marker 
                key={bid} 
                position={[parseFloat(lat), parseFloat(lng)]}                
                >
                  <Popup key={bid}>
                    <div>
                      <h3>{bid}</h3>
                      <h3>{name}</h3>
                      <p>{desc}</p>
                    </div>
                  </Popup>
                </Marker>
              ))
              }

      </MapContainer>
      {showDialog()}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
    const accessToken = context.req.cookies['access_token']
    const allBuildings = await getBuildings();
    return {
      props: {
        accessToken,
        allBuildings
      },
    };
  } 
export default withAuth(AddBuilding);

