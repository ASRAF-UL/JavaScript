import React, { useEffect, useState } from "react";
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
const options = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "In Active" },
  { value: "deleted", label: "Delete" }
];

const schema = yup.object().shape({
  status: yup
    .object()
    .shape({
      label: yup.string().required("status is required (from label)"),
      value: yup.string().required("status is required")
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required("status is required (from outter null check)")
});

const UserProfile = (props) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => console.log('Here: ', data, props);
  const { classes } = props;
  return (
    <div className="App">
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Issue Instant Pass</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <div className="veh-status">
                      <span>(Entry/Exit) Type</span>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            // defaultValue={options[0]}
                            {...field}
                            isClearable // enable isClearable to demonstrate extra error handling
                            isSearchable={false}
                            className="react-dropdown"
                            classNamePrefix="dropdown"
                            options={options}
                          />
                        )}
                      />
                      <p style={{
                        color: 'red'
                      }}>{errors.status?.message || errors.status?.label.message}</p>
                    </div>
                  </GridItem>
                </GridContainer>
                <button type='Submit'>Submit</button>
              </CardBody>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
export default withStyles(useStyles)(UserProfile);
