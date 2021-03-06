import React, {useState,useEffect} from 'react'
import { CssBaseline, Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import useStyles from './styles'
import AddressForm  from './AddressForm';
import PaymentForm  from './PaymentForm';
import { commerce } from '../lib/commerce'


const steps = ['Shipping address', 'Payment details'];


const CheckOut = ({ cart, onCaptureCheckout, order, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const classes = useStyles();
    const [checkoutToken, setCheckoutToken] = useState({});
    const [shippingData, setShippingData] = useState({});
    const history = useHistory();

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    

    useEffect(() => {
      if (cart.id) {
        const generateToken = async () => {
          try {
            const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
  
            setCheckoutToken(token);
           
          } catch {
            if (activeStep !== steps.length) history.push('/');
          }
        };
  
        generateToken();
      }
    }, [cart]);

    const test = (data) => {
      setShippingData(data);
      nextStep()
  
      
    };

    const Confirmation =()=>{
        <div>
            Confirmation
        </div>
    }


    const Form = () => activeStep === 0 ? <AddressForm  CheckoutToken={checkoutToken} 
     test={test}  nextStep={nextStep}  nextStep={nextStep} backStep={backStep} setShippingData={setShippingData}/> :<PaymentForm checkoutToken={checkoutToken} onCaptureCheckout={onCaptureCheckout} shippingData={shippingData}/>
 
    
        
    return (
        <>
              <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />} 
          
        </Paper>
      </main>
    </>
            
     
    )
}

export default CheckOut
