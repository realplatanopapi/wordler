import React from 'react' 

import { toast, ToastContainer as ToastContainerBase, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = () => {
  return <ToastContainerBase autoClose={3000} theme="dark" transition={Slide} position={toast.POSITION.BOTTOM_RIGHT} />
}

export default ToastContainer