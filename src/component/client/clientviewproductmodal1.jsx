

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
        <dialog id="viewProductModal" className="modal">
            <div className="modal-box h-fit w-fit max-h-full max-w-full rounded-none p-5 flex items-center justify-center rounded-xl">
                <IoCloseSharp onClick={() => { document.getElementById('viewProductModal').close(); }}
                    className='absolute top-4 right-4 text-2xl hover:bg-red-500 hover:text-white' />
                {selectedProduct.map((item) => (
                    <section key={item.addtocartprimarykey} className='h-[30rem] w-[60rem] flex'>
                        <div className={`h-full w-[30rem] bg-cover bg-center flex items-center justify-center overflow-hidden bg-[url('../../asset/admin/productimage/${item.addtocartproductimage}')]`}>
                        </div>
                        <div className='h-full w-[30rem] flex flex-col justify-evenly gap-y-5 p-8'>
                            <p className='text-5xl font-bold '>{item.addtocartproductname}</p>
                            <p className='text-2xl'>Size: {item.addtocartproductsize}</p>
                            <p className='text-2xl'>Available Stock: {item.addtocartproductstock - quantity}</p>
                            <div className='h-fit max-h-[14rem] w-full overflow-scroll noScrollbar'>
                                <p>Description: {item.addtocartproductdescription}</p>
                            </div>
                            <p>Quantity:
                                <input
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    type="number" className="h-[2.5rem] w-[5rem] ml-2 outline-none rounded-sm border border-gray-400 px-2" />
                            </p>
                            <p className='font-semibold text-3xl'>₱{item.addtocartproductprice * quantity}.00</p>
                            <div className='flex gap-x-3'>
                                <button onClick={handleCheckoutFunc} className='p-2 bg-blue-500 hover:bg-blue-400 duration-700 text-white'>Checkout</button>
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </dialog>
    );
};

