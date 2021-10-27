import React, { useEffect, useState, useRef } from "react";

import { withStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import axios from "axios";
import Select from "react-select";
import "@pathofdev/react-tag-input/build/index.css";
import "./styles.css";
import ReactToPrint from "react-to-print";
import logo from "assets/img/bepz.png";
import { Table } from "reactstrap";
import dateFormat from "dateformat";
import moment from "moment";
import ReactTagInput from "@pathofdev/react-tag-input";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setConstantValue } from "typescript";
const useStyles = () => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  textField: {
    width: "900px",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: "10px",
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    color: "blue",
  },
});
const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgb(230, 230, 230)",
    height: 50,
    // match with the menu
    borderRadius: state.isFocused ? "4px 4px 4px 4px" : 4,
    // Overwrittes the different states of border
    borderStyle: "none",
    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "red" : "blue",
    },
  }),
  menu: (base) => ({
    ...base,
    // override border radius to match the box
    borderRadius: 0,
    // kill the gap
    marginTop: 0,
  }),
  menuList: (base) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
  }),
};
const UserProfile = (props) => {
  const componentRef = useRef();
  const [factories, setFactories] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [duty_officer, setDuty_officer] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [factoryId, setFactoryId] = useState('');
  const [selectedFactory, setSelectedFactory] = useState('');
  const [permissionId, setPermissionId] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [passType, setPassType] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [vehStatus, setVehStatus] = useState([
    { label: "Loaded", value: "Loaded" },
    { label: "Empty", value: "Empty" },
  ]);
  const [entryExitTypes, setENtryExitTypes] = useState([
    { label: "Entry", value: "Entry" },
    { label: "Exit", value: "Exit" },
  ]);
  const [vehicleType, setVehicleType] = useState('');
  const [selectedVehType, setSelectedVehType] = useState('');
  const [regNo, setRegNo] = useState('');
  const [numberPlates, setNumberPlates] = useState([]);
  const [getSingleInstantPassVehicleId, setGetSingleInstantPassVehicleId] = useState('');
  const [pdfData, setPdfData] = useState('');
  const [submittedSingle, setSubmittedSingle] = useState(false);
  const [submittedMultiple, setSubmittedMultiple] = useState(false);
  const [pdfSingleData, setPdfSingleData] = useState('');
  const [responseId, setResponseId] = useState('');
  useEffect(() => {
    const user = localStorage.getItem("user");
    let parsedUser;
    if (user) {
      parsedUser = JSON.parse(user);
      parsedUser = parsedUser.data;
      setDuty_officer(parsedUser.name ? parsedUser.name : null);
    }
    getFactories();
  }, []);
  const getFactories = async () => {
    let result1, result2, result3;
    await axios
      .all([
        axios.get(`http://13.233.159.126:8000/api/factories/all`),
        axios.get(`http://13.233.159.126:8000/api/permission/all`),
        axios.get(`http:///13.233.159.126:8000/api/vehicle_type/get/all`),
      ])
      .then(
        axios.spread((resFactory, resPermission, resVehType) => {
          result1 = resFactory.data.factories;
          console.log("Factory: ", result1);
          result2 = resPermission.data;
          result3 = resVehType.data;
        })
      );

    const factory = result1.map((results) => ({
      value: results.id,
      label: results.name,
    }));
    const permission = result2.map((results) => ({
      value: results.id,
      label: results.name,
    }));
    const type = result3.map((results) => ({
      value: results.id,
      label: results.type,
    }));
    setFactories(factory);
    setPermissions(permission);
    setVehicleTypes(type);
  }
  const handleStatusChange = (event) => {
    setVehicleStatus(event.value);
    setSelectedStatus(event.value);
  };
  const handleFactoryChange = async (event) => {
    setFactoryId(event.value);
    setSelectedFactory(event.label);
  };
  const handlePermissionChange = (event) => {
    setPermissionId(event.value);
    setSelectedPermission(event.label);
  };
  const handlePassTypeChange = (event) => {
    if (event.value === "Entry") {

      getFactories();
      setPassType(event.value);
      setSelectedType(event.value);
      setVehStatus([
        { label: "Loaded", value: "Loaded" },
        { label: "Empty", value: "Empty" },
      ])
    } else {
      setPassType(event.value);
      setSelectedType(event.value);
    }
  };
  const handleVehicleTypeChange = (event) => {
    setVehicleType(event.value);
    setSelectedVehType(event.label);
  };
  const handleNumberplateChange = async (tags) => {
    console.log('Tags for tags: ', tags);
    if (passType === "Exit") {
      setNumberPlates(tags);
      console.log("Tag of index 0: ", tags);
      if (tags.length > 1) {
        const data = {
          regNumber: tags[0],
        };
        await axios
          .post(`http://13.233.159.126:8000/api/gpas-entries/all`, data)
          .then((res) => {
            console.log("Data from entry response: ", res.data);
            let factoryData = [];
            let permissionData = [];
            let typeData = [];
            let factoryId,
              permissionId,
              vehicleType,
              selectedFactory,
              selectedPermission,
              selectedVehType;
            if (res.data) {
              if (res.data.response) {
                setGetSingleInstantPassVehicleId(res.data.response.id)
                factoryData = [
                  {
                    label: res.data.response.gpas_factory.name,
                    value: res.data.factory_id,
                  },
                ];
                permissionData = [
                  {
                    value: res.data.permission_id,
                    label: res.data.response.gpas_number.type,
                  },
                ];
                typeData = [
                  {
                    value: res.data.vehicle_type_id,
                    label: res.data.response.type,
                  },
                ];

                factoryData.map((item) => {
                  factoryId = item.value;
                  selectedFactory = item.label;
                });
                permissionData.map((item) => {
                  permissionId = item.value;
                  selectedPermission = item.label;
                });
                typeData.map((item) => {
                  vehicleType = item.value;
                  selectedVehType = item.label;
                });
              } else {
                setGetSingleInstantPassVehicleId(res.data.vehicle.id)
                factoryData = [
                  {
                    label: res.data.vehicle.factory.name,
                    value: res.data.vehicle.factory_id,
                  },
                ];
                permissionData = [
                  {
                    value: res.data.vehicle.permission_id,
                    label: res.data.vehicle.permission.name,
                  },
                ];
                typeData = [
                  {
                    value: res.data.vehicle_type_id,
                    label: res.data.vehicle.vehicle_type,
                  },
                ];
                factoryData.map((item) => {
                  factoryId = item.value;
                  selectedFactory = item.label;
                });
                permissionData.map((item) => {
                  permissionId = item.value;
                  selectedPermission = item.label;
                });
                typeData.map((item) => {
                  vehicleType = item.value;
                  selectedVehType = item.label;
                });
              }
            }
            setSelectedFactory(selectedFactory);
            setFactoryId(factoryId);
            setPermissionId(permissionId);
            setSelectedPermission(selectedPermission);
            setVehicleType(vehicleType);
            setSelectedVehType(selectedVehType);
            setPassType("Exit");
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        console.log("Tag: ", tags[0]);
        const data = {
          regNumber: tags[0],
        };
        await axios
          .post(`http://13.233.159.126:8000/api/gpas-entries/all`, data)
          .then((res) => {
            console.log("Data from entry response: ", res.data);
            let factoryData = [];
            let permissionData = [];
            let typeData = [];
            let factoryId,
              permissionId,
              vehicleType,
              selectedFactory,
              selectedPermission,
              selectedVehType;
            if (res.data) {
              if (res.data.response) {
                setGetSingleInstantPassVehicleId(res.data.response.id);
                factoryData = [
                  {
                    label: res.data.response.gpas_factory.name,
                    value: res.data.factory_id,
                  },
                ];

                permissionData = [
                  {
                    value: res.data.permission_id,
                    label: res.data.response.gpas_number.type,
                  },
                ];
                typeData = [
                  {
                    value: res.data.vehicle_type_id,
                    label: res.data.response.type,
                  },
                ];
                factoryData.map((item) => {
                  factoryId = item.value;
                  selectedFactory = item.label;
                });
                permissionData.map((item) => {
                  permissionId = item.value;
                  selectedPermission = item.label;
                });
                typeData.map((item) => {
                  vehicleType = item.value;
                  selectedVehType = item.label;
                });
              } else {
                setGetSingleInstantPassVehicleId(res.data.vehicle.id);
                factoryData = [
                  {
                    label: res.data.vehicle.factory.name,
                    value: res.data.vehicle.factory_id,
                  },
                ];
                permissionData = [
                  {
                    value: res.data.vehicle.permission_id,
                    label: res.data.vehicle.permission.name,
                  },
                ];
                typeData = [
                  {
                    value: res.data.vehicle_type_id,
                    label: res.data.vehicle.vehicle_type,
                  },
                ];
                factoryData.map((item) => {
                  factoryId = item.value;
                  selectedFactory = item.label;
                });
                permissionData.map((item) => {
                  permissionId = item.value;
                  selectedPermission = item.label;
                });
                typeData.map((item) => {
                  vehicleType = item.value;
                  selectedVehType = item.label;
                });
              }
            }
            setSelectedFactory(selectedFactory);
            setFactoryId(factoryId);
            setPermissionId(permissionId);
            setSelectedPermission(selectedPermission);
            setVehicleType(vehicleType);
            setSelectedVehType(selectedVehType);
            setPassType("Exit");
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    } else {
      if (tags.length > 1) {
        setNumberPlates(tags);
      } else {
        let plateData = [];
        for (let i = 0; i < tags.length; i += 1) {
          plateData = tags[i].split(/[ \-,\(,\),\=]+/);
        }
        setNumberPlates(plateData);
      }
    }
    console.log("Number plate length: ", typeof tags);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (numberPlates.length > 1) {
      numberPlates.forEach(async (plate) => {
        // console.log("For each values: ", plate);
        await axios.post(
          "http://13.233.159.126:8000/api/ins_pass_vehicles/create",
          {
            reg_number: plate,
            permission_id: permissionId,
            vehicle_type: selectedVehType,
            vehicle_status: vehicleStatus,
            pass_type: passType,
            factory_id: factoryId,
            duty_officer: duty_officer,
          }
        );
      });
      if (passType === "Exit") {
        setPdfData({
          duty_officer: duty_officer,
          numberPlates: numberPlates,
          permission: selectedPermission,
          factory: selectedFactory,
          vehicleType: selectedVehType,
          passType: passType,
          vehicleStatus: vehicleStatus,
          getSingleInstantPassVehicleId:
            getSingleInstantPassVehicleId,
        });
        setSubmittedSingle(false);
        setSubmittedMultiple(true);
      } else {
        setPdfData({
          duty_officer: duty_officer,
          numberPlates: numberPlates,
          permission: selectedPermission,
          factory: selectedFactory,
          vehicleType: selectedVehType,
          passType: passType,
          vehicleStatus: vehicleStatus,
        });
        setSubmittedSingle(false);
        setSubmittedMultiple(true);
      }
      window.confirm("Data submitted successfully..!");
    } else {
      await axios
        .post("http://13.233.159.126:8000/api/ins_pass_vehicles/create", {
          reg_number: numberPlates[0],
          permission_id: permissionId,
          vehicle_type: selectedVehType,
          vehicle_status: vehicleStatus,
          pass_type: passType,
          factory_id: factoryId,
          duty_officer: duty_officer,
        })
        .then(async (res) => {
          console.log("Post Response: ", res.data);
          if (passType === "Exit") {
            setResponseId(res.data.id);
            setPdfSingleData({
              data: res.data,
              getSingleInstantPassVehicleId:
                getSingleInstantPassVehicleId,
            });
            setSubmittedMultiple(false);
            setSubmittedSingle(true);

          } else {
            setResponseId(res.data.id);
            setPdfSingleData(res.data.id);
            setSubmittedMultiple(false);
            setSubmittedSingle(true);
          }
          window.confirm("Data submitted successfully..!");
        })
        .catch((error) => {
          console.log("Error occured", error);
          window.confirm(error.message);
        });
    }
    setRegNo('');
    setVehicleType('');
    setFactoryId('');
    setSelectedFactory('');
    setSelectedPermission('');
    setPermissionId('');
    setSelectedStatus('');
    setVehicleStatus('');
    setSelectedType('');
    setSelectedVehType('');
    setNumberPlates([]);
    setPassType('');
    setGetSingleInstantPassVehicleId('');
  };
  const { classes } = props;
  // const reg_no = register('reg_no', { required: true });
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Issue Instant Pass</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="veh-status">
                    <span>(Entry/Exit) Type</span>
                    <Select
                      styles={customStyles}
                      options={entryExitTypes}
                      placeholder="Select Pass Type..."
                      onChange={handlePassTypeChange}
                      value={entryExitTypes.filter(
                        ({ value }) => value === passType
                      )}
                    />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <div className="veh-status">
                    <span>Registration Number</span>
                    <ReactTagInput
                      tags={numberPlates}
                      onChange={(e) => {
                        handleNumberplateChange(e);
                      }}
                    />
                  </div>
                </GridItem>
              </GridContainer>
              {passType === "Exit" &&
                numberPlates.length ? (
                <div>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Factories List</span>
                        <Select
                          styles={customStyles}
                          options={factories}
                          placeholder="Select a factory..."
                          onChange={handleFactoryChange}
                          value={factories.filter(
                            ({ value }) => value === factoryId
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Permissions List</span>
                        <Select
                          styles={customStyles}
                          options={permissions}
                          placeholder="Select Permission Type..."
                          onChange={handlePermissionChange}
                          value={permissions.filter(
                            ({ value }) => value === permissionId
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Vehicle Status</span>
                        <Select
                          styles={customStyles}
                          options={vehStatus}
                          placeholder="Select Vehicle Status..."
                          onChange={handleStatusChange}
                          value={vehStatus.filter(
                            ({ value }) => value === vehicleStatus
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Vehicle Type</span>
                        <Select
                          styles={customStyles}
                          options={vehicleTypes}
                          placeholder="Select Vehicle Type..."
                          onChange={handleVehicleTypeChange}
                          value={vehicleTypes.filter(
                            ({ value }) => value === vehicleType
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                </div>
              ) : (
                <div>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Factories List</span>
                        <Select
                          styles={customStyles}
                          options={factories}
                          placeholder="Select a Factory..."
                          onChange={handleFactoryChange}
                          value={factories.filter(
                            ({ value }) => value === factoryId
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Permissions List</span>
                        <Select
                          styles={customStyles}
                          options={permissions}
                          placeholder="Select a Permission..."
                          onChange={handlePermissionChange}
                          value={permissions.filter(
                            ({ value }) => value === permissionId
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Vehicle Status</span>
                        <Select
                          styles={customStyles}
                          options={vehStatus}
                          placeholder="Select Vehicle Type..."
                          onChange={handleStatusChange}
                          value={vehStatus.filter(
                            ({ value }) => value === vehicleStatus
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className="veh-status">
                        <span>Vehicle Type</span>
                        <Select
                          styles={customStyles}
                          options={vehicleTypes}
                          placeholder="Select Vehicle Type..."
                          onChange={handleVehicleTypeChange}
                          value={vehicleTypes.filter(
                            ({ value }) => value === vehicleType
                          )}
                        />
                      </div>
                    </GridItem>
                  </GridContainer>
                </div>
              )}
            </CardBody>
            {/* <CardFooter>
              <button className="btn btn-primary" onClick={onSubmit}>
                Submit
              </button>
              <div>
                <ReactToPrint content={() => componentRef.current} trigger={() => <button className="primary">Print</button>} />
                <div style={{ display: 'none' }}>
                  {submittedSingle ? (
                    <ComponentToPrint
                      data={pdfSingleData}
                      ref={componentRef}
                    />
                  ) : (
                    <ComponentToPrintMultiple
                      data={pdfData}
                      ref={componentRef}
                    />
                  )}
                </div>
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};
export default withStyles(useStyles)(UserProfile);
const ComponentToPrint = React.forwardRef((props, ref) => {
  console.log('Proooooooooops: ', props);
  const [data, setData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    if (props.data.data) {
      console.log("..../////......");
      await axios
        .get(
          `http://13.233.159.126:8000/api/ins_pass_vehicles/find/${props.data.data.id}`
        )
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => setError(err.message));
      await axios
        .get(
          `http://13.233.159.126:8000/api/instant-pass-vehicle-entry/${props.data.getSingleInstantPassVehicleId}`
        )
        .then((res) => {
          if (res) {
            setStatusData(res.data);
          }
        })
        .catch((err) => setError(err.message));
    } else {
      await axios
        .get(
          `http://13.233.159.126:8000/api/ins_pass_vehicles/find/${props.data.id}`
        )
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => setError(err.message));
    }
  }
  return (
    <div
      style={{
        margin: "100px",
      }}
      ref={ref}
    >
      <div
        style={{
          paddingBottom: "60px",
          borderBottom: "2px solid black",
        }}
      >
        <div
          style={{
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginTop: "20px",
            border: "2px solid black",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div
              style={{
                display: "grid",
                justifyContent: "initial",
              }}
            >
              <span
                style={{
                  borderBottom: "2px solid black",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Serial No: "}
                {data ? data.id : null}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Entry/Exit: "}
                {data ? data.pass_type : null}
              </span>
              {statusData ? (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {"Status: "}
                  {moment(statusData.entry_time).diff(
                    statusData.instant_gatepass_vehicle
                      ? statusData.instant_gatepass_vehicle
                        .createdAt
                      : null,
                    "hours"
                  ) > 2 ? (
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Delayed Entry
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      Entered Timely
                    </span>
                  )}
                </span>
              ) : null}
            </div>
            <img
              src={logo}
              style={{
                height: "80px",
                alignSelf: "center",
                marginBottom: "30px",
              }}
            />
            <span
              style={{
                border: "2px solid black",
                fontSize: "12px",
                fontWeight: "bold",
                maxHeight: "40px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              User Copy
            </span>
          </div>
          <div
            style={{
              display: "grid",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <span className="text-para">
              Karnaphuli Export Processing Zone
            </span>
            <span className="text-para-two">Karnaphuli, Chittagong</span>
          </div>
          <div
            className="data-row"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Table>
              <thead
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Number Plate
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Vehicle Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Factory Name
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Permission Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Load Status
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.reg_number : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.vehicle_type : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.factory.name : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.permission.name : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.vehicle_status : null}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div
            style={{
              paddingTop: "60px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                display: "grid",
                paddingBottom: "10px",
              }}
            >
              <span>
                Date:{" "}
                {data
                  ? dateFormat(data.createdAt, "mmmm dS, yyyy")
                  : null}
              </span>
              <span>
                Time:{" "}
                {data
                  ? dateFormat(data.createdAt, "h:MM:ss TT")
                  : null}
              </span>
            </div>
            <div>
              <span
                style={{
                  borderTop: "2px solid black",
                }}
              >
                Signature of SO/ASO/Inspector
              </span>
            </div>
            <div
              style={{
                display: "grid",
              }}
            >
              <span
                style={{
                  borderTop: "2px solid black",
                }}
              >
                Signature of Duty Officer
              </span>
              <span
                style={{
                  padding: "5px",
                }}
              >
                {data ? data.duty_officer : null}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          paddingTop: "40px",
        }}
      >
        <div
          style={{
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginTop: "20px",
            border: "2px solid black",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div
              style={{
                display: "grid",
                justifyContent: "initial",
              }}
            >
              <span
                style={{
                  borderBottom: "2px solid black",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Serial No: "}
                {data ? data.id : null}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Entry/Exit: "}
                {data ? data.pass_type : null}
              </span>
              {statusData ? (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {"Status: "}
                  {moment(statusData.entry_time).diff(
                    statusData.instant_gatepass_vehicle
                      ? statusData.instant_gatepass_vehicle
                        .createdAt
                      : null,
                    "hours"
                  ) > 2 ? (
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Delayed Entry
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      Entered Timely
                    </span>
                  )}
                </span>
              ) : null}
            </div>
            <img
              src={logo}
              style={{
                height: "80px",
                alignSelf: "center",
                marginBottom: "30px",
              }}
            />
            <span
              style={{
                border: "2px solid black",
                fontSize: "12px",
                fontWeight: "bold",
                maxHeight: "40px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Office Copy
            </span>
          </div>
          <div
            style={{
              display: "grid",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <span className="text-para">
              Karnaphuli Export Processing Zone
            </span>
            <span className="text-para-two">Karnaphuli, Chittagong</span>
          </div>
          <div
            className="data-row"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Table>
              <thead
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Number Plate
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Vehicle Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Factory Name
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Permission Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Load Status
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.reg_number : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.vehicle_type : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.factory.name : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.permission.name : null}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {data ? data.vehicle_status : null}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div
            style={{
              paddingTop: "60px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                display: "grid",
                paddingBottom: "10px",
              }}
            >
              <span>
                Date:{" "}
                {data
                  ? dateFormat(data.createdAt, "mmmm dS, yyyy")
                  : null}
              </span>
              <span>
                Time:{" "}
                {data
                  ? dateFormat(data.createdAt, "h:MM:ss TT")
                  : null}
              </span>
            </div>
            <div
              style={{
                display: "grid",
              }}
            >
              <span
                style={{
                  borderTop: "2px solid black",
                }}
              >
                Signature of Duty Officer
              </span>
              <span
                style={{
                  padding: "5px",
                }}
              >
                {data ? data.duty_officer : null}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
const ComponentToPrintMultiple = React.forwardRef((props, ref) => {
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    if (props.data) {
      console.log("..../////......");
      await axios
        .get(
          `http://13.233.159.126:8000/api/instant-pass-vehicle-entry/${props.data.getSingleInstantPassVehicleId}`
        )
        .then((res) => {
          if (res) {
            console.log("Data for status: ", res.data);
            setStatusData(res.data);
          }
        })
        .catch((err) => setError(err.message));
    } else {
      setStatusData(null);
    }
  };
  return (
    <div
      style={{
        margin: "100px",
      }}
      ref={ref}
    >
      <div
        style={{
          paddingBottom: "60px",
          borderBottom: "2px solid black",
        }}
      >
        <div
          style={{
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginTop: "20px",
            border: "2px solid black",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div
              style={{
                display: "grid",
                justifyContent: "initial",
              }}
            >
              <span
                style={{
                  borderBottom: "2px solid black",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Serial No: "}
                {Math.floor(1000 + Math.random() * 9000)}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Entry/Exit: "}
                {props.data ? props.data.passType : "null"}
              </span>
              {statusData ? (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {"Status: "}
                  {moment(statusData.entry_time).diff(
                    statusData.instant_gatepass_vehicle
                      ? statusData.instant_gatepass_vehicle
                        .createdAt
                      : null,
                    "hours"
                  ) > 2 ? (
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Delayed Entry
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      Entered Timely
                    </span>
                  )}
                </span>
              ) : null}
            </div>
            <img
              src={logo}
              style={{
                height: "80px",
                alignSelf: "center",
                marginBottom: "30px",
              }}
            />
            <span
              style={{
                border: "2px solid black",
                fontSize: "12px",
                fontWeight: "bold",
                maxHeight: "40px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              User Copy
            </span>
          </div>
          <div
            style={{
              display: "grid",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <span className="text-para">
              Karnaphuli Export Processing Zone
            </span>
            <span className="text-para-two">Karnaphuli, Chittagong</span>
          </div>
          <div
            className="data-row"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Table>
              <thead
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Number Plate
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Vehicle Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Factory Name
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Permission Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Load Status
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {props.data
                        ? props.data.numberPlates.map((item, index) => (
                          <div key={index}>
                            <span
                              style={{
                                borderBottomColor: "black",
                              }}
                            >
                              {item}
                            </span>
                            {", "}
                          </div>
                        ))
                        : "null"}
                    </div>
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.vehicleType : "null"}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.factory : "null"}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.permission : "null"}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.vehicleStatus : "null"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div
            style={{
              paddingTop: "60px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                display: "grid",
                paddingBottom: "10px",
              }}
            >
              <span>Date: {dateFormat(Date.now(), "mmmm dS, yyyy")}</span>
              <span>Time: {dateFormat(Date.now(), "h:MM:ss TT")}</span>
            </div>
            <div>
              <span
                style={{
                  borderTop: "2px solid black",
                }}
              >
                Signature of SO/ASO/Inspector
              </span>
            </div>
            <div
              style={{
                display: "grid",
              }}
            >
              <span
                style={{
                  borderTop: "2px solid black",
                }}
              >
                Signature of Duty Officer
              </span>
              <span
                style={{
                  padding: "5px",
                }}
              >
                {props.data ? props.data.duty_officer : "null"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          paddingTop: "40px",
        }}
      >
        <div
          style={{
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "10px",
            paddingRight: "10px",
            marginTop: "20px",
            border: "2px solid black",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: "20px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div
              style={{
                display: "grid",
                justifyContent: "initial",
              }}
            >
              <span
                style={{
                  borderBottom: "2px solid black",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Serial No: "}
                {Math.floor(1000 + Math.random() * 9000)}
              </span>
              <span
                style={{
                  // border: "2px solid black",
                  // borderRight: "2px solid black",
                  // borderBottom: "2px solid black",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                {"Entry/Exit: "}
                {props.data ? props.data.passType : "null"}
              </span>
              {statusData ? (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  {"Status: "}
                  {moment(statusData.entry_time).diff(
                    statusData.instant_gatepass_vehicle
                      ? statusData.instant_gatepass_vehicle
                        .createdAt
                      : null,
                    "hours"
                  ) > 2 ? (
                    <span
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Delayed Entry
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                      }}
                    >
                      Entered Timely
                    </span>
                  )}
                </span>
              ) : null}
            </div>
            <img
              src={logo}
              style={{
                height: "80px",
                alignSelf: "center",
                marginBottom: "30px",
              }}
            />
            <span
              style={{
                border: "2px solid black",
                fontSize: "12px",
                fontWeight: "bold",
                maxHeight: "40px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Office Copy
            </span>
          </div>
          <div
            style={{
              display: "grid",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <span className="text-para">
              Karnaphuli Export Processing Zone
            </span>
            <span className="text-para-two">Karnaphuli, Chittagong</span>
          </div>
          <div
            className="data-row"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Table>
              <thead
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Number Plate
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Vehicle Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Factory Name
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Permission Type
                  </th>
                  <th
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    Load Status
                  </th>
                </tr>
              </thead>
              <tbody
                style={{
                  height: "60px",
                }}
              >
                <tr>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {props.data
                        ? props.data.numberPlates.map((item, index) => (
                          <div key={index}>
                            <span
                              style={{
                                borderBottomColor: "black",
                              }}
                            >
                              {item}
                            </span>
                            {", "}
                          </div>
                        ))
                        : "null"}
                    </div>
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.vehicleType : "null"}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.factory : "null"}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.permission : "null"}
                  </td>
                  <td
                    style={{
                      border: "2px solid black",
                    }}
                  >
                    {props.data ? props.data.vehicleStatus : "null"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div
            style={{
              paddingTop: "60px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "500",
            }}
          >
            <div
              style={{
                display: "grid",
                paddingBottom: "10px",
              }}
            >
              <span>Date: {dateFormat(Date.now(), "mmmm dS, yyyy")}</span>
              <span>Time: {dateFormat(Date.now(), "h:MM:ss TT")}</span>
            </div>
            <div
              style={{
                display: "grid",
              }}
            >
              <span
                style={{
                  borderTop: "2px solid black",
                }}
              >
                Signature of Duty Officer
              </span>
              <span
                style={{
                  padding: "5px",
                }}
              >
                {props.data ? props.data.duty_officer : null}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
