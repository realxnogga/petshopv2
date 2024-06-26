

// ViewProductModal.js
import React, { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { InsertAddToCartDataThunk, clearIsAddToCartDataInserted, GetAddToCartDataThunk, isAddToCartDataInsertedTemp } from '../../feature/client/addtocartSlice';
import { InsertBuyDataThunk, clearIsBuyDataInserted, GetBuyDataThunk, GetAllBuyDataThunk, isBuyDataInsertedTemp } from '../../feature/client/clientbuySlice';
import { UpdateProductStockThunk } from '../../feature/admin/adminproductSlice';
import { userDataTemp } from '../../feature/client/clientloginSlice';
import { ShowToast } from '../../component/admin/toaster';
import { whatIsClickedInClientSidebarState } from '../../feature/client/clientsidebarSlice';
import { GetProductDataThunk } from '../../feature/admin/adminproductSlice';
import { addToCartProductDataTemp } from '../../feature/client/addtocartSlice';

export const ClientViewProductModal1 = ({ selectedProduct }) => {
    const dispatch = useDispatch();
    const userdata = useSelector(userDataTemp);
    const [quantity, setQuantity] = useState(1);

    const [paymentMode, setPaymentMode] = useState('');
    console.log(paymentMode)

    let clientID, clientusername, clientprofile, clientaddress;

    if (Object.keys(userdata).length !== 0) {
        clientID = userdata.clientID;
        clientusername = userdata.clientusername;
        clientprofile = userdata.clientprofile;
        clientaddress = userdata.clientaddress;
    }

    // for checkout button
    const handleCheckoutFunc = () => {
        selectedProduct.forEach(item => {
            const productID = item.addtocartproductID;
            const producttotalstock = item.addtocartproductstock - quantity;

            const buyDataTemp = {
                productID: productID,
                clientID: clientID,
                clientusername: clientusername,
                productname: item.addtocartproductname,
                productsize: item.addtocartproductsize,
                productquantity: quantity,
                producttotalprice: item.addtocartproductprice * quantity,
                clientaddress: clientaddress,
                paymentMode: paymentMode,
            };

            dispatch(InsertBuyDataThunk({ buyDataTemp }));
            dispatch(UpdateProductStockThunk({ productID, producttotalstock }));
        });
    };

    const isBuyDataInserted = useSelector(isBuyDataInsertedTemp);
    useEffect(() => {
        if (isBuyDataInserted === true) {
            ShowToast('checkout success', 'success');
            document.getElementById('viewProductModal').close();
            dispatch(clearIsBuyDataInserted());

            dispatch(GetAllBuyDataThunk());
            dispatch(GetProductDataThunk()); //get all updated product after clicking the checkout btn
            dispatch(GetBuyDataThunk(clientusername));
            dispatch(whatIsClickedInClientSidebarState('yourorder'));
        }
        if (isBuyDataInserted === false) {
            ShowToast('operation failed.', 'error');
            document.getElementById('viewProductModal').close();
            dispatch(clearIsBuyDataInserted());
        }
    }, [isBuyDataInserted]);


    return (
        <>
        <dialog id="viewProductModal" className="modal">
            <div className="modal-box h-fit w-fit max-h-full max-w-full mo:h-full mo:w-full mo:rounded-none rounded-none p-5 flex items-center mo:items-start justify-center rounded-xl">
                <IoCloseSharp onClick={() => { document.getElementById('viewProductModal').close(); }}
                    className='absolute top-4 right-4 text-2xl hover:bg-red-500 hover:text-white' />
                {selectedProduct.map((item) => (
                    <section key={item.addtocartprimarykey} className='h-[30rem] w-[60rem] max-w-full flex flex-wrap'>
         
                        <div className={`h-full w-[30rem] bg-cover bg-center flex items-center justify-center overflow-hidden bg-[url('../../asset/admin/productimage/${item.addtocartproductimage}')]`}>
                        </div>

                        <div className='h-full w-[30rem] flex flex-col justify-evenly gap-y-5 p-8 mo:gap-y-2 mo:p-4'>
                            <p className='text-5xl font-bold '>{item.addtocartproductname}</p>
                            <p className='text-2xl'>Size: {item.addtocartproductsize}</p>
                            <p className='text-2xl'>Available Stock: {item.addtocartproductstock - quantity}</p>
                            <div className='h-fit max-h-[14rem] w-full overflow-scroll noScrollbar'>
                                <p>Description: {item.addtocartproductdescription}</p>
                            </div>
                            {/* <p>Quantity:
                                <input
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    type="number" className="h-[2.5rem] w-[5rem] ml-2 outline-none rounded-sm border border-gray-400 px-2" />
                            </p> */}
                            <p className='font-semibold text-3xl'>₱{item.addtocartproductprice * quantity}.00</p>
                            <div className='flex gap-x-3'>
                                <button onClick={() => { document.getElementById('placeOrderModal').showModal(); }} className='p-2 bg-blue-500 hover:bg-blue-400 duration-700 text-white'>Checkout</button>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </dialog>

          {/* place order modal */}
          <dialog id="placeOrderModal" className="modal">
          <div className="modal-box h-fit w-fit rounded-none p-0 flex flex-col gap-y-4 items-center justify-center p-5 rounded-xl">
              <IoCloseSharp onClick={() => { document.getElementById('placeOrderModal').close(); }} className="absolute top-4 right-4 text-2xl hover:bg-red-500" />

              <section className='flex flex-col gap-y-5 p-5'>
                  {
                      selectedProduct.map((item) => (
                          <>
                              <p className='text-2xl'>Available Stock: {item.addtocartproductstock - quantity}</p>
                              <p className='font-semibold text-3xl'>₱{item.addtocartproductprice * quantity}.00</p>
                          </>
                      ))
                  }
                  <p>Quantity:
                      <input
                      min={1}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          type="number" className="h-[2.5rem] w-[5rem] ml-2 outline-none rounded-sm border border-gray-400 px-2" />
                  </p>

                  <div className='flex'>
                      <div className='flex w-[50%] gap-x-2'>
                          <input onChange={(e) => setPaymentMode(e.target.value)} value={'cod'} type="radio" name='paymentmethod'/>
                          <img src="../../asset/paymentmethodImg/cod.png" alt="" className='h-[3rem]' />
                      </div>

                      <div className='flex w-[50%] gap-x-2'>
                          <input onClick={() => {document.getElementById('qrModal').showModal();}} onChange={(e) => setPaymentMode(e.target.value)} value={'gcash'} type="radio" name='paymentmethod'/>
                          <img src="../../asset/paymentmethodImg/gcash.png" alt="" className='h-[3rem]' />
                      </div>

                  </div>

                  <div className='flex gap-x-3'>
                      <button onClick={handleCheckoutFunc} className='p-2 bg-blue-500 hover:bg-blue-400 duration-700 text-white'>Place Order</button>
                      <button onClick={() => document.getElementById('placeOrderModal').close()} className='p-2 bg-green-500 hover:bg-green-400 duration-700 text-white'>Cancel</button>
                  </div>

              </section>
          </div>
      </dialog>

       {/* qr modal */}
       <dialog id="qrModal" className="modal">
                <div className="modal-box bg-blue-500 w-fit rounded-none p-0 flex items-center justify-center p-5 rounded-xl">
                    <IoCloseSharp onClick={() => { document.getElementById('qrModal').close(); }} className="absolute top-4 right-4 text-2xl hover:bg-red-500" />
                  
                  <section className='flex flex-col items-center'>
                    <img src="../../asset/qrImg/gcashmahaba.png" alt="" className='h-[4rem]'/>
                    <h3 className='text-white text-2xl'>SCAN TO PAY HERE</h3>
                    <div className='border h-full w-full bg-white rounded-xl flex flex-col items-center p-3 gap-y-1'>
                        <p className='font-semibold text-lg'>Petshop Admin</p>
                        <p className='font-semibold text-lg'>09123456789</p>

                        <img src="../../asset/qrImg/qr.png" alt="" />
                    </div>
                  </section>
                    

                </div>
            </dialog>
        </>
        
    );
};

