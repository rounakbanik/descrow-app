import { useState } from 'react';
import './ContractForm.css';

const ContractForm = (props) => {

    const [buyer, setBuyer] = useState('');
    const [seller, setSeller] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

    const buyerHandler = e => setBuyer(e.target.value);
    const sellerHandler = e => setSeller(e.target.value);
    const priceHandler = e => setPrice(e.target.value);

    const cancelHandler = () => {
        props.onCancel();
    }

    const formSubmitHandler = (e) => {

        e.preventDefault();
        setError(null);

        // Form validation
        if (buyer.trim().length > 0 && seller.trim().length > 0 && !isNaN(Number(price))) {

            const data = { buyer, seller, price }
            // Mine
            props.onFormSubmit(data);

        }
        else {
            setError('Please enter valid inputs!');
            return;
        }
    }

    return (
        <div className='form-container'>
            <h2>Create New Contract</h2>
            <form onSubmit={formSubmitHandler}>
                <div className='form-control'>
                    <label htmlFor='buyer'>Buyer Address</label>
                    <input type='text' name='buyer' required onChange={buyerHandler} value={buyer}></input>
                </div>
                <div className='form-control'>
                    <label htmlFor='seller'>Seller Address</label>
                    <input type='text' name='buyer' required onChange={sellerHandler} value={seller}></input>
                </div>
                <div className='form-control'>
                    <label htmlFor='price'>Price (in MATIC)</label>
                    <input type='number' name='price' required onChange={priceHandler} value={price}></input>
                </div>
                {error && <p className='error-message'>{error}</p>}
                <div className='button-container'>
                    <button className='submitBtn' type='submit'>Submit</button>
                    <button className='cancelBtn' onClick={cancelHandler}>Cancel</button>
                </div>
            </form>
        </div>
    )

}

export default ContractForm;