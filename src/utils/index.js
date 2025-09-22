
// Import SweetAlert2 for modal functionality
import Swal from 'sweetalert2';

const portalUrl = 'https://3f8331aabf12.ngrok-free.app';

// Storage helper functions
const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const removeStorage = (key) => {
  if (key) {
    localStorage.removeItem(key);
  } else {
    localStorage.clear();
  }
};

// Global variables
let sessionExpired = false;
const tokenKey = "authToken";
const isEncrypted = "false";

// Decryption function (placeholder)
const decryptData = (data, salt, key) => {
  return data;
};

// Exception mail function (placeholder)
const exceptionMail = async (data) => {
  return { status: "SUCCESS" };
};

export async function checkStatus(response) {
  setStorage("loginCheck", false);

  const showModal = async (
    message,
    buttonText = "Back",
    showCloseButton = true,
    clearStorage = false,
    showSendMailButton = true
  ) => {
    if (showCloseButton) appendCloseButtonStyle();

    const result = await Swal.fire({
      title: "",
      text: message,
      icon: "warning",
      confirmButtonText: buttonText,
      confirmButtonColor: "#DD6B55",
      showDenyButton: showSendMailButton,
      denyButtonText: showSendMailButton ? `Send Mail` : "",
      denyButtonColor: "rgb(59, 130, 246)",
      showCloseButton,
    });

    if (result.isConfirmed && clearStorage) {
      removeStorage();
      window.location = "/login";
    } else if (
      result.isDenied &&
      (response?.status === 500 ||
        response?.status === 502 ||
        response?.status === 512)
    ) {
      try {
        Swal.fire({
          title: "Sending Email...",
          text: "Please wait while we notify the admin.",
          icon: "info",
          showConfirmButton: false,
          willOpen: () => Swal.showLoading(),
        });

        const res = await exceptionMail({
          obj: {
            exceptionMessage: "Error occurring.",
            exceptionSubject: "Error in DB",
            stackTrace: "Stack trace details go here.",
            subject: "Exception Email",
            exceptionMailServiceEnum: "DB",
          },
        });

        if (res?.status === "SUCCESS") {
          Swal.fire({
            title: "Success!",
            text: "The admin has been notified via email.",
            icon: "success",
            timer: 3000,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "Something went wrong while sending the email.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error sending email:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while trying to send the email.",
          icon: "error",
        });
      }
    }
  };

  const appendCloseButtonStyle = () => {
    const existingStyle = document.getElementById("swal2-close-style");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "swal2-close-style";
      style.innerHTML = `
        .swal2-close {
          font-size: 32px !important;
          top: 10px !important;
          right: 10px !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleDecryption = async (data) => {
    try {
      const decrypted = decryptData(
        data,
        salt,
        "Or-F1IjTa]1LiOt30en36,Py6z5Hz^Z="
      );
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt response data");
    }
  };

  if (!response) return;

  const { status } = response;

  switch (status) {
    case 401: {
      if (!sessionExpired) {
        sessionExpired = true;
        await showModal(
          "Your session has timed out. Please log in again.",
          "Logout",
          false,
          true,
          false
        );
      }
      break;
    }
    case 500:
      await showModal(
        "Something went wrong on our end. Please try again later.",
        "Back",
        true,
        false,
        false
      );
      break;
    case 403:
      await showModal(
        "You don't have permission to access this page.",
        "Back",
        true,
        false,
        false
      );
      break;
    case 512:
      await showModal(
        "An error occurred due to unhandled exceptions or unexpected conditions within the system. The admin will be notified by email.",
        "Back",
        true,
        false,
        true
      );
      break;
    default: {
      const data =
        isEncrypted === "true" ? await response.text() : await response.json();

      if (isEncrypted === "true") {
        return await handleDecryption(data);
      } else {
        if (data.logout) {
          await removeStorage(tokenKey);
          window.open("/", "_self");
          return;
        }
        if (status !== 200) {
          throw { ...data };
        }
        return data;
      }
    }
  }
}

export async function requestPortal(url, options) {
  // const { client = null, project = null, roleId = null, orgId = null } = getLocalStored();
//   const token = getStorage(tokenKey);
  const actualUrl = `${url}`;
  const actualOptions = {
    ...options,
    headers: {
      Authorization: `${"Bearer" + " "}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      "X-Role-Id": "Summa",
      "X-Tenant": "Summa",
      "X-Client": "Summa",
      "X-Org": "Summa",
      "X-Project": "Summa",
      "X-Org-based": "Summa",
      "X-user":"test",
      ...options.headers, // Merge custom headers from options
    },
  };
  return fetch(actualUrl, actualOptions).then(checkStatus);
}