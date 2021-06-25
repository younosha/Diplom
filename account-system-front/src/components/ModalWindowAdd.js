import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Field } from "react-final-form";
import { Container, Button, TextField } from "@material-ui/core";

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    underlineInput: {
      "& .MuiInputBase-root": {
        "& input": {
          boxShadow: "none",
          borderBottom: "none",
          paddingLeft: "15px",
          marginBottom: 0,
          "&:focus": {
            borderBottom: "none !important",
            boxShadow: "none !important",
          },
        },
      },
    },
  }));
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (values) => {
    props.onSubmit(values);
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Добавить трату
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" style={{ textAlign: "center" }}>
          Добавление траты
        </DialogTitle>
        <DialogContent>
          <Container maxWidth="md" className={classes.root}>
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, form, submitting, values }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="productname">
                    {({ input, meta }) => (
                      <div>
                        <TextField
                          error={meta.error && meta.touched}
                          helperText={
                            meta.error && meta.touched ? meta.error : ""
                          }
                          {...input}
                          classes={{
                            root: classes.underlineInput,
                          }}
                          required
                          variant="outlined"
                          margin="normal"
                          id="what"
                          label="На что вы потратили?"
                          fullWidth
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="price">
                    {({ input, meta }) => (
                      <div>
                        <TextField
                          error={meta.error && meta.touched}
                          helperText={
                            meta.error && meta.touched ? meta.error : ""
                          }
                          {...input}
                          classes={{
                            root: classes.underlineInput,
                          }}
                          required
                          variant="outlined"
                          margin="normal"
                          id="how"
                          label="Сколько вы потратили?"
                          fullWidth
                        />
                        <Field name="date">
                          {({ input, meta }) => (
                            <div>
                              <TextField
                                error={meta.error && meta.touched}
                                helperText={
                                  meta.error && meta.touched ? meta.error : ""
                                }
                                {...input}
                                classes={{
                                  root: classes.underlineInput,
                                }}
                                required
                                variant="outlined"
                                margin="normal"
                                id="date"
                                label="Дата траты"
                                fullWidth
                                type="date"
                                className={classes.textField}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </div>
                          )}
                        </Field>

                        <div className="buttons">
                          <Button
                            style={{ marginLeft: "55px" }}
                            type="submit"
                            disabled={submitting}
                            variant="contained"
                            color="primary"
                            className="btnLog"
                          >
                            Добавить
                          </Button>
                        </div>
                      </div>
                    )}
                  </Field>
                </form>
              )}
            />
          </Container>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
