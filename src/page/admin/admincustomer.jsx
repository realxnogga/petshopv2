

import { AdminHamburger } from "../../component/admin/adminhamburger"
import { RiDeleteBin5Fill } from "react-icons/ri";
import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from "react";
import { ShowToast } from "../../component/admin/toaster";
import { IoSearch } from "react-icons/io5";
import { Empty } from "../../component/client/empty";
import { useAdminCustomer } from "../../store/admin/admincustomerstore";

export const AdminCustomer = () => {

    const {allClientData, getAllCustomerData, deleteCustomerData, isCustomerDataDeleted, clearIsCustomerDataDeleted} = useAdminCustomer(state => ({
        allClientData: state.allClientData,
        getAllCustomerData: state.getAllCustomerData,
        deleteCustomerData: state.deleteCustomerData,
        isCustomerDataDeleted: state.isCustomerDataDeleted,
        clearIsCustomerDataDeleted: state.clearIsCustomerDataDeleted,
    }));


    const DeleteCustomerFunc = (clientID, clientprofile) => {
        const temp = {clientID, clientprofile}
        deleteCustomerData({temp});
    }

    useEffect(() => {
        if (isCustomerDataDeleted === true) {
            ShowToast('customer deleted successfully', 'success');
            getAllCustomerData();
            clearIsCustomerDataDeleted();
        }
    }, [isCustomerDataDeleted])

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchQueryChangeFunc = (e) => {
        setSearchQuery(e.target.value)
    }

    const filteredClientData = allClientData.filter(item => {
        const temp = item.clientusername.toLowerCase().includes(searchQuery.toLowerCase());
        return temp;
    });


    return (
        <section className={`relative bg-gray-200 mt-[4rem] h-screen w-screen flex items-center justify-center`}>
            <AdminHamburger />

            <div className="h-[95%] w-[70rem] max-w-[95%] flex flex-col gap-y-4">

                <div className="w-full flex justify-end">
                    <div className='flex border border-gray-400'>
                        <IoSearch className='h-[2.5rem] w-[2.5rem] p-[.5rem] bg-white' />
                        <input
                            value={searchQuery}
                            onChange={handleSearchQueryChangeFunc}
                            type="text"
                            placeholder='search client name'
                            className="h-[2.5rem] rounded-sm outline-none" />
                    </div>
                </div>

                <div className="h-full w-full overflow-y-scroll noScrollbar rounded-lg">
                    {
                        filteredClientData.length === 0 ?
                            (
                                <Empty design={`border border-gray-500 rounded-lg `} text1={'Nothing to show'} text2={'Its empty here, you can choose other day.'} />
                            )
                            :
                            (
                                <table className="w-full bg-white">
                                    <tr className="bg-blue-400 sticky top-0">
                                        <td className="border font-semibold text-left p-[.6rem]">Customer ID</td>
                                        <td className="border font-semibold text-left p-[.6rem]">Customer Profile</td>
                                        <td className="border font-semibold text-left p-[.6rem]">Customer Name</td>
                                        <td className="border font-semibold text-left p-[.6rem]">Join Date</td>
                                        <td className="border font-semibold text-left p-[.6rem]">Customer Address</td>
                                        <td className="border font-semibold text-left p-[.6rem]">Action</td>
                                    </tr>

                                    {filteredClientData.map(item => (
                                        <tr key={item.clientID}>
                                            <td className="border px-2">{item.clientID}</td>
                                            <td className="border flex items-center justify-center">
                                                <img src={`../../asset/client/clientprofile/${item.clientprofile}`} alt="" className="h-[5rem]" />
                                            </td>
                                            <td className="border px-2">{item.clientusername}</td>
                                            <td className="border px-2">{item.joindate}</td>
                                            <td className="border px-2">{item.clientaddress}</td>
                                            <td className="border px-2">
                                                <div className="flex items-center justify-evenly w-full h-full ">
                                                    <RiDeleteBin5Fill onClick={() => { DeleteCustomerFunc(item.clientID, item.clientprofile) }} data-type="info" data-tip="Delete" className="text-3xl p-1 bg-red-500 hover:bg-red-400 rounded-sm text-white" />
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

        </section>
    )
}