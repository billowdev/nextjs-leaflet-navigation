import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, List, ListItem, ListItemText } from '@material-ui/core';
import {BuildingPayload} from "@/models/building.model";
type Props = {
  open: boolean;
  onClose: () => void;
  nodes: BuildingPayload[];
  onSelect: (node: string) => void;
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function ModalList({ open, onClose, nodes, onSelect }: Props) {
  const classes = useStyles();

  const handleListItemClick = (node: string) => {
    onSelect(node);
    onClose();
  };

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2>เลือกปลายทาง</h2>
          <List component="nav">
            {nodes.map((node, index) => (
              <ListItem button key={index} onClick={() => handleListItemClick(node.bid)}>
                <ListItemText primary={node.name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Fade>
    </Modal>
  );
}

export default ModalList;
