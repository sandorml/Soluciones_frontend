import React, { useEffect, useState } from "react";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { MenuItem } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import PropTypes from "prop-types";
import { CREATE_CLIENT, UPDATE_CLIENT, GET_SOURCES } from "Query";
import { useMutation, useQuery } from "@apollo/react-hooks";



const styles = {
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

const FormClient = (props) => {
    const { update, onSave, onCancel, autoClean, header } = props;

    const [name, setName] = useState("");
    const [addr, setAddr] = useState("");
    const [phone, setPhone] = useState("");
    const [municip, setMunicip] = useState("");
    const [source, setSource] = useState("");
    const [comment, setComment] = useState("");
    const [id, setId] = useState("");
    const [errorForm, setErrorForm] = useState("");


    useEffect(() => {
        if (update) {
            setName(update.name ? update.name : "");
            setAddr(update.address ? update.address : "");
            setPhone(update.phoneNumber ? update.phoneNumber : "");
            setMunicip(update.municipality ? update.municipality : "");
            setSource(update.source ? update.source.id : "");
            setComment(update.comment ? update.comment : "");
            setId(update.id ? update.id : "");
        }
    }, [update]);

    const [handleMutation, newClient] = useMutation(id ? UPDATE_CLIENT : CREATE_CLIENT);
    const { loading, error, data } = useQuery(GET_SOURCES);

    if (loading) return "Loading...";
    if (error) return "Error...";

    const autoCleanStates = () => {
        if (autoClean) {
            setName("");
            setAddr("");
            setPhone("");
            setMunicip("");
            setSource("");
            setComment("");
            setId("");
        }
    }

    const handleClickGuardar = () => {

        if (!name) {
            setErrorForm("Nombre no puede quedar vacío")
            return;
        }
        if (!source) {
            setErrorForm("Fuente no puede quedar vacía")
            return;
        }
        handleMutation({
            variables: {
                sourceId: source,
                municipality: municip,
                phoneNumber: phone,
                comment: comment,
                address: addr,
                name: name,
                id: id
            }
        }).then(({data}) => {
            autoCleanStates();
            onSave(id ? data.updateClient.client : data.createClient.client);
        });

    }

    const handleClickCancel = () => {
        autoCleanStates();
        onCancel();
    };

    return (

        <Card>
            {header? <CardHeader color="primary">
                <h4 className={styles.cardTitleWhite}>Agregar Cliente</h4>
            </CardHeader>: null}
            <CardBody>
                {errorForm ? <h4>{errorForm}</h4> : null}
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Nombre"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value: name,
                                onChange: ({ target }) => setName(target.value)
                            }}
                        />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Dirección"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value: addr,
                                onChange: ({ target }) => setAddr(target.value)
                            }}
                        />
                    </GridItem>

                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            labelText="Municipio"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                autoWidth: true,
                                value: municip,
                                onChange: ({ target }) => setMunicip(target.value)
                            }}
                            select
                        >
                            <MenuItem value="Arroyo Naranjo">Arroyo Naranjo</MenuItem>
                            <MenuItem value="Boyeros">Boyeros</MenuItem>
                            <MenuItem value="Centro Habana">Centro Habana</MenuItem>
                            <MenuItem value="Cerro">Cerro</MenuItem>
                            <MenuItem value="Cotorro">Cotorro</MenuItem>
                            <MenuItem value="10 de Octubre">10 de Octubre</MenuItem>
                            <MenuItem value="Guanabacoa">Guanabacoa</MenuItem>
                            <MenuItem value="Habana del Este">Habana del Este</MenuItem>
                            <MenuItem value="Habana Vieja">Habana Vieja</MenuItem>
                            <MenuItem value="La Lisa">La Lisa</MenuItem>
                            <MenuItem value="Marianao">Marianao</MenuItem>
                            <MenuItem value="Playa">Playa</MenuItem>
                            <MenuItem value="Plaza de la Revolucion">Plaza de la Revolucion</MenuItem>
                            <MenuItem value="Regla">Regla</MenuItem>
                            <MenuItem value="San Miguel del Padron">San Miguel del Padron</MenuItem>
                        </CustomInput>

                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            labelText="Teléfono"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                value: phone,
                                onChange: ({ target }) => setPhone(target.value)
                            }}
                        />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                            labelText="Fuente"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                autoWidth: true,
                                value: source,
                                onChange: ({ target }) => setSource(target.value)
                            }}
                            select>
                            {data.sources.map(({ id, name }) => (< MenuItem key={id} value={id} > {name}</MenuItem>))}
                        </CustomInput>
                    </GridItem>
                </GridContainer>

                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            labelText="Comentario sobre el cliente "
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                multiline: true,
                                rows: 5,
                                value: comment,
                                onChange: ({ target }) => setComment(target.value)
                            }}
                        />
                    </GridItem>
                </GridContainer>
            </CardBody>
            <CardFooter>
                <Button onClick={handleClickCancel}>Cancel</Button >
                <Button color="primary" onClick={handleClickGuardar}>Guardar</Button >
            </CardFooter>
        </Card >
    )

}


FormClient.propTypes = {
    update: PropTypes.any,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    autoClean: PropTypes.bool,
    header: PropTypes.bool,
};
FormClient.defaultProps = {
    update: false,
    autoClean: true,
    header: false,
    onSave: () => console.log("No tiene implementado onSave"),
    onCancel: () => console.log("No tiene implementado onCancel")
};
export default FormClient;





