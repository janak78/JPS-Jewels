import swal from "sweetalert";

const sendSwal = () => {
  return swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this item!",
    buttons: {
      confirm: {
        text: "Delete",
        className: "swal-button-confirm",
        value: true,
        visible: true,
        closeModal: true,
      },
      cancel: {
        text: "Cancel",
        value: false,
        visible: true,
        className: "swal-button-cancel",
        closeModal: true,
      },
    },
    dangerMode: true,
  }).then((value) => {
    return value; // Returns true if confirmed, false/null if canceled
  });
};

export default sendSwal;
