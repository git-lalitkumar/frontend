// pages/dashboard.js
import { useEffect, useState } from 'react';
import { withAuth } from '../utils/withAuth';
import api from "@/api";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const DashboardPage = () => {
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [newBooking, setNewBooking] = useState({ date: '', reason: '' });
    const [bookings, setBookings] = useState([]);
    const [refresh,setRefresh]=useState()

    const router =useRouter();



    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.get('/bookings?filter=' + filter); // Replace with your API endpoint
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    };

    const createBooking = async (booking) => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.post('/bookings', { ...booking }); 
            setRefresh(new Date())
            toast.success("created")
            // Replace with your API endpoint
        } catch (error) {
            console.log(error);
            toast.error(`${error?.response?.data?.errors?.date[0]}`);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleAddBooking = () => {
        // Add logic to handle new booking submission
        console.log('New booking:', newBooking);
        setShowModal(false);
        createBooking(newBooking);
        setNewBooking({ date: '', reason: '' });
    };

    const handleModalClose = () => {
        setShowModal(false);
        setNewBooking({ date: '', reason: '' });
    };

    const handlelogout=()=>{
        localStorage.clear();
        router.push('/login');
        
    }

    useEffect(() => {
        fetchBookings();
    }, [filter,refresh]);

    return (
        <div className="container mx-auto p-4">
           
            <div className='flex flex-row justify-between'>
            <h1 className="text-3xl font-bold mb-6">Booking List</h1>
            <div>
            <button
                    onClick={handlelogout}
                    className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded">
                    Logout
                </button>
            </div>
            </div>

            <div className="flex justify-end mb-4">
                <div className="mx-4">
                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        className="block appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">All</option>
                        <option value="today">Today</option>
                        <option value="future">Future</option>
                        <option value="past">Past</option>
                    </select>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add New Booking
                </button>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                            Sr. No.
                        </th>
                        <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-700 uppercase tracking-wider">
                            Reason
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={booking.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                                {booking.date}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                                {booking.reason}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded p-4 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Add New Booking</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newBooking.date}
                                    onChange={(e) =>
                                        setNewBooking({ ...newBooking, date: e.target.value })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter date"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Reason
                                </label>
                                <input
                                    type="text"
                                    value={newBooking.reason}
                                    onChange={(e) =>
                                        setNewBooking({ ...newBooking, reason: e.target.value })
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter reason"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleModalClose}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddBooking}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default withAuth(DashboardPage);
