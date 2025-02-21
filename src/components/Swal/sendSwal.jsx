import swal from "sweetalert";

const sendSwal = () => {
  return swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this item!",
    icon: "warning",
    buttons: { 
      cancel: "Cancel",
      confirm: {
        text: "Delete",
        closeModal: true,
        className: "swal-button--danger",
      },
    },
    dangerMode: true,
  }).then((value) => {
    return value; // Returns true if confirmed, false/null if canceled
  });
};

export default sendSwal;
