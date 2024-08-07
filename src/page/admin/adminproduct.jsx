
import { FaPlus } from "react-icons/fa6";
import { AdminHamburger } from "../../component/admin/adminhamburger"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ReactTooltip from 'react-tooltip';
import { ShowToast } from "../../component/admin/toaster";
import { IoSearch } from "react-icons/io5";
import { Empty } from "../../component/client/empty";
import { useAdminProduct } from "../../store/admin/adminproductstore";

export const AdminInventory = () => {

    const {isProductDataInserted, insertProductData, clearIsProductDataInserted, 
        fetchedProductData, getProductData, 
        isProductDataDeleted, deleteProductData, clearIsProductDataDeleted, 
        isProductUpdated, updateProduct, clearIsProductUpdated} = useAdminProduct(state => ({
    
            isProductDataInserted: state.isProductDataInserted,
            insertProductData: state.insertProductData,
            clearIsProductDataInserted: state.clearIsProductDataInserted,
    
            fetchedProductData: state.fetchedProductData,
            getProductData: state.getProductData,
    
            isProductDataDeleted: state.isProductDataDeleted,
            deleteProductData: state.deleteProductData,
            clearIsProductDataDeleted: state.clearIsProductDataDeleted,
    
            isProductUpdated: state.isProductUpdated,
            updateProduct: state.updateProduct,
            clearIsProductUpdated: state.clearIsProductUpdated,
    }));

    const [productData, setProductData] = useState({
        productname: '',
        productsize: 'XS',
        productstock: 0,
        productprice: 0,
        productdescription: '',
        productcategory: 'Dog Food',
    })

    console.log(productData)

    const handleProductDataChangeFunc = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    // for product image
    const [productImage, setProductImage] = useState(null);
    const handleProductImageUploadChange = (e) => setProductImage(e.target.files[0]);


    const handleProductDataSubmitFunc = () => {
        insertProductData({ productData, productImage });
    }

    useEffect(() => {
        if (isProductDataInserted === true) {

            ShowToast('new product has been added', 'success');

            setProductData({ // clear input fields
                productname: '',
                productsize: 'XS',
                productstock: 0,
                productprice: 0,
                productdescription: '',
                productcategory: 'Dog Food',
            });
            document.getElementById('fileInput').value = "";
            document.getElementById('addProductModal').close();

            getProductData();
            clearIsProductDataInserted();
        }
    }, [isProductDataInserted])


    const DeleteProductFunc = (productID, productimage) => {
        const temp = {productID, productimage}
        deleteProductData({ temp });
    }

    useEffect(() => {
        if (isProductDataDeleted === true) {
            ShowToast('product deleted successfully', 'success');
            clearIsProductDataDeleted();
            getProductData();
        }

    }, [isProductDataDeleted])


    const [selectedProduct, setSelectedProduct] = useState({});
    const handleEditProductFunc = (productID) => {
        let selectedProductTemp = fetchedProductData.find(item => item.productID === productID);
        if (selectedProductTemp) {
            setSelectedProduct(selectedProductTemp);
        }
    }

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct({ ...selectedProduct, [name]: value, });
    };

    const [productPic, setProductPic] = useState(null);
    const handleProductPicChange = (e) => setProductPic(e.target.files[0]);

    const handleEditInputFunc = () => updateProduct({ selectedProduct, productPic });


    useEffect(() => {
        if (isProductUpdated === true) {
            ShowToast('successfully edited', 'success');
            document.getElementById('editProductModal').close()
    
            getProductData();
            clearIsProductUpdated();
        }
        if (isProductUpdated === false) {
            ShowToast('failed to edit', 'error');
            document.getElementById('editProductModal').close()
         
            clearIsProductUpdated();
        }

    }, [isProductUpdated])


    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchQueryChangeFunc = (e) => {
        setSearchQuery(e.target.value)
    }

    const filteredProductData = fetchedProductData.reverse().filter(item => {
        const temp = item.productname.toLowerCase().includes(searchQuery.toLowerCase()); 
        return temp;   
    });

    return (
        <section className={`relative bg-gray-200 mt-[4rem] h-screen w-screen flex items-center justify-center`}>
            <AdminHamburger />

            <div className="h-[95%] w-[70rem] max-w-[95%] flex flex-col gap-y-4">
                <div className="w-full flex justify-end gap-x-5 mo:gap-x-2">

                    <div className='flex border border-gray-400'>
                        <IoSearch className='h-[2.5rem] w-[2.5rem] p-[.5rem] bg-white' />
                        <input
                            value={searchQuery}
                            onChange={handleSearchQueryChangeFunc}
                            type="text"
                            placeholder='search product name'
                            className="h-[2.5rem] rounded-sm outline-none" />
                    </div>

                    <button onClick={() => document.getElementById('addProductModal').showModal()} className="bg-green-500 hover:bg-green-400 p-2 rounded-sm text-white flex items-center gap-x-1"><FaPlus className="text-2xl" />add
                    </button>
                </div>

                <div className="h-full w-full overflow-y-scroll noScrollbar rounded-lg">
                    {
                     filteredProductData.length === 0 ?
                     (
                        <Empty design={`border border-gray-500 rounded-lg `} text1={'Nothing to show'} text2={'Its empty here, you can choose other product name.'}/> 
                     )  
                     :
                     (
                        <table className="w-full bg-white">
                        <tr className="bg-blue-400 sticky top-0">
                            <td className="border font-semibold text-left p-[.6rem]">Product ID</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Picture</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Name</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Size</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Stock</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Price</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Description</td>
                            <td className="border font-semibold text-left p-[.6rem]">Product Category</td>
                            <td className="border font-semibold text-left p-[.6rem]">Creation Date</td>
                            <td className="border font-semibold text-left p-[.6rem]">Action</td>
                        </tr>

                        {filteredProductData.map(item => (
                            <tr key={item.productID}>
                                <td className="border px-2">{item.productID}</td>
                                <td className="border flex items-center justify-center">

                                    <img src={`../../asset/admin/productimage/${item.productimage}`} alt="" className="h-[5rem]" />


                                </td>
                                <td className="border px-2">{item.productname}</td>
                                <td className="border px-2">{item.productsize}</td>
                                <td className="border px-2">{item.productstock}</td>
                                <td className="border px-2">{item.productprice}</td>
                                <td className="border px-2">{item.productdescription}</td>
                                <td className="border px-2">{item.productcategory}</td>
                                <td className="border px-2">{item.creationdate}</td>
                                <td className="border px-2 min-w-[6rem]">
                                    <div className="flex items-center justify-evenly w-full h-full ">
                                        <MdEdit onClick={() => { handleEditProductFunc(item.productID); document.getElementById('editProductModal').showModal() }} data-type="info" data-tip="Edit" className="text-3xl p-1 bg-green-500 hover:bg-green-400 rounded-sm text-white" />
                                        <RiDeleteBin5Fill onClick={() => { DeleteProductFunc(item.productID, item.productimage) }} data-type="info" data-tip="Delete" className="text-3xl p-1 bg-red-500 hover:bg-red-400 rounded-sm text-white" />
                                        <ReactTooltip />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </table>
                     ) 
                    }
                   

                </div>
            </div>

            {/* edit product modal */}
            <dialog id="editProductModal" className="modal">

                <div className="modal-box h-fit w-[25rem] max-w-[95%] flex flex-col gap-y-4 rounded-lg p-4 noScrollbar">

                    <div className="w-full">
                        <label className={`text-lg text-black`}>Enter product name<span className='text-red-500'>*</span></label>
                        <input
                            onChange={handleEditInputChange}
                            value={selectedProduct.productname}
                            name="productname"
                            type="text" className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`} />
                    </div>

                    <div className="w-full">
                        <label className={`text-lg text-black`}>Choose product size<span className='text-red-500'>*</span></label>
                        <select
                            onChange={handleEditInputChange}
                            value={selectedProduct.productsize}
                            name="productsize"
                            className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`}>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>

                    <div className="w-full flex gap-x-4">
                        <div>
                            <label className={`text-lg text-black`}>Enter product stock<span className='text-red-500'>*</span></label>
                            <input
                                onChange={handleEditInputChange}
                                value={selectedProduct.productstock}
                                name="productstock"
                                type="number" className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`} />
                        </div>
                        <div>
                            <label className={`text-lg text-black`}>Enter product price<span className='text-red-500'>*</span></label>
                            <input
                                onChange={handleEditInputChange}
                                value={selectedProduct.productprice}
                                name="productprice"
                                type="number" className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`} />
                        </div>
                    </div>

                    <div>
                        <label className={`text-lg text-black`}>Enter product description<span className='text-red-500'>*</span></label>
                        <textarea
                            onChange={handleEditInputChange}
                            value={selectedProduct.productdescription}
                            name="productdescription"
                            className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`}>
                        </textarea>
                    </div>

                    <div className="w-full">
                        <label className={`text-lg text-black`}>Choose product category<span className='text-red-500'>*</span></label>
                        <select
                            onChange={handleEditInputChange}
                            value={selectedProduct.productcategory}
                            name="productcategory"
                            className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`}>
                            <option value="Dog Food">Dog Food</option>
                            <option value="Cat Food">Cat Food</option>
                            <option value="Bird Food">Bird Food</option>
                            <option value="Vitamins/Supplements">Vitamins/Supplements</option>
                            <option value="Flea/Tick Control">Flea/Tick Control</option>
                            <option value="Grooming Supplies">Grooming Supplies</option>
                        </select>
                    </div>

                    <div>
                        <label className={`text-lg text-black`}>Enter product image<span className='text-red-500'>*</span></label>
                        <input onChange={handleProductPicChange} type="file" className={`p-2 border border-gray-400 rounded-sm w-full outline-none text-black text-md`} />
                    </div>

                    <div className="w-full flex gap-x-3">
                        <button onClick={handleEditInputFunc} className="bg-green-500 hover:bg-green-400 py-2 px-4 rounded-sm text-white flex items-center gap-x-1">Edit</button>
                    </div>

                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* add product modal */}
            <dialog id="addProductModal" className="modal">

                <div className="modal-box h-fit w-[25rem] max-w-[95%] flex flex-col gap-y-4 rounded-lg p-4 noScrollbar">

                    <div className="w-full">
                        <label className={`text-lg text-black`}>Enter product name<span className='text-red-500'>*</span></label>
                        <input
                            onChange={handleProductDataChangeFunc}
                            value={productData.productname}
                            name="productname"
                            type="text" className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`} />
                    </div>

                    <div className="w-full">
                        <label className={`text-lg text-black`}>Choose product size<span className='text-red-500'>*</span></label>
                        <select
                            onChange={handleProductDataChangeFunc}
                            value={productData.productsize}
                            name="productsize"
                            className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`}>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>

                     <div className="w-full flex gap-x-4">
                        <div>
                            <label className={`text-lg text-black`}>Enter product stock<span className='text-red-500'>*</span></label>
                            <input
                                onChange={handleProductDataChangeFunc}
                                value={productData.productstock}
                                name="productstock"
                                type="number" className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`} />
                        </div>
                        <div>
                            <label className={`text-lg text-black`}>Enter product price<span className='text-red-500'>*</span></label>
                            <input
                                onChange={handleProductDataChangeFunc}
                                value={productData.productprice}
                                name="productprice"
                                type="number" className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`} />
                        </div>
                    </div>

                    <div>
                        <label className={`text-lg text-black`}>Enter product description<span className='text-red-500'>*</span></label>
                        <textarea
                            onChange={handleProductDataChangeFunc}
                            value={productData.productdescription}
                            name="productdescription"
                            className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`}>
                        </textarea>
                    </div>

                    <div className="w-full">
                        <label className={`text-lg text-black`}>Choose product category<span className='text-red-500'>*</span></label>
                        <select
                            onChange={handleProductDataChangeFunc}
                            value={productData.productcategory}
                            name="productcategory"
                            className={`border border-gray-400 rounded-sm w-full outline-none p-2 text-black text-md`}>
                            <option value="Dog Food">Dog Food</option>
                            <option value="Cat Food">Cat Food</option>
                            <option value="Bird Food">Bird Food</option>
                            <option value="Vitamins/Supplements">Vitamins/Supplements</option>
                            <option value="Flea/Tick Control">Flea/Tick Control</option>
                            <option value="Grooming Supplies">Grooming Supplies</option>
                        </select>
                    </div>

                    <div>
                        <label className={`text-lg text-black`}>Enter product image<span className='text-red-500'>*</span></label>
                        <input id="fileInput" onChange={handleProductImageUploadChange} type="file" className={`p-2 border border-gray-400 rounded-sm w-full outline-none text-black text-md`} />
                    </div>

                    <div className="w-full flex gap-x-3">
                        <button onClick={handleProductDataSubmitFunc} className="bg-green-500 hover:bg-green-400 py-2 px-4 rounded-sm text-white flex items-center gap-x-1">Add</button>
                    </div>

                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

        </section>
    )
}