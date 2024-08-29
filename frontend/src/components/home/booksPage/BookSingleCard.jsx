import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import { RiSwapLine } from 'react-icons/ri';
import { useContext, useState } from 'react';
import BookModal from './BookModal';
import SwapModal from '../swapRequestsPage/SwapModal';
import axios from 'axios';
import { UserContext } from '../../../context/UserContext';
import { enqueueSnackbar } from 'notistack';

const UserBookSingleCard = ({ book }) => {
  const [showBookModal, setShowBookModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null); // Track only the ID here
  const { userData } = useContext(UserContext);

  const handleConfirmSwap = async (bookId) => {
    if (!bookId) return; // Early return if no bookId provided

    setLoading(true);

    try {
      // Fetch selected book details
      const { data: selectedBook } = await axios.get(`http://localhost:5555/books/${bookId.toString()}`);

      // Prepare swap request object
      const newSwapRequest = {
        requester: userData.username,
        requestee: selectedBook.ownerUsername,
        bookRequestedId: book._id,
        bookOfferedId: bookId,
        bookRequestedName: book.title,
        bookOfferedName: selectedBook.title,
        status: 'pending',
      };

      // Send swap request
      await axios.post('http://localhost:5555/swapRequest', newSwapRequest);

      enqueueSnackbar('Request Sent successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error handling swap request:', error);
      enqueueSnackbar('Failed to send request', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='border border-gray-300 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out m-4 relative'>
      <h2 className='absolute top-2 right-2 px-4 py-1 bg-[#F9FAFB] text-[#1A202C] rounded-lg shadow-sm'>
        {book.publishYear}
      </h2>
      <div className='p-4'>
        <div className='flex items-center gap-x-2 mb-2'>
          <PiBookOpenTextLight className='text-[#1A202C] text-2xl' />
          <h3 className='text-xl font-semibold text-[#1A202C]'>{book.title}</h3>
        </div>
        <div className='flex items-center gap-x-2 mb-4'>
          <BiUserCircle className='text-[#1A202C] text-2xl' />
          <h4 className='text-lg text-gray-700'>{book.author}</h4>
        </div>
        <div className='flex justify-between items-center gap-x-2 mt-4'>
          <BiShow
            className='text-3xl text-blue-600 hover:text-blue-800 cursor-pointer'
            onClick={() => setShowBookModal(true)}
          />
          <RiSwapLine
            className='text-2xl text-yellow-600 hover:text-yellow-800 cursor-pointer'
            onClick={() => setShowSwapModal(true)}
          />
          <Link to={`/books/details/${book._id}`}>
            <BsInfoCircle className='text-2xl text-green-600 hover:text-green-800' />
          </Link>
        </div>
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <BookModal book={book} onClose={() => setShowBookModal(false)} />
      )}

      {/* Swap Modal */}
      {showSwapModal && (
        <SwapModal
          onClose={() => setShowSwapModal(false)}
          onConfirm={(selectedBook) => {
            if (selectedBook) {
              handleConfirmSwap(selectedBook);
            }
            setShowSwapModal(false);
          }}
          visible={showSwapModal}
        />
      )}
    </div>
  );
};

export default UserBookSingleCard;
